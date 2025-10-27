/**
 * Framework v2 Atomic Processes Overview
 * High-level view showing how atomic processes connect
 * 
 * Usage with bpmn.io:
 * 1. Include bpmn-js library in your HTML
 * 2. Create a container element: <div id="atomic-overview-container"></div>
 * 3. Call: renderAtomicProcessesOverview('atomic-overview-container')
 */

function renderAtomicProcessesOverview(containerId) {
    const bpmnXML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI" 
                  id="Definitions_AtomicOverview" 
                  targetNamespace="http://bpmn.io/schema/bpmn" 
                  exporter="bpmn-js (https://demo.bpmn.io)" 
                  exporterVersion="8.7.1">
  
  <!-- Process Definition -->
  <bpmn:process id="FrameworkV2_AtomicOverview" name="Framework v2 Atomic Processes Overview" isExecutable="false">
    
    <!-- Start Event -->
    <bpmn:startEvent id="StartEvent_Overview" name="Workflow Start">
      <bpmn:outgoing>Flow_Overview_1</bpmn:outgoing>
    </bpmn:startEvent>
    
    <!-- Persona Activation (Atomic) -->
    <bpmn:callActivity id="CallActivity_PersonaActivation" name="ATOMIC: Persona Activation">
      <bpmn:incoming>Flow_Overview_1</bpmn:incoming>
      <bpmn:outgoing>Flow_Overview_2</bpmn:outgoing>
    </bpmn:callActivity>
    
    <!-- MCP Context7 Validation (Atomic) -->
    <bpmn:callActivity id="CallActivity_MCPContext7" name="ATOMIC: MCP Context7 Validation">
      <bpmn:incoming>Flow_Overview_2</bpmn:incoming>
      <bpmn:outgoing>Flow_Overview_3</bpmn:outgoing>
    </bpmn:callActivity>
    
    <!-- Quality Gate (Atomic) -->
    <bpmn:callActivity id="CallActivity_QualityGate" name="ATOMIC: Quality Gate">
      <bpmn:incoming>Flow_Overview_3</bpmn:incoming>
      <bpmn:outgoing>Flow_Overview_4</bpmn:outgoing>
    </bpmn:callActivity>
    
    <!-- State Persistence (Atomic) -->
    <bpmn:callActivity id="CallActivity_StatePersistence" name="ATOMIC: State Persistence">
      <bpmn:incoming>Flow_Overview_4</bpmn:incoming>
      <bpmn:outgoing>Flow_Overview_5</bpmn:outgoing>
    </bpmn:callActivity>
    
    <!-- End Event -->
    <bpmn:endEvent id="EndEvent_Overview" name="Workflow Complete">
      <bpmn:incoming>Flow_Overview_5</bpmn:incoming>
    </bpmn:endEvent>
    
    <!-- Sequence Flows -->
    <bpmn:sequenceFlow id="Flow_Overview_1" sourceRef="StartEvent_Overview" targetRef="CallActivity_PersonaActivation" />
    <bpmn:sequenceFlow id="Flow_Overview_2" sourceRef="CallActivity_PersonaActivation" targetRef="CallActivity_MCPContext7" />
    <bpmn:sequenceFlow id="Flow_Overview_3" sourceRef="CallActivity_MCPContext7" targetRef="CallActivity_QualityGate" />
    <bpmn:sequenceFlow id="Flow_Overview_4" sourceRef="CallActivity_QualityGate" targetRef="CallActivity_StatePersistence" />
    <bpmn:sequenceFlow id="Flow_Overview_5" sourceRef="CallActivity_StatePersistence" targetRef="EndEvent_Overview" />
    
  </bpmn:process>
  
  <!-- Diagram Definition -->
  <bpmndi:BPMNDiagram id="BPMNDiagram_AtomicOverview">
    <bpmndi:BPMNPlane id="BPMNPlane_AtomicOverview" bpmnElement="FrameworkV2_AtomicOverview">
      
      <!-- Start Event -->
      <bpmndi:BPMNShape id="StartEvent_Overview_di" bpmnElement="StartEvent_Overview">
        <dc:Bounds x="152" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="140" y="145" width="80" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      
      <!-- Persona Activation -->
      <bpmndi:BPMNShape id="CallActivity_PersonaActivation_di" bpmnElement="CallActivity_PersonaActivation">
        <dc:Bounds x="240" y="70" width="120" height="100" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="240" y="175" width="120" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      
      <!-- MCP Context7 -->
      <bpmndi:BPMNShape id="CallActivity_MCPContext7_di" bpmnElement="CallActivity_MCPContext7">
        <dc:Bounds x="400" y="70" width="120" height="100" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="400" y="175" width="120" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      
      <!-- Quality Gate -->
      <bpmndi:BPMNShape id="CallActivity_QualityGate_di" bpmnElement="CallActivity_QualityGate">
        <dc:Bounds x="560" y="70" width="120" height="100" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="560" y="175" width="120" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      
      <!-- State Persistence -->
      <bpmndi:BPMNShape id="CallActivity_StatePersistence_di" bpmnElement="CallActivity_StatePersistence">
        <dc:Bounds x="720" y="70" width="120" height="100" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="720" y="175" width="120" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      
      <!-- End Event -->
      <bpmndi:BPMNShape id="EndEvent_Overview_di" bpmnElement="EndEvent_Overview">
        <dc:Bounds x="892" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="880" y="145" width="80" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      
      <!-- Sequence Flow Edges -->
      <bpmndi:BPMNEdge id="Flow_Overview_1_di" bpmnElement="Flow_Overview_1">
        <di:waypoint x="188" y="120" />
        <di:waypoint x="240" y="120" />
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_Overview_2_di" bpmnElement="Flow_Overview_2">
        <di:waypoint x="360" y="120" />
        <di:waypoint x="400" y="120" />
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_Overview_3_di" bpmnElement="Flow_Overview_3">
        <di:waypoint x="520" y="120" />
        <di:waypoint x="560" y="120" />
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_Overview_4_di" bpmnElement="Flow_Overview_4">
        <di:waypoint x="680" y="120" />
        <di:waypoint x="720" y="120" />
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_Overview_5_di" bpmnElement="Flow_Overview_5">
        <di:waypoint x="840" y="120" />
        <di:waypoint x="892" y="120" />
      </bpmndi:BPMNEdge>
      
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

    const viewer = new BpmnJS({ container: `#${containerId}` });
    
    viewer.importXML(bpmnXML).then(() => {
        console.log('Framework v2 Atomic Processes Overview rendered successfully');
        viewer.get('canvas').zoom('fit-viewport');
    }).catch(err => {
        console.error('Error rendering Atomic Processes Overview:', err);
    });
    
    return viewer;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderAtomicProcessesOverview };
}

