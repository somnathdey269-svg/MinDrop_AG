# Final Document Index

Every engineering document for MindDrop, and when to use each.

> If you're an engineer new to MindDrop, read in this order:
> 1. [README.md](./README.md)
> 2. [MASTER_ARCHITECTURE.md](./MASTER_ARCHITECTURE.md)
> 3. [PROJECT_AUDIT.md](./PROJECT_AUDIT.md)
> 4. [DEVELOPMENT_STANDARDS.md](./DEVELOPMENT_STANDARDS.md)
> 5. Then the doc for your task below.

---

## When to Use Each Document

| Document | Read when… |
|---|---|
| [README.md](./README.md) | You just landed. Get oriented. |
| [MASTER_ARCHITECTURE.md](./MASTER_ARCHITECTURE.md) | Anything about ownership, folder responsibility, sync between Lovable / GitHub / Android Studio. The top-level truth. |
| [PROJECT_AUDIT.md](./PROJECT_AUDIT.md) | Deciding what's shipped vs missing. Planning next work. |
| [NATIVE_ANDROID_GUIDE.md](./NATIVE_ANDROID_GUIDE.md) | Any Kotlin / Android Studio / native OS integration. |
| [FEATURE_BACKLOG.md](./FEATURE_BACKLOG.md) | Understanding what features exist and their status. |
| [CHANGELOG.md](./CHANGELOG.md) | Writing release notes or checking when something shipped. |
| [API_REFERENCE.md](./API_REFERENCE.md) | Calling or writing a server function; documenting a new endpoint. |
| [DATABASE_REFERENCE.md](./DATABASE_REFERENCE.md) | Adding/altering tables, writing RLS, reading schema. |
| [CONNECTORS.md](./CONNECTORS.md) | Integrating an external service (Cashfree, FCM, Drive, etc.). |
| [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) | Setting up env vars; rotating a secret. |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Publishing web or Android; understanding preview vs prod. |
| [TESTING_GUIDE.md](./TESTING_GUIDE.md) | Before every release; adding tests; QA scripts. |
| [SECURITY.md](./SECURITY.md) | Anything auth, RLS, secrets, webhooks, threat model. |
| [PERFORMANCE.md](./PERFORMANCE.md) | Diagnosing slow queries; planning caching. |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | Something is broken and you need a quick answer. |
| [KNOWN_LIMITATIONS.md](./KNOWN_LIMITATIONS.md) | User asks "can we do X?" — check here first. |
| [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md) | Every release, without exception. |
| [CODE_OWNERSHIP.md](./CODE_OWNERSHIP.md) | Editing a file and unsure whether Lovable or Android Studio owns it. |
| [FUTURE_ROADMAP.md](./FUTURE_ROADMAP.md) | Planning quarters ahead; prioritizing. |
| [PROJECT_GLOSSARY.md](./PROJECT_GLOSSARY.md) | Any unfamiliar term. |
| [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md) | Wondering *why* something is the way it is. |
| [DEVELOPMENT_STANDARDS.md](./DEVELOPMENT_STANDARDS.md) | Every PR — coding conventions, naming, git etiquette. |
| [android-build.md](./android-build.md) | Existing per-step build notes for Android (predates the guide). |

## By Role

**Product owner:** README · FEATURE_BACKLOG · FUTURE_ROADMAP · CHANGELOG · PROJECT_GLOSSARY.

**Web engineer (Lovable):** README · MASTER_ARCHITECTURE · API_REFERENCE · DATABASE_REFERENCE · DEVELOPMENT_STANDARDS · SECURITY · TESTING_GUIDE.

**Android engineer:** README · MASTER_ARCHITECTURE · NATIVE_ANDROID_GUIDE · CODE_OWNERSHIP · SECURITY · TESTING_GUIDE · RELEASE_CHECKLIST.

**DevOps / release manager:** DEPLOYMENT · RELEASE_CHECKLIST · ENVIRONMENT_SETUP · CONNECTORS · SECURITY · TROUBLESHOOTING.

**Security reviewer:** SECURITY · DATABASE_REFERENCE · API_REFERENCE · ARCHITECTURE_DECISIONS.

**Contractor onboarding:** README → MASTER_ARCHITECTURE → PROJECT_AUDIT → PROJECT_GLOSSARY → DEVELOPMENT_STANDARDS → the doc for their task.

## Documentation Maintenance

- Every PR that changes behavior must update the relevant doc in the same commit.
- `MASTER_ARCHITECTURE.md` bumps `Last updated` when its content changes.
- Doc-only PRs are welcome and merged fast.
- If two docs conflict, `MASTER_ARCHITECTURE.md` wins until reconciled.
- If a doc contradicts the code, the code wins — fix the doc.
- Delete stale docs rather than leave them wrong.

## File Map

```
docs/
├── README.md
├── MASTER_ARCHITECTURE.md
├── PROJECT_AUDIT.md
├── NATIVE_ANDROID_GUIDE.md
├── FEATURE_BACKLOG.md
├── CHANGELOG.md
├── API_REFERENCE.md
├── DATABASE_REFERENCE.md
├── CONNECTORS.md
├── ENVIRONMENT_SETUP.md
├── DEPLOYMENT.md
├── TESTING_GUIDE.md
├── SECURITY.md
├── PERFORMANCE.md
├── TROUBLESHOOTING.md
├── KNOWN_LIMITATIONS.md
├── RELEASE_CHECKLIST.md
├── CODE_OWNERSHIP.md
├── FUTURE_ROADMAP.md
├── PROJECT_GLOSSARY.md
├── ARCHITECTURE_DECISIONS.md
├── DEVELOPMENT_STANDARDS.md
├── FINAL_DOCUMENT_INDEX.md   ← you are here
└── android-build.md
```
