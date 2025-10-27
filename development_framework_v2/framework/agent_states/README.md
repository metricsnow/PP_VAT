# Agent States Directory

## Purpose
This directory stores persona state files for state persistence across executions.

## Usage
- **Persona State**: JSON files storing persona-specific state
- **Workflow State**: State information for workflow orchestration
- **Execution Context**: Context maintained across persona switches

## Current Status
**Empty by design** - State files are automatically created during framework usage.

## Framework Integration
Agent states are used by:
- `.cursor/rules/` - Rules can access state files
- `.cursor/workflows/` - Workflows maintain state
- Persona agents - Maintain context between activations

## File Format
State files use JSON format:
```json
{
  "persona": "mission-analyst",
  "timestamp": "2024-12-26T00:00:00Z",
  "state": { ... }
}
```

