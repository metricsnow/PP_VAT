/**
 * Pre-Execution Hook - Framework v2
 * Prepares environment and context before persona activation
 */

module.exports = function preExecution(context) {
    const persona = context.persona;
    const task = context.task;
    
    console.log(`[Pre-Execution] Preparing environment for ${persona}`);
    
    // Load persona state
    const statePath = `.cursor/agent_states/${persona}.json`;
    const state = loadState(statePath) || {
        persona,
        sessionCount: 0,
        lastActivation: null,
        contextHistory: []
    };
    
    // Update state
    state.sessionCount++;
    state.lastActivation = new Date().toISOString();
    
    // Save state
    saveState(statePath, state);
    
    // Load context for task
    if (task) {
        const taskContext = loadTaskContext(task);
        context.taskContext = taskContext;
    }
    
    console.log(`[Pre-Execution] Environment ready for ${persona}`);
    
    return context;
};

function loadState(path) {
    try {
        const fs = require('fs');
        if (fs.existsSync(path)) {
            return JSON.parse(fs.readFileSync(path, 'utf8'));
        }
    } catch (error) {
        console.error(`[Pre-Execution] Error loading state from ${path}:`, error);
    }
    return null;
}

function saveState(path, state) {
    try {
        const fs = require('fs');
        const dir = require('path').dirname(path);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(path, JSON.stringify(state, null, 2));
    } catch (error) {
        console.error(`[Pre-Execution] Error saving state to ${path}:`, error);
    }
}

function loadTaskContext(task) {
    // Load task context from project dev directories
    const fs = require('fs');
    const path = require('path');
    
    const taskPath = path.join('project', 'dev', 'tasks', `${task}.md`);
    if (fs.existsSync(taskPath)) {
        return fs.readFileSync(taskPath, 'utf8');
    }
    
    return null;
}

