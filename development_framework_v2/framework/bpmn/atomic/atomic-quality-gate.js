/**
 * Atomic Process: Quality Gate
 * 
 * Definition: Reusable quality validation gate
 * Called By: All workflows requiring quality validation
 */

const atomicQualityGate = {
    processId: "AtomicQualityGate",
    processName: "Atomic: Quality Gate",
    
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
                  xmlns:camunda="http://camunda.org/schema/1.0/bpmn">
  
  <bpmn:process id="AtomicQualityGate" name="Atomic: Quality Gate" isExecutable="true">
    
    <bpmn:startEvent id="StartEvent_Quality" name="Quality Gate Start">
      <bpmn:outgoing>Flow_Quality_1</bpmn:outgoing>
    </bpmn:startEvent>
    
    <!-- Parallel Gateway for Quality Checks -->
    <bpmn:parallelGateway id="Gateway_QualityStart" name="Start Quality Checks">
      <bpmn:incoming>Flow_Quality_1</bpmn:incoming>
      <bpmn:outgoing>Flow_Quality_2</bpmn:outgoing>
      <bpmn:outgoing>Flow_Quality_3</bpmn:outgoing>
      <bpmn:outgoing>Flow_Quality_4</bpmn:outgoing>
    </bpmn:parallelGateway>
    
    <!-- Code Quality Check -->
    <bpmn:businessRuleTask id="Task_CodeQuality" name="Code Quality Check" 
                           camunda:delegateExpression="\${codeQualityDelegate}">
      <bpmn:incoming>Flow_Quality_2</bpmn:incoming>
      <bpmn:outgoing>Flow_Quality_5</bpmn:outgoing>
    </bpmn:businessRuleTask>
    
    <!-- Security Check -->
    <bpmn:businessRuleTask id="Task_SecurityCheck" name="Security Check" 
                           camunda:delegateExpression="\${securityDelegate}">
      <bpmn:incoming>Flow_Quality_3</bpmn:incoming>
      <bpmn:outgoing>Flow_Quality_6</bpmn:outgoing>
    </bpmn:businessRuleTask>
    
    <!-- Performance Check -->
    <bpmn:businessRuleTask id="Task_PerformanceCheck" name="Performance Check" 
                           camunda:delegateExpression="\${performanceDelegate}">
      <bpmn:incoming>Flow_Quality_4</bpmn:incoming>
      <bpmn:outgoing>Flow_Quality_7</bpmn:outgoing>
    </bpmn:businessRuleTask>
    
    <!-- Merge Gateway -->
    <bpmn:parallelGateway id="Gateway_QualityMerge" name="Merge Quality Results">
      <bpmn:incoming>Flow_Quality_5</bpmn:incoming>
      <bpmn:incoming>Flow_Quality_6</bpmn:incoming>
      <bpmn:incoming>Flow_Quality_7</bpmn:incoming>
      <bpmn:outgoing>Flow_Quality_8</bpmn:outgoing>
    </bpmn:parallelGateway>
    
    <!-- Decision Gateway -->
    <bpmn:exclusiveGateway id="Gateway_QualityDecision" name="Quality Passed?">
      <bpmn:incoming>Flow_Quality_8</bpmn:incoming>
      <bpmn:outgoing>Flow_Quality_9</bpmn:outgoing>
      <bpmn:outgoing>Flow_Quality_10</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    
    <!-- Pass: Continue -->
    <bpmn:endEvent id="EndEvent_QualityPass" name="Quality Passed">
      <bpmn:incoming>Flow_Quality_9</bpmn:incoming>
    </bpmn:endEvent>
    
    <!-- Fail: Remediate -->
    <bpmn:serviceTask id="Task_Remediate" name="Remediate Issues" 
                      camunda:delegateExpression="\${remediateDelegate}">
      <bpmn:incoming>Flow_Quality_10</bpmn:incoming>
      <bpmn:outgoing>Flow_Quality_11</bpmn:outgoing>
    </bpmn:serviceTask>
    
    <bpmn:endEvent id="EndEvent_QualityFail" name="Remediation Complete">
      <bpmn:incoming>Flow_Quality_11</bpmn:incoming>
    </bpmn:endEvent>
    
    <!-- Sequence Flows -->
    <bpmn:sequenceFlow id="Flow_Quality_1" sourceRef="StartEvent_Quality" targetRef="Gateway_QualityStart" />
    <bpmn:sequenceFlow id="Flow_Quality_2" sourceRef="Gateway_QualityStart" targetRef="Task_CodeQuality" />
    <bpmn:sequenceFlow id="Flow_Quality_3" sourceRef="Gateway_QualityStart" targetRef="Task_SecurityCheck" />
    <bpmn:sequenceFlow id="Flow_Quality_4" sourceRef="Gateway_QualityStart" targetRef="Task_PerformanceCheck" />
    <bpmn:sequenceFlow id="Flow_Quality_5" sourceRef="Task_CodeQuality" targetRef="Gateway_QualityMerge" />
    <bpmn:sequenceFlow id="Flow_Quality_6" sourceRef="Task_SecurityCheck" targetRef="Gateway_QualityMerge" />
    <bpmn:sequenceFlow id="Flow_Quality_7" sourceRef="Task_PerformanceCheck" targetRef="Gateway_QualityMerge" />
    <bpmn:sequenceFlow id="Flow_Quality_8" sourceRef="Gateway_QualityMerge" targetRef="Gateway_QualityDecision" />
    <bpmn:sequenceFlow id="Flow_Quality_9" sourceRef="Gateway_QualityDecision" targetRef="EndEvent_QualityPass" name="Pass" />
    <bpmn:sequenceFlow id="Flow_Quality_10" sourceRef="Gateway_QualityDecision" targetRef="Task_Remediate" name="Fail" />
    <bpmn:sequenceFlow id="Flow_Quality_11" sourceRef="Task_Remediate" targetRef="EndEvent_QualityFail" />
    
  </bpmn:process>
  
  <bpmndi:BPMNDiagram id="BPMNDiagram_Quality">
    <bpmndi:BPMNPlane id="BPMNPlane_Quality" bpmnElement="AtomicQualityGate">
      <!-- Diagram definitions would include shapes and edges -->
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`,
    
    documentation: {
        purpose: "Quality validation gate process",
        atomic: true,
        reusable: true,
        steps: [
            "Parallel execution of quality checks (code, security, performance)",
            "Merge results",
            "Decision: Pass or Fail",
            "If Pass: Continue to next stage",
            "If Fail: Remediate and retry"
        ]
    }
};

function renderAtomicQualityGate(containerId) {
    const viewer = new BpmnJS({ container: `#${containerId}` });
    viewer.importXML(atomicQualityGate.xml).then(() => {
        console.log('Atomic Quality Gate rendered successfully');
        viewer.get('canvas').zoom('fit-viewport');
    }).catch(err => console.error('Error:', err));
    return viewer;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { atomicQualityGate, renderAtomicQualityGate };
}

