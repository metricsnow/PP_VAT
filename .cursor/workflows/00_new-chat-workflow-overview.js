/**
 * New Chat Workflow Overview - Atomic Processes Connection
 * 
 * This file shows how atomic processes are connected in the New Chat Workflow
 * Processing Order: 
 * - Analysis → Gateways (Enhancement/Bug) → Atomic Persona Activation → Atomic Task/Bug Creation
 * 
 * Complexity: Multiple atomic processes with branching logic
 * 
 * Usage with bpmn.io:
 * 1. Include bpmn-js library in your HTML
 * 2. Create a container element: <div id="new-chat-overview-container"></div>
 * 3. Call: renderNewChatWorkflowOverview('new-chat-overview-container')
 */

function renderNewChatWorkflowOverview(containerId) {
    const bpmnXML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI" 
                  id="Definitions_NewChatOverview">
  
  <bpmn:process id="NewChatWorkflowOverview" name="New Chat Workflow Overview - Atomic Process Connections" isExecutable="false">
    
    <!-- Start Event -->
    <bpmn:startEvent id="StartEvent_NewChat" name="Workflow Start">
      <bpmn:outgoing>Flow_NewChat_1</bpmn:outgoing>
    </bpmn:startEvent>
    
    <!-- ATOMIC PROCESS 1: Persona Activation (Mission Analyst) -->
    <bpmn:callActivity id="CallActivity_Analyst" name="ATOMIC 1: Persona Activation (Analyst)">
      <bpmn:incoming>Flow_NewChat_1</bpmn:incoming>
      <bpmn:outgoing>Flow_NewChat_2</bpmn:outgoing>
    </bpmn:callActivity>
    
    <!-- Gateway: Content Type Analysis -->
    <bpmn:exclusiveGateway id="Gateway_ContentType" name="Content Type">
      <bpmn:incoming>Flow_NewChat_2</bpmn:incoming>
      <bpmn:outgoing>Flow_NewChat_3</bpmn:outgoing>
      <bpmn:outgoing>Flow_NewChat_4</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    
    <!-- Enhancement Path: ATOMIC PROCESS 2 -->
    <bpmn:callActivity id="CallActivity_Planner" name="ATOMIC 2: Persona Activation (Planner)">
      <bpmn:incoming>Flow_NewChat_3</bpmn:incoming>
      <bpmn:outgoing>Flow_NewChat_5</bpmn:outgoing>
    </bpmn:callActivity>
    
    <!-- ATOMIC PROCESS 3: Task Creation -->
    <bpmn:callActivity id="CallActivity_TaskCreation" name="ATOMIC 3: Task Creation">
      <bpmn:incoming>Flow_NewChat_5</bpmn:incoming>
      <bpmn:outgoing>Flow_NewChat_6</bpmn:outgoing>
    </bpmn:callActivity>
    
    <!-- Bug Report Path: ATOMIC PROCESS 2 -->
    <bpmn:callActivity id="CallActivity_QA" name="ATOMIC 2: Persona Activation (QA)">
      <bpmn:incoming>Flow_NewChat_4</bpmn:incoming>
      <bpmn:outgoing>Flow_NewChat_7</bpmn:outgoing>
    </bpmn:callActivity>
    
    <!-- ATOMIC PROCESS 3: Bug Creation -->
    <bpmn:callActivity id="CallActivity_BugCreation" name="ATOMIC 3: Bug Creation">
      <bpmn:incoming>Flow_NewChat_7</bpmn:incoming>
      <bpmn:outgoing>Flow_NewChat_8</bpmn:outgoing>
    </bpmn:callActivity>
    
    <!-- Merge Gateway -->
    <bpmn:inclusiveGateway id="Gateway_Merge" name="Merge">
      <bpmn:incoming>Flow_NewChat_6</bpmn:incoming>
      <bpmn:incoming>Flow_NewChat_8</bpmn:incoming>
      <bpmn:outgoing>Flow_NewChat_9</bpmn:outgoing>
    </bpmn:inclusiveGateway>
    
    <!-- End Event -->
    <bpmn:endEvent id="EndEvent_NewChat" name="Workflow Complete">
      <bpmn:incoming>Flow_NewChat_9</bpmn:incoming>
    </bpmn:endEvent>
    
    <!-- Sequence Flows -->
    <bpmn:sequenceFlow id="Flow_NewChat_1" sourceRef="StartEvent_NewChat" targetRef="CallActivity_Analyst" />
    <bpmn:sequenceFlow id="Flow_NewChat_2" sourceRef="CallActivity_Analyst" targetRef="Gateway_ContentType" />
    <bpmn:sequenceFlow id="Flow_NewChat_3" sourceRef="Gateway_ContentType" targetRef="CallActivity_Planner" name="Enhancement" />
    <bpmn:sequenceFlow id="Flow_NewChat_4" sourceRef="Gateway_ContentType" targetRef="CallActivity_QA" name="Bug" />
    <bpmn:sequenceFlow id="Flow_NewChat_5" sourceRef="CallActivity_Planner" targetRef="CallActivity_TaskCreation" />
    <bpmn:sequenceFlow id="Flow_NewChat_6" sourceRef="CallActivity_TaskCreation" targetRef="Gateway_Merge" />
    <bpmn:sequenceFlow id="Flow_NewChat_7" sourceRef="CallActivity_QA" targetRef="CallActivity_BugCreation" />
    <bpmn:sequenceFlow id="Flow_NewChat_8" sourceRef="CallActivity_BugCreation" targetRef="Gateway_Merge" />
    <bpmn:sequenceFlow id="Flow_NewChat_9" sourceRef="Gateway_Merge" targetRef="EndEvent_NewChat" />
    
  </bpmn:process>
  
  <bpmndi:BPMNDiagram id="BPMNDiagram_NewChat">
    <bpmndi:BPMNPlane id="BPMNPlane_NewChat" bpmnElement="NewChatWorkflowOverview">
      <!-- Diagram definitions with appropriate shapes and edges -->
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

    const viewer = new BpmnJS({ container: `#${containerId}` });
    
    viewer.importXML(bpmnXML).then(() => {
        console.log('New Chat Workflow Overview rendered successfully');
        viewer.get('canvas').zoom('fit-viewport');
    }).catch(err => {
        console.error('Error rendering New Chat Workflow Overview:', err);
    });
    
    return viewer;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderNewChatWorkflowOverview };
}

