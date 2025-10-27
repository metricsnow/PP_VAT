# Framework v2 BPMN Workflow Documentation

This directory contains BPMN (Business Process Model and Notation) workflow documentation for Framework v2, designed to work with [bpmn.io](https://bpmn.io) tools and libraries.

## 📁 Files Overview

### Workflow Files
- **`standard-workflow-bpmn.js`** - 5-Persona Sequential Workflow (Analyst → Planner → Executor → QA → Challenger)
- **`quick-workflow-bpmn.js`** - 3-Persona Rapid Workflow (Planner → Executor → QA)
- **`research-workflow-bpmn.js`** - 3-Persona Research Workflow (Analyst → Planner → Challenger)
- **`new-chat-workflow-bpmn.js`** - Intelligent File/Folder Analysis with Automatic Routing
- **`persona-switching-workflow-bpmn.js`** - Sequential Persona Switching with Quality Gates
- **`quality-gates-workflow-bpmn.js`** - 8-Stage Quality Validation Process
- **`master-orchestrator-workflow-bpmn.js`** - Complete Framework v2 Orchestration

### Demo File
- **`framework-v2-bpmn-demo.html`** - Interactive demo page showcasing all workflows

## 🚀 Usage

### Individual Workflow Files

Each workflow file exports a function that renders the BPMN diagram:

```javascript
// Include bpmn-js library
<script src="https://unpkg.com/bpmn-js@8.7.1/dist/bpmn-viewer.development.js"></script>

// Include the workflow file
<script src="standard-workflow-bpmn.js"></script>

// Create container and render
<div id="workflow-container"></div>
<script>
    const viewer = renderStandardWorkflow('workflow-container');
</script>
```

### Interactive Demo

Open `framework-v2-bpmn-demo.html` in a web browser to:
- View all Framework v2 workflows interactively
- Switch between different workflow types
- See detailed descriptions for each workflow
- Experience the complete BPMN documentation system

## 🔧 Technical Details

### BPMN 2.0 Compliance
- All workflows are fully compliant with BPMN 2.0 XML standard
- Compatible with bpmn.io tools and libraries
- Can be imported into any BPMN-compatible tool

### bpmn-js Integration
- Uses bpmn-js viewer for rendering
- Automatic viewport fitting
- Error handling and logging
- Modular design for easy integration

### Workflow Types

#### Standard Workflow (5-Persona)
- **Use Case**: Complex tasks requiring thorough analysis
- **Personas**: Mission Analyst → Mission Planner → Mission Executor → Mission-QA → Mission Challenger
- **Quality**: Full quality assurance with critical review

#### Quick Workflow (3-Persona)
- **Use Case**: Simple tasks needing rapid execution
- **Personas**: Mission Planner → Mission Executor → Mission-QA
- **Quality**: Essential quality checks only

#### Research Workflow (3-Persona)
- **Use Case**: Research tasks requiring analysis and evaluation
- **Personas**: Mission Analyst → Mission Planner → Mission Challenger
- **Quality**: Focus on research quality and critical evaluation

#### New Chat Workflow (2-3 Personas)
- **Use Case**: File/folder analysis with automatic routing
- **Personas**: Mission Analyst → (Mission Planner | Mission-QA) → Optional merge
- **Quality**: Intelligent routing with confidence scoring
- **Features**: Automatic task/bug creation in appropriate folders

#### Persona Switching Workflow
- **Use Case**: Sequential persona switching with quality gates
- **Features**: Pre-execution gates, persona selection, post-execution validation, state persistence
- **Quality**: Comprehensive quality validation at each step

#### Quality Gates Workflow
- **Use Case**: Comprehensive quality validation
- **Gates**: Context → Standards → Template → Placement → Documentation → Code → Validation → Assumption
- **Features**: Quality scoring, auto-correction, decision routing

#### Master Orchestrator Workflow
- **Use Case**: Complete Framework v2 orchestration
- **Features**: Workflow selection, subprocess integration, quality gates, state management
- **Coverage**: Coordinates all other workflows

## 📊 BPMN Elements Used

### Tasks
- **User Tasks**: Manual tasks performed by personas
- **Service Tasks**: Automated quality gates and validation
- **Script Tasks**: State persistence and calculations

### Gateways
- **Exclusive Gateways**: Workflow selection and quality decisions
- **Parallel Gateways**: Concurrent quality gate execution

### Events
- **Start Events**: Workflow initiation
- **End Events**: Workflow completion

### Subprocesses
- **Embedded Subprocesses**: Workflow-specific persona sequences
- **Call Activities**: Reusable workflow components

## 🎯 Benefits

### Documentation
- **Visual Process Maps**: Clear understanding of Framework v2 workflows
- **Standard Compliance**: Industry-standard BPMN notation
- **Interactive Exploration**: Live workflow visualization

### Integration
- **Tool Compatibility**: Works with bpmn.io ecosystem
- **Export Capabilities**: Can be exported to various formats
- **Customization**: Easy to modify and extend

### Communication
- **Stakeholder Alignment**: Clear process visualization for stakeholders
- **Training Material**: Visual guides for Framework v2 usage
- **Process Improvement**: Foundation for workflow optimization

## 🔗 Related Resources

- [bpmn.io Official Website](https://bpmn.io)
- [bpmn-js GitHub Repository](https://github.com/bpmn-io/bpmn-js)
- [BPMN 2.0 Specification](https://www.omg.org/spec/BPMN/2.0/)
- [Framework v2 Documentation](../docs/)

## 📝 Notes

- All workflows are designed to work with Framework v2's sequential persona switching architecture
- Quality gates ensure consistency across dynamic LLM switching
- State persistence maintains context across persona switches
- Workflows can be customized for specific use cases while maintaining BPMN compliance
