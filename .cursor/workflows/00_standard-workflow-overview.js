/**
 * Standard Workflow Overview - Atomic Processes Connection
 * 
 * This file shows how atomic processes are connected in the Standard Workflow
 * Processing Order: Persona Activation (Analyst) → Persona Activation (Planner) → 
 * Persona Activation (Executor) → Quality Gate → Persona Activation (QA) → Persona Activation (Challenger)
 * 
 * Usage with bpmn.io:
 * 1. Include bpmn-js library in your HTML
 * 2. Create a container element: <div id="standard-overview-container"></div>
 * 3. Call: renderStandardWorkflowOverview('standard-overview-container')
 */

function renderStandardWorkflowOverview(containerId) {
    const bpmnXML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI" 
                  id="Definitions_StandardOverview" 
                  targetNamespace="http://bpmn.io/schema/bpmn">
  
  <!-- Standard Workflow Overview Process -->
  <bpmn:process id="StandardWorkflowOverview" name="Standard Workflow Overview - Atomic Process Connections" isExecutable="false">
    
    <!-- Start Event -->
    <bpmn:startEvent id="StartEvent_Standard" name="Workflow Start">
      <bpmn:outgoing>Flow_Standard_1</bpmn:outgoing>
    </bpmn:startEvent>
    
    <!-- ATOMIC PROCESS 1: Persona Activation (Mission Analyst) -->
    <bpmn:callActivity id="CallActivity_Analyst" name="ATOMIC 1: Persona Activation (Analyst)">
      <bpmn:incoming>Flow_Standard_1</bpmn:incoming>
      <bpmn:outgoing>Flow_Standard_2</bpmn:outgoing>
    </bpmn:callActivity>
    
    <!-- ATOMIC PROCESS 2: Persona Activation (Mission Planner) -->
    <bpmn:callActivity id="CallActivity_Planner" name="ATOMIC 2: Persona Activation (Planner)">
      <bpmn:incoming>Flow_Standard_2</bpmn:incoming>
      <bpmn:outgoing>Flow_Standard_3</bpmn:outgoing>
    </bpmn:callActivity>
    
    <!-- ATOMIC PROCESS 3: Persona Activation (Mission Executor) -->
    <bpmn:callActivity id="CallActivity_Executor" name="ATOMIC 3: Persona Activation (Executor)">
      <bpmn:incoming>Flow_Standard_3</bpmn:incoming>
      <bpmn:outgoing>Flow_Standard_4</bpmn:outgoing>
    </bpmn:callActivity>
    
    <!-- ATOMIC PROCESS 4: Quality Gate -->
    <bpmn:callActivity id="CallActivity_QualityGate" name="ATOMIC 4: Quality Gate">
      <bpmn:incoming>Flow_Standard_4</bpmn:incoming>
      <bpmn:outgoing>Flow_Standard_5</bpmn:outgoing>
    </bpmn:callActivity>
    
    <!-- ATOMIC PROCESS 5: Persona Activation (Mission-QA) -->
    <bpmn:callActivity id="CallActivity_QA" name="ATOMIC 5: Persona Activation (QA)">
      <bpmn:incoming>Flow_Standard_5</bpmn:incoming>
      <bpmn:outgoing>Flow_Standard_6</bpmn:outgoing>
    </bpmn:callActivity>
    
    <!-- ATOMIC PROCESS 6: Persona Activation (Mission Challenger) -->
    <bpmn:callActivity id="CallActivity_Challenger" name="ATOMIC 6: Persona Activation (Challenger)">
      <bpmn:incoming>Flow_Standard_6</bpmn:incoming>
      <bpmn:outgoing>Flow_Standard_7</bpmn:outgoing>
    </bpmn:callActivity>
    
    <!-- End Event -->
    <bpmn:endEvent id="EndEvent_Standard" name="Workflow Complete">
      <bpmn:incoming>Flow_Standard_7</bpmn:incoming>
    </bpmn:endEvent>
    
    <!-- Sequence Flows -->
    <bpmn:sequenceFlow id="Flow_Standard_1" sourceRef="StartEvent_Standard" targetRef="CallActivity_Analyst" />
    <bpmn:sequenceFlow id="Flow_Standard_2" sourceRef="CallActivity_Analyst" targetRef="CallActivity_Planner" />
    <bpmn:sequenceFlow id="Flow_Standard_3" sourceRef="CallActivity_Planner" targetRef="CallActivity_Executor" />
    <bpmn:sequenceFlow id="Flow_Standard_4" sourceRef="CallActivity_Executor" targetRef="CallActivity_QualityGate" />
    <bpmn:sequenceFlow id="Flow_Standard_5" sourceRef="CallActivity_QualityGate" targetRef="CallActivity_QA" />
    <bpmn:sequenceFlow id="Flow_Standard_6" sourceRef="CallActivity_QA" targetRef="CallActivity_Challenger" />
    <bpmn:sequenceFlow id="Flow_Standard_7" sourceRef="CallActivity_Challenger" targetRef="EndEvent_Standard" />
    
  </bpmn:process>
  
  <!-- Diagram Definition -->
  <bpmndi:BPMNDiagram id="BPMNDiagram_Standard">
    <bpmndi:BPMNPlane id="BPMNPlane_Standard" bpmnElement="StandardWorkflowOverview">
      
      <!-- Start Event -->
      <bpmndi:BPMNShape id="StartEvent_Standard_di" bpmnElement="StartEvent_Standard">
        <dc:Bounds x="152" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>
      
      <!-- Atomic Process 1 -->
      <bpmndi:BPMNShape id="CallActivity_Analyst_di" bpmnElement="CallActivity_Analyst">
        <dc:Bounds x="240" y="70" width="140" height="100" />
      </bpmndi:BPMNShape>
      
      <!-- Atomic Process 2 -->
      <bpmndi:BPMNShape id="CallActivity_Planner_di" bpmnElement="CallActivity_Planner">
        <dc:Bounds x="420" y="70" width="140" height="100" />
      </bpmndi:BPMNShape>
      
      <!-- Atomic Process 3 -->
      <bpmndi:BPMNShape id="CallActivity_Executor_di" bpmnElement="CallActivity_Executor">
        <dc:Bounds x="600" y="70" width="140" height="100" />
      </bpmndi:BPMNShape>
      
      <!-- Atomic Process 4 -->
      <bpmndi:BPMNShape id="CallActivity_QualityGate_di" bpmnElement="CallActivity_QualityGate">
        <dc:Bounds x="780" y="70" width="140" height="100" />
      </bpmndi:BPMNShape>
      
      <!-- Atomic Process 5 -->
      <bpmndi:BPMNShape id="CallActivity_QA_di" bpmnElement="CallActivity_QA">
        <dc:Bounds x="960" y="70" width="140" height="100" />
      </bpmndi:BPMNShape>
      
      <!-- Atomic Process 6 -->
      <bpmndi:BPMNShape id="CallActivity_Challenger_di" bpmnElement="CallActivity_Challenger">
        <dc:Bounds x="1140" y="70" width="140" height="100" />
      </bpmndi:BPMNShape>
      
      <!-- End Event -->
      <bpmndi:BPMNShape id="EndEvent_Standard_di" bpmnElement="EndEvent_Standard">
        <dc:Bounds x="1332" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>
      
      <!-- Sequence Flow Edges -->
      <bpmndi:BPMNEdge id="Flow_Standard_1_di" bpmnElement="Flow_Standard_1">
        <di:waypoint x="188" y="120" />
        <di:waypoint x="240" y="120" />
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_Standard_2_di" bpmnElement="Flow_Standard_2">
        <di:waypoint x="380" y="120" />
        <di:waypoint x="420" y="120" />
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_Standard_3_di" bpmnElement="Flow_Standard_3">
        <di:waypoint x="560" y="120" />
        <di:waypoint x="600" y="120" />
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_Standard_4_di" bpmnElement="Flow_Standard_4">
        <di:waypoint x="740" y="120" />
        <di:waypoint x="780" y="120" />
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_Standard_5_di" bpmnElement="Flow_Standard_5">
        <di:waypoint x="920" y="120" />
        <di:waypoint x="960" y="120" />
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_Standard_6_di" bpmnElement="Flow_Standard_6">
        <di:waypoint x="1100" y="120" />
        <di:waypoint x="1140" y="120" />
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_Standard_7_di" bpmnElement="Flow_Standard_7">
        <di:waypoint x="1280" y="120" />
        <di:waypoint x="1332" y="120" />
      </bpmndi:BPMNEdge>
      
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

    const viewer = new BpmnJS({ container: `#${containerId}` });
    
    viewer.importXML(bpmnXML).then(() => {
        console.log('Standard Workflow Overview rendered successfully');
        viewer.get('canvas').zoom('fit-viewport');
    }).catch(err => {
        console.error('Error rendering Standard Workflow Overview:', err);
    });
    
    return viewer;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderStandardWorkflowOverview };
}

