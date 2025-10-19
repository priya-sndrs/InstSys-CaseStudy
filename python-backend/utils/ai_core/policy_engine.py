# backend/utils/ai_core/policy_engine.py

import re
from typing import Dict, Any, List

class PolicyEngine:
    """
    [CORRECTED] Responsible for de-lexicalizing queries and plans to create abstract
    templates for few-shot learning using a more robust, pattern-based approach.
    """
    def __init__(self, known_programs: List[str] = None):
        """
        Initializes the engine with known entity values to improve matching accuracy.
        """
        self.known_programs = set(known_programs or [])
        
        # Define patterns in a specific order to avoid conflicts
        # More specific patterns should come before more general ones.
        self.patterns = [
            # Pattern for multi-word capitalized names
            ("PERSON_NAME", re.compile(r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b')),
            # Pattern for known program codes (dynamically built)
            ("PROGRAM", re.compile(r'\b(' + '|'.join(re.escape(p) for p in self.known_programs) + r')\b', re.IGNORECASE)),
            # Pattern for year level formats
            ("YEAR", re.compile(r'\b(\d(?:st|nd|rd|th)?\s*year|year\s*\d)\b', re.IGNORECASE)),
            # Pattern for section formats
            ("SECTION", re.compile(r'\b(section\s*[A-Z0-9]+|[1-4][A-Z])\b', re.IGNORECASE))
        ]

    def delexicalize(self, query: str, plan: Dict[str, Any]) -> Dict[str, Any]:
        """
        [CORRECTED] Takes a raw user query and a plan and converts them into
        abstract, de-lexicalized templates.
        """
        user_pattern = query
        plan_params = plan.get("parameters", {})
        plan_template = {
            "tool_name": plan.get("tool_name"),
            "parameters": plan_params.copy() # Start with a copy
        }

        # --- Scrub the user_pattern using all defined regex patterns ---
        for placeholder, pattern in self.patterns:
            user_pattern = pattern.sub(f"{{{placeholder}}}", user_pattern)

        # --- Scrub the parameters in the plan template ---
        for key, value in plan_params.items():
            if value is None:
                continue
            
            val_str = str(value)
            
            # Match parameter values against the same patterns
            for placeholder, pattern in self.patterns:
                # Check if the whole string is a match for a pattern
                if pattern.fullmatch(val_str):
                    plan_template["parameters"][key] = f"{{{placeholder}}}"
                    break # Stop after the first match
            
            # Special handling for year_level if it's an integer
            if key == "year_level" and isinstance(value, int):
                plan_template["parameters"][key] = "{YEAR}"


        return {
            "user_pattern": user_pattern,
            "plan_template": plan_template
        }