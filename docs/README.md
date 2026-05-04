# Documentation

## Structure

```
docs/
  adr/        # Architecture Decision Records
  epic/       # Epics - large initiatives
  story/      # Stories - individual tasks within epics
  runbook/    # Operational procedures
  spike/      # Technical investigations & feasibility studies
  _templates/ # Templates for each document type
```

## Document Types

### ADR (Architecture Decision Record)
Record significant architectural decisions with context, options considered, and rationale.
- Naming: `NNN-short-title.md` (e.g., `001-migrate-to-vite.md`)
- Status lifecycle: `Proposed` → `Accepted` | `Rejected` | `Superseded`

### Epic
Large body of work that can be broken down into stories. Tracks overall progress and goals.
- Naming: `NNN-short-title.md` (e.g., `001-modernize-stack.md`)
- Status lifecycle: `Draft` → `In Progress` → `Done` | `Cancelled`

### Story
A concrete, deliverable unit of work belonging to an epic.
- Naming: `NNN-short-title.md` (e.g., `001-migrate-to-vite.md`)
- Status lifecycle: `Todo` → `In Progress` → `Done` | `Blocked`

### Runbook
Step-by-step operational procedures for repeatable tasks.
- Naming: `NNN-short-title.md` (e.g., `001-local-dev-setup.md`)

### Spike
Time-boxed technical investigation to reduce uncertainty before committing to a solution.
- Naming: `NNN-short-title.md` (e.g., `001-evaluate-vite-migration.md`)
- Status lifecycle: `In Progress` → `Concluded`
