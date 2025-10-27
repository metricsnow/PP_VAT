# Workflows Directory

## Purpose
This directory stores Cursor AI workflow configuration files.

## Usage
- **Workflow Definitions**: JSON or YAML files defining persona sequences
- **Workflow Orchestration**: Files that coordinate multi-persona workflows
- **Workflow Templates**: Reusable workflow patterns

## Current Status
**Empty by design** - Workflow files will be created as needed during framework usage.

## Framework Integration
Workflows are referenced by:
- `.cursor/commands/workflow-*.md` - Workflow command definitions
- `.cursor/hooks/` - Workflow orchestration hooks
- Persona agents - Workflow triggers persona activation

## Future Additions
- `standard-workflow.json` - Standard 5-persona workflow
- `quick-workflow.json` - Quick 3-persona workflow  
- `research-workflow.json` - Research-focused workflow

