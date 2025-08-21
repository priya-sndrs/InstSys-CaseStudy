import json
import os

class AIAnalyst:
    def __init__(self, collections: Dict[str, Any], llm_config: Optional[dict] = None, learn_file: str = "learned_responses.json"):
        self.collections = collections or {}
        self.debug_mode = bool((llm_config or {}).get("debug_mode", False))
        self.llm = LLMService(llm_config or {})
        self.db_schema_summary = "Schema not generated yet."
        self._generate_db_schema()
        self.learn_file = learn_file
        self.learned_responses = self._load_learned_responses()

    def _load_learned_responses(self):
        if os.path.exists(self.learn_file):
            try:
                with open(self.learn_file, "r", encoding="utf-8") as f:
                    return json.load(f)
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

    def execute_reasoning_plan(self, query: str, history: Optional[List[dict]] = None) -> str:
        # Check if query is in learned responses
        for item in self.learned_responses:
            if item["query"].strip().lower() == query.strip().lower():
                self.debug("🔁 Returning learned response.")
                return item["response"]

        # Otherwise, run LLM as usual
        response = self._run_llm_reasoning(query, history)
        rating = self._rate_response(response)
        # Save the new interaction
        self.learned_responses.append({
            "query": query,
            "response": response,
            "rating": rating
        })
        self._save_learned_responses()
        return response

    def _run_llm_reasoning(self, query, history):
        # The original execute_reasoning_plan logic goes here (from your code, lines 85-163)
        # For brevity, call the original logic as a separate method
        # ...existing code from lines 85-163...
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
        return answer