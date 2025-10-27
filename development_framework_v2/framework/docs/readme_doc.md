# Cursor AI Development Environment Framework v2.0

**Framework Version**: 2.0  
**Last Updated**: 2024-12-19  
**Status**: Best Practice Cursor AI Development Environment  
**Architecture**: Sequential Persona Switching with Intelligent Orchestration  

> **Core Purpose**: Create a best practice Cursor AI based project development environment that is fully autark from other project files, swappable after improvements without any effect on real projects, and sets up Cursor AI the best way possible to work efficiently and maintain highest possible standards and quality for project development.

## CRITICAL ARCHITECTURAL SEPARATION

This directory contains the **Cursor AI Development Environment Framework** - a completely autonomous development environment that provides specialized AI capabilities through **sequential persona switching** and **intelligent workflow orchestration** while maintaining strict separation from actual project files.

### AUTARK ARCHITECTURE

**This framework is COMPLETELY AUTONOMOUS and SWAPPABLE:**
- **Zero Project Dependencies**: Framework never creates references from project to development_framework
- **Complete Autonomy**: Project can operate without any framework dependencies
- **Swappable Design**: Framework can be replaced/updated without affecting real projects
- **Cursor Optimization**: Sets up Cursor AI for maximum efficiency and quality
- **File-Based Coordination**: Uses Cursor's file system for agent state and workflow management
- **Rules-Driven Behavior**: Leverages Cursor's powerful rules system for persona behavior
- **Hook-Based Orchestration**: Utilizes Cursor's hook system for workflow coordination

**The framework maintains COMPLETE SEPARATION from project files while providing enhanced Cursor AI capabilities.**

---

## Framework Overview

### Vision Statement
Create a best practice Cursor AI development environment that is fully autark, swappable, and optimizes Cursor AI for maximum efficiency and quality in project development.

### Mission Statement
Provide a completely autonomous development environment that enhances Cursor AI capabilities through sequential persona switching and workflow orchestration while maintaining strict separation from actual project files.

## Framework Structure

```
development_framework_v2/
├── framework/               # Core framework components
│   ├── agents/             # Agent definitions and rules
│   ├── docs/               # Framework documentation
│   ├── scripts/            # Setup and utility scripts
│   ├── bpmn/               # BPMN workflow definitions
│   ├── commands/           # Command definitions
│   └── core/               # Framework core utilities
├── .cursor/                 # Cursor configuration (created by setup)
├── PRODUCTION_README.md     # Production deployment guide
└── README_doc.md           # This file
```

## What's Included

### **Atomic Task Management System**
- **Unique Task IDs**: TASK-XXX format with sequential numbering
- **Atomic Tasks**: Self-contained, single-responsibility tasks
- **Empty Context Protocol**: Fresh start for each task
- **Individual Documentation**: Each task gets its own markdown file
- **Complete Audit Trail**: Full history of task development

### **Command-Based Persona Activation**
- **Primary Commands**: `/mission-analyst`, `/mission-planner`, `/mission-executor`, `/mission-qa`, `/mission-challenger`
- **Specialized Commands**: `/mission-prd`, `/agent-creator`, `/document-analyst`, `/prompt-optimizer`, `/publish`
- **Trading Commands**: `/trading-dev-nt8`, `/trading-quant-architect`
- **Direct Activation**: Immediate persona activation via slash commands

### **Optional Workflow Support**
- **Standard Workflow**: `/workflow-standard` - Full 6-persona sequence
- **Quick Workflow**: `/workflow-quick` - 3-persona sequence
- **Research Workflow**: `/workflow-research` - Research-focused sequence
- **Custom Workflows**: User-defined persona sequences

### **Cursor-Optimized Multi-Persona System (12+ Personas)**
- **Mission Analyst**: Deep research and investigation specialist
- **Mission Planner**: Strategic planning and technical architecture expert
- **Mission Executor**: Code implementation and testing specialist
- **Mission-QA**: Quality assurance and validation expert
- **Mission Challenger**: Optimization and assumption validation specialist
- **Mission PRD**: Requirements analysis and PRD creation specialist
- **Mission-QA Bugfix**: Bugfix analysis and planning specialist
- **Agent Creator**: Meta-agent for agent creation and optimization
- **Document Analyst**: Document processing and analysis specialist
- **Prompt Optimizer**: Instruction optimization and prompt engineering specialist
- **Publish**: Documentation and git workflow management specialist
- **Trading Dev NT8**: NinjaTrader 8 development specialist
- **Trading Quant Architect**: Quantitative trading strategy architecture specialist

### Intelligent Workflow Orchestration
- **Sequential Persona Switching**: Intelligent switching between specialized personas
- **Workflow Configuration**: Configurable workflows for different task types
- **Quality Gates**: Built-in validation and quality assurance at each stage
- **State Persistence**: Maintains context and state across persona switches
- **Hook-Based Coordination**: Uses Cursor hooks for workflow orchestration

### Cursor Integration Features
- **Persona-Specific Rules**: Custom `.cursorrules` files for each persona
- **Workflow Hooks**: Pre/post execution hooks for orchestration
- **State Management**: File-based agent state persistence
- **Command Integration**: Custom command definitions for persona activation
- **Context Management**: Intelligent context chunking and management

### Development Tools
- **MCP Context7 Integration**: External data source integration
- **Code Quality Standards**: File size limits, modular organization, MVP validation
- **Comprehensive Validation**: Setup validation and ongoing health checks
- **Enhanced Git Workflows**: Branch protection, release management, conventional commits
- **Conflict Resolution**: Automated conflict detection and resolution

### Complete Documentation
- **Framework Documentation**: Complete Cursor-optimized system details
- **User Guides**: Getting started, workflow orchestration, persona switching
- **Agent Persona Rules**: Specialized rules for each persona type
- **Template Documentation**: Comprehensive template usage instructions
- **Hook Documentation**: Workflow orchestration and coordination guides

### Command System (12 Personas + Specialized)
- **Persona Commands**: `/mission-analyst`, `/mission-planner`, `/mission-executor`, `/mission-qa`, `/mission-challenger`, `/mission-prd`, `/mission-qa-bugfix`, `/agent-creator`, `/document-analyst`, `/prompt-optimizer`, `/publish`, `/trading-dev-nt8`, `/trading-quant-architect`
- **Workflow Commands**: `/workflow-standard`, `/workflow-quick`, `/workflow-research`
- **Specialized Commands**: `/task-organizer`, `/optimize`
- **Direct Integration**: Commands directly activate persona switching and workflow orchestration
- **Seamless Workflow**: Immediate persona activation and intelligent coordination

## Development Setup

### 1. Environment Setup
```bash
# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Framework Initialization
```bash
# Initialize Framework v2
cd development_framework_v2
./scripts/init-framework.sh

# Verify installation
./scripts/verify-setup.sh
```

### 3. Start Development
```bash
# Use persona commands to activate specialized agents
/mission-analyst Analyze this project requirements
/mission-planner Create comprehensive implementation plan
/mission-executor Implement the user authentication system
/mission-qa Review this code for security vulnerabilities
/mission-challenger Optimize this implementation for performance
```

## Framework Features

### Cursor-Optimized Multi-Agent Coordination
- **Sequential Persona Switching**: Intelligent switching between specialized personas
- **Workflow Orchestration**: Configurable workflows with quality gates
- **State Persistence**: Maintains context across persona switches
- **Hook-Based Coordination**: Uses Cursor hooks for workflow management
- **Rules-Driven Behavior**: Persona-specific behavior through Cursor rules

### Development Standards
- **File Size Limits**: Keep files under 500 lines (target 300)
- **Modular Organization**: Organize by feature or responsibility
- **Type Safety**: Full TypeScript support throughout
- **Testing**: Unit, integration, and E2E testing setup
- **Documentation**: Comprehensive guides and API docs

### Quality Assurance
- **Automated Testing**: Comprehensive test coverage
- **Code Quality**: Linting, formatting, and review processes
- **Security Review**: OWASP compliance and vulnerability assessment
- **Performance Optimization**: Monitoring and bottleneck identification
- **Quality Gates**: Built-in validation at each workflow stage

## Usage Workflow

1. **Activate Persona**: Use slash commands to activate specialized agent personas
2. **Create Atomic Task**: Persona creates TASK-XXX.md file in `project/dev/tasks/`
3. **Define Requirements**: Create comprehensive task documentation
4. **Execute Task**: Persona implements solution with empty context protocol
5. **Quality Validation**: Use `/mission-qa` command for quality validation
6. **Optimization**: Use `/mission-challenger` command for optimization
7. **Deploy**: Professional git workflow with conventional commits

### **Command Examples**
```bash
# Individual persona activation
/mission-analyst Analyze requirements for user authentication system
/mission-planner Create implementation plan for OAuth2 integration
/mission-executor Implement user authentication with OAuth2
/mission-qa Review authentication system for security vulnerabilities
/mission-challenger Optimize authentication system for performance

# Optional workflow activation
/workflow-standard Implement user authentication system with OAuth2
/workflow-quick Add new button component to dashboard
/workflow-research Investigate GraphQL integration for API layer
```

## Architectural Principles

### Cursor Optimization
- **Sequential Processing**: Works with Cursor's single-agent architecture
- **File-Based Coordination**: Uses file system for agent state and workflow management
- **Rules Integration**: Leverages Cursor's rules system for persona behavior
- **Hook Orchestration**: Uses Cursor hooks for workflow coordination
- **Context Management**: Intelligent context chunking and state persistence

### Quality Standards
- **MVP Focus**: Only build what directly contributes to project goals
- **Professional Standards**: High-quality, maintainable code
- **Comprehensive Testing**: Unit, integration, and E2E tests
- **Documentation**: Complete guides and API documentation

## Ready for Any Project

This framework is designed to build any type of project with Cursor-optimized multi-agent capabilities:
- **Web Applications**: React frontend + FastAPI backend
- **Desktop Applications**: Cross-platform desktop apps
- **Mobile Applications**: React Native or Flutter apps
- **APIs**: RESTful APIs and microservices
- **Data Projects**: ETL pipelines and data processing
- **AI/ML Projects**: Machine learning and AI applications

## Persona Commands

The framework personas use slash commands for direct activation:

### Persona Commands (Primary)
- `/mission-analyst [description]` - Activate Mission Analyst persona for deep research
- `/mission-planner [specification]` - Activate Mission Planner persona for strategic planning
- `/mission-executor [task]` - Activate Mission Executor persona for implementation
- `/mission-qa [review]` - Activate Mission-QA persona for quality validation
- `/mission-challenger [optimization]` - Activate Mission Challenger persona for optimization
- `/mission-prd [requirements]` - Activate Mission PRD persona for requirements analysis
- `/mission-qa-bugfix [bug]` - Activate Mission-QA Bugfix persona for bugfix analysis
- `/agent-creator [creation]` - Activate Agent Creator persona for agent creation
- `/document-analyst [document]` - Activate Document Analyst persona for document analysis
- `/prompt-optimizer [prompt]` - Activate Prompt Optimizer persona for prompt optimization
- `/publish [content]` - Activate Publish persona for documentation and git workflow
- `/trading-dev-nt8 [strategy]` - Activate Trading Dev NT8 persona for NinjaTrader 8 development
- `/trading-quant-architect [analysis]` - Activate Trading Quant Architect persona for quantitative analysis

### Workflow Commands
- `/workflow-standard [task]` - Execute standard multi-persona workflow
- `/workflow-quick [task]` - Execute quick 3-persona workflow
- `/workflow-research [task]` - Execute research-focused workflow

### Specialized Commands
- `/task-organizer [cleanup]` - Activate task cleanup and archiving
- `/optimize [system]` - Activate optimization process

## Framework v2 Innovations

### Cursor-Optimized Architecture
- **Sequential Persona Switching**: Simulates multi-agent behavior through intelligent switching
- **File-Based Coordination**: Uses Cursor's file system for state and workflow management
- **Rules-Driven Behavior**: Leverages Cursor's rules system for persona behavior
- **Hook-Based Orchestration**: Utilizes Cursor's hook system for coordination
- **Context-Aware Processing**: Maintains context across persona switches

### Intelligent Workflow Orchestration
- **Configurable Workflows**: Standard, quick, and research workflows
- **Quality Gates**: Built-in validation at each stage
- **State Persistence**: Maintains context and state across switches
- **Error Handling**: Comprehensive error handling and recovery
- **Performance Monitoring**: Tracks and optimizes system performance

### Enhanced Integration
- **MCP Context7 Integration**: External data source integration
- **Web Search Integration**: Real-time information gathering
- **Documentation Generation**: Automated documentation creation
- **Testing Integration**: Comprehensive testing framework
- **Git Integration**: Enhanced git workflows and automation

## Next Steps

1. **Choose Your Project**: Define what you want to build
2. **Activate Personas**: Use persona commands to activate specialized agent personas
3. **Define Requirements**: Create your PRD_doc.md
4. **Start Development**: Begin the multi-persona workflow with commands
5. **Build Professionally**: Follow framework standards and practices

## Contributing

This framework follows professional development standards:
- **File Size Limits**: Keep files under 500 lines (target 300)
- **Modular Organization**: Organize by feature or responsibility
- **Type Hints**: Use Python type hints and TypeScript
- **Documentation**: Include comprehensive docstrings
- **Testing**: Maintain high test coverage
- **Code Quality**: Follow PEP8 and use black formatting

## CRITICAL REMINDER

### **This Framework is Cursor-Optimized**

- **Purpose**: Build and maintain your project application with Cursor-optimized multi-agent capabilities
- **Scope**: Development tools, personas, workflows, documentation
- **Architecture**: Sequential persona switching with intelligent orchestration
- **Compatibility**: Works seamlessly within Cursor's single-agent architecture

### **Architectural Innovation**

**The success of this framework depends on its Cursor optimization:**
- Framework provides multi-agent benefits through persona switching
- Project operates with enhanced AI capabilities
- No architectural conflicts with Cursor's limitations
- Complete compatibility with Cursor's single-agent model

**This framework represents a breakthrough in adapting multi-agent research to Cursor's constraints while maintaining all the benefits of specialized AI agents.**

---

## License

This development framework follows standard licensing terms for development tools and templates.

---

**Ready to build your next project with Cursor-optimized multi-agent development!**
