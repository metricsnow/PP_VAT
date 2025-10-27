# Atomic Processes Library - Framework v2

## Overview

This directory contains **atomic, reusable BPMN processes** that can be composed into various workflows. Each atomic process is:

- ✅ **Self-contained**: Complete process with start and end
- ✅ **Reusable**: Can be called from any workflow via Call Activities
- ✅ **Context-free**: No dependencies on parent workflow context
- ✅ **Modular**: Can be composed to build complex workflows

## Atomic Process Definition

> **"An atomic process is a complete, self-contained process with a defined start and end. The entire process can be reused as a modular unit within other processes (via BPMN Call Activities), but you cannot extract and reuse individual tasks from within it. Atomic processes follow Single Responsibility Principle — one clear purpose from start to end."**

## Available Atomic Processes

### 1. AtomicPersonaActivation (`atomic-persona-activation.js`)
**Purpose**: Reusable persona activation process  
**Steps**:
1. Load Persona Rules from framework/agents/
2. Switch context to activate persona
3. Execute persona-specific logic
4. Return control to calling workflow

**Called By**: All workflows requiring persona execution

**Usage**:
```xml
<bpmn:callActivity id="Call_Analyst" 
                   calledElement="AtomicPersonaActivation" />
```

### 2. AtomicMCPContext7 (`atomic-mcp-context7.js`)
**Purpose**: MCP Context7 documentation validation  
**Steps**:
1. Resolve library ID using MCP Context7
2. Retrieve official documentation
3. Validate implementation against documentation
4. Return validation results

**Called By**: Personas requiring official documentation validation

**Usage**:
```xml
<bpmn:callActivity id="Call_MCPValidation" 
                   calledElement="AtomicMCPContext7" />
```

### 3. AtomicQualityGate (`atomic-quality-gate.js`)
**Purpose**: Quality validation gate process  
**Steps**:
1. Parallel execution of quality checks (code, security, performance)
2. Merge results
3. Decision: Pass or Fail
4. If Pass: Continue
5. If Fail: Remediate and retry

**Called By**: All workflows requiring quality validation

**Usage**:
```xml
<bpmn:callActivity id="Call_QualityGate" 
                   calledElement="AtomicQualityGate" />
```

## Building Workflows from Atomic Processes

### Standard Workflow Example
```xml
<bpmn:process id="StandardWorkflow" isExecutable="false">
  
  <!-- Start -->
  <bpmn:startEvent id="Start" />
  
  <!-- Chain of Atomic Processes -->
  <bpmn:callActivity id="Analyst" calledElement="AtomicPersonaActivation" />
  <bpmn:callActivity id="Planner" calledElement="AtomicPersonaActivation" />
  <bpmn:callActivity id="Executor" calledElement="AtomicPersonaActivation" />
  <bpmn:callActivity id="QA" calledElement="AtomicPersonaActivation" />
  
  <!-- End -->
  <bpmn:endEvent id="End" />
</bpmn:process>
```

## Benefits of Atomic Processes

1. **Modular Composition**: Build complex workflows from simple components
2. **Consistency**: Same process logic across all workflows
3. **Maintainability**: Update once, use everywhere
4. **Testability**: Test atomic processes independently
5. **Reusability**: Same process in multiple workflows

## Integration with Main Workflows

All atomic processes are defined in separate BPMN process definitions and called via Call Activities:

```xml
<bpmn:definitions>
  <!-- Atomic Process Definition -->
  <bpmn:process id="AtomicPersonaActivation" isExecutable="true">
    <!-- Process definition -->
  </bpmn:process>
  
  <!-- Main Workflow Definition -->
  <bpmn:process id="MainWorkflow" isExecutable="false">
    <bpmn:callActivity id="Call_Process" 
                       calledElement="AtomicPersonaActivation" />
  </bpmn:process>
</bpmn:definitions>
```

## File Structure

```
atomic/
├── README.md                           # This file
├── atomic-persona-activation.js       # Persona activation process
├── atomic-mcp-context7.js             # MCP validation process  
├── atomic-quality-gate.js             # Quality gate process
└── [future atomic processes...]       # Additional atomic components
```

## Usage in JavaScript

```javascript
// Import atomic process
const { renderAtomicPersonaActivation } = require('./atomic/atomic-persona-activation');

// Render in container
const viewer = renderAtomicPersonaActivation('container-id');

// Access atomic process definition
import { atomicPersonaActivation } from './atomic/atomic-persona-activation';
console.log(atomicPersonaActivation.documentation);
```

## Adding New Atomic Processes

When creating new atomic processes:

1. **Single Purpose**: One clear objective
2. **Start/End Events**: Defined start and end
3. **Self-Contained**: No dependencies on parent
4. **Reusable**: Can be called from any workflow
5. **Documented**: Clear documentation in process file

## Best Practices

- ✅ Use Call Activities to reference atomic processes
- ✅ Keep atomic processes small and focused
- ✅ Document parameters and usage
- ✅ Test atomic processes independently
- ❌ Don't embed context-specific logic in atomic processes
- ❌ Don't create dependencies on parent workflow state

---

**Framework v2 Atomic Processes Library**  
Version: 1.0 | Updated: 2024-12-19

