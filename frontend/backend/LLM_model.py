
# ai_analyst.py
# ------------------------------------------------------------------
# Pluggable "AI School Analyst" for your Student Data System
# - Phase 1: Planner (creates multi-step retrieval plan)
# - Phase 2: Synthesizer (writes final answer grounded in retrieved docs)
# This file is SELF-CONTAINED and can be dropped into any project that
# passes a dict of Chroma collections into AIAnalyst(...).
# ------------------------------------------------------------------

from __future__ import annotations
import json, re, time, os
from typing import Dict, Any, List, Optional
import requests

# -------------------------------
# LLM Service (with retries)
# -------------------------------
class LLMService:
    def __init__(self, config: dict):
        self.api_mode = config.get('api_mode', 'online')
        self.debug_mode = config.get('debug_mode', False)
        self.mistral_api_key = config.get('mistral_api_key')
        self.mistral_api_url = config.get('mistral_api_url', 'https://api.mistral.ai/v1/chat/completions')
        self.ollama_api_url = config.get('ollama_api_url', 'http://localhost:11434/api/chat')
        self.planner_model = config.get('planner_model')  # optional override per-phase
        self.synth_model   = config.get('synth_model')    # optional override per-phase

    def _prepare_request(self, messages: list, json_mode: bool, phase: str = "planner"):
        headers, payload, api_url = {}, {}, ""
        # allow per-phase model override (planner vs synth)
        model_override = self.planner_model if phase == "planner" else self.synth_model

        if self.api_mode == 'online':
            api_url = self.mistral_api_url
            headers = {"Authorization": f"Bearer {self.mistral_api_key}", "Content-Type": "application/json"}
            payload = {"model": model_override or "mistral-small-latest", "messages": messages}
            if json_mode:
                payload["response_format"] = {"type": "json_object"}
        else:
            api_url = self.ollama_api_url
            headers = {"Content-Type": "application/json"}
            payload = {"model": model_override or "mistral:instruct", "messages": messages, "stream": False}
            if json_mode:
                payload["format"] = "json"
        return api_url, headers, payload

    def execute(self, *, system_prompt: str, user_prompt: str, json_mode: bool = False,
                history: Optional[List[dict]] = None, retries: int = 2, phase: str = "planner") -> str:
        messages = list(history) if history else []
        messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": user_prompt})

        api_url, headers, payload = self._prepare_request(messages, json_mode, phase=phase)
        if not api_url:
            return "Configuration Error: API URL is not set."

        if self.debug_mode:
            print(f"🧠 LLMService → {self.api_mode.upper()} | phase={phase} | json={json_mode}")

        last_err = None
        for attempt in range(retries + 1):
            try:
                resp = requests.post(api_url, headers=headers, data=json.dumps(payload), timeout=120)
                resp.raise_for_status()
                rj = resp.json()
                if 'choices' in rj and rj['choices']:
                    return rj['choices'][0]['message']['content'].strip()
                if 'message' in rj and 'content' in rj['message']:
                    return rj['message']['content'].strip()
                raise ValueError("No content in LLM response")
            except Exception as e:
                last_err = e
                if self.debug_mode:
                    print(f"⚠️ LLM attempt {attempt+1}/{retries+1} failed: {e}")
                if attempt < retries:
                    time.sleep(1)
        return f"Error: Could not connect to the AI service. Details: {last_err}"

# -------------------------------
# Prompts
# -------------------------------
# In ai_analyst.py

PROMPT_TEMPLATES = {
    "planner_agent": r"""
        You are a highly intelligent AI data analyst for a school-wide database. Your goal is to create a research plan to answer user questions.

        DATABASE SCHEMA (collections & metadata fields):
        {schema}

        INSTRUCTIONS:
        1)  **Analyze the Goal:** Understand if the user wants simple information about a person OR if they want information related to that person (like a schedule, adviser, grades, etc.).
        2.  **Formulate a Plan:**
            - For a simple lookup ("who is Lee"), a single search step followed by "finish_plan" is enough.
            - For related information ("schedule of Lee"), you MUST first find the person, then use placeholders to find the related data in a second step.
        3.  **PARAMETER RULES:**
            - `collection_filter`: Only use if the user specifies a role (e.g., "which *student*..."). For general searches, do not use this.
            - `document_filter`: Use for text searches.
        4)  **CRITICAL RULE:** To use information from a previous step, you MUST use a placeholder variable like '$year_level_from_step_1'.
        5)  When you have all the facts, add a final step: {{"tool_name": "finish_plan"}}
        6)  Output a SINGLE JSON object.

        **COMPREHENSIVE EXAMPLE (Connecting a Person to Related Data):**
        User Query: "what is the schedule of lee pace"
        Your JSON Response:
        {{
          "plan": [
            {{
              "step": 1,
              "thought": "The user is asking for the schedule of a person named Lee Pace. First, I must find the record for 'Lee Pace' to get their details like course, year, and section. I will search all collections to be thorough.",
              "tool_call": {{
                "tool_name": "search_database",
                "parameters": {{
                  "query_text": "Lee Pace",
                  "document_filter": {{"$and": [{{"$contains": "Lee"}}, {{"$contains": "Pace"}}]}}
                }}
              }}
            }},
            {{
              "step": 2,
              "thought": "Now that I have the student's details from Step 1, I must use placeholders to find their specific schedule in the 'schedules' collections.",
              "tool_call": {{
                "tool_name": "search_database",
                "parameters": {{
                  "collection_filter": "schedules",
                  "query_text": "class schedule",
                  "filters": {{
                    "year_level": "$year_level_from_step_1",
                    "section": "$section_from_step_1",
                    "course": "$course_from_step_1"
                  }}
                }}
              }}
            }},
            {{
              "step": 3,
              "thought": "I have found the student and their matching schedule. I have all the information needed to answer the user's question.",
              "tool_call": {{ "tool_name": "finish_plan" }}
            }}
          ]
        }}
    """,
     "final_synthesizer": r"""
        You are an AI Analyst. Your answer must be based ONLY on the "Factual Documents" provided.

        INSTRUCTIONS:
        - Synthesize information from all documents to create a complete answer.
        - Infer logical connections. For example, if a student document and a class schedule share the same course, year, and section, you MUST state that the schedule applies to that student.
        - **Name Interpretation Rule:** When a user asks about a person using a single name (e.g., "who is Lee"), you must summarize information for all individuals where that name appears as a first OR last name. If you find a match on a last name (e.g., "Michelle Lee"), you MUST include this person in your summary and clarify their role. Do not restrict your answer to only first-name matches.
        - If data is truly missing, state that clearly.
        - Cite the source_collection for key facts using [source_collection_name].

        ---
        Factual Documents:
        {context}
        ---
        User's Query:
        {query}
        ---
        Your concise analysis (with citations):
    """
}

# -------------------------------
# AIAnalyst (Planner + Synthesizer)
# -------------------------------
class AIAnalyst:
    def __init__(self, collections: Dict[str, Any], llm_config: Optional[dict] = None, learn_file='agent_data.json'):
        """
        collections: dict[str, chroma.Collection]
        llm_config: read from config.json or pass inline
        """
        self.collections = collections or {}
        self.debug_mode = bool((llm_config or {}).get("debug_mode", False))
        self.llm = LLMService(llm_config or {})

        self.db_schema_summary = "Schema not generated yet."
        self._generate_db_schema()  # eager build so planner sees schema
        self.learn_file = learn_file
        self.learned_responses = self._load_learned_responses()

    # --------------- Utilities
    
    
    
    
    def _resolve_placeholders(self, params: dict, step_results: dict) -> dict:
        """Recursively search for and replace placeholders like '$value_from_step_1'."""
        resolved_params = json.loads(json.dumps(params)) # Deep copy to avoid modifying original

        def resolve(obj):
            if isinstance(obj, dict):
                for k, v_item in obj.items():
                    obj[k] = resolve(v_item)
            elif isinstance(obj, list):
                for i, item in enumerate(obj):
                    obj[i] = resolve(item)
            # ✅ FIX: Changed 'v' to 'obj' to use the correct variable
            elif isinstance(obj, str) and obj.startswith('$'):
                # Found a placeholder, e.g., "$course_from_step_1"
                # ✅ FIX: Changed 'v' to 'obj' here as well
                parts = obj.strip('$').split('_from_step_')
                if len(parts) == 2:
                    key_to_find, step_num_str = parts
                    step_num = int(step_num_str)
                    
                    self.debug(f"  -> Resolving placeholder: looking for '{key_to_find}' in results of step {step_num}")
                    
                    # Look in the results of the specified step
                    if step_num in step_results and step_results[step_num]:
                        # Get the metadata from the *first* result of that step
                        first_result_metadata = step_results[step_num][0].get("metadata", {})
                        if key_to_find in first_result_metadata:
                            # Return the resolved value
                            return first_result_metadata[key_to_find]
            # Return the object itself if no changes were made
            return obj

        return resolve(resolved_params)
    
    def debug(self, *args):
        if self.debug_mode:
            print(*args)

    def _repair_json(self, text: str) -> Optional[dict]:
        """Extract the first JSON object found in the text."""
        if not text:
            return None
        m = re.search(r'\{.*\}', text, re.DOTALL)
        if not m:
            return None
        try:
            return json.loads(m.group(0))
        except json.JSONDecodeError:
            return None

    def _normalize_schema(self, schema_dict: dict) -> dict:
        """Map common field variants to a standard name when presenting to the LLM."""
        mappings = {
            ('year', 'yr', 'yearlvl', 'year_level'): 'year_level',
            ('name', 'student_name', 'full_name'): 'full_name',
            ('course', 'program'): 'course',
            ('section', 'sec'): 'section',
            ('adviser', 'advisor', 'faculty'): 'adviser',
            ('student_id', 'stud_id', 'id'): 'student_id'
        }
        def std(field: str) -> str:
            for ks, v in mappings.items():
                if field.lower() in ks:
                    return v
            return field
        norm = {}
        for coll, fields in schema_dict.items():
            norm[coll] = sorted(list({std(f) for f in fields}))
        return norm

    def _generate_db_schema(self):
        """Inspect one record per collection to derive metadata keys for the planner."""
        if not self.collections:
            self.db_schema_summary = "No collections loaded."
            return
        raw = {}
        for name, coll in self.collections.items():
            try:
                sample = coll.get(limit=1, include=["metadatas"])
                if sample and sample.get("metadatas") and sample["metadatas"][0]:
                    raw[name] = list(sample["metadatas"][0].keys())
                else:
                    raw[name] = []
            except Exception as e:
                self.debug(f"Schema inspect failed for {name}: {e}")
                raw[name] = []

        norm = self._normalize_schema(raw)
        # make a readable schema string
        parts = []
        for name, fields in norm.items():
            parts.append(f"- {name}: {fields}")
        self.db_schema_summary = "\n".join(parts)
        self.debug("✅ DB Schema for planner:\n", self.db_schema_summary)

    # --------------- Retrieval tool
    def search_database(self, query_text: str, filters: Optional[dict] = None, document_filter: Optional[dict] = None, collection_filter: Optional[str] = None) -> List[dict]:
        """Universal search with a robust query builder that understands course aliases."""
        self.debug(f"🔎 search_database | query='{query_text}' | filters={filters} | doc_filter={document_filter} | coll_filter='{collection_filter}'")
        all_hits: List[dict] = []

        COURSE_ALIASES = {
            "BSCS": ["BSCS", "BS COMPUTER SCIENCE"],
            "BSTM": ["BSTM", "BS TOURISM MANAGEMENT"],
            "BSHM": ["BSHM", "BS HOSPITALITY MANAGEMENT"],
            "BSIT": ["BSIT", "BS INFORMATION TECHNOLOGY"],
        }

        where_clause: Optional[dict] = None
        if filters:
            conds = []
            for k, v in filters.items():
                if k == 'course':
                    course_val = v.get('$eq') if isinstance(v, dict) and '$eq' in v else v
                    aliases = next((aliases for key, aliases in COURSE_ALIASES.items() if course_val in aliases), [course_val])
                    if len(aliases) > 1:
                        conds.append({ "$or": [{k: {"$eq": alias}} for alias in aliases] })
                    else:
                        conds.append({k: {"$eq": course_val}})
                elif k == 'year_level':
                    year_val = v.get('$eq') if isinstance(v, dict) and '$eq' in v else v
                    try:
                        conds.append({ "$or": [{k: {"$eq": int(year_val)}}, {k: {"$eq": str(year_val)}}] })
                    except (ValueError, TypeError):
                        conds.append({k: {"$eq": str(year_val)}})
                else:
                    if isinstance(v, dict) and any(key.startswith('$') for key in v.keys()):
                        conds.append({k: v})
                    else:
                        conds.append({k: {"$eq": v}})

            if len(conds) == 1:
                where_clause = conds[0]
            elif len(conds) > 1:
                where_clause = {"$and": conds}

        for name, coll in self.collections.items():
            # ✅ START OF FIX: Handle advanced collection_filter
            if collection_filter:
                # Handle simple string filter (e.g., "schedules")
                if isinstance(collection_filter, str):
                    if collection_filter not in name:
                        continue
                # Handle advanced dictionary filter (e.g., {"$or": ["list", "of", "names"]})
                elif isinstance(collection_filter, dict):
                    should_skip = True
                    if "$or" in collection_filter and isinstance(collection_filter.get("$or"), list):
                        if name in collection_filter["$or"]:
                            should_skip = False # This collection is in the list, so don't skip it.
                    
                    if should_skip:
                        continue
            # ✅ END OF FIX
            
            try:
                res = coll.query(
                    query_texts=[query_text] if query_text else None,
                    n_results=10,
                    where=where_clause,
                    where_document=document_filter
                )
                docs = (res.get("documents") or [[]])[0]
                metas = (res.get("metadatas") or [[]])[0]
                for i, doc in enumerate(docs):
                    all_hits.append({
                        "source_collection": name,
                        "content": doc,
                        "metadata": metas[i] if i < len(metas) else {}
                    })
            except Exception as e:
                self.debug(f"⚠️ Query error in {name}: {e}")
        return all_hits
    
    def _load_learned_responses(self):
        if os.path.exists(self.learn_file):
            try:
                with open(self.learn_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if isinstance(data, list):
                        return data
                    else:
                        self.debug(f"⚠️ Learned responses file contained unexpected type: {type(data)}. Resetting to empty list.")
                        return []
            except Exception as e:
                self.debug(f"Failed to load learned responses: {e}")
        return []


    def _save_learned_responses(self):
        try:
            with open(self.learn_file, "w", encoding="utf-8") as f:
                json.dump(self.learned_responses, f, indent=2, ensure_ascii=False)
        except Exception as e:
            self.debug(f"Failed to save learned responses: {e}")

    def _rate_response(self, response: str) -> str:
        # Example: If response contains "I couldn't" or "No relevant", rate as bad, else good
        bad_phrases = ["I couldn't", "No relevant", "not found", "could not"]
        for phrase in bad_phrases:
            if phrase.lower() in response.lower():
                return "bad"
        return "good"

    # --------------- Planner + Execution
    def execute_reasoning_plan(self, query: str, history: Optional[List[dict]] = None) -> str:
        self.debug("🤖 Planner starting...")
        sys_prompt = PROMPT_TEMPLATES["planner_agent"].format(schema=self.db_schema_summary)
        user_prompt = f"User Query: {query}"

        plan_raw = self.llm.execute(system_prompt=sys_prompt, user_prompt=user_prompt, json_mode=True, phase="planner")
        plan_json = self._repair_json(plan_raw)

        if not plan_json or "plan" not in plan_json:
            self.debug("❌ Planner produced invalid JSON:", plan_raw)
            return "I couldn't generate a valid research plan for that request. Please rephrase."

        plan = plan_json["plan"]
        self.debug(f"📝 Planner produced {len(plan)} steps.")
        collected = []
        step_results = {}

        for i, step in enumerate(plan):
            step_num = int(step.get("step", 0) or 0)
            if not isinstance(step.get("tool_call"), dict) or "tool_name" not in step["tool_call"]:
                self.debug(f"❌ Invalid step format from AI Planner: {json.dumps(step, indent=2)}")
                return "The AI planner produced an invalid step format."

            tool = step["tool_call"]["tool_name"]
            if tool == "finish_plan":
                self.debug("✅ Reached finish_plan. Moving to synthesis.")
                break
            if tool != "search_database":
                self.debug(f"⚠️ Unknown tool in plan: {tool}")
                continue

            params = (step.get("tool_call") or {}).get("parameters", {})
            resolved_params = self._resolve_placeholders(params, step_results)
            self.debug(f"  -> Resolved params: {resolved_params}")
            
            qtext = resolved_params.get("query_text", "") or ""
            filters = resolved_params.get("filters", {}) or {}
            doc_filter = resolved_params.get("document_filter")
            coll_filter = resolved_params.get("collection_filter")

            if isinstance(doc_filter, dict):
                for operator in ["$and", "$or"]:
                    if operator in doc_filter and isinstance(doc_filter.get(operator), list) and len(doc_filter[operator]) == 1:
                        self.debug(f"  -> Simplifying single-condition '{operator}' to a simple filter.")
                        doc_filter = doc_filter[operator][0]
                        break
            
            hits = self.search_database(qtext, filters, doc_filter, coll_filter)
            
            is_person_search = "student" in str(coll_filter or "")
            if is_person_search and len(hits) > 1:
                next_step_index = i + 1
                if next_step_index < len(plan):
                    next_step_raw_params = str(plan[next_step_index].get("tool_call", {}).get("parameters", {}))
                    if f"_from_step_{step_num}" in next_step_raw_params:
                        self.debug(f"⚠️ Ambiguous person search found {len(hits)} initial results. Filtering for primary name matches.")
                        
                        primary_matches = []
                        search_term = (qtext or "").lower()
                        for hit in hits:
                            metadata = hit.get("metadata", {})
                            full_name = metadata.get("full_name", "").lower()
                            if search_term and search_term in full_name:
                                primary_matches.append(hit)
                        
                        if len(primary_matches) > 1:
                            self.debug(f"  -> Found {len(primary_matches)} primary name matches. Asking for clarification.")
                            options = [f'{idx+1}. {h["metadata"].get("full_name", "Unknown")} (Year {h["metadata"].get("year_level", "?")}, {h["metadata"].get("course", "?")})' for idx, h in enumerate(primary_matches[:5])]
                            clarification_prompt = "I found multiple students with that name. Which one are you referring to?\n\n" + "\n".join(options)
                            return clarification_prompt
                        
                        elif len(primary_matches) == 1:
                            self.debug(f"  -> Ambiguity resolved. Proceeding with the single primary match.")
                            hits = primary_matches
            
            step_results[step_num] = hits
            collected.extend(hits)
            self.debug(f"👀 Step {step_num}: {len(hits)} docs found.")

        unique = {f"{d['source_collection']}::{hash(d['content'])}": d for d in collected}
        docs = list(unique.values())
        if len(docs) > 20:
            docs = docs[:20]
            self.debug("⚠️ Evidence capped at 20 docs.")
        if not docs:
            return "I couldn't find any relevant documents to answer that. Try a more specific query."
            
        context = json.dumps(docs, indent=2, ensure_ascii=False)
        synth_user = PROMPT_TEMPLATES["final_synthesizer"].format(context=context, query=query)
        answer = self.llm.execute(system_prompt="You are a careful analyst who uses only provided facts.",
                                  user_prompt=synth_user, history=history or [], phase="synth")
        rating = self._rate_response(answer)
        self.learned_responses.append({
            "query": query,
            "response": answer,
            "rating": rating
        })
        self._save_learned_responses()
        return answer
    
    # --------------- CLI loop
    def start_ai_analyst(self):
        # ❗ HISTORY FIX: The history list has been completely removed from this loop.
        print("\n" + "="*70)
        print("🤖 AI SCHOOL ANALYST (Retrieve → Analyze)")
        print("   Type 'exit' to go back.")
        print("="*70)

        while True:
            q = input("\n👤 You: ").strip()
            if not q:
                continue
            if q.lower() == "exit":
                break
            
            # The reasoning plan is now called without any history.
            ans = self.execute_reasoning_plan(q)
            print("\n🧠 Analyst:", ans)


# -------------------------------
# Helper to load config.json
# -------------------------------
# In ai_analyst.py

def load_llm_config(config_path: str = "config.json") -> dict:
    """
    Loads the configuration from a JSON file.
    - FIX: Now provides a clear error message if the file cannot be found or parsed.
    """
    default_config = {
        "api_mode": "online",
        "debug_mode": True,
        "mistral_api_key": "fcbJyUY4pHwpCNOTB7Wq3IZaivGdzz01",
        "mistral_api_url": "https://api.mistral.ai/v1/chat/completions",
        "ollama_api_url": "http://localhost:11434/api/chat",
        "planner_model": None,
        "synth_model": None
    }
    
    try:
        with open(config_path, "r", encoding="utf-8") as f:
            print(f"✅ Successfully loaded configuration from {config_path}")
            return json.load(f)
    except FileNotFoundError:
        print(f"⚠️ WARNING: Configuration file '{config_path}' not found.")
        print("   -> Using default settings with a placeholder API key.")
        return default_config
    except json.JSONDecodeError:
        print(f"❌ ERROR: The configuration file '{config_path}' contains a JSON syntax error.")
        print("   -> Using default settings with a placeholder API key.")
        return default_config
    except Exception as e:
        print(f"❌ An unexpected error occurred while loading '{config_path}': {e}")
        return default_config
