import os
import json
import asyncio
from datetime import datetime

# Load GEMINI_API_KEY from root .env file if it exists
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
if os.path.exists(env_path):
    with open(env_path, "r") as f:
        for line in f:
            if line.strip().startswith("GEMINI_API_KEY="):
                key = line.strip().split("=", 1)[1].strip()
                if key:
                    os.environ["GEMINI_API_KEY"] = key

# Import Google Antigravity SDK
has_sdk = False
if "GEMINI_API_KEY" in os.environ and os.environ["GEMINI_API_KEY"].strip():
    try:
        from google.antigravity import Agent, LocalAgentConfig
        has_sdk = True
    except ImportError:
        pass

if not has_sdk:
    class MockResponse:
        async def text(self):
            return "Rule: Under Capacitor development, always configure VITE_WEB_ORIGIN and VITE_API_ORIGIN in .env to map to http://localhost:8080."
    class MockAgent:
        def __init__(self, config=None):
            pass
        async def __aenter__(self):
            return self
        async def __aexit__(self, exc_type, exc_val, exc_tb):
            pass
        async def chat(self, prompt):
            return MockResponse()
    Agent = MockAgent
    LocalAgentConfig = lambda **kwargs: None

LEDGER_PATH = ".agents/ledger.json"
MODULES_DIR = "docs/modules"

async def generate_lesson_from_failure(error_msg, doc_module):
    """Uses LLM to summarize an error context into a concrete documentation rule."""
    prompt = (
        f"You are the Reflective Memory Agent. Analyze this project event / error:\n"
        f"'{error_msg}'\n\n"
        f"Translate it into a strict documentation rule for the '{doc_module}' module "
        f"to prevent engineers/agents from repeating this mistake. Format it as a single sentence starting with 'Rule: '."
    )
    
    config = LocalAgentConfig(system_instructions="You translate logs into strict code disciplines.")
    
    max_retries = 3
    retry_delay = 12  # Start with a safe 12-second backoff
    
    for attempt in range(max_retries + 1):
        try:
            async with Agent(config) as agent:
                response = await agent.chat(prompt)
                return await response.text()
        except Exception as e:
            err_msg = str(e)
            if "429" in err_msg or "quota" in err_msg.lower() or "resource_exhausted" in err_msg.lower():
                if attempt < max_retries:
                    print(f" -> Rate limit hit during reflection (attempt {attempt + 1}/{max_retries}). Retrying in {retry_delay}s...")
                    await asyncio.sleep(retry_delay)
                    retry_delay *= 2  # Exponential backoff
                    continue
            raise e

async def generate_new_module_document(doc_name, error_msg):
    """Generates a new structured feature module markdown file."""
    title = doc_name.replace(".md", "").replace("_", " ").title()
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    if has_sdk:
        prompt = (
            f"Generate a documentation module for the feature named '{title}'.\n"
            f"The module file name is '{doc_name}'.\n"
            f"An error occurred during this feature's execution: '{error_msg}'.\n"
            f"Provide the documentation in this format:\n\n"
            f"Depends On: database_client.md\n"
            f"# Module: {title}\n\n"
            f"## 1. Overview\n"
            f"[Describe what this feature does]\n\n"
            f"## 2. Dependencies\n"
            f"[List any dependencies or other modules it relies on]\n\n"
            f"## 3. Rules & Gotchas\n"
            f"* [A rule describing how to avoid the failure: '{error_msg}']\n\n"
            f"## 4. Version & Modification Ledger\n"
            f"- **{timestamp}** | System Creator\n"
            f"  * **Change**: Initial feature setup and learning rule registration."
        )
        try:
            config = LocalAgentConfig(system_instructions="You are a Technical Writer.")
            async with Agent(config) as agent:
                response = await agent.chat(prompt)
                txt = await response.text()
                if txt.strip():
                    return txt.strip()
        except Exception as e:
            print(f"Error calling Agent for document generation: {e}")
            
    # Mock / Fallback Mode
    return (
        f"Depends On: database_client.md\n"
        f"# Module: {title}\n\n"
        f"## 1. Overview\n"
        f"Natively handles system implementations for {title}.\n\n"
        f"## 2. Dependencies\n"
        f"* Native Capacitor modules\n\n"
        f"## 3. Rules & Gotchas\n"
        f"* Rule: Always ensure proper error handling for {title} calls.\n\n"
        f"## 4. Version & Modification Ledger\n"
        f"- **{timestamp}** | System Creator\n"
        f"  * **Change**: Initial feature setup."
    )

async def auto_map_new_module(doc_name, doc_content):
    """Automatically parses or generates code path associations for mapping.json."""
    mapping_path = "docs/mapping.json"
    if not os.path.exists(mapping_path):
        return
        
    try:
        with open(mapping_path, "r") as f:
            mapping = json.load(f)
    except Exception as e:
        print(f"Error reading mapping.json: {e}")
        return
        
    base_name = doc_name.replace(".md", "")
    prefix = base_name.split("_")[0]
    
    path_1 = f"src/components/{prefix}/"
    path_2 = f"src/lib/{prefix}/"
    
    updated = False
    if path_1 not in mapping:
        mapping[path_1] = doc_name
        updated = True
    if path_2 not in mapping:
        mapping[path_2] = doc_name
        updated = True
        
    if updated:
        try:
            with open(mapping_path, "w") as f:
                json.dump(mapping, f, indent=2)
            print(f" -> Automatically updated docs/mapping.json to link code paths to {doc_name}!")
        except Exception as e:
            print(f"Error writing mapping.json: {e}")

async def run_reflection():
    print("==================================================")
    print("RUNNING AGENT SELF-REFLECTION & EVOLUTION LOOP")
    print(f"Timestamp: {datetime.now().isoformat()}")
    print("==================================================")

    if not os.path.exists(LEDGER_PATH):
        print("No ledger found. Nothing to reflect on yet.")
        return

    try:
        with open(LEDGER_PATH, "r") as f:
            ledger = json.load(f)
    except json.JSONDecodeError:
        print("Empty or invalid ledger format.")
        return

    if not ledger:
        print("Ledger contains no entries.")
        return

    # Scan only the latest entry in the ledger for failures/bug rectifications
    failures_detected = []
    
    latest_entry = ledger[-1]
    # Get active impacted docs for this run
    impacted_docs = latest_entry.get("impacts", {}).get("direct", []) + latest_entry.get("impacts", {}).get("secondary", [])
    
    for agent_id, data in latest_entry.get("pipeline_results", {}).items():
        # Bug was rectified
        if agent_id == "18_bug_rectifier" and data.get("status") == "ACTIVE":
            failures_detected.append({
                "docs": impacted_docs if impacted_docs else ["database_client.md"],
                "error": data.get("output", "Bug occurred and code needed rectification.")
            })
        # Core agent execution failed
        elif data.get("status") == "FAILED":
            failures_detected.append({
                "docs": impacted_docs if impacted_docs else ["database_client.md"],
                "error": data.get("output", "Task execution failed.")
            })

    # If no failures are logged in the latest run, seed a mock reflection to demonstrate the learning system
    if not failures_detected:
        print("No active code failures detected in the latest run. Seeding learning with project CORS fixes.")
        failures_detected.append({
            "docs": ["database_client.md"],
            "error": "Console error: webpage at http://localhost:8080/ could not be loaded because of connection refused / CORS preflight block."
        })

    # Iterate over failures, create rules, and patch corresponding module docs
    active_call_count = 0
    for fail in failures_detected:
        docs = fail["docs"]
        error = fail["error"]
        
        for doc in docs:
            doc_path = os.path.join(MODULES_DIR, doc)
            if not os.path.exists(doc_path):
                print(f"Creating new module document for feature: {doc}...")
                new_doc_content = await generate_new_module_document(doc, error)
                with open(doc_path, "w") as f:
                    f.write(new_doc_content)
                print(f" Successfully created new module: {doc}!")
                await auto_map_new_module(doc, new_doc_content)

            print(f"Analyzing failure for module: {doc}...")
            if active_call_count > 0:
                print(" -> Proactive pacing delay: Sleeping 12 seconds...")
                await asyncio.sleep(12)
            active_call_count += 1
            new_rule = await generate_lesson_from_failure(error, doc)
            print(f" Generated Lesson: {new_rule}")
            
            with open(doc_path, "r") as f:
                content = f.read()
                
            # We inject rules under the "Rules & Gotchas" section
            rules_header = "## 3. Rules & Gotchas"
            if rules_header in content:
                rule_entry = f"\n* {new_rule}"
                if new_rule not in content:
                    # Insert right after the header line
                    header_index = content.find(rules_header) + len(rules_header)
                    content = content[:header_index] + rule_entry + content[header_index:]
                    
                    # Also append to ledger at the bottom
                    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    ledger_header = "## 4. Version & Modification Ledger"
                    if ledger_header in content:
                        ledger_entry = f"- **{timestamp}** | Self-Healed Learning Loop\n  * **Rule Added**: {new_rule}\n"
                        content += ledger_entry
                        
                    with open(doc_path, "w") as f:
                        f.write(content)
                    print(f" Successfully injected self-learned rule into {doc}!")
                else:
                    print(f" Rule already exists in {doc}. Skipping.")

    print("==================================================")
    print("Self-Reflection & Evolution Loop Completed!")

if __name__ == "__main__":
    asyncio.run(run_reflection())
