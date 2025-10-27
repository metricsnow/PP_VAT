/**
 * Framework v2 Quick Workflow BPMN Diagram
 * 3-Persona Rapid Workflow: Planner → Executor → QA
 * 
 * Usage with bpmn.io:
 * 1. Include bpmn-js library in your HTML
 * 2. Create a container element: <div id="quick-workflow-container"></div>
 * 3. Call: renderQuickWorkflow('quick-workflow-container')
 */

function renderQuickWorkflow(containerId) {
    const bpmnXML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI" 
                  id="Definitions_QuickWorkflow" 
                  targetNamespace="http://bpmn.io/schema/bpmn" 
                  exporter="bpmn-js (https://demo.bpmn.io)" 
                  exporterVersion="8.7.1">
  
  <!-- Process Definition -->
  <bpmn:process id="FrameworkV2_QuickWorkflow" name="Framework v2 Quick Workflow" isExecutable="false">
    
    <!-- Start Event -->
    <bpmn:startEvent id="StartEvent_Quick" name="Quick Task Request">
      <bpmn:outgoing>Flow_Quick_1</bpmn:outgoing>
    </bpmn:startEvent>
    
    <!-- Mission Planner Task -->
    <bpmn:task id="Task_QuickPlanner" name="Mission Planner">
      <bpmn:incoming>Flow_Quick_1</bpmn:incoming>
      <bpmn:outgoing>Flow_Quick_2</bpmn:outgoing>
    </bpmn:task>
    
    <!-- Mission Executor Task -->
    <bpmn:task id="Task_QuickExecutor" name="Mission Executor">
      <bpmn:incoming>Flow_Quick_2</bpmn:incoming>
      <bpmn:outgoing>Flow_Quick_3</bpmn:outgoing>
    </bpmn:task>
    
    <!-- Mission-QA Task -->
    <bpmn:task id="Task_QuickQA" name="Mission-QA">
      <bpmn:incoming>Flow_Quick_3</bpmn:incoming>
      <bpmn:outgoing>Flow_Quick_4</bpmn:outgoing>
    </bpmn:task>
    
    <!-- End Event -->
    <bpmn:endEvent id="EndEvent_Quick" name="Quick Task Complete">
      <bpmn:incoming>Flow_Quick_4</bpmn:incoming>
    </bpmn:endEvent>
    
    <!-- Sequence Flows -->
    <bpmn:sequenceFlow id="Flow_Quick_1" sourceRef="StartEvent_Quick" targetRef="Task_QuickPlanner" />
    <bpmn:sequenceFlow id="Flow_Quick_2" sourceRef="Task_QuickPlanner" targetRef="Task_QuickExecutor" />
    <bpmn:sequenceFlow id="Flow_Quick_3" sourceRef="Task_QuickExecutor" targetRef="Task_QuickQA" />
    <bpmn:sequenceFlow id="Flow_Quick_4" sourceRef="Task_QuickQA" targetRef="EndEvent_Quick" />
    
  </bpmn:process>
  
  <!-- Diagram Definition -->
  <bpmndi:BPMNDiagram id="BPMNDiagram_Quick">
    <bpmndi:BPMNPlane id="BPMNPlane_Quick" bpmnElement="FrameworkV2_QuickWorkflow">
      
      <!-- Start Event Shape -->
      <bpmndi:BPMNShape id="StartEvent_Quick_di" bpmnElement="StartEvent_Quick">
        <dc:Bounds x="152" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="130" y="145" width="80" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      
      <!-- Mission Planner Shape -->
      <bpmndi:BPMNShape id="Task_QuickPlanner_di" bpmnElement="Task_QuickPlanner">
        <dc:Bounds x="240" y="80" width="100" height="80" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="250" y="165" width="80" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      
      <!-- Mission Executor Shape -->
      <bpmndi:BPMNShape id="Task_QuickExecutor_di" bpmnElement="Task_QuickExecutor">
        <dc:Bounds x="380" y="80" width="100" height="80" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="390" y="165" width="80" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      
      <!-- Mission-QA Shape -->
      <bpmndi:BPMNShape id="Task_QuickQA_di" bpmnElement="Task_QuickQA">
        <dc:Bounds x="520" y="80" width="100" height="80" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="530" y="165" width="80" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      
      <!-- End Event Shape -->
      <bpmndi:BPMNShape id="EndEvent_Quick_di" bpmnElement="EndEvent_Quick">
        <dc:Bounds x="672" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="650" y="145" width="80" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      
      <!-- Sequence Flow Shapes -->
      <bpmndi:BPMNEdge id="Flow_Quick_1_di" bpmnElement="Flow_Quick_1">
        <di:waypoint x="188" y="120" />
        <di:waypoint x="240" y="120" />
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_Quick_2_di" bpmnElement="Flow_Quick_2">
        <di:waypoint x="340" y="120" />
        <di:waypoint x="380" y="120" />
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_Quick_3_di" bpmnElement="Flow_Quick_3">
        <di:waypoint x="480" y="120" />
        <di:waypoint x="520" y="120" />
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_Quick_4_di" bpmnElement="Flow_Quick_4">
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
        console.log('Framework v2 Quick Workflow rendered successfully');
        // Zoom to fit the diagram
        viewer.get('canvas').zoom('fit-viewport');
    }).catch(err => {
        console.error('Error rendering Framework v2 Quick Workflow:', err);
    });
    
    return viewer;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderQuickWorkflow };
}
