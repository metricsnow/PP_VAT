# Persona System Documentation - Framework v2.0

## Overview

The Framework v2.0 Persona System implements Cursor-optimized multi-agent capabilities through sequential persona switching and intelligent workflow orchestration. This system provides specialized AI agent behavior within Cursor's single-agent architecture constraints.

## Core Concept

Instead of running multiple agents in parallel (which Cursor doesn't support), the framework uses **sequential persona switching** to simulate multi-agent behavior:

```bash
User Input → Persona Selection → Context Loading → Task Processing → State Saving → Next Persona
```

## Persona Architecture

### 1. Mission Analyst Persona
**Role**: Deep research and investigation specialist  
**Activation**: `/mission-analyst` command  
**Focus**: Comprehensive analysis, MCP Context7 integration, web search research  

**Key Capabilities**:
- Deep research methodology with systematic investigation
- Multi-source intelligence gathering (MCP Context7 + Web Search)
- Technical documentation and structured analysis
- Strategic intelligence and actionable insights
- PRD analysis as mandatory first step

**State Management**:
- State file: `.cursor/agent_states/mission-analyst.json`
- Context preservation across Cursor sessions
- Research history and source tracking
- Performance metrics and quality scores

### 2. Mission Planner Persona
**Role**: Strategic planning and technical architecture expert  
**Activation**: `/mission-planner` command  
**Focus**: Precision planning, requirements analysis, technical architecture  

**Key Capabilities**:
- Structured planning methodology with 10-step protocol
- Technical architecture excellence and feasibility validation
- Requirements-driven planning with MCP Context7 integration
- Primary and contingency planning strategies
- Atomic task breakdown with clear dependencies

**State Management**:
- State file: `.cursor/agent_states/mission-planner.json`
- Architecture documentation and task tracking
- Planning history and decision records
- Feasibility validation and risk assessment

### 3. Mission Executor Persona
**Role**: Code implementation and testing specialist  
**Activation**: `/mission-executor` command  
**Focus**: Systematic execution, code quality, testing integration  

**Key Capabilities**:
- Systematic implementation following detailed plans
- Code quality maintenance and best practices
- Comprehensive testing integration (unit, integration, E2E)
- Documentation creation and maintenance
- Quality assurance and validation

**State Management**:
- State file: `.cursor/agent_states/mission-executor.json`
- Code change tracking and implementation progress
- Testing records and quality metrics
- Documentation and deployment readiness

### 4. Mission-QA Persona
**Role**: Quality assurance and validation specialist  
**Activation**: `/mission-qa` command  
**Focus**: Comprehensive validation, security assessment, performance evaluation  

**Key Capabilities**:
- Comprehensive quality validation and testing
- Security assessment and OWASP compliance
- Performance evaluation and optimization opportunities
- Documentation review and accuracy validation
- Quality assurance and standards compliance

**State Management**:
- State file: `.cursor/agent_states/mission-qa.json`
- Validation records and quality metrics
- Security assessment logs and compliance tracking
- Performance evaluation and optimization records

### 5. Mission Challenger Persona
**Role**: Optimization and assumption validation specialist  
**Activation**: `/mission-challenger` command  
**Focus**: Assumption challenge, optimization analysis, efficiency evaluation  

**Key Capabilities**:
- Assumption validation and challenge
- Optimization analysis and improvement identification
- Efficiency evaluation and performance optimization
- Alternative solutions and creative problem solving
- Critical analysis and improvement suggestions

**State Management**:
- State file: `.cursor/agent_states/mission-challenger.json`
- Optimization analysis and recommendation tracking
- Assumption validation and challenge records
- Efficiency analysis and improvement suggestions

## Persona Switching Mechanism

### 1. Activation Process
```javascript
// Persona activation flow
1. User issues command (e.g., /mission-analyst)
2. Load persona-specific rules from .cursor/rules/
3. Update .cursorrules file with persona rules
4. Load persona state from .cursor/agent_states/
5. Set up persona context and environment
6. Execute pre-execution hooks
7. Process task with persona behavior
8. Execute post-execution hooks
9. Save updated state and context
10. Prepare for next persona if in workflow
```

### 2. State Persistence
Each persona maintains persistent state across Cursor sessions:

```json
{
  "persona": "mission-analyst",
  "createdAt": "2024-12-19T00:00:00.000Z",
  "lastUpdated": "2024-12-19T00:00:00.000Z",
  "state": {
    "currentFocus": "user authentication analysis",
    "researchAreas": ["OAuth2", "JWT", "security"],
    "sources": ["MCP Context7", "OWASP", "RFC 6749"],
    "findings": ["OAuth2 is recommended", "JWT for tokens"],
    "recommendations": ["Implement OAuth2 flow", "Use JWT tokens"]
  },
  "history": [...],
  "metrics": {
    "totalExecutions": 15,
    "averageExecutionTime": 45.2,
    "successRate": 0.93,
    "researchQuality": 0.89
  }
}
```

### 3. Context Management
Personas maintain context through:
- **State Files**: Persistent state in `.cursor/agent_states/`
- **Context Files**: Temporary context in `.cursor/agent_states/{persona}_context.json`
- **Workflow State**: Workflow progress in `.cursor/workflows/{workflow}_progress.json`
- **Execution Logs**: Detailed logs in `.cursor/logs/`

## Workflow Integration

### 1. Sequential Workflow Execution
```bash
# Standard workflow example
/mission-analyst → /mission-planner → /mission-executor → /mission-qa → /mission-challenger
```

### 2. Workflow Orchestration
The framework supports three workflow types:

**Standard Workflow** (5 personas):
- Comprehensive validation and quality assurance
- Estimated duration: 30 minutes
- Use cases: Complex projects, production-ready code

**Quick Workflow** (3 personas):
- Rapid development and essential validation
- Estimated duration: 11 minutes
- Use cases: Rapid prototyping, quick fixes

**Research Workflow** (3 personas):
- Research-focused analysis and planning
- Estimated duration: 17 minutes
- Use cases: Research projects, architecture design

### 3. Quality Gates
Each workflow step includes quality gates:
- **Completeness**: All required components present
- **Accuracy**: Information verified and correct
- **Documentation**: Proper documentation provided
- **Feasibility**: Plans are technically feasible
- **Quality**: Code meets quality standards
- **Security**: Security requirements met
- **Performance**: Performance standards achieved

## Usage Examples

### 1. Single Persona Activation
```bash
# Activate Mission Analyst for research
/mission-analyst Analyze the requirements for implementing a user authentication system

# Activate Mission Planner for planning
/mission-planner Create a comprehensive implementation plan based on the analysis

# Activate Mission Executor for implementation
/mission-executor Implement the user authentication system with OAuth2 integration
```

### 2. Workflow Execution
```bash
# Execute standard workflow
/workflow-standard Implement a complete user authentication system with OAuth2

# Execute quick workflow
/workflow-quick Add user login functionality to the existing system

# Execute research workflow
/workflow-research Research and design the architecture for a microservices system
```

### 3. State Inspection
```bash
# Check persona state
cat .cursor/agent_states/mission-analyst.json

# Check workflow progress
cat .cursor/workflows/standard_progress.json

# Check execution logs
tail -f .cursor/logs/execution.log
```

## Best Practices

### 1. Persona Selection
- **Use Mission Analyst** for research and analysis tasks
- **Use Mission Planner** for strategic planning and architecture
- **Use Mission Executor** for code implementation and testing
- **Use Mission-QA** for quality validation and security assessment
- **Use Mission Challenger** for optimization and assumption validation

### 2. Workflow Selection
- **Use Standard Workflow** for complex, production-ready projects
- **Use Quick Workflow** for rapid prototyping and simple features
- **Use Research Workflow** for research projects and architecture design

### 3. State Management
- **Regular State Backup**: Backup `.cursor/agent_states/` directory
- **Log Monitoring**: Monitor `.cursor/logs/` for execution issues
- **Performance Tracking**: Review metrics in persona state files
- **Context Preservation**: Maintain context across persona switches

### 4. Quality Assurance
- **Quality Gates**: Ensure all quality gates pass before proceeding
- **State Validation**: Validate persona state integrity
- **Workflow Monitoring**: Monitor workflow progress and completion
- **Error Handling**: Handle persona switching errors gracefully

## Troubleshooting

### 1. Persona Not Activating
- Check if persona rules file exists in `.cursor/rules/`
- Verify persona state file exists in `.cursor/agent_states/`
- Check Cursor rules loading in `.cursorrules` file
- Review execution logs for errors

### 2. State Not Persisting
- Verify write permissions on `.cursor/agent_states/` directory
- Check file system space and permissions
- Review state file JSON format and validity
- Check for file locking issues

### 3. Workflow Not Progressing
- Check workflow configuration in `.cursor/workflows/`
- Verify quality gate requirements and results
- Review workflow progress in `.cursor/workflows/{workflow}_progress.json`
- Check execution logs for workflow errors

### 4. Quality Gate Failures
- Review quality gate results in logs
- Check persona-specific quality requirements
- Verify input data meets quality standards
- Review quality gate configuration and thresholds

## Conclusion

The Framework v2.0 Persona System provides a powerful, Cursor-optimized approach to multi-agent development. By leveraging sequential persona switching, state persistence, and intelligent workflow orchestration, it delivers the benefits of specialized AI agents while working within Cursor's architectural constraints.

The system is designed to be:
- **Efficient**: Optimized for Cursor's single-agent architecture
- **Flexible**: Supports multiple workflow types and use cases
- **Reliable**: Comprehensive state management and error handling
- **Scalable**: Easy to extend with new personas and workflows
- **Professional**: Production-ready quality and documentation
