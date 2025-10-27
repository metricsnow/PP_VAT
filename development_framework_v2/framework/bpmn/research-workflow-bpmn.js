/**
 * Framework v2 Research Workflow BPMN Diagram
 * 3-Persona Research Workflow: Analyst → Planner → Challenger
 * 
 * Usage with bpmn.io:
 * 1. Include bpmn-js library in your HTML
 * 2. Create a container element: <div id="research-workflow-container"></div>
 * 3. Call: renderResearchWorkflow('research-workflow-container')
 */

function renderResearchWorkflow(containerId) {
    const bpmnXML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI" 
                  id="Definitions_ResearchWorkflow" 
                  targetNamespace="http://bpmn.io/schema/bpmn" 
                  exporter="bpmn-js (https://demo.bpmn.io)" 
                  exporterVersion="8.7.1">
  
  <!-- Process Definition -->
  <bpmn:process id="FrameworkV2_ResearchWorkflow" name="Framework v2 Research Workflow" isExecutable="false">
    
    <!-- Start Event -->
    <bpmn:startEvent id="StartEvent_Research" name="Research Request">
      <bpmn:outgoing>Flow_Research_1</bpmn:outgoing>
    </bpmn:startEvent>
    
    <!-- Mission Analyst Task -->
    <bpmn:task id="Task_ResearchAnalyst" name="Mission Analyst">
      <bpmn:incoming>Flow_Research_1</bpmn:incoming>
      <bpmn:outgoing>Flow_Research_2</bpmn:outgoing>
    </bpmn:task>
    
    <!-- Mission Planner Task -->
    <bpmn:task id="Task_ResearchPlanner" name="Mission Planner">
      <bpmn:incoming>Flow_Research_2</bpmn:incoming>
      <bpmn:outgoing>Flow_Research_3</bpmn:outgoing>
    </bpmn:task>
    
    <!-- Mission Challenger Task -->
    <bpmn:task id="Task_ResearchChallenger" name="Mission Challenger">
      <bpmn:incoming>Flow_Research_3</bpmn:incoming>
      <bpmn:outgoing>Flow_Research_4</bpmn:outgoing>
    </bpmn:task>
    
    <!-- End Event -->
    <bpmn:endEvent id="EndEvent_Research" name="Research Complete">
      <bpmn:incoming>Flow_Research_4</bpmn:incoming>
    </bpmn:endEvent>
    
    <!-- Sequence Flows -->
    <bpmn:sequenceFlow id="Flow_Research_1" sourceRef="StartEvent_Research" targetRef="Task_ResearchAnalyst" />
    <bpmn:sequenceFlow id="Flow_Research_2" sourceRef="Task_ResearchAnalyst" targetRef="Task_ResearchPlanner" />
    <bpmn:sequenceFlow id="Flow_Research_3" sourceRef="Task_ResearchPlanner" targetRef="Task_ResearchChallenger" />
    <bpmn:sequenceFlow id="Flow_Research_4" sourceRef="Task_ResearchChallenger" targetRef="EndEvent_Research" />
    
  </bpmn:process>
  
  <!-- Diagram Definition -->
  <bpmndi:BPMNDiagram id="BPMNDiagram_Research">
    <bpmndi:BPMNPlane id="BPMNPlane_Research" bpmnElement="FrameworkV2_ResearchWorkflow">
      
      <!-- Start Event Shape -->
      <bpmndi:BPMNShape id="StartEvent_Research_di" bpmnElement="StartEvent_Research">
        <dc:Bounds x="152" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="130" y="145" width="80" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      
      <!-- Mission Analyst Shape -->
      <bpmndi:BPMNShape id="Task_ResearchAnalyst_di" bpmnElement="Task_ResearchAnalyst">
        <dc:Bounds x="240" y="80" width="100" height="80" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="250" y="165" width="80" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      
      <!-- Mission Planner Shape -->
      <bpmndi:BPMNShape id="Task_ResearchPlanner_di" bpmnElement="Task_ResearchPlanner">
        <dc:Bounds x="380" y="80" width="100" height="80" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="390" y="165" width="80" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      
      <!-- Mission Challenger Shape -->
      <bpmndi:BPMNShape id="Task_ResearchChallenger_di" bpmnElement="Task_ResearchChallenger">
        <dc:Bounds x="520" y="80" width="100" height="80" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="530" y="165" width="80" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      
      <!-- End Event Shape -->
      <bpmndi:BPMNShape id="EndEvent_Research_di" bpmnElement="EndEvent_Research">
        <dc:Bounds x="672" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="650" y="145" width="80" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      
      <!-- Sequence Flow Shapes -->
      <bpmndi:BPMNEdge id="Flow_Research_1_di" bpmnElement="Flow_Research_1">
        <di:waypoint x="188" y="120" />
        <di:waypoint x="240" y="120" />
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_Research_2_di" bpmnElement="Flow_Research_2">
        <di:waypoint x="340" y="120" />
        <di:waypoint x="380" y="120" />
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_Research_3_di" bpmnElement="Flow_Research_3">
        <di:waypoint x="480" y="120" />
        <di:waypoint x="520" y="120" />
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_Research_4_di" bpmnElement="Flow_Research_4">
        <di:waypoint x="620" y="120" />
        <di:waypoint x="672" y="120" />
      </bpmndi:BPMNEdge>
      
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

    // Initialize bpmn-js viewer
    const viewer = new BpmnJS({ container: `#${containerId}` });
    
    // Import and render the BPMN diagram
    viewer.importXML(bpmnXML).then(() => {
        console.log('Framework v2 Research Workflow rendered successfully');
        // Zoom to fit the diagram
        viewer.get('canvas').zoom('fit-viewport');
    }).catch(err => {
        console.error('Error rendering Framework v2 Research Workflow:', err);
    });
    
    return viewer;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderResearchWorkflow };
}
