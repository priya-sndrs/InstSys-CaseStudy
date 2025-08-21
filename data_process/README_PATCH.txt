
PATCH GUIDE — Integrate ai_analyst.py into your current project
===============================================================

Files you now have:
  - ai_analyst.py   → the AI "brain" (planner + synthesizer)
  - config.json     → API + model config
  - (this) README_PATCH.txt

Goal:
  Keep ALL your data ingestion and Chroma filtering intact.
  Add a menu entry that runs the new AI Analyst WITHOUT changing your existing collection structure.

---------------------------------------------------------------
1) In your main file (e.g., main_student_data.py or your current script)
   - Ensure your main system class builds and holds a dict of Chroma collections.
     You already have self.collections = {...} in your system — keep it.
   - Import the AI module:

        from ai_analyst import AIAnalyst, load_llm_config

---------------------------------------------------------------
2) Initialize and call the AI Analyst from your menu

   Add a new menu item (example):

        print("1. 🤖 Engage AI School Analyst (Recommended)")
        # ... your other items ...

   And handle it like this:

        elif choice == "1":
            # Ensure collections are loaded already in your code
            llm_cfg = load_llm_config("config.json")
            ai = AIAnalyst(self.collections, llm_cfg)
            ai.start_ai_analyst()

   NOTE: Do NOT change how you load/build self.collections — pass it directly.

---------------------------------------------------------------
3) Remove / disable obsolete AI code
   - Old "GROUP 3 AI" menu option and its handler
   - Any direct LLM calls that previously tried to answer queries in one shot
   - Any old scope/intent detection LLM functions that conflict with the planner

   Your non-AI features (e.g., basic smart search, manage collections) remain as-is.

---------------------------------------------------------------
4) Optional: per-phase local models when you switch to offline
   - In config.json, set:
        "api_mode": "offline",
        "planner_model": "qwen2.5:7b-instruct-q4_K_M",
        "synth_model": "llama3:8b-instruct-q4_0"
     and ensure Ollama is running.

---------------------------------------------------------------
5) Quick sanity tests (after integrating)
   - "who is <existing student full name>"
   - "list 3rd year BSCS students"
   - "which adviser teaches the most subjects"
   - "show students with missing guardian contact"
   - "compare student counts by year level in BSCS"

   If planner JSON fails sometimes, that's a model limitation.
   The system includes a JSON repair attempt; upgrade models later for stability.

---------------------------------------------------------------
6) Troubleshooting
   - API error once per run: ensure your config.json keys/URLs are correct.
   - No docs found: confirm your self.collections is passed and populated.
   - Planner ignores fields: check schema printout in console (debug_mode true).

Happy testing!
