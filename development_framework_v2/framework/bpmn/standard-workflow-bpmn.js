/**
 * Framework v2 Standard Workflow BPMN Diagram
 * 5-Persona Sequential Workflow: Analyst → Planner → Executor → QA → Challenger
 * 
 * Usage with bpmn.io:
 * 1. Include bpmn-js library in your HTML
 * 2. Create a container element: <div id="standard-workflow-container"></div>
 * 3. Call: renderStandardWorkflow('standard-workflow-container')
 */

function renderStandardWorkflow(containerId) {
    const bpmnXML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI" 
                  id="Definitions_1" 
                  targetNamespace="http://bpmn.io/schema/bpmn" 
                  exporter="bpmn-js (https://demo.bpmn.io)" 
                  exporterVersion="8.7.1">
  
  <!-- Process Definition -->
  <bpmn:process id="FrameworkV2_StandardWorkflow" name="Framework v2 Standard Workflow" isExecutable="false">
    
    <!-- Start Event -->
    <bpmn:startEvent id="StartEvent_1" name="User Request">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    
    <!-- Mission Analyst Task -->
    <bpmn:task id="Task_MissionAnalyst" name="Mission Analyst">
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:task>
    
    <!-- Mission Planner Task -->
    <bpmn:task id="Task_MissionPlanner" name="Mission Planner">
      <bpmn:incoming>Flow_2</bpmn:incoming>
      <bpmn:outgoing>Flow_3</bpmn:outgoing>
    </bpmn:task>
    
    <!-- Mission Executor Task -->
    <bpmn:task id="Task_MissionExecutor" name="Mission Executor">
      <bpmn:incoming>Flow_3</bpmn:incoming>
      <bpmn:outgoing>Flow_4</bpmn:outgoing>
    </bpmn:task>
    
    <!-- Mission-QA Task -->
    <bpmn:task id="Task_MissionQA" name="Mission-QA">
      <bpmn:incoming>Flow_4</bpmn:incoming>
      <bpmn:outgoing>Flow_5</bpmn:outgoing>
    </bpmn:task>
    
    <!-- Mission Challenger Task -->
    <bpmn:task id="Task_MissionChallenger" name="Mission Challenger">
      <bpmn:incoming>Flow_5</bpmn:incoming>
      <bpmn:outgoing>Flow_6</bpmn:outgoing>
    </bpmn:task>
    
    <!-- End Event -->
    <bpmn:endEvent id="EndEvent_1" name="Task Complete">
      <bpmn:incoming>Flow_6</bpmn:incoming>
    </bpmn:endEvent>
    
    <!-- Sequence Flows -->
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Task_MissionAnalyst" />
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Task_MissionAnalyst" targetRef="Task_MissionPlanner" />
    <bpmn:sequenceFlow id="Flow_3" sourceRef="Task_MissionPlanner" targetRef="Task_MissionExecutor" />
    <bpmn:sequenceFlow id="Flow_4" sourceRef="Task_MissionExecutor" targetRef="Task_MissionQA" />
    <bpmn:sequenceFlow id="Flow_5" sourceRef="Task_MissionQA" targetRef="Task_MissionChallenger" />
    <bpmn:sequenceFlow id="Flow_6" sourceRef="Task_MissionChallenger" targetRef="EndEvent_1" />
    
  </bpmn:process>
  
  <!-- Diagram Definition -->
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="FrameworkV2_StandardWorkflow">
      
      <!-- Start Event Shape -->
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="152" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="140" y="145" width="60" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      
      <!-- Mission Analyst Shape -->
      <bpmndi:BPMNShape id="Task_MissionAnalyst_di" bpmnElement="Task_MissionAnalyst">
        <dc:Bounds x="240" y="80" width="100" height="80" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="250" y="165" width="80" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      
      <!-- Mission Planner Shape -->
      <bpmndi:BPMNShape id="Task_MissionPlanner_di" bpmnElement="Task_MissionPlanner">
        <dc:Bounds x="380" y="80" width="100" height="80" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="390" y="165" width="80" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      
      <!-- Mission Executor Shape -->
      <bpmndi:BPMNShape id="Task_MissionExecutor_di" bpmnElement="Task_MissionExecutor">
        <dc:Bounds x="520" y="80" width="100" height="80" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="530" y="165" width="80" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      
      <!-- Mission-QA Shape -->
      <bpmndi:BPMNShape id="Task_MissionQA_di" bpmnElement="Task_MissionQA">
        <dc:Bounds x="660" y="80" width="100" height="80" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="670" y="165" width="80" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      
      <!-- Mission Challenger Shape -->
      <bpmndi:BPMNShape id="Task_MissionChallenger_di" bpmnElement="Task_MissionChallenger">
        <dc:Bounds x="800" y="80" width="100" height="80" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="810" y="165" width="80" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      
      <!-- End Event Shape -->
      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="952" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="940" y="145" width="60" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      
      <!-- Sequence Flow Shapes -->
      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
        <di:waypoint x="188" y="120" />
        <di:waypoint x="240" y="120" />
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2">
        <di:waypoint x="340" y="120" />
        <di:waypoint x="380" y="120" />
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_3_di" bpmnElement="Flow_3">
        <di:waypoint x="480" y="120" />
        <di:waypoint x="520" y="120" />
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_4_di" bpmnElement="Flow_4">
        <di:waypoint x="620" y="120" />
        <di:waypoint x="660" y="120" />
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_5_di" bpmnElement="Flow_5">
        <di:waypoint x="760" y="120" />
        <di:waypoint x="800" y="120" />
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_6_di" bpmnElement="Flow_6">
        <di:waypoint x="900" y="120" />
        <di:waypoint x="952" y="120" />
      </bpmndi:BPMNEdge>
      
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

    // Initialize bpmn-js viewer
    const viewer = new BpmnJS({ container: `#${containerId}` });
    
    // Import and render the BPMN diagram
    viewer.importXML(bpmnXML).then(() => {
        console.log('Framework v2 Standard Workflow rendered successfully');
        // Zoom to fit the diagram
        viewer.get('canvas').zoom('fit-viewport');
    }).catch(err => {
        console.error('Error rendering Framework v2 Standard Workflow:', err);
    });
    
    return viewer;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderStandardWorkflow };
}
