/**
 * Post-Execution Hook - Framework v2
 * Manages cleanup and state persistence after persona completion
 */

module.exports = function postExecution(context, result) {
    const persona = context.persona;
    const task = context.task;
    
    console.log(`[Post-Execution] Finalizing execution for ${persona}`);
    
    // Update persona state with execution results
    const statePath = `.cursor/agent_states/${persona}.json`;
    const state = loadState(statePath) || {};
    
    // Add execution record
    if (!state.executionHistory) {
        state.executionHistory = [];
    }
    
    state.executionHistory.push({
        timestamp: new Date().toISOString(),
        task,
        success: result.success,
        duration: result.duration,
        outputPath: result.outputPath
    });
    
    // Save state
    saveState(statePath, state);
    
    // Save task context if applicable
    if (task && result.output) {
        saveTaskContext(task, result.output);
    }
    
    // Log execution
    logExecution(persona, task, result);
    
    console.log(`[Post-Execution] Execution finalized for ${persona}`);
    
    return { context, result };
};

function loadState(path) {
    try {
        const fs = require('fs');
        if (fs.existsSync(path)) {
            return JSON.parse(fs.readFileSync(path, 'utf8'));
        }
    } catch (error) {
        console.error(`[Post-Execution] Error loading state from ${path}:`, error);
    }
    return null;
}

function saveState(path, state) {
    try {
        const fs = require('fs');
        const pathModule = require('path');
        const dir = pathModule.dirname(path);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(path, JSON.stringify(state, null, 2));
    } catch (error) {
        console.error(`[Post-Execution] Error saving state to ${path}:`, error);
    }
}

function saveTaskContext(task, output) {
    // Save task context to appropriate location
    const fs = require('fs');
    const path = require('path');
    
    const taskPath = path.join('project', 'dev', 'tasks', `${task}.md`);
    if (fs.existsSync(taskPath)) {
        // Append output to existing task file
        const existingContent = fs.readFileSync(taskPath, 'utf8');
        const updatedContent = `${existingContent}\n\n${output}`;
        fs.writeFileSync(taskPath, updatedContent);
    }
}

function logExecution(persona, task, result) {
    const fs = require('fs');
    const logPath = '.cursor/logs/execution.log';
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${persona} - ${task} - Success: ${result.success}\n`;
    
    try {
        fs.appendFileSync(logPath, logEntry);
    } catch (error) {
        console.error(`[Post-Execution] Error logging execution:`, error);
    }
}

