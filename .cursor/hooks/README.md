# Hooks Directory

## Purpose
This directory stores Cursor AI hook files for workflow orchestration.

## Usage
- **Pre-execution Hooks**: Prepare environment before persona activation
- **Post-execution Hooks**: Cleanup and state management after persona completion
- **Workflow Hooks**: Coordinate multi-persona workflow transitions

## Current Status
**Empty by design** - Hooks are created as needed during framework usage.

## Framework Integration
Hooks are referenced by:
- `.cursor/workflows/` - Workflow definitions can trigger hooks
- Persona agents - Can register hook callbacks
- State management - Hooks maintain state between personas

## Future Additions
- `pre-execution.js` - Pre-execution orchestration
- `post-execution.js` - Post-execution cleanup
- `workflow-coordination.js` - Multi-persona coordination

## Note
Hooks are not copied by setup script (see line 135 in setup.sh):
> "Hooks are not copied - they should be created separately if needed"

