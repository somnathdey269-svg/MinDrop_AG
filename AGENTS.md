<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# Antigravity Orchestrator Behavior

Whenever the user submits a prompt, categorize the intent and respond accordingly:
1. **Inquiries & Explanations (Conversational)**:
   If the prompt is an inquiry, question, or general query (e.g., *"How do I run X?"*, *"Where is the API URL?"*, *"Explain this function"*), answer directly and concisely. **Do not run the pipeline.**
2. **Requirements & Code Modifications (Actionable)**:
   If the prompt is an actionable requirement, feature request, or code modification (e.g., *"Add a delete button"*, *"Fix the layout bug on settings screen"*, *"Create a table"*), you must automatically:
   - Run the custom pipeline script in the background: `python3 .agents/pipeline.py "<requirement prompt>"`
   - Read the audit trail and execute the code modifications.
   - Run the reflection script: `python3 .agents/reflection.py` to persist lessons learned.

