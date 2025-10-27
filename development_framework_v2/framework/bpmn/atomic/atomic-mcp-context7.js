/**
 * Atomic Process: MCP Context7 Validation
 * 
 * Definition: Reusable process for MCP Context7 documentation validation
 * Called By: Personas requiring official documentation validation
 * 
 * Usage:
 * 1. Include this in BPMN definitions
 * 2. Reference via callActivity with calledElement="AtomicMCPContext7"
 */

const atomicMCPContext7 = {
    processId: "AtomicMCPContext7",
    processName: "Atomic: MCP Context7 Validation",
    
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI" 
                  xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
                  id="Definitions_MCPContext7">
  
  <bpmn:process id="AtomicMCPContext7" name="Atomic: MCP Context7 Validation" isExecutable="true">
    
    <!-- Start Event -->
    <bpmn:startEvent id="StartEvent_MCP" name="Start MCP Validation">
      <bpmn:outgoing>Flow_MCP_1</bpmn:outgoing>
    </bpmn:startEvent>
    
    <!-- Resolve Library ID -->
    <bpmn:serviceTask id="Task_ResolveLibraryID" name="Resolve Library ID" 
                      camunda:delegateExpression="\${resolveLibraryIDDelegate}">
      <bpmn:incoming>Flow_MCP_1</bpmn:incoming>
      <bpmn:outgoing>Flow_MCP_2</bpmn:outgoing>
    </bpmn:serviceTask>
    
    <!-- Get Library Docs -->
    <bpmn:serviceTask id="Task_GetLibraryDocs" name="Get Library Documentation" 
                      camunda:delegateExpression="\${getLibraryDocsDelegate}">
      <bpmn:incoming>Flow_MCP_2</bpmn:incoming>
      <bpmn:outgoing>Flow_MCP_3</bpmn:outgoing>
    </bpmn:serviceTask>
    
    <!-- Validate Implementation -->
    <bpmn:businessRuleTask id="Task_ValidateImplementation" name="Validate Implementation Against Docs" 
                           camunda:delegateExpression="\${validateImplementationDelegate}">
      <bpmn:incoming>Flow_MCP_3</bpmn:incoming>
      <bpmn:outgoing>Flow_MCP_4</bpmn:outgoing>
    </bpmn:businessRuleTask>
    
    <!-- End Event -->
    <bpmn:endEvent id="EndEvent_MCP" name="MCP Validation Complete">
      <bpmn:incoming>Flow_MCP_4</bpmn:incoming>
    </bpmn:endEvent>
    
    <!-- Sequence Flows -->
    <bpmn:sequenceFlow id="Flow_MCP_1" sourceRef="StartEvent_MCP" targetRef="Task_ResolveLibraryID" />
    <bpmn:sequenceFlow id="Flow_MCP_2" sourceRef="Task_ResolveLibraryID" targetRef="Task_GetLibraryDocs" />
    <bpmn:sequenceFlow id="Flow_MCP_3" sourceRef="Task_GetLibraryDocs" targetRef="Task_ValidateImplementation" />
    <bpmn:sequenceFlow id="Flow_MCP_4" sourceRef="Task_ValidateImplementation" targetRef="EndEvent_MCP" />
    
  </bpmn:process>
  
  <bpmndi:BPMNDiagram id="BPMNDiagram_MCP">
    <bpmndi:BPMNPlane id="BPMNPlane_MCP" bpmnElement="AtomicMCPContext7">
      
      <bpmndi:BPMNShape id="StartEvent_MCP_di" bpmnElement="StartEvent_MCP">
        <dc:Bounds x="152" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>
      
      <bpmndi:BPMNShape id="Task_ResolveLibraryID_di" bpmnElement="Task_ResolveLibraryID">
        <dc:Bounds x="240" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      
      <bpmndi:BPMNShape id="Task_GetLibraryDocs_di" bpmnElement="Task_GetLibraryDocs">
        <dc:Bounds x="380" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      
      <bpmndi:BPMNShape id="Task_ValidateImplementation_di" bpmnElement="Task_ValidateImplementation">
        <dc:Bounds x="520" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      
      <bpmndi:BPMNShape id="EndEvent_MCP_di" bpmnElement="EndEvent_MCP">
        <dc:Bounds x="672" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>
      
      <bpmndi:BPMNEdge id="Flow_MCP_1_di" bpmnElement="Flow_MCP_1">
        <di:waypoint x="188" y="120" />
        <di:waypoint x="240" y="120" />
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_MCP_2_di" bpmnElement="Flow_MCP_2">
        <di:waypoint x="340" y="120" />
        <di:waypoint x="380" y="120" />
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_MCP_3_di" bpmnElement="Flow_MCP_3">
        <di:waypoint x="480" y="120" />
        <di:waypoint x="520" y="120" />
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_MCP_4_di" bpmnElement="Flow_MCP_4">
        <di:waypoint x="620" y="120" />
        <di:waypoint x="672" y="120" />
      </bpmndi:BPMNEdge>
      
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`,
    
    documentation: {
        purpose: "MCP Context7 documentation validation process",
        atomic: true,
        reusable: true,
        parameters: {
            libraryName: "Name of library to validate against",
            topic: "Specific documentation topic"
        },
        steps: [
            "Resolve library ID using MCP Context7",
            "Retrieve official documentation",
            "Validate implementation against documentation",
            "Return validation results"
        ]
    }
};

function renderAtomicMCPContext7(containerId) {
    const viewer = new BpmnJS({ container: `#${containerId}` });
    viewer.importXML(atomicMCPContext7.xml).then(() => {
        console.log('Atomic MCP Context7 rendered successfully');
        viewer.get('canvas').zoom('fit-viewport');
    }).catch(err => console.error('Error rendering Atomic MCP Context7:', err));
    return viewer;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { atomicMCPContext7, renderAtomicMCPContext7 };
}
if (typeof window !== 'undefined') {
    window.AtomicMCPContext7 = atomicMCPContext7;
    window.renderAtomicMCPContext7 = renderAtomicMCPContext7;
}

