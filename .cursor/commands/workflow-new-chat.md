# New Chat Workflow Command Reference

The `/workflow-new-chat` command activates the New Chat Workflow for intelligent file/folder analysis with automatic routing to enhancement or bug report workflows.

**Command Location**: `development_framework_v2/commands/workflow-new-chat.md`

**Workflow Router**: `development_framework_v2/src/workflows/new-chat-router.ts`

**BPMN Diagram**: `development_framework_v2/bpmn/new-chat-workflow-bpmn.js`

---

## **Command Usage**

### **Basic Syntax**
```bash
/workflow-new-chat [file_or_folder_path] [instruction]
```

### **Examples**

#### **File Analysis**
```bash
# Analyze a specific file for enhancement
/workflow-new-chat src/auth/login.js "Add password strength validation"

# Analyze a file for bug report
/workflow-new-chat src/api/users.js "Fix user creation error when email is null"
```

#### **Folder Analysis**
```bash
# Analyze entire folder for enhancements
/workflow-new-chat src/components "Add responsive design to all components"

# Analyze folder for bug reports
/workflow-new-chat tests "Fix failing authentication tests"
```

#### **Mixed Scenarios**
```bash
# Complex instruction with both bug and enhancement aspects
/workflow-new-chat src/database "Fix connection timeout issues and add connection pooling"
```

---

## **Workflow Process**

### **1. Mission Analyst Activation**
- **File/Folder Analysis**: Comprehensive analysis of provided content
- **Content Type Detection**: Determines if content is enhancement or bug report
- **Confidence Scoring**: Provides confidence level for routing decision
- **Reasoning**: Explains the analysis and routing decision

### **2. Intelligent Routing**
Based on Mission Analyst results, automatically routes to:

#### **Enhancement Path**
- **Personas**: Mission Analyst → Mission Planner
- **Target Folder**: `project/dev/tasks`
- **Output**: Enhancement tasks with implementation plan
- **Duration**: ~20 minutes

#### **Bug Report Path**
- **Personas**: Mission Analyst → Mission-QA
- **Target Folder**: `project/dev/bugs`
- **Output**: Bug report with classification and analysis
- **Duration**: ~18 minutes

#### **Mixed Path**
- **Personas**: Mission Analyst → Mission-QA → Mission Planner
- **Target Folders**: Both `project/dev/tasks` and `project/dev/bugs`
- **Output**: Both bug reports and enhancement tasks
- **Duration**: ~25 minutes

### **3. Automatic File Creation**
- **Task Files**: Created in `project/dev/tasks/` with format `TASK-XXX.md`
- **Bug Files**: Created in `project/dev/bugs/` with format `BUG-XXX.md`
- **Content**: Pre-populated with analysis results and structured templates

---

## **Analysis Intelligence**

### **Bug Report Detection**
The workflow detects bug reports based on:
- **Keywords**: bug, error, issue, problem, fix, broken, not working, failing, crash, exception, defect, fault, glitch
- **File Context**: Test files, error logs, configuration files
- **Instruction Patterns**: Problem descriptions, error reports, failure scenarios

### **Enhancement Detection**
The workflow detects enhancements based on:
- **Keywords**: enhance, improve, add, new feature, implement, create, develop, build, extend, upgrade, optimize, refactor
- **File Context**: Source code files, documentation files
- **Instruction Patterns**: Feature requests, improvement suggestions, new functionality

### **Confidence Scoring**
- **High Confidence (0.8-1.0)**: Clear indicators with strong context
- **Medium Confidence (0.6-0.8)**: Some indicators with moderate context
- **Low Confidence (0.4-0.6)**: Few indicators or unclear context
- **Default (0.5)**: Unclear intent, defaults to enhancement workflow

---

## **Output Files**

### **Task File Structure** (`project/dev/tasks/TASK-XXX.md`)
```markdown
# Enhancement Task

## Overview
- **File/Folder**: [path]
- **Instruction**: [user instruction]
- **Analysis**: [analysis reasoning]
- **Confidence**: [confidence score]

## Analysis Results
[Detailed analysis from Mission Analyst]

## Planning Results
[Implementation plan from Mission Planner]

## Suggested Actions
- [Action 1]
- [Action 2]
- [Action 3]

## Implementation Plan
[To be filled by Mission Planner]

## Status
- [ ] Analysis Complete
- [ ] Planning Complete
- [ ] Implementation Ready
```

### **Bug File Structure** (`project/dev/bugs/BUG-XXX.md`)
```markdown
# Bug Report

## Overview
- **File/Folder**: [path]
- **Description**: [user instruction]
- **Analysis**: [analysis reasoning]
- **Confidence**: [confidence score]

## Analysis Results
[Detailed analysis from Mission Analyst]

## QA Analysis Results
[Bug analysis from Mission-QA]

## Bug Classification
- **Severity**: [To be determined]
- **Priority**: [To be determined]
- **Category**: [To be determined]

## Reproduction Steps
[To be filled by Mission-QA]

## Expected Behavior
[To be filled by Mission-QA]

## Actual Behavior
[To be filled by Mission-QA]

## Status
- [ ] Analysis Complete
- [ ] Classification Complete
- [ ] Ready for Fix
```

---

## **Integration with Framework v2**

### **Persona Integration**
- **Mission Analyst**: Provides comprehensive file/folder analysis
- **Mission Planner**: Creates enhancement tasks and implementation plans
- **Mission-QA**: Analyzes bugs and creates bug reports

### **State Management**
- **Analysis State**: Stored in `.cursor/agent_states/mission-analyst.json`
- **Workflow Progress**: Tracked in `.cursor/workflows/new-chat_progress.json`
- **File Creation**: Logged in `.cursor/logs/execution.log`

### **Quality Gates**
- **Analysis Quality**: Mission Analyst analysis must meet quality standards
- **Routing Accuracy**: Confidence scoring must be above threshold
- **File Creation**: Generated files must be properly formatted and complete

---

## **Best Practices**

### **Effective Instructions**
- **Be Specific**: Provide clear, specific instructions
- **Include Context**: Mention relevant file types or project areas
- **Use Keywords**: Include relevant keywords for better detection
- **Provide Examples**: Give examples of expected behavior or issues

### **File/Folder Selection**
- **Single Files**: Use for specific feature or bug analysis
- **Folders**: Use for broader scope analysis
- **Relevant Paths**: Select paths relevant to the instruction
- **Complete Paths**: Provide complete relative paths from project root

### **Workflow Optimization**
- **Clear Intent**: Make your intent clear in the instruction
- **Appropriate Scope**: Choose appropriate file/folder scope
- **Follow-up**: Use generated files as starting points for further work
- **Review Results**: Always review analysis results for accuracy

---

## **Troubleshooting**

### **Low Confidence Scores**
- **Check Keywords**: Ensure instruction contains relevant keywords
- **Provide Context**: Add more context about the file/folder
- **Clarify Intent**: Make your intent more explicit
- **Use Examples**: Provide examples of expected behavior

### **Incorrect Routing**
- **Review Analysis**: Check Mission Analyst reasoning
- **Adjust Keywords**: Modify instruction with better keywords
- **Manual Override**: Use specific persona commands if needed
- **Mixed Workflow**: Use mixed workflow for complex scenarios

### **File Creation Issues**
- **Check Permissions**: Ensure write permissions to target folders
- **Verify Paths**: Confirm folder paths exist
- **Review Logs**: Check execution logs for errors
- **Manual Creation**: Create files manually if automatic creation fails

---

## **Advanced Usage**

### **Custom Analysis**
```bash
# Force specific analysis type
/workflow-new-chat src/auth "Analyze authentication system for security vulnerabilities" --type=security

# Request specific persona sequence
/workflow-new-chat src/api "Review API endpoints" --personas=analyst,qa,challenger
```

### **Batch Processing**
```bash
# Analyze multiple files
/workflow-new-chat src/components/*.js "Add error handling to all components"

# Analyze with specific patterns
/workflow-new-chat src/**/*.test.js "Fix all failing tests"
```

### **Integration with Other Workflows**
```bash
# Follow up with standard workflow
/workflow-new-chat src/auth "Add OAuth2 integration"
/workflow-standard Implement OAuth2 integration based on analysis

# Follow up with quick workflow
/workflow-new-chat src/utils "Fix date formatting bug"
/workflow-quick Fix date formatting based on bug report
```

---

## **Success Metrics**

- **Routing Accuracy**: 90%+ correct routing decisions
- **Analysis Quality**: 95%+ comprehensive analysis coverage
- **File Creation**: 100% successful file creation rate
- **User Satisfaction**: 9.0/10 workflow satisfaction score
- **Execution Time**: <5 minutes average execution time

---

**The New Chat Workflow provides intelligent, automated analysis and routing for the most common development scenario - starting fresh with file/folder analysis and getting appropriate tasks or bug reports created automatically.**
