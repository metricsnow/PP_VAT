# Atomic Task Management System - Framework v2

## Overview

The Cursor AI Development Environment Framework v2 implements a comprehensive atomic task management system that ensures each task has a unique ID, is atomic and self-contained, and includes detailed planning, implementation, and documentation in individual markdown files while maintaining complete autark separation.

## Key Features

### ✅ Unique Task IDs
- **Format**: TASK-XXX where XXX is a 3-digit sequential number
- **Generation**: Automatic sequential numbering starting from TASK-001
- **Uniqueness**: Each task gets a guaranteed unique identifier
- **Tracking**: Current counter stored in `project/dev/task-counter.txt`

### ✅ Atomic Tasks
- **Single Responsibility**: Each task has one clear objective
- **Self-Contained**: Tasks include all necessary context and requirements
- **Independent**: Tasks can be worked on independently by different personas
- **Clear Boundaries**: Well-defined start and end points

### ✅ Empty Context Protocol
- **Fresh Start**: Each persona begins with empty context for new tasks
- **No Memory**: Personas don't carry over previous session information
- **Task-Focused**: Personas read only the specific task documentation
- **Consistent Results**: Ensures consistent output regardless of previous work

### ✅ Individual Documentation
- **Dedicated Files**: Each task gets its own markdown file (`project/dev/tasks/TASK-XXX.md`)
- **Comprehensive**: Includes planning, implementation, and documentation sections
- **Audit Trail**: Complete history of task development
- **Persona Contributions**: Each persona updates their respective sections

## CRITICAL AUTARK PRINCIPLE

### ⚠️ **ABSOLUTE AUTARK RULE**

**The autark principle is the HIGHEST and MOST IMPORTANT principle of Framework v2:**

- ❌ **NEVER** create references from project to development_framework
- ❌ **NEVER** modify project files to reference framework paths
- ❌ **NEVER** create dependencies from project to framework scripts
- ❌ **NEVER** allow project code to import from framework

**The project layer MUST remain COMPLETELY AUTONOMOUS and independent.**

### 🎯 **Autark Task Management**

**Task files are created in PROJECT directories, NEVER in framework:**
- ✅ **Task Files**: `project/dev/tasks/TASK-XXX.md` (project layer)
- ✅ **Task Counter**: `project/dev/task-counter.txt` (project layer)
- ✅ **Project Documentation**: `project/docs/` (project layer)
- ❌ **Framework References**: No project files reference framework paths

**CRITICAL**: Violating autark principle breaks the entire architectural design and compromises the project's independence.

## System Components

### 1. Command-Based Persona Activation
**Role**: Direct persona activation via slash commands
- `/mission-analyst` - Activate Mission Analyst for requirements analysis
- `/mission-planner` - Activate Mission Planner for task planning
- `/mission-executor` - Activate Mission Executor for implementation
- `/mission-qa` - Activate Mission-QA for quality validation
- `/mission-challenger` - Activate Mission Challenger for optimization

### 2. Optional Workflow Support
- **Standard Workflow**: `/workflow-standard` - Full persona sequence
- **Quick Workflow**: `/workflow-quick` - 3-persona sequence
- **Research Workflow**: `/workflow-research` - Research-focused sequence
- **Custom Workflows**: User-defined persona sequences

### 3. Task Documentation Template
Each task file contains:
- **Task Overview**: ID, status, priority, estimated time
- **Requirements**: Functional and technical requirements
- **Implementation Plan**: Phases and milestones
- **Acceptance Criteria**: Clear success metrics
- **Planning Section**: Filled by Mission Planner
- **Implementation Section**: Filled by Mission Executor
- **Documentation Section**: Filled by all personas
- **Task Status**: Progress tracking checkboxes

## Workflow Process

### 1. Task Creation (Commands)
```bash
# Use slash commands to activate specialized personas
/mission-analyst Analyze requirements and create comprehensive analysis
/mission-planner Create detailed implementation plan with technical architecture
/mission-executor Implement the planned solution with systematic execution
/mission-qa Review implementation for quality, security, and performance
```

### 2. Optional Workflow Execution
```bash
# Use workflow commands for predefined sequences
/workflow-standard Implement user authentication system
/workflow-quick Add new feature to existing component
/workflow-research Investigate new technology integration
```

### 3. Persona Execution
- Persona reads task documentation from `project/dev/tasks/TASK-XXX.md`
- Works with empty context (no previous session memory)
- Completes task according to specifications
- Updates task documentation with results
- Maintains autark separation (no framework references)

### 4. Task Completion
```bash
# QA review happens through commands
/mission-qa Review implementation for quality, security, and performance
/mission-challenger Optimize implementation for maximum efficiency
```

## Persona Coordination

### Handoff Protocol
1. **User** activates persona via slash command
2. **Persona** reads task documentation and requirements
3. **Persona** completes task with mandatory protocols:
   - **MCP Context7 Integration**: Official documentation validation
   - **Web Search Research**: Best practices and solutions research
   - **Mission-QA Handoff**: Quality validation delivery (Mission Executor only)
4. **Persona** updates task documentation with results
5. **Persona** reports completion to user
6. **User** validates task completion and activates next persona

### Persona-Specific Boundaries
- **Mission Analyst**: Research and analysis in `project/docs/`
- **Mission Planner**: Planning in `project/dev/tasks/`
- **Mission Executor**: Implementation in `project/src/`
- **Mission-QA**: Validation across all project files
- **Mission Challenger**: Optimization across all project files

## File Structure

```
project_[PROJECT_NAME]/
├── project/
│   ├── dev/                    # Project development workspace
│   │   ├── tasks/              # Individual task documentation
│   │   │   ├── TASK-001.md     # Task 1 documentation
│   │   │   ├── TASK-002.md     # Task 2 documentation
│   │   │   └── ...             # Additional tasks
│   │   ├── task-counter.txt    # Current task counter
│   │   └── scratchpad_doc.md   # Persona communication
│   ├── docs/                   # Project documentation
│   └── src/                    # Project source code
├── development_framework_v2/   # Framework layer (AUTARK)
│   ├── agents/                 # Persona definitions
│   ├── commands/               # Command definitions
│   ├── workflows/              # Workflow definitions
│   └── docs/                   # Framework documentation
└── .cursorrules                # Cursor AI configuration
```

## Benefits

### 1. Clear Accountability
- Each task has a clear owner and timeline
- Progress is tracked in individual task files
- Persona contributions are documented separately

### 2. Consistent Quality
- Empty context ensures fresh perspective
- Standardized task documentation format
- Clear acceptance criteria for each task

### 3. Scalable Workflow
- Tasks can be worked on in parallel
- Easy to add new personas or modify workflows
- Clear separation of concerns

### 4. Complete Audit Trail
- Every task has detailed documentation
- Persona handoffs are clearly tracked
- Decision history is preserved

### 5. Autark Independence
- Project operates completely independently
- Framework can be swapped without affecting project
- No cross-layer dependencies

## Usage Examples

### Creating a New Feature
```bash
# 1. Use slash commands to activate specialized personas
/mission-analyst Analyze requirements and create comprehensive analysis
/mission-planner Create detailed implementation plan with technical architecture
/mission-executor Implement the planned solution with systematic execution
/mission-qa Review implementation for quality, security, and performance
/mission-challenger Optimize implementation for maximum efficiency
```

### Using Optional Workflows
```bash
# Standard workflow for complex features
/workflow-standard Implement user authentication system

# Quick workflow for simple features
/workflow-quick Add new button component

# Research workflow for technology investigation
/workflow-research Investigate GraphQL integration
```

### Task Documentation Example
Each task file includes:
- **Planning Section**: Architecture decisions, requirements analysis
- **Implementation Section**: Code changes, testing results
- **Documentation Section**: API docs, user guides, code comments
- **Status Tracking**: Progress checkboxes and completion timestamps

## Integration with Cursor AI

The atomic task management system integrates seamlessly with:
- **Cursor AI Optimization**: Sequential persona switching
- **Auto LLM Selection**: Intelligent model selection
- **Context Management**: Intelligent context chunking
- **File-Based Coordination**: Cursor's file system for state management
- **Rules-Driven Behavior**: Cursor's rules system for persona behavior

## Next Steps

1. **Validate System**: Test with real development tasks
2. **Create Examples**: Build example tasks for common scenarios
3. **Persona Training**: Ensure all personas understand the new protocols
4. **Continuous Improvement**: Refine based on usage feedback

This atomic task management system provides a robust foundation for Cursor AI-assisted development with clear accountability, consistent quality, complete traceability, and strict autark separation.
