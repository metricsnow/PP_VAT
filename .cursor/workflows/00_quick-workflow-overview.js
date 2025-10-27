/**
 * Quick Workflow Overview - Atomic Processes Connection
 * 
 * This file shows how atomic processes are connected in the Quick Workflow
 * Processing Order: Persona Activation (Planner) → Persona Activation (Executor) → Persona Activation (QA)
 * 
 * Complexity: 3 atomic processes in sequence
 * 
 * Usage with bpmn.io:
 * 1. Include bpmn-js library in your HTML
 * 2. Create a container element: <div id="quick-overview-container"></div>
 * 3. Call: renderQuickWorkflowOverview('quick-overview-container')
 */

function renderQuickWorkflowOverview(containerId) {
    const bpmnXML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI" 
                  id="Definitions_QuickOverview">
  
  <bpmn:process id="QuickWorkflowOverview" name="Quick Workflow Overview - Atomic Process Connections" isExecutable="false">
    
    <bpmn:startEvent id="StartEvent_Quick" name="Workflow Start">
      <bpmn:outgoing>Flow_Quick_1</bpmn:outgoing>
    </bpmn:startEvent>
    
    <!-- ATOMIC PROCESS 1: Persona Activation (Mission Planner) -->
    <bpmn:callActivity id="CallActivity_Planner" name="ATOMIC 1: Persona Activation (Planner)">
      <bpmn:incoming>Flow_Quick_1</bpmn:incoming>
      <bpmn:outgoing>Flow_Quick_2</bpmn:outgoing>
    </bpmn:callActivity>
    
    <!-- ATOMIC PROCESS 2: Persona Activation (Mission Executor) -->
    <bpmn:callActivity id="CallActivity_Executor" name="ATOMIC 2: Persona Activation (Executor)">
      <bpmn:incoming>Flow_Quick_2</bpmn:incoming>
      <bpmn:outgoing>Flow_Quick_3</bpmn:outgoing>
    </bpmn:callActivity>
    
    <!-- ATOMIC PROCESS 3: Persona Activation (Mission-QA) -->
    <bpmn:callActivity id="CallActivity_QA" name="ATOMIC 3: Persona Activation (QA)">
      <bpmn:incoming>Flow_Quick_3</bpmn:incoming>
      <bpmn:outgoing>Flow_Quick_4</bpmn:outgoing>
    </bpmn:callActivity>
    
    <bpmn:endEvent id="EndEvent_Quick" name="Workflow Complete">
      <bpmn:incoming>Flow_Quick_4</bpmn:incoming>
    </bpmn:endEvent>
    
    <!-- Sequence Flows -->
    <bpmn:sequenceFlow id="Flow_Quick_1" sourceRef="StartEvent_Quick" targetRef="CallActivity_Planner" />
    <bpmn:sequenceFlow id="Flow_Quick_2" sourceRef="CallActivity_Planner" targetRef="CallActivity_Executor" />
    <bpmn:sequenceFlow id="Flow_Quick_3" sourceRef="CallActivity_Executor" targetRef="CallActivity_QA" />
    <bpmn:sequenceFlow id="Flow_Quick_4" sourceRef="CallActivity_QA" targetRef="EndEvent_Quick" />
    
  </bpmn:process>
  
  <bpmndi:BPMNDiagram id="BPMNDiagram_Quick">
    <bpmndi:BPMNPlane id="BPMNPlane_Quick" bpmnElement="QuickWorkflowOverview">
      <!-- Diagram definitions -->
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

    const viewer = new BpmnJS({ container: `#${containerId}` });
    
    viewer.importXML(bpmnXML).then(() => {
        console.log('Quick Workflow Overview rendered successfully');
        viewer.get('canvas').zoom('fit-viewport');
    }).catch(err => console.error('Error:', err));
    
    return viewer;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderQuickWorkflowOverview };
}

