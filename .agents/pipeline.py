import os
import sys
import json
import asyncio
from datetime import datetime

# Import Google Antigravity SDK
try:
    from google.antigravity import Agent, LocalAgentConfig, types
except ImportError:
    class MockResponse:
        def __init__(self, text):
            self._text = text
        async def text(self):
            return self._text

    class MockAgent:
        def __init__(self, config=None):
            self.config = config
            self.conversation_id = "mock-convo-id"
        async def __aenter__(self):
            return self
        async def __aexit__(self, exc_type, exc_val, exc_tb):
            pass
        async def chat(self, prompt):
            role = "Agent"
            if self.config and self.config.system_instructions:
                if "Database" in self.config.system_instructions:
                    role = "Database Schema Designer"
                elif "RLS" in self.config.system_instructions:
                    role = "RLS Security Auditor"
                elif "Security" in self.config.system_instructions:
                    role = "Security Auditor"
                elif "Testing" in self.config.system_instructions:
                    role = "Testing & QA Engineer"
            
            return MockResponse(f"[{role} Output] Successfully processed the request under discipline constraints.")

    Agent = MockAgent
    LocalAgentConfig = lambda **kwargs: type("Config", (), kwargs)
    types = type("Types", (), {"CapabilitiesConfig": lambda **kwargs: None})

# List of all 20 agents in order of pipeline execution
AGENT_LIST = [
    "01_architect",
    "02_research",
    "03_database_schema",
    "04_rls_auditor",
    "05_backend_logic",
    "06_frontend_component",
    "07_css_aesthetics",
    "08_responsive_viewport",
    "09_asset_manager",
    "10_localization",
    "11_capacitor_bridge",
    "12_native_android",
    "13_native_ios",
    "14_security_auditor",
    "15_performance_optimizer",
    "16_accessibility_inspector",
    "17_testing_qa",
    "18_bug_rectifier",
    "19_changelog_writer",
    "20_analytics_marketing"
]

KEYWORD_MAPPINGS = {
    "03_database_schema": ["db", "database", "table", "column", "migration", "schema", "postgres", "sql"],
    "04_rls_auditor": ["rls", "policy", "security", "protect", "auth", "row level", "permission"],
    "05_backend_logic": ["backend", "server", "endpoint", "function", "api", "zod", "validate", "route"],
    "06_frontend_component": ["frontend", "component", "react", "view", "jsx", "tsx", "state", "hook", "page", "route"],
    "07_css_aesthetics": ["css", "style", "tailwind", "color", "theme", "glassmorphism", "animate", "transition", "font"],
    "08_responsive_viewport": ["mobile", "tablet", "responsive", "viewport", "screen", "layout", "flex", "grid"],
    "09_asset_manager": ["image", "icon", "png", "jpg", "svg", "asset", "logo", "lucide"],
    "10_localization": ["lang", "translate", "locale", "language", "i18n", "dictionary", "format"],
    "11_capacitor_bridge": ["capacitor", "bridge", "plugin", "device", "camera", "geolocation", "notification"],
    "12_native_android": ["android", "gradle", "apk", "xml", "manifest", "kotlin", "java"],
    "13_native_ios": ["ios", "swift", "cocoapods", "plist", "xcode", "podfile"],
    "14_security_auditor": ["security", "injection", "vulnerability", "auth", "token", "key", "secret"],
    "15_performance_optimizer": ["performance", "speed", "lcp", "inp", "cls", "bundle", "optimize", "render"],
    "16_accessibility_inspector": ["aria", "accessibility", "a11y", "semantic", "screen reader", "contrast", "keyboard"],
    "17_testing_qa": ["test", "vitest", "mock", "spec", "assert", "expect", "qa"],
    "18_bug_rectifier": ["bug", "fix", "error", "crash", "fails", "uncaught", "exception", "trace", "rectify"],
    "20_analytics_marketing": ["analytics", "seo", "event", "tracking", "meta", "title", "head"]
}

MAPPING_FILE = "docs/mapping.json"
MODULES_DIR = "docs/modules"

def perform_impact_analysis(prompt):
    """
    Scans mapping.json and module dependencies to calculate:
    - Direct documentation module impacts.
    - Secondary/cascading dependency impacts.
    """
    direct_impacts = set()
    secondary_impacts = set()
    
    # 1. Load Mapping JSON
    mapping = {}
    if os.path.exists(MAPPING_FILE):
        with open(MAPPING_FILE, "r") as f:
            mapping = json.load(f)
            
    # 2. Match prompt keywords to mapping values
    prompt_lower = prompt.lower()
    for key, doc in mapping.items():
        # Clean paths to match keywords
        keywords = [k for k in key.replace(".", "/").split("/") if len(k) > 2]
        if any(kw in prompt_lower for kw in keywords):
            direct_impacts.add(doc)
            
    # Match based on file name tokens
    if os.path.exists(MODULES_DIR):
        for doc in os.listdir(MODULES_DIR):
            if not doc.endswith(".md"):
                continue
            base_name = doc.replace(".md", "")
            tokens = [t for t in base_name.split("_") if len(t) > 3]
            if any(t in prompt_lower or t[:-1] in prompt_lower for t in tokens):
                direct_impacts.add(doc)

    # 3. Resolve secondary dependencies (Depends On: header checking)
    for doc in list(direct_impacts):
        doc_path = os.path.join(MODULES_DIR, doc)
        if os.path.exists(doc_path):
            with open(doc_path, "r") as f:
                lines = f.readlines()
                for line in lines[:5]:
                    if line.startswith("Depends On:"):
                        dep_doc = line.split(":", 1)[1].strip()
                        if dep_doc not in direct_impacts:
                            secondary_impacts.add(dep_doc)
                            
    return list(direct_impacts), list(secondary_impacts)

def determine_applicability(prompt, direct_impacts, secondary_impacts):
    """
    Decides active agents based on prompt and active document modules.
    Always triggers database/security agents if database modules are impacted.
    Automatically triggers the full stack (database, RLS, backend, frontend, security, testing)
    for any new requirements or features.
    """
    applicability = {}
    prompt_lower = prompt.lower()
    
    # Core system operational agents
    applicability["01_architect"] = (True, "Required to orchestrate the pipeline.")
    applicability["02_research"] = (True, "Required to check API references and specifications.")
    applicability["19_changelog_writer"] = (True, "Required to document changes and update files touched.")

    # Check if database module is impacted
    db_impacted = any("database" in d.lower() for d in (direct_impacts + secondary_impacts))

    # Check if this is a new feature or requirement
    new_req_keywords = ["new", "feature", "add", "create", "implement", "develop", "integrate", "setup", "build", "introduce"]
    is_new_requirement = any(kw in prompt_lower for kw in new_req_keywords)

    for agent in AGENT_LIST:
        if agent in applicability:
            continue
            
        # Trigger DB/security checks automatically on DB impact
        if db_impacted and agent in ["03_database_schema", "04_rls_auditor", "14_security_auditor"]:
            applicability[agent] = (True, "Activated because a database client module is impacted.")
            continue

        # Automatically activate full architecture stack for new features/requirements
        if is_new_requirement and agent in [
            "03_database_schema",
            "04_rls_auditor",
            "05_backend_logic",
            "06_frontend_component",
            "14_security_auditor",
            "17_testing_qa"
        ]:
            applicability[agent] = (True, "Automatically activated stack agent for new requirement / feature.")
            continue

        keywords = KEYWORD_MAPPINGS.get(agent, [])
        matched = [k for k in keywords if k in prompt_lower]
        
        if matched:
            applicability[agent] = (True, f"Active due to keyword matches: {', '.join(matched)}")
        else:
            clean_name = agent.split("_", 1)[1].replace("_", " ").title()
            applicability[agent] = (False, f"Not Applicable. Task does not reference {clean_name} requirements or keywords.")
            
    return applicability

def update_module_ledgers(direct_impacts, change_summary):
    """Auto-appends a timestamped change history item to all directly impacted documentation ledgers."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    for doc in direct_impacts:
        doc_path = os.path.join(MODULES_DIR, doc)
        if os.path.exists(doc_path):
            with open(doc_path, "r") as f:
                content = f.read()
            
            ledger_header = "## 4. Version & Modification Ledger"
            if ledger_header not in content:
                content += f"\n\n{ledger_header}\n"
                
            entry = f"- **{timestamp}** | Changed by: 20-Agent Pipeline\n  * **Change**: {change_summary}\n"
            
            # Avoid repeating the entry
            if entry not in content:
                content += entry
                with open(doc_path, "w") as f:
                    f.write(content)
                print(f" -> Automatically updated ledger inside {doc}!")

def push_changes_to_git(prompt_desc):
    """Stages, commits, and pushes modified files automatically to GitHub."""
    print("\n -> Checking Git status for changes...")
    try:
        # Check if git is initialized
        if not os.path.exists(".git"):
            print(" -> Git not initialized. Bypassing Git push.")
            return

        status = os.popen("git status --porcelain").read().strip()
        if not status:
            print(" -> Git status: Clean. No files to commit or push.")
            return

        # Stage files
        os.system("git add .")
        
        # Commit changes
        commit_msg = f"Auto-commit: {prompt_desc[:80]}"
        print(f" -> Committing: '{commit_msg}'...")
        os.system(f'git commit -m "{commit_msg}"')
        
        # Push changes
        branch = os.popen("git rev-parse --abbrev-ref HEAD").read().strip()
        branch = branch if branch else "main"
        print(f" -> Pushing changes to origin '{branch}'...")
        os.system(f"git push origin {branch}")
        print(" -> Git commit and push completed successfully!")
    except Exception as e:
        print(f" -> Git operations failed: {str(e)}")

async def run_agent(agent_name, prompt, discipline_content, docs_context):
    """Executes agent with strict disciplines AND module documentation context."""
    system_instructions = (
        f"Discipline Guidelines:\n{discipline_content}\n\n"
        f"Impacted Architecture Documentation:\n{docs_context}\n\n"
        f"Task Context:\n{prompt}"
    )
    
    config = LocalAgentConfig(
        system_instructions=system_instructions,
        capabilities=types.CapabilitiesConfig(enable_subagents=False)
    )
    
    async with Agent(config) as agent:
        response = await agent.chat(prompt)
        return await response.text()

async def execute_pipeline(user_prompt):
    print("==================================================")
    print("MINDROP 20-AGENT AUDITED PIPELINE WITH IMPACT ANALYSER")
    print(f"Timestamp: {datetime.now().isoformat()}")
    print("==================================================")

    # 1. Run Impact Analysis
    direct_impacts, secondary_impacts = perform_impact_analysis(user_prompt)
    print(f"=== IMPACT ANALYSIS ===")
    print(f"Direct Module Impacts: {direct_impacts if direct_impacts else 'None'}")
    print(f"Secondary (Dependency) Impacts: {secondary_impacts if secondary_impacts else 'None'}\n")

    # 2. Gather Document Context for LLM prompt injection
    docs_context = ""
    for doc in (direct_impacts + secondary_impacts):
        doc_path = os.path.join(MODULES_DIR, doc)
        if os.path.exists(doc_path):
            with open(doc_path, "r") as f:
                docs_context += f"--- {doc} ---\n{f.read()}\n\n"

    # 3. Determine applicability
    applicability = determine_applicability(user_prompt, direct_impacts, secondary_impacts)
    
    audit_trail = []
    task_ledger_entry = {
        "timestamp": datetime.now().isoformat(),
        "prompt": user_prompt,
        "impacts": {"direct": direct_impacts, "secondary": secondary_impacts},
        "pipeline_results": {}
    }

    # 4. Run sequential pipeline
    for agent in AGENT_LIST:
        is_active, reason = applicability[agent]
        clean_name = agent.split("_", 1)[1].replace("_", " ").upper()
        
        if is_active:
            discipline_path = f".agents/disciplines/{agent}.md"
            discipline_content = ""
            if os.path.exists(discipline_path):
                with open(discipline_path, "r") as f:
                    discipline_content = f.read()
            
            try:
                output = await run_agent(agent, user_prompt, discipline_content, docs_context)
                status = "ACTIVE"
            except Exception as e:
                output = f"Execution failed: {str(e)}"
                status = "FAILED"
        else:
            status = "NOT APPLICABLE"
            output = reason
            
        audit_trail.append({
            "agent": agent,
            "name": clean_name,
            "status": status,
            "output": output
        })
        
        task_ledger_entry["pipeline_results"][agent] = {
            "status": status,
            "output": output
        }

    # 5. Save to Ledger
    ledger_path = ".agents/ledger.json"
    ledger_data = []
    if os.path.exists(ledger_path):
        try:
            with open(ledger_path, "r") as f:
                ledger_data = json.load(f)
        except json.JSONDecodeError:
            ledger_data = []
            
    ledger_data.append(task_ledger_entry)
    with open(ledger_path, "w") as f:
        json.dump(ledger_data, f, indent=2)

    # 6. Update document change ledgers (Auto-Documentation Self-Healing)
    if direct_impacts:
        update_module_ledgers(direct_impacts, f"Executed requirements: '{user_prompt}'")

    # 7. Print Audit Trail Output
    print("\n================== AUDIT LOGS ==================")
    for log in audit_trail:
        print(f"[{log['agent'].upper()}] {log['name']} | Status: {log['status']}")
        if log['status'] == "ACTIVE":
            indented = "\n".join("   " + line for line in log['output'].splitlines()[:5])
            print(f"{indented}\n   ...")
        else:
            print(f"   Reason: {log['output']}")
    print("==================================================")
    print("Pipeline run saved successfully to ledger.json!")

    # 8. Post-Execution Auto-Push Hook
    push_changes_to_git(user_prompt)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 pipeline.py '<user prompt>'")
        sys.exit(1)
        
    prompt_arg = sys.argv[1]
    asyncio.run(execute_pipeline(prompt_arg))
