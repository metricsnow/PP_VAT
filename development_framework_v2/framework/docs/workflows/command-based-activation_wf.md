# Command-Based Persona Activation System - Framework v2

## Overview

The Cursor AI Development Environment Framework v2 implements a comprehensive command-based persona activation system that enables direct activation of specialized personas through slash commands while maintaining strict autark separation and supporting optional workflow execution.

## Core Commands

### **Primary Persona Commands**
- `/mission-analyst [description]` - Activate Mission Analyst for deep research and investigation
- `/mission-planner [specification]` - Activate Mission Planner for strategic planning and technical architecture
- `/mission-executor [task]` - Activate Mission Executor for code implementation and testing
- `/mission-qa [review]` - Activate Mission-QA for quality validation and security review
- `/mission-challenger [optimization]` - Activate Mission Challenger for optimization and assumption validation

### **Specialized Persona Commands**
- `/mission-prd [requirements]` - Activate Mission PRD for requirements analysis and PRD creation
- `/mission-qa-bugfix [bug]` - Activate Mission-QA Bugfix for bugfix analysis and planning
- `/agent-creator [creation]` - Activate Agent Creator for agent creation and optimization
- `/document-analyst [document]` - Activate Document Analyst for document processing and analysis
- `/prompt-optimizer [prompt]` - Activate Prompt Optimizer for instruction optimization
- `/publish [content]` - Activate Publish for documentation and git workflow management

### **Trading Specialized Commands**
- `/trading-dev-nt8 [strategy]` - Activate Trading Dev NT8 for NinjaTrader 8 development
- `/trading-quant-architect [analysis]` - Activate Trading Quant Architect for quantitative analysis

## Optional Workflow Commands

### **Predefined Workflows**
- `/workflow-standard [task]` - Execute standard multi-persona workflow (6 personas)
- `/workflow-quick [task]` - Execute quick 3-persona workflow (Analyst → Planner → Executor)
- `/workflow-research [task]` - Execute research-focused workflow (Analyst → PRD → Planner)

### **Workflow Sequences**

#### **Standard Workflow** (`/workflow-standard`)
1. **Mission Analyst**: Deep research and investigation
2. **Mission Planner**: Strategic planning and technical architecture
3. **Mission Executor**: Code implementation and testing
4. **Mission-QA**: Quality validation and security review
5. **Mission Challenger**: Optimization and assumption validation
6. **Agent Creator**: Meta-analysis and optimization (if needed)

#### **Quick Workflow** (`/workflow-quick`)
1. **Mission Analyst**: Requirements analysis
2. **Mission Planner**: Implementation planning
3. **Mission Executor**: Code implementation

#### **Research Workflow** (`/workflow-research`)
1. **Mission Analyst**: Deep research and investigation
2. **Mission PRD**: Requirements analysis and PRD creation
3. **Mission Planner**: Strategic planning based on research

## Command Activation Process

### **Direct Persona Activation**
1. **User** types slash command with task description
2. **Framework** activates specified persona immediately
3. **Persona** reads task documentation from `project/dev/tasks/TASK-XXX.md`
4. **Persona** executes task with empty context protocol
5. **Persona** updates task documentation with results
6. **Persona** reports completion to user

### **Workflow Activation**
1. **User** types workflow command with task description
2. **Framework** executes predefined persona sequence
3. **Each Persona** follows standard activation process
4. **Framework** coordinates handoffs between personas
5. **Final Persona** reports workflow completion

## CRITICAL AUTARK PRINCIPLE

### ⚠️ **ABSOLUTE AUTARK RULE**

**All commands MUST maintain strict autark separation:**

- ✅ **Task Files**: Created in `project/dev/tasks/` (project layer)
- ✅ **Project Data**: Stored in `project/` directories only
- ✅ **Persona States**: Managed in `.cursor/agent_states/` (framework only)
- ❌ **No Cross-References**: Project files never reference framework
- ❌ **No Dependencies**: Project operates independently

**CRITICAL**: Violating autark principle breaks the entire architectural design.

## Command Examples

### **Individual Persona Commands**
```bash
# Deep research and analysis
/mission-analyst Analyze the requirements for implementing a user authentication system with OAuth2 integration

# Strategic planning
/mission-planner Create comprehensive implementation plan for the user authentication system

# Code implementation
/mission-executor Implement the user authentication system with OAuth2 integration

# Quality validation
/mission-qa Review the user authentication implementation for security vulnerabilities

# Optimization
/mission-challenger Optimize the user authentication system for performance and security
```

### **Workflow Commands**
```bash
# Standard workflow for complex features
/workflow-standard Implement user authentication system with OAuth2 integration

# Quick workflow for simple features
/workflow-quick Add new button component to the dashboard

# Research workflow for technology investigation
/workflow-research Investigate GraphQL integration for the API layer
```

### **Specialized Commands**
```bash
# Requirements analysis
/mission-prd Create comprehensive PRD for the user authentication system

# Bugfix analysis
/mission-qa-bugfix Analyze and plan fix for authentication token expiration issue

# Document analysis
/document-analyst Analyze the existing API documentation and create comprehensive guide

# Prompt optimization
/prompt-optimizer Optimize the user authentication prompts for better AI responses
```

## Integration with Atomic Task System

### **Task Creation Process**
1. **User** activates persona via command
2. **Persona** creates new task file: `project/dev/tasks/TASK-XXX.md`
3. **Persona** increments task counter: `project/dev/task-counter.txt`
4. **Persona** documents task requirements and implementation plan
5. **Persona** executes task according to specifications

### **Task Documentation Format**
Each task file (`TASK-XXX.md`) includes:
- **Task Overview**: ID, status, priority, estimated time
- **Requirements**: Functional and technical requirements
- **Implementation Plan**: Phases and milestones
- **Acceptance Criteria**: Clear success metrics
- **Planning Section**: Filled by Mission Planner
- **Implementation Section**: Filled by Mission Executor
- **Documentation Section**: Filled by all personas
- **Task Status**: Progress tracking checkboxes

## Persona-Specific Protocols

### **Mission Analyst Protocol**
- **MCP Context7 Integration**: Official documentation validation
- **Web Search Research**: Best practices and solutions research
- **Comprehensive Analysis**: Deep investigation and documentation
- **Strategic Intelligence**: Actionable insights and recommendations

### **Mission Planner Protocol**
- **Technical Architecture**: System design and feasibility analysis
- **Task Breakdown**: Atomic task creation and dependency mapping
- **Resource Planning**: Time estimates and resource allocation
- **Risk Assessment**: Potential issues and mitigation strategies

### **Mission Executor Protocol**
- **Code Implementation**: Systematic code development
- **Testing Integration**: Unit and integration testing
- **Documentation**: Code documentation and API docs
- **Mission-QA Handoff**: Quality validation delivery

### **Mission-QA Protocol**
- **Quality Validation**: Comprehensive quality review
- **Security Review**: OWASP compliance and vulnerability assessment
- **Performance Review**: Performance optimization recommendations
- **Standards Compliance**: Code quality and documentation standards

### **Mission Challenger Protocol**
- **Assumption Validation**: Challenge assumptions and requirements
- **Optimization Analysis**: Performance and efficiency improvements
- **Alternative Solutions**: Explore different implementation approaches
- **Best Practices**: Apply industry best practices and patterns

## Benefits

### **1. Immediate Activation**
- Direct persona activation without file I/O delays
- Seamless workflow with real-time iteration
- Context preservation across persona switches

### **2. Flexible Workflows**
- Individual persona commands for specific tasks
- Predefined workflows for common scenarios
- Custom workflow support for specialized needs

### **3. Consistent Quality**
- Standardized persona protocols
- Empty context ensures fresh perspective
- Clear handoff procedures between personas

### **4. Complete Traceability**
- All commands logged and tracked
- Task documentation provides audit trail
- Persona contributions clearly documented

### **5. Autark Independence**
- Project operates completely independently
- Framework can be swapped without affecting project
- No cross-layer dependencies

## Usage Guidelines

### **Command Selection**
- **Use individual commands** for specific, focused tasks
- **Use workflow commands** for complex, multi-step processes
- **Use specialized commands** for domain-specific tasks

### **Task Management**
- **Create atomic tasks** with clear boundaries
- **Document all decisions** in task files
- **Maintain task counter** for unique identification

### **Quality Assurance**
- **Always use Mission-QA** for final validation
- **Apply Mission Challenger** for optimization
- **Follow persona protocols** consistently

This command-based persona activation system provides immediate, flexible, and high-quality development capabilities while maintaining strict autark separation and supporting both individual and workflow-based development processes.
