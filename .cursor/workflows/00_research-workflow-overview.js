/**
 * Research Workflow Overview - Atomic Processes Connection
 * 
 * This file shows how atomic processes are connected in the Research Workflow
 * Processing Order: Persona Activation (Analyst) → MCP Context7 → Persona Activation (Planner) → Persona Activation (Challenger)
 * 
 * Complexity: 4 atomic processes including MCP Context7 validation
 * 
 * Usage with bpmn.io:
 * 1. Include bpmn-js library in your HTML
 * 2. Create a container element: <div id="research-overview-container"></div>
 * 3. Call: renderResearchWorkflowOverview('research-overview-container')
 */

function renderResearchWorkflowOverview(containerId) {
    const bpmnXML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI" 
                  id="Definitions_ResearchOverview">
  
  <bpmn:process id="ResearchWorkflowOverview" name="Research Workflow Overview - Atomic Process Connections" isExecutable="false">
    
    <bpmn:startEvent id="StartEvent_Research" name="Workflow Start">
      <bpmn:outgoing>Flow_Research_1</bpmn:outgoing>
    </bpmn:startEvent>
    
    <!-- ATOMIC PROCESS 1: Persona Activation (Mission Analyst) -->
    <bpmn:callActivity id="CallActivity_Analyst" name="ATOMIC 1: Persona Activation (Analyst)">
      <bpmn:incoming>Flow_Research_1</bpmn:incoming>
      <bpmn:outgoing>Flow_Research_2</bpmn:outgoing>
    </bpmn:callActivity>
    
    <!-- ATOMIC PROCESS 2: MCP Context7 Validation -->
    <bpmn:callActivity id="CallActivity_MCP" name="ATOMIC 2: MCP Context7 Validation">
      <bpmn:incoming>Flow_Research_2</bpmn:incoming>
      <bpmn:outgoing>Flow_Research_3</bpmn:outgoing>
    </bpmn:callActivity>
    
    <!-- ATOMIC PROCESS 3: Persona Activation (Mission Planner) -->
    <bpmn:callActivity id="CallActivity_Planner" name="ATOMIC 3: Persona Activation (Planner)">
      <bpmn:incoming>Flow_Research_3</bpmn:incoming>
      <bpmn:outgoing>Flow_Research_4</bpmn:outgoing>
    </bpmn:callActivity>
    
    <!-- ATOMIC PROCESS 4: Persona Activation (Mission Challenger) -->
    <bpmn:callActivity id="CallActivity_Challenger" name="ATOMIC 4: Persona Activation (Challenger)">
      <bpmn:incoming>Flow_Research_4</bpmn:incoming>
      <bpmn:outgoing>Flow_Research_5</bpmn:outgoing>
    </bpmn:callActivity>
    
    <bpmn:endEvent id="EndEvent_Research" name="Workflow Complete">
      <bpmn:incoming>Flow_Research_5</bpmn:incoming>
    </bpmn:endEvent>
    
    <!-- Sequence Flows -->
    <bpmn:sequenceFlow id="Flow_Research_1" sourceRef="StartEvent_Research" targetRef="CallActivity_Analyst" />
    <bpmn:sequenceFlow id="Flow_Research_2" sourceRef="CallActivity_Analyst" targetRef="CallActivity_MCP" />
    <bpmn:sequenceFlow id="Flow_Research_3" sourceRef="CallActivity_MCP" targetRef="CallActivity_Planner" />
    <bpmn:sequenceFlow id="Flow_Research_4" sourceRef="CallActivity_Planner" targetRef="CallActivity_Challenger" />
    <bpmn:sequenceFlow id="Flow_Research_5" sourceRef="CallActivity_Challenger" targetRef="EndEvent_Research" />
    
  </bpmn:process>
  
  <bpmndi:BPMNDiagram id="BPMNDiagram_Research">
    <bpmndi:BPMNPlane id="BPMNPlane_Research" bpmnElement="ResearchWorkflowOverview">
      <!-- Diagram definitions -->
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

    const viewer = new BpmnJS({ container: `#${containerId}` });
    
    viewer.importXML(bpmnXML).then(() => {
        console.log('Research Workflow Overview rendered successfully');
        viewer.get('canvas').zoom('fit-viewport');
    }).catch(err => console.error('Error:', err));
    
    return viewer;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderResearchWorkflowOverview };
}

