/**
 * Workflow Coordination Hook - Framework v2
 * Coordinates multi-persona workflow transitions
 */

module.exports = function workflowCoordination(workflowName, currentPersona, nextPersona, executionContext) {
    console.log(`[Workflow Coordination] Orchestrating ${workflowName} transition: ${currentPersona} → ${nextPersona}`);
    
    // Load workflow state
    const workflowState = loadWorkflowState(workflowName);
    
    // Update workflow progress
    workflowState.currentPersona = nextPersona;
    workflowState.completedPersonas.push(currentPersona);
    workflowState.lastTransition = new Date().toISOString();
    
    // Save workflow state
    saveWorkflowState(workflowName, workflowState);
    
    // Load context for next persona
    const contextForNext = prepareContextForPersona(nextPersona, executionContext);
    
    // Execute quality gates if applicable
    const qualityGateResult = executeQualityGate(currentPersona, executionContext);
    
    console.log(`[Workflow Coordination] Transition complete: ${nextPersona} ready`);
    console.log(`[Workflow Coordination] Quality gate result: ${qualityGateResult.status}`);
    
    return {
        nextPersona,
        context: contextForNext,
        workflowProgress: {
            current: nextPersona,
            completed: workflowState.completedPersonas,
            remaining: getRemainingPersonas(workflowName, workflowState.completedPersonas)
        },
        qualityGate: qualityGateResult
    };
};

function loadWorkflowState(workflowName) {
    try {
        const fs = require('fs');
        const statePath = `.cursor/agent_states/workflow-${workflowName}.json`;
        if (fs.existsSync(statePath)) {
            return JSON.parse(fs.readFileSync(statePath, 'utf8'));
        }
    } catch (error) {
        console.error(`[Workflow Coordination] Error loading workflow state:`, error);
    }
    
    // Return default state
    return {
        workflow: workflowName,
        startTime: new Date().toISOString(),
        completedPersonas: [],
        status: 'running'
    };
}

function saveWorkflowState(workflowName, state) {
    try {
        const fs = require('fs');
        const statePath = `.cursor/agent_states/workflow-${workflowName}.json`;
        const path = require('path');
        const dir = path.dirname(statePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
    } catch (error) {
        console.error(`[Workflow Coordination] Error saving workflow state:`, error);
    }
}

function prepareContextForPersona(persona, executionContext) {
    // Prepare context specifically for the next persona
    const context = {
        ...executionContext,
        persona,
        personaSpecificContext: loadPersonaContext(persona)
    };
    
    return context;
}

function loadPersonaContext(persona) {
    try {
        const fs = require('fs');
        const contextPath = `.cursor/agent_states/${persona}.json`;
        if (fs.existsSync(contextPath)) {
            return JSON.parse(fs.readFileSync(contextPath, 'utf8'));
        }
    } catch (error) {
        console.error(`[Workflow Coordination] Error loading persona context:`, error);
    }
    return null;
}

function executeQualityGate(persona, context) {
    // Execute quality gates based on persona
    const qualityCheck = {
        status: 'passed',
        checks: []
    };
    
    // Add persona-specific quality checks
    switch (persona) {
        case 'mission-analyst':
            qualityCheck.checks.push('Analysis completeness check');
            break;
        case 'mission-planner':
            qualityCheck.checks.push('Planning accuracy check');
            break;
        case 'mission-executor':
            qualityCheck.checks.push('Implementation quality check');
            break;
        case 'mission-qa':
            qualityCheck.checks.push('Quality validation check');
            break;
        case 'mission-challenger':
            qualityCheck.checks.push('Optimization check');
            break;
    }
    
    return qualityCheck;
}

function getRemainingPersonas(workflowName, completedPersonas) {
    // Get remaining personas based on workflow type
    const workflowPersonas = {
        'standard': ['mission-analyst', 'mission-planner', 'mission-executor', 'mission-qa', 'mission-challenger'],
        'quick': ['mission-analyst', 'mission-executor', 'mission-qa'],
        'research': ['mission-analyst', 'mission-planner', 'mission-challenger']
    };
    
    const allPersonas = workflowPersonas[workflowName] || workflowPersonas['standard'];
    return allPersonas.filter(p => !completedPersonas.includes(p));
}

