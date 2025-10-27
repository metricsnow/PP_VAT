/**
 * Atomic Process: Persona Activation
 * 
 * Definition: Reusable process for activating any Framework v2 persona
 * Called By: All workflows requiring persona execution
 * 
 * Usage:
 * 1. Include this in BPMN definitions
 * 2. Reference via callActivity with calledElement="AtomicPersonaActivation"
 */

const atomicPersonaActivation = {
    processId: "AtomicPersonaActivation",
    processName: "Atomic: Persona Activation",
    
    // BPMN XML Definition
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI" 
                  xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
                  id="Definitions_PersonaActivation" 
                  targetNamespace="http://bpmn.io/schema/bpmn">
  
  <!-- Atomic Persona Activation Process -->
  <bpmn:process id="AtomicPersonaActivation" name="Atomic: Persona Activation" isExecutable="true">
    
    <!-- Start Event -->
    <bpmn:startEvent id="StartEvent_Persona" name="Activate Persona">
      <bpmn:outgoing>Flow_Persona_1</bpmn:outgoing>
    </bpmn:startEvent>
    
    <!-- Load Persona Rules -->
    <bpmn:serviceTask id="Task_LoadPersonaRules" name="Load Persona Rules" 
                      camunda:delegateExpression="\${loadPersonaRulesDelegate}">
      <bpmn:incoming>Flow_Persona_1</bpmn:incoming>
      <bpmn:outgoing>Flow_Persona_2</bpmn:outgoing>
    </bpmn:serviceTask>
    
    <!-- Switch Context -->
    <bpmn:serviceTask id="Task_SwitchContext" name="Switch Persona Context" 
                      camunda:delegateExpression="\${switchContextDelegate}">
      <bpmn:incoming>Flow_Persona_2</bpmn:incoming>
      <bpmn:outgoing>Flow_Persona_3</bpmn:outgoing>
    </bpmn:serviceTask>
    
    <!-- Execute Persona Logic -->
    <bpmn:userTask id="Task_ExecutePersona" name="Execute Persona Logic">
      <bpmn:incoming>Flow_Persona_3</bpmn:incoming>
      <bpmn:outgoing>Flow_Persona_4</bpmn:outgoing>
    </bpmn:userTask>
    
    <!-- End Event -->
    <bpmn:endEvent id="EndEvent_Persona" name="Persona Activation Complete">
      <bpmn:incoming>Flow_Persona_4</bpmn:incoming>
    </bpmn:endEvent>
    
    <!-- Sequence Flows -->
    <bpmn:sequenceFlow id="Flow_Persona_1" sourceRef="StartEvent_Persona" targetRef="Task_LoadPersonaRules" />
    <bpmn:sequenceFlow id="Flow_Persona_2" sourceRef="Task_LoadPersonaRules" targetRef="Task_SwitchContext" />
    <bpmn:sequenceFlow id="Flow_Persona_3" sourceRef="Task_SwitchContext" targetRef="Task_ExecutePersona" />
    <bpmn:sequenceFlow id="Flow_Persona_4" sourceRef="Task_ExecutePersona" targetRef="EndEvent_Persona" />
    
  </bpmn:process>
  
  <!-- Separate Diagram for Visualization -->
  <bpmndi:BPMNDiagram id="BPMNDiagram_PersonaActivation">
    <bpmndi:BPMNPlane id="BPMNPlane_PersonaActivation" bpmnElement="AtomicPersonaActivation">
      
      <!-- Start Event Shape -->
      <bpmndi:BPMNShape id="StartEvent_Persona_di" bpmnElement="StartEvent_Persona">
        <dc:Bounds x="152" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>
      
      <!-- Load Persona Rules Shape -->
      <bpmndi:BPMNShape id="Task_LoadPersonaRules_di" bpmnElement="Task_LoadPersonaRules">
        <dc:Bounds x="240" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      
      <!-- Switch Context Shape -->
      <bpmndi:BPMNShape id="Task_SwitchContext_di" bpmnElement="Task_SwitchContext">
        <dc:Bounds x="380" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      
      <!-- Execute Persona Shape -->
      <bpmndi:BPMNShape id="Task_ExecutePersona_di" bpmnElement="Task_ExecutePersona">
        <dc:Bounds x="520" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      
      <!-- End Event Shape -->
      <bpmndi:BPMNShape id="EndEvent_Persona_di" bpmnElement="EndEvent_Persona">
        <dc:Bounds x="672" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>
      
      <!-- Sequence Flow Edges -->
      <bpmndi:BPMNEdge id="Flow_Persona_1_di" bpmnElement="Flow_Persona_1">
        <di:waypoint x="188" y="120" />
        <di:waypoint x="240" y="120" />
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_Persona_2_di" bpmnElement="Flow_Persona_2">
        <di:waypoint x="340" y="120" />
        <di:waypoint x="380" y="120" />
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_Persona_3_di" bpmnElement="Flow_Persona_3">
        <di:waypoint x="480" y="120" />
        <di:waypoint x="520" y="120" />
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_Persona_4_di" bpmnElement="Flow_Persona_4">
        <di:waypoint x="620" y="120" />
        <di:waypoint x="672" y="120" />
      </bpmndi:BPMNEdge>
      
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`,
    
    // Usage Documentation
    documentation: {
        purpose: "Reusable persona activation process for Framework v2",
        atomic: true,
        reusable: true,
        parameters: {
            personaType: "Mission Analyst | Mission Planner | Mission Executor | Mission-QA | Mission Challenger"
        },
        steps: [
            "Load Persona Rules from framework/agents/",
            "Switch context to activate persona",
            "Execute persona-specific logic",
            "Return control to calling workflow"
        ]
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = atomicPersonaActivation;
}

// Export as global for browser usage
if (typeof window !== 'undefined') {
    window.AtomicPersonaActivation = atomicPersonaActivation;
}

// Render function for standalone visualization
function renderAtomicPersonaActivation(containerId) {
    const viewer = new BpmnJS({ container: `#${containerId}` });
    
    viewer.importXML(atomicPersonaActivation.xml).then(() => {
        console.log('Atomic Persona Activation rendered successfully');
        viewer.get('canvas').zoom('fit-viewport');
    }).catch(err => {
        console.error('Error rendering Atomic Persona Activation:', err);
    });
    
    return viewer;
}

if (typeof window !== 'undefined') {
    window.renderAtomicPersonaActivation = renderAtomicPersonaActivation;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports.renderAtomicPersonaActivation = renderAtomicPersonaActivation;
}

