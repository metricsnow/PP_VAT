# Templates Directory

## Purpose
This directory stores Cursor AI template files for workflow orchestration and task management.

## Usage
- **Task Templates**: Standard templates for creating tasks
- **Workflow Templates**: Templates for workflow definitions
- **Documentation Templates**: Templates for documentation generation

## Current Status
**Active Templates Available** - Templates are ready for use in framework operations.

## Available Templates
- `task-template.md` - Standard task documentation template
- `bug-report-template.md` - Bug report template

## Framework Integration
Templates are referenced by:
- Agent files in `framework/agents/` - Agents reference templates for consistent file creation
- Commands in `framework/commands/` - Command definitions can use templates
- Workflows in `framework/docs/workflows/` - Workflows use template files for automation
- Persona agents - Agents generate files from templates following standardized formats

## Template Usage
When creating task files or bug files:
1. Read template from `development_framework_v2/framework/templates/`
2. Fill template placeholders with actual data
3. Create file in appropriate `project/dev/tasks/` or `project/dev/bugs/` directory
4. Follow naming conventions:
   - Tasks: `TASK-XXX.md` (e.g., TASK-001.md)
   - Bugs: `BUG-XXX.md` (e.g., BUG-001.md)

