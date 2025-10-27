/**
 * Atomic BPMN Process: PDF Invoice Updater
 * 
 * Process ID: pdf-invoice-updater
 * Process Type: Atomic (single executable process)
 * Description: Updates PDF invoices by overlaying text at specified positions
 * 
 * This is an atomic BPMN process diagram following BPMN 2.0 standards.
 */

export const PDFInvoiceUpdaterXML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL"
                   xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                   xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
                   xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
                   targetNamespace="http://pdf-invoice-updater"
                   id="PDFInvoiceUpdater">
  <bpmn2:process id="PDFInvoiceUpdater" name="PDF Invoice Updater" isExecutable="true">
    <!-- Data Objects -->
    <bpmn2:dataObject id="DataInput_pdfPath" name="PDF Path" itemSubjectRef="String"/>
    <bpmn2:dataObject id="DataInput_updates" name="Updates Config" itemSubjectRef="JSONArray"/>
    <bpmn2:dataObject id="DataInput_outputSuffix" name="Output Suffix" itemSubjectRef="String"/>
    <bpmn2:dataObject id="DataObject_document" name="PDF Document"/>
    <bpmn2:dataObject id="DataObject_positions" name="Text Positions"/>
    <bpmn2:dataObject id="DataOutput_pdfPath" name="Updated PDF Path" itemSubjectRef="String"/>
    
    <!-- Start Event -->
    <bpmn2:startEvent id="StartEvent_1" name="Start PDF Update">
      <bpmn2:outgoing>Flow_Init</bpmn2:outgoing>
    </bpmn2:startEvent>
    
    <!-- Initialize -->
    <bpmn2:scriptTask id="Initialize" name="Initialize PDF Invoice Updater">
      <bpmn2:incoming>Flow_Init</bpmn2:incoming>
      <bpmn2:outgoing>Flow_Load</bpmn2:outgoing>
    </bpmn2:scriptTask>
    
    <!-- Load PDF -->
    <bpmn2:serviceTask id="LoadPDF" name="Load PDF Document" implementation="pymupdf.open">
      <bpmn2:incoming>Flow_Load</bpmn2:incoming>
      <bpmn2:outgoing>Flow_Validate</bpmn2:outgoing>
    </bpmn2:serviceTask>
    
    <!-- Validate -->
    <bpmn2:exclusiveGateway id="ValidatePDF" name="PDF Loaded?">
      <bpmn2:incoming>Flow_Validate</bpmn2:incoming>
      <bpmn2:outgoing>Flow_LoadSuccess</bpmn2:outgoing>
      <bpmn2:outgoing>Flow_LoadError</bpmn2:outgoing>
    </bpmn2:exclusiveGateway>
    
    <!-- Error End -->
    <bpmn2:endEvent id="HandleError" name="Error: PDF Load Failed">
      <bpmn2:errorEventDefinition errorRef="PDF_LOAD_ERROR"/>
      <bpmn2:incoming>Flow_LoadError</bpmn2:incoming>
    </bpmn2:endEvent>
    
    <!-- For Each Update Sub-Process -->
    <bpmn2:subProcess id="ForEachUpdate" name="Process Each Update" triggeredByEvent="false">
      <bpmn2:incoming>Flow_LoadSuccess</bpmn2:incoming>
      <bpmn2:outgoing>Flow_SavePDF</bpmn2:outgoing>
      
      <!-- Find Text Positions -->
      <bpmn2:serviceTask id="FindTextPositions" name="Find Text Positions" implementation="page.search_for">
        <bpmn2:outgoing>Flow_FindToCover</bpmn2:outgoing>
      </bpmn2:serviceTask>
      
      <!-- Apply Yellow Cover -->
      <bpmn2:scriptTask id="ApplyYellowCover" name="Cover Old Text with Yellow Box">
        <bpmn2:incoming>Flow_FindToCover</bpmn2:incoming>
        <bpmn2:outgoing>Flow_CoverToOverlay</bpmn2:outgoing>
      </bpmn2:scriptTask>
      
      <!-- Overlay Text -->
      <bpmn2:scriptTask id="OverlayText" name="Overlay New Text">
        <bpmn2:incoming>Flow_CoverToOverlay</bpmn2:incoming>
        <bpmn2:outgoing>Flow_OverlayToCheck</bpmn2:outgoing>
      </bpmn2:scriptTask>
      
      <!-- Check More Positions -->
      <bpmn2:exclusiveGateway id="CheckMorePositions" name="More Positions?">
        <bpmn2:incoming>Flow_OverlayToCheck</bpmn2:incoming>
        <bpmn2:outgoing>Flow_NextPosition</bpmn2:outgoing>
        <bpmn2:outgoing>Flow_UpdateComplete</bpmn2:outgoing>
      </bpmn2:exclusiveGateway>
      
      <!-- Internal flows -->
      <bpmn2:sequenceFlow id="Flow_FindToCover" sourceRef="FindTextPositions" targetRef="ApplyYellowCover"/>
      <bpmn2:sequenceFlow id="Flow_CoverToOverlay" sourceRef="ApplyYellowCover" targetRef="OverlayText"/>
      <bpmn2:sequenceFlow id="Flow_OverlayToCheck" sourceRef="OverlayText" targetRef="CheckMorePositions"/>
      <bpmn2:sequenceFlow id="Flow_NextPosition" sourceRef="CheckMorePositions" targetRef="FindTextPositions" name="More positions exist"/>
      <bpmn2:sequenceFlow id="Flow_UpdateComplete" sourceRef="CheckMorePositions" name="All positions updated" targetRef="SubProcessEnd"/>
      
      <bpmn2:endEvent id="SubProcessEnd"/>
    </bpmn2:subProcess>
    
    <!-- Save PDF -->
    <bpmn2:serviceTask id="SavePDF" name="Save Updated PDF" implementation="document.save">
      <bpmn2:incoming>Flow_SavePDF</bpmn2:incoming>
      <bpmn2:outgoing>Flow_End</bpmn2:outgoing>
    </bpmn2:serviceTask>
    
    <!-- End Event -->
    <bpmn2:endEvent id="EndEvent_1" name="PDF Updated Successfully">
      <bpmn2:incoming>Flow_End</bpmn2:incoming>
    </bpmn2:endEvent>
    
    <!-- Main Sequence Flows -->
    <bpmn2:sequenceFlow id="Flow_Init" sourceRef="StartEvent_1" targetRef="Initialize"/>
    <bpmn2:sequenceFlow id="Flow_Load" sourceRef="Initialize" targetRef="LoadPDF"/>
    <bpmn2:sequenceFlow id="Flow_Validate" sourceRef="LoadPDF" targetRef="ValidatePDF"/>
    <bpmn2:sequenceFlow id="Flow_LoadSuccess" sourceRef="ValidatePDF" targetRef="ForEachUpdate" name="PDF loaded successfully"/>
    <bpmn2:sequenceFlow id="Flow_LoadError" sourceRef="ValidatePDF" targetRef="HandleError" name="PDF load failed"/>
    <bpmn2:sequenceFlow id="Flow_SavePDF" sourceRef="ForEachUpdate" targetRef="SavePDF"/>
    <bpmn2:sequenceFlow id="Flow_End" sourceRef="SavePDF" targetRef="EndEvent_1"/>
  </bpmn2:process>
  
  <!-- BPMN Diagram -->
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="PDFInvoiceUpdater">
      <!-- Start Event -->
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="100" y="300" width="36" height="36"/>
      </bpmndi:BPMNShape>
      
      <!-- Initialize -->
      <bpmndi:BPMNShape id="Initialize_di" bpmnElement="Initialize">
        <dc:Bounds x="200" y="278" width="100" height="80"/>
      </bpmndi:BPMNShape>
      
      <!-- Load PDF -->
      <bpmndi:BPMNShape id="LoadPDF_di" bpmnElement="LoadPDF">
        <dc:Bounds x="350" y="278" width="100" height="80"/>
      </bpmndi:BPMNShape>
      
      <!-- Validate Gateway -->
      <bpmndi:BPMNShape id="ValidatePDF_di" bpmnElement="ValidatePDF">
        <dc:Bounds x="500" y="293" width="50" height="50"/>
      </bpmndi:BPMNShape>
      
      <!-- Error End -->
      <bpmndi:BPMNShape id="HandleError_di" bpmnElement="HandleError">
        <dc:Bounds x="512" y="450" width="36" height="36"/>
      </bpmndi:BPMNShape>
      
      <!-- Sub-Process -->
      <bpmndi:BPMNShape id="ForEachUpdate_di" bpmnElement="ForEachUpdate" isExpanded="true">
        <dc:Bounds x="600" y="250" width="700" height="150"/>
      </bpmndi:BPMNShape>
      
      <!-- Save PDF -->
      <bpmndi:BPMNShape id="SavePDF_di" bpmnElement="SavePDF">
        <dc:Bounds x="1370" y="278" width="100" height="80"/>
      </bpmndi:BPMNShape>
      
      <!-- End Event -->
      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="1530" y="300" width="36" height="36"/>
      </bpmndi:BPMNShape>
      
      <!-- Flows -->
      <bpmndi:BPMNEdge id="Flow_Init_di" bpmnElement="Flow_Init">
        <di:waypoint x="136" y="318"/>
        <di:waypoint x="200" y="318"/>
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_Load_di" bpmnElement="Flow_Load">
        <di:waypoint x="300" y="318"/>
        <di:waypoint x="350" y="318"/>
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_Validate_di" bpmnElement="Flow_Validate">
        <di:waypoint x="450" y="318"/>
        <di:waypoint x="500" y="318"/>
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_LoadSuccess_di" bpmnElement="Flow_LoadSuccess">
        <di:waypoint x="550" y="318"/>
        <di:waypoint x="600" y="325"/>
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_LoadError_di" bpmnElement="Flow_LoadError">
        <di:waypoint x="530" y="343"/>
        <di:waypoint x="530" y="450"/>
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_SavePDF_di" bpmnElement="Flow_SavePDF">
        <di:waypoint x="1300" y="325"/>
        <di:waypoint x="1370" y="318"/>
      </bpmndi:BPMNEdge>
      
      <bpmndi:BPMNEdge id="Flow_End_di" bpmnElement="Flow_End">
        <di:waypoint x="1470" y="318"/>
        <di:waypoint x="1530" y="318"/>
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
  
  <!-- Error Definition -->
  <bpmn2:error id="PDF_LOAD_ERROR" name="PDF Load Error"/>
</bpmn2:definitions>`;

export const PDFInvoiceUpdaterProcess = {
  id: 'pdf-invoice-updater',
  name: 'PDF Invoice Updater',
  version: '1.0.0',
  type: 'atomic',
  
  // Process Metadata
  metadata: {
    author: 'Marcus',
    created: '2025',
    description: 'Overlays text updates on PDF invoices with yellow highlighting',
    category: 'pdf-manipulation',
    framework: 'Approach 3: Overlay Updates',
  },

  // BPMN Elements
  elements: [
    // Start Event
    {
      id: 'StartEvent_1',
      type: 'bpmn:StartEvent',
      name: 'Start PDF Update',
      position: { x: 100, y: 300 },
      outgoing: ['Flow_Init']
    },

    // Initialize Process
    {
      id: 'Initialize',
      type: 'bpmn:ScriptTask',
      name: 'Initialize PDF Invoice Updater',
      inputs: [
        'pdf_path',
        'updates',
        'config',
        'output_suffix'
      ],
      script: `
        // Initialize updater with configuration
        pdf_path = Path(pdf_path)
        updates = updates
        config = config or {}
        output_suffix = output_suffix or "_updated"
      `,
      position: { x: 200, y: 300 },
      incoming: ['Flow_Init'],
      outgoing: ['Flow_Load']
    },

    // Load PDF Document
    {
      id: 'LoadPDF',
      type: 'bpmn:ServiceTask',
      name: 'Load PDF Document',
      implementation: 'pymupdf.open',
      inputs: ['pdf_path'],
      outputs: ['document'],
      position: { x: 400, y: 300 },
      incoming: ['Flow_Load'],
      outgoing: ['Flow_Validate']
    },

    // Validate PDF Loaded
    {
      id: 'ValidatePDF',
      type: 'bpmn:ExclusiveGateway',
      name: 'PDF Loaded?',
      position: { x: 600, y: 300 },
      incoming: ['Flow_Validate'],
      outgoing: ['Flow_LoadSuccess', 'Flow_LoadError']
    },

    // Error Handling
    {
      id: 'HandleError',
      type: 'bpmn:EndEvent',
      name: 'Error: PDF Load Failed',
      errorCode: 'PDF_LOAD_ERROR',
      position: { x: 600, y: 450 },
      incoming: ['Flow_LoadError']
    },

    // Process Each Update
    {
      id: 'ForEachUpdate',
      type: 'bpmn:SubProcess',
      name: 'Process Each Update',
      triggeredByEvent: false,
      loopCharacteristics: {
        isSequential: true,
        collectionRef: 'updates'
      },
      position: { x: 800, y: 250 },
      incoming: ['Flow_LoadSuccess'],
      outgoing: ['Flow_SavePDF'],
      
      // Sub-process elements
      elements: [
        // Find Text Positions
        {
          id: 'FindTextPositions',
          type: 'bpmn:ServiceTask',
          name: 'Find Text Positions',
          implementation: 'page.search_for',
          inputs: ['search_text', 'document'],
          outputs: ['positions'],
          position: { x: 850, y: 200 }
        },

        // Apply Yellow Cover
        {
          id: 'ApplyYellowCover',
          type: 'bpmn:ScriptTask',
          name: 'Cover Old Text with Yellow Box',
          script: `
            padding = 2
            expanded_rect = Rect(
              rect.x0 - padding,
              rect.y0 - padding,
              rect.x1 + padding,
              rect.y1 + padding
            )
            page.draw_rect(expanded_rect, color=(1,1,0.85), fill=(1,1,0.85))
          `,
          position: { x: 1050, y: 200 },
          incoming: ['Flow_FindToCover']
        },

        // Overlay New Text
        {
          id: 'OverlayText',
          type: 'bpmn:ScriptTask',
          name: 'Overlay New Text',
          script: `
            point = Point(x, y)
            page.insert_text(
              point,
              new_text,
              fontsize=font_size,
              fontname=font_family,
              color=(0,0,0),
              render_mode=0
            )
          `,
          position: { x: 1250, y: 200 },
          incoming: ['Flow_CoverToOverlay']
        },

        // Check More Positions
        {
          id: 'CheckMorePositions',
          type: 'bpmn:ExclusiveGateway',
          name: 'More Positions?',
          position: { x: 1450, y: 200 },
          incoming: ['Flow_OverlayToCheck'],
          outgoing: ['Flow_NextPosition', 'Flow_UpdateComplete']
        }
      ]
    },

    // Save Updated PDF
    {
      id: 'SavePDF',
      type: 'bpmn:ServiceTask',
      name: 'Save Updated PDF',
      implementation: 'document.save',
      inputs: ['document', 'output_path'],
      outputs: ['saved_file'],
      position: { x: 1000, y: 300 },
      incoming: ['Flow_SavePDF'],
      outgoing: ['Flow_End']
    },

    // End Event
    {
      id: 'EndEvent_1',
      type: 'bpmn:EndEvent',
      name: 'PDF Updated Successfully',
      outputs: ['updated_pdf_path'],
      position: { x: 1200, y: 300 },
      incoming: ['Flow_End']
    }
  ],

  // Sequence Flows
  flows: [
    { id: 'Flow_Init', sourceRef: 'StartEvent_1', targetRef: 'Initialize' },
    { id: 'Flow_Load', sourceRef: 'Initialize', targetRef: 'LoadPDF' },
    { id: 'Flow_Validate', sourceRef: 'LoadPDF', targetRef: 'ValidatePDF' },
    { id: 'Flow_LoadSuccess', sourceRef: 'ValidatePDF', targetRef: 'ForEachUpdate', condition: 'PDF loaded successfully' },
    { id: 'Flow_LoadError', sourceRef: 'ValidatePDF', targetRef: 'HandleError', condition: 'PDF load failed' },
    { id: 'Flow_SavePDF', sourceRef: 'ForEachUpdate', targetRef: 'SavePDF' },
    { id: 'Flow_End', sourceRef: 'SavePDF', targetRef: 'EndEvent_1' },
    
    // Sub-process flows
    { id: 'Flow_FindToCover', sourceRef: 'FindTextPositions', targetRef: 'ApplyYellowCover' },
    { id: 'Flow_CoverToOverlay', sourceRef: 'ApplyYellowCover', targetRef: 'OverlayText' },
    { id: 'Flow_OverlayToCheck', sourceRef: 'OverlayText', targetRef: 'CheckMorePositions' },
    { id: 'Flow_NextPosition', sourceRef: 'CheckMorePositions', targetRef: 'FindTextPositions', condition: 'More positions exist' },
    { id: 'Flow_UpdateComplete', sourceRef: 'CheckMorePositions', targetRef: 'EndSubProcess', condition: 'All positions updated' }
  ],

  // Data Objects
  dataObjects: [
    {
      id: 'pdf_path',
      name: 'PDF File Path',
      type: 'String',
      state: 'Input'
    },
    {
      id: 'updates',
      name: 'Update Configurations',
      type: 'JSON Array',
      state: 'Input'
    },
    {
      id: 'output_suffix',
      name: 'Output Suffix',
      type: 'String',
      state: 'Input'
    },
    {
      id: 'document',
      name: 'PDF Document',
      type: 'pymupdf.Document',
      state: 'Internal'
    },
    {
      id: 'positions',
      name: 'Text Positions',
      type: 'List[Rect]',
      state: 'Internal'
    },
    {
      id: 'updated_pdf_path',
      name: 'Updated PDF Path',
      type: 'String',
      state: 'Output'
    }
  ],

  // Execution Logic
  execute: async (context) => {
    const { pdf_path, updates, output_suffix = '_updated' } = context;
    
    // Start process
    console.log(`Loading PDF: ${pdf_path}`);
    
    // Load PDF
    const document = await loadPDF(pdf_path);
    
    // Process each update
    for (const update of updates) {
      const { search, replace, font_size, offset } = update;
      
      // Find positions
      const positions = findTextPositions(document, search);
      
      // Apply updates
      for (const [page_num, pos, rect] of positions) {
        // Cover with yellow box
        coverOldText(page_num, rect);
        
        // Overlay new text
        overlayText(page_num, pos, replace, font_size);
      }
    }
    
    // Save updated PDF
    const output_path = savePDF(document, pdf_path, output_suffix);
    
    console.log(`Successfully created: ${output_path}`);
    return { updated_pdf_path: output_path };
  }
};

export default PDFInvoiceUpdaterProcess;

