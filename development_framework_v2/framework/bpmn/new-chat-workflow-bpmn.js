/**
 * Framework v2 New Chat Workflow BPMN Diagram
 * Intelligent File/Folder Analysis with Automatic Routing
 * 
 * Usage with bpmn.io:
 * 1. Include bpmn-js library in your HTML
 * 2. Create a container element: <div id="new-chat-workflow-container"></div>
 * 3. Call: renderNewChatWorkflow('new-chat-workflow-container')
 */

function renderNewChatWorkflow(containerId) {
    const bpmnXML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI" 
                  id="Definitions_NewChatWorkflow" 
                  targetNamespace="http://bpmn.io/schema/bpmn" 
                  exporter="bpmn-js (https://demo.bpmn.io)" 
                  exporterVersion="8.7.1">
  
  <!-- Process Definition -->
  <bpmn:process id="FrameworkV2_NewChatWorkflow" name="Framework v2 New Chat Workflow" isExecutable="false">
    
    <!-- Start Event -->
    <bpmn:startEvent id="StartEvent_NewChat" name="New Chat Session">
      <bpmn:outgoing>Flow_NewChat_1</bpmn:outgoing>
    </bpmn:startEvent>
    
    <!-- Mission Analyst Task -->
    <bpmn:task id="Task_NewChatAnalyst" name="Mission Analyst - File/Folder Analysis">
      <bpmn:incoming>Flow_NewChat_1</bpmn:incoming>
      <bpmn:outgoing>Flow_NewChat_2</bpmn:outgoing>
    </bpmn:task>
    
    <!-- Content Analysis Gateway -->
    <bpmn:exclusiveGateway id="Gateway_ContentAnalysis" name="Content Type Analysis">
      <bpmn:incoming>Flow_NewChat_2</bpmn:incoming>
      <bpmn:outgoing>Flow_NewChat_3</bpmn:outgoing>
      <bpmn:outgoing>Flow_NewChat_4</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    
    <!-- Enhancement Path - Mission Planner -->
    <bpmn:task id="Task_NewChatPlanner" name="Mission Planner - Task Enhancement">
      <bpmn:incoming>Flow_NewChat_3</bpmn:incoming>
      <bpmn:outgoing>Flow_NewChat_5</bpmn:outgoing>
    </bpmn:task>
    
    <!-- Task Creation Subprocess -->
    <bpmn:subProcess id="SubProcess_TaskCreation" name="Task Creation in project/dev/tasks">
      <bpmn:incoming>Flow_NewChat_5</bpmn:incoming>
      <bpmn:outgoing>Flow_NewChat_7</bpmn:outgoing>
      
      <!-- Task Creation Start -->
      <bpmn:startEvent id="StartEvent_TaskCreation" name="Start Task Creation">
        <bpmn:outgoing>Flow_Task_1</bpmn:outgoing>
      </bpmn:startEvent>
      
      <!-- Task Analysis -->
      <bpmn:task id="Task_TaskAnalysis" name="Analyze Enhancement Requirements">
        <bpmn:incoming>Flow_Task_1</bpmn:incoming>
        <bpmn:outgoing>Flow_Task_2</bpmn:outgoing>
      </bpmn:task>
      
      <!-- Task Planning -->
      <bpmn:task id="Task_TaskPlanning" name="Plan Implementation Tasks">
        <bpmn:incoming>Flow_Task_2</bpmn:incoming>
        <bpmn:outgoing>Flow_Task_3</bpmn:outgoing>
      </bpmn:task>
      
      <!-- Task Placement -->
      <bpmn:task id="Task_TaskPlacement" name="Place Tasks in project/dev/tasks">
        <bpmn:incoming>Flow_Task_3</bpmn:incoming>
        <bpmn:outgoing>Flow_Task_4</bpmn:outgoing>
      </bpmn:task>
      
      <!-- Task Creation End -->
      <bpmn:endEvent id="EndEvent_TaskCreation" name="Task Creation Complete">
        <bpmn:incoming>Flow_Task_4</bpmn:incoming>
      </bpmn:endEvent>
      
      <!-- Internal Flows -->
      <bpmn:sequenceFlow id="Flow_Task_1" sourceRef="StartEvent_TaskCreation" targetRef="Task_TaskAnalysis" />
      <bpmn:sequenceFlow id="Flow_Task_2" sourceRef="Task_TaskAnalysis" targetRef="Task_TaskPlanning" />
      <bpmn:sequenceFlow id="Flow_Task_3" sourceRef="Task_TaskPlanning" targetRef="Task_TaskPlacement" />
      <bpmn:sequenceFlow id="Flow_Task_4" sourceRef="Task_TaskPlacement" targetRef="EndEvent_TaskCreation" />
    </bpmn:subProcess>
    
    <!-- Bug Report Path - Mission-QA -->
    <bpmn:task id="Task_NewChatQA" name="Mission-QA - Bug Analysis">
      <bpmn:incoming>Flow_NewChat_4</bpmn:incoming>
      <bpmn:outgoing>Flow_NewChat_6</bpmn:outgoing>
    </bpmn:task>
    
    <!-- Bug Creation Subprocess -->
    <bpmn:subProcess id="SubProcess_BugCreation" name="Bug Creation in project/dev/bugs">
      <bpmn:incoming>Flow_NewChat_6</bpmn:incoming>
      <bpmn:outgoing>Flow_NewChat_8</bpmn:outgoing>
      
      <!-- Bug Creation Start -->
      <bpmn:startEvent id="StartEvent_BugCreation" name="Start Bug Creation">
        <bpmn:outgoing>Flow_Bug_1</bpmn:outgoing>
      </bpmn:startEvent>
      
      <!-- Bug Analysis -->
      <bpmn:task id="Task_BugAnalysis" name="Analyze Bug Report">
        <bpmn:incoming>Flow_Bug_1</bpmn:incoming>
        <bpmn:outgoing>Flow_Bug_2</bpmn:outgoing>
      </bpmn:task>
      
      <!-- Bug Classification -->
      <bpmn:task id="Task_BugClassification" name="Classify Bug Severity">
        <bpmn:incoming>Flow_Bug_2</bpmn:incoming>
        <bpmn:outgoing>Flow_Bug_3</bpmn:outgoing>
      </bpmn:task>
      
      <!-- Bug Placement -->
      <bpmn:task id="Task_BugPlacement" name="Place Bug in project/dev/bugs">
        <bpmn:incoming>Flow_Bug_3</bpmn:incoming>
        <bpmn:outgoing>Flow_Bug_4</bpmn:outgoing>
      </bpmn:task>
      
      <!-- Bug Creation End -->
      <bpmn:endEvent id="EndEvent_BugCreation" name="Bug Creation Complete">
        <bpmn:incoming>Flow_Bug_4</bpmn:incoming>
      </bpmn:endEvent>
      
      <!-- Internal Flows -->
      <bpmn:sequenceFlow id="Flow_Bug_1" sourceRef="StartEvent_BugCreation" targetRef="Task_BugAnalysis" />
      <bpmn:sequenceFlow id="Flow_Bug_2" sourceRef="Task_BugAnalysis" targetRef="Task_BugClassification" />
      <bpmn:sequenceFlow id="Flow_Bug_3" sourceRef="Task_BugClassification" targetRef="Task_BugPlacement" />
      <bpmn:sequenceFlow id="Flow_Bug_4" sourceRef="Task_BugPlacement" targetRef="EndEvent_BugCreation" />
    </bpmn:subProcess>
    
    <!-- Merge Gateway -->
    <bpmn:exclusiveGateway id="Gateway_Merge" name="Merge Results">
      <bpmn:incoming>Flow_NewChat_7</bpmn:incoming>
      <bpmn:incoming>Flow_NewChat_8</bpmn:incoming>
      <bpmn:outgoing>Flow_NewChat_9</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    
    <!-- Final Validation -->
    <bpmn:task id="Task_FinalValidation" name="Final Validation & Summary">
      <bpmn:incoming>Flow_NewChat_9</bpmn:incoming>
      <bpmn:outgoing>Flow_NewChat_10</bpmn:outgoing>
    </bpmn:task>
    
    <!-- End Event -->
    <bpmn:endEvent id="EndEvent_NewChat" name="New Chat Workflow Complete">
      <bpmn:incoming>Flow_NewChat_10</bpmn:incoming>
    </bpmn:endEvent>
    
    <!-- Sequence Flows -->
    <bpmn:sequenceFlow id="Flow_NewChat_1" sourceRef="StartEvent_NewChat" targetRef="Task_NewChatAnalyst" />
    <bpmn:sequenceFlow id="Flow_NewChat_2" sourceRef="Task_NewChatAnalyst" targetRef="Gateway_ContentAnalysis" />
    <bpmn:sequenceFlow id="Flow_NewChat_3" sourceRef="Gateway_ContentAnalysis" targetRef="Task_NewChatPlanner" name="Enhancement Path" />
    <bpmn:sequenceFlow id="Flow_NewChat_4" sourceRef="Gateway_ContentAnalysis" targetRef="Task_NewChatQA" name="Bug Report Path" />
    <bpmn:sequenceFlow id="Flow_NewChat_5" sourceRef="Task_NewChatPlanner" targetRef="SubProcess_TaskCreation" />
    <bpmn:sequenceFlow id="Flow_NewChat_6" sourceRef="Task_NewChatQA" targetRef="SubProcess_BugCreation" />
    <bpmn:sequenceFlow id="Flow_NewChat_7" sourceRef="SubProcess_TaskCreation" targetRef="Gateway_Merge" />
    <bpmn:sequenceFlow id="Flow_NewChat_8" sourceRef="SubProcess_BugCreation" targetRef="Gateway_Merge" />
    <bpmn:sequenceFlow id="Flow_NewChat_9" sourceRef="Gateway_Merge" targetRef="Task_FinalValidation" />
    <bpmn:sequenceFlow id="Flow_NewChat_10" sourceRef="Task_FinalValidation" targetRef="EndEvent_NewChat" />
    
  </bpmn:process>
  
  <!-- Diagram Definition -->
  <bpmndi:BPMNDiagram id="BPMNDiagram_NewChat">
    <bpmndi:BPMNPlane id="BPMNPlane_NewChat" bpmnElement="FrameworkV2_NewChatWorkflow">
      
      <!-- Start Event Shape -->
      <bpmndi:BPMNShape id="StartEvent_NewChat_di" bpmnElement="StartEvent_NewChat">
        <dc:Bounds x="152" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="140" y="145" width="60" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      
      <!-- Mission Analyst Shape -->
      <bpmndi:BPMNShape id="Task_NewChatAnalyst_di" bpmnElement="Task_NewChatAnalyst">
        <dc:Bounds x="240" y="80" width="120" height="80" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="250" y="165" width="100" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      
      <!-- Content Analysis Gateway Shape -->
      <bpmndi:BPMNShape id="Gateway_ContentAnalysis_di" bpmnElement="Gateway_ContentAnalysis">
        <dc:Bounds x="400" y="95" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="380" y="152" width="90" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      
      <!-- Mission Planner Shape -->
      <bpmndi:BPMNShape id="Task_NewChatPlanner_di" bpmnElement="Task_NewChatPlanner">
        <dc:Bounds x="500" y="20" width="120" height="80" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="510" y="105" width="100" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      
      <!-- Task Creation Subprocess Shape -->
      <bpmndi:BPMNShape id="SubProcess_TaskCreation_di" bpmnElement="SubProcess_TaskCreation">
        <dc:Bounds x="680" y="20" width="200" height="120" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="700" y="145" width="160" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      
      <!-- Mission-QA Shape -->
      <bpmndi:BPMNShape id="Task_NewChatQA_di" bpmnElement="Task_NewChatQA">
        <dc:Bounds x="500" y="140" width="120" height="80" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="510" y="225" width="100" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      
      <!-- Bug Creation Subprocess Shape -->
      <bpmndi:BPMNShape id="SubProcess_BugCreation_di" bpmnElement="SubProcess_BugCreation">
        <dc:Bounds x="680" y="140" width="200" height="120" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="700" y="265" width="160" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      
      <!-- Merge Gateway Shape -->
      <bpmndi:BPMNShape id="Gateway_Merge_di" bpmnElement="Gateway_Merge">
        <dc:Bounds x="920" y="95" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="900" y="152" width="90" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      
      <!-- Final Validation Shape -->
      <bpmndi:BPMNShape id="Task_FinalValidation_di" bpmnElement="Task_FinalValidation">
        <dc:Bounds x="1020" y="80" width="120" height="80" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1030" y="165" width="100" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      
      <!-- End Event Shape -->
      <bpmndi:BPMNShape id="EndEvent_NewChat_di" bpmnElement="EndEvent_NewChat">
        <dc:Bounds x="1180" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1168" y="145" width="60" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      
      <!-- Sequence Flow Shapes -->
      <bpmndi:BPMNEdge id="Flow_NewChat_1_di" bpmnElement="Flow_NewChat_1">
        <di:waypoint x="188" y="120" />
        <di:waypoint x="240" y="120" />
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_NewChat_2_di" bpmnElement="Flow_NewChat_2">
        <di:waypoint x="360" y="120" />
        <di:waypoint x="400" y="120" />
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_NewChat_3_di" bpmnElement="Flow_NewChat_3">
        <di:waypoint x="425" y="95" />
        <di:waypoint x="500" y="60" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="450" y="75" width="80" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_NewChat_4_di" bpmnElement="Flow_NewChat_4">
        <di:waypoint x="425" y="145" />
        <di:waypoint x="500" y="180" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="450" y="160" width="80" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_NewChat_5_di" bpmnElement="Flow_NewChat_5">
        <di:waypoint x="620" y="60" />
        <di:waypoint x="680" y="80" />
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_NewChat_6_di" bpmnElement="Flow_NewChat_6">
        <di:waypoint x="620" y="180" />
        <di:waypoint x="680" y="200" />
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_NewChat_7_di" bpmnElement="Flow_NewChat_7">
        <di:waypoint x="880" y="80" />
        <di:waypoint x="920" y="95" />
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_NewChat_8_di" bpmnElement="Flow_NewChat_8">
        <di:waypoint x="880" y="200" />
        <di:waypoint x="920" y="145" />
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_NewChat_9_di" bpmnElement="Flow_NewChat_9">
        <di:waypoint x="970" y="120" />
        <di:waypoint x="1020" y="120" />
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_NewChat_10_di" bpmnElement="Flow_NewChat_10">
        <di:waypoint x="1140" y="120" />
        <di:waypoint x="1180" y="120" />
      </bpmndi:BPMNEdge>
      
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

    // Initialize bpmn-js viewer
    const viewer = new BpmnJS({ container: `#${containerId}` });
    
    // Import and render the BPMN diagram
    viewer.importXML(bpmnXML).then(() => {
        console.log('Framework v2 New Chat Workflow rendered successfully');
        // Zoom to fit the diagram
        viewer.get('canvas').zoom('fit-viewport');
    }).catch(err => {
        console.error('Error rendering Framework v2 New Chat Workflow:', err);
    });
    
    return viewer;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderNewChatWorkflow };
}
