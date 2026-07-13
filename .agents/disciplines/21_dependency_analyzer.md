# Discipline: Dependency Analyzer Agent

## Rules & Guidelines
1. Scan modified source code files in commits or workspace edits.
2. Read import lines (e.g. `import ... from "@/lib/notify"`) to identify dependencies.
3. Map directories using `docs/mapping.json` to matching module markdown files.
4. Auto-update module headers with matching `Depends On: <module.md>` links.
