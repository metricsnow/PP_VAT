#!/bin/bash

# Framework v2 - Single Setup Script
# One script to rule them all - complete framework setup and verification

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory and framework root
# Setup runs from development_framework_v2 directory
# PROJECT_ROOT is where the script is run from (the parent directory)
CURRENT_DIR="$(pwd)"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRAMEWORK_DIR="$(dirname "$SCRIPT_DIR")"  # Go up from framework/scripts/ to framework/

# If we're in development_framework_v2, PROJECT_ROOT is parent
# Otherwise, use current directory as PROJECT_ROOT
if [[ "$CURRENT_DIR" == *"/development_framework_v2" ]]; then
    PROJECT_ROOT="$(dirname "$CURRENT_DIR")"
else
    PROJECT_ROOT="$CURRENT_DIR"
fi

echo -e "${BLUE}🚀 Framework v2 - Complete Setup${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Function to print status
print_status() {
    local status="$1"
    local message="$2"
    if [ "$status" = "success" ]; then
        echo -e "${GREEN}✅ $message${NC}"
    elif [ "$status" = "warning" ]; then
        echo -e "${YELLOW}⚠️  $message${NC}"
    elif [ "$status" = "error" ]; then
        echo -e "${RED}❌ $message${NC}"
    else
        echo -e "${BLUE}ℹ️  $message${NC}"
    fi
}

# Function to check if running from correct directory
check_directory() {
    if [ ! -f "$FRAMEWORK_DIR/docs/readme_doc.md" ]; then
        print_status "error" "Please run this script from the development_framework_v2 directory"
        echo "Current directory: $(pwd)"
        echo "Expected framework directory: $FRAMEWORK_DIR"
        exit 1
    fi
    print_status "success" "Running from correct directory"
}

# Function to detect setup mode
detect_setup_mode() {
    if [ -d "$PROJECT_ROOT/.cursor" ]; then
        print_status "info" "Existing Framework setup detected - update mode"
    else
        print_status "info" "Fresh installation detected"
    fi
}

# Function to clean existing setup
clean_existing() {
    print_status "info" "Cleaning existing setup..."
    
    # Remove existing .cursor directory
    if [ -d "$PROJECT_ROOT/.cursor" ]; then
        rm -rf "$PROJECT_ROOT/.cursor"
        print_status "success" "Removed existing .cursor directory"
    fi
    
    # DO NOT remove .cursorrules and .cursorignore - they are needed for Cursor
    if [ -f "$PROJECT_ROOT/.cursorrules" ]; then
        print_status "info" "Keeping existing .cursorrules"
    fi
    
    if [ -f "$PROJECT_ROOT/.cursorignore" ]; then
        print_status "info" "Keeping existing .cursorignore"
    fi
}

# Function to create directory structure
create_directories() {
    print_status "info" "Creating directory structure..."
    
    # Create .cursor directory structure at PROJECT_ROOT
    mkdir -p "$PROJECT_ROOT/.cursor"/{agent_states,commands,rules,templates,hooks,logs,workflows,cache}
    
    # Only create project directories if project folder doesn't already exist
    if [ ! -d "$PROJECT_ROOT/project" ]; then
        print_status "info" "Creating project directory structure"
        mkdir -p "$PROJECT_ROOT"/project/{dev/{tasks,bugs},docs}
        print_status "success" "Created project directory at $PROJECT_ROOT/project"
    else
        print_status "info" "Project folder already exists - framework update mode"
        print_status "info" "Only updating .cursor framework configuration"
    fi
    
    print_status "success" "Directory structure created"
}

# Function to copy framework files
copy_framework_files() {
    print_status "info" "Copying Framework v2 files..."
    
    # Copy commands directory from framework/commands to .cursor/commands
    if [ -d "$FRAMEWORK_DIR/commands" ]; then
        cp -r "$FRAMEWORK_DIR/commands/"* "$PROJECT_ROOT/.cursor/commands/" 2>/dev/null || true
        print_status "success" "Copied commands directory"
    else
        print_status "error" "Commands directory not found in framework"
    fi
    
    # Copy hooks README if it exists
    if [ -f "$FRAMEWORK_DIR/hooks/README.md" ]; then
        cp "$FRAMEWORK_DIR/hooks/README.md" "$PROJECT_ROOT/.cursor/hooks/" 2>/dev/null || true
        print_status "info" "Copied hooks README"
    fi
    
    # Copy templates README if it exists
    if [ -f "$FRAMEWORK_DIR/templates/README.md" ]; then
        cp "$FRAMEWORK_DIR/templates/README.md" "$PROJECT_ROOT/.cursor/templates/" 2>/dev/null || true
        print_status "info" "Copied templates README"
    fi
    
    # Copy workflows README if it exists
    if [ -f "$FRAMEWORK_DIR/workflows/README.md" ]; then
        cp "$FRAMEWORK_DIR/workflows/README.md" "$PROJECT_ROOT/.cursor/workflows/" 2>/dev/null || true
        print_status "info" "Copied workflows README"
    fi
    
    # Copy cache README if it exists
    if [ -f "$FRAMEWORK_DIR/cache/README.md" ]; then
        cp "$FRAMEWORK_DIR/cache/README.md" "$PROJECT_ROOT/.cursor/cache/" 2>/dev/null || true
        print_status "info" "Copied cache README"
    fi
    
    # Copy agent_states README if it exists
    if [ -f "$FRAMEWORK_DIR/agent_states/README.md" ]; then
        cp "$FRAMEWORK_DIR/agent_states/README.md" "$PROJECT_ROOT/.cursor/agent_states/" 2>/dev/null || true
        print_status "info" "Copied agent_states README"
    fi
    
    # Copy BPMN workflow files from framework/bpmn to .cursor/workflows
    if [ -d "$FRAMEWORK_DIR/bpmn" ]; then
        cp "$FRAMEWORK_DIR/bpmn"/*.js "$PROJECT_ROOT/.cursor/workflows/" 2>/dev/null || true
        print_status "success" "Copied BPMN workflow files"
    fi
    
    # Copy hooks from framework/hooks to .cursor/hooks (exclude README)
    if [ -d "$FRAMEWORK_DIR/hooks" ]; then
        cp "$FRAMEWORK_DIR/hooks"/*.js "$PROJECT_ROOT/.cursor/hooks/" 2>/dev/null || true
        print_status "success" "Copied hook files"
    fi
    
    # Copy templates from framework/templates to .cursor/templates (exclude README)
    if [ -d "$FRAMEWORK_DIR/templates" ]; then
        cp "$FRAMEWORK_DIR/templates"/*.md "$PROJECT_ROOT/.cursor/templates/" 2>/dev/null || true
        print_status "success" "Copied template files"
    fi
    
    # Copy rules from framework/rules to .cursor/rules (if directory exists)
    if [ -d "$FRAMEWORK_DIR/rules" ]; then
        cp "$FRAMEWORK_DIR/rules"/*.mdc "$PROJECT_ROOT/.cursor/rules/" 2>/dev/null || true
        print_status "success" "Copied rule files"
    fi
    
    # Create placeholder rule files if they don't exist yet (for backward compatibility)
    for persona in mission-analyst mission-planner mission-executor mission-qa mission-challenger; do
        if [ ! -f "$PROJECT_ROOT/.cursor/rules/${persona}.mdc" ]; then
            echo "# ${persona} rules" > "$PROJECT_ROOT/.cursor/rules/${persona}.mdc"
        fi
    done
    print_status "success" "Ensured all persona rule files exist"
    
    # Create core .cursor configuration files if they don't exist
    create_core_config() {
        local file="$1"
        local content="$2"
        
        if [ -f "$PROJECT_ROOT/.cursor/$file" ]; then
            print_status "info" "$file already exists"
            return 0
        fi
        
        # Create new file
        echo "$content" > "$PROJECT_ROOT/.cursor/$file"
        print_status "success" "Created $file"
    }
    
    # Create indexing.json
    create_core_config "indexing.json" "$(cat << 'INDEXING_EOF'
{
  "includes": [
    "**/*.{js,jsx,ts,tsx,py,md,css,html,json,yaml,yml}",
    "**/*.d.ts"
  ],
  "excludes": [
    "node_modules/**",
    "dist/**",
    "build/**",
    ".git/**",
    ".cursor/**",
    "development_framework/**",
    "development_framework_v2/**",
    "**/*.min.js",
    "**/*.map",
    "coverage/**",
    ".nyc_output/**"
  ],
  "maxFileSize": 50000,
  "contextWindow": 200000
}
INDEXING_EOF
)"
    
    # Create memories.json
    local init_date=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    cat > "$PROJECT_ROOT/.cursor/memories.json" << EOFMEM
{
  "framework": {
    "version": "2.0",
    "initialized": "$init_date",
    "status": "production-ready"
  },
  "patterns": {
    "code_organization": "Feature-based with atomic task system",
    "documentation_standard": "Google-style docstrings, comprehensive markdown",
    "testing_approach": "Unit tests with 90%+ coverage",
    "security_standard": "OWASP compliant with input validation"
  },
  "preferences": {
    "prefer_functional_components": true,
    "use_type_annotations": true,
    "prefer_async_await": true,
    "logging_level": "info"
  }
}
EOFMEM
    print_status "success" "Created memories.json"
    
    # Create mcp-servers.json with actual path
    cat > "$PROJECT_ROOT/.cursor/mcp-servers.json" << EOFMCP
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "\${CONTEXT7_API_KEY}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "$PROJECT_ROOT"]
    },
    "git": {
      "command": "uvx",
      "args": ["mcp-server-git", "--repository", "$PROJECT_ROOT"]
    },
    "time": {
      "command": "uvx",
      "args": [
        "mcp-server-time",
        "--local-timezone=America/Los_Angeles"
      ]
    }
  }
}
EOFMCP
    print_status "success" "Created mcp-servers.json"
    
    # Create model-strategy.md
    create_core_config "model-strategy.md" "$(cat << 'STRATEGY_EOF'
# Model Selection Strategy

## Intelligent LLM Selection

This document defines the model selection strategy for Framework v2.

## Selection Criteria

### Task Complexity
- **Simple Tasks**: Use Claude 3.5 Sonnet (fast, cost-effective)
- **Medium Tasks**: Use GPT-4 Turbo (balanced performance)
- **Complex Tasks**: Use Claude 3 Opus (highest quality)

### Task Type
- **Code Implementation**: Prefer GPT-4 Turbo (coding expertise)
- **Analysis & Research**: Prefer Claude 3.5 Sonnet (deep reasoning)
- **Quick Fixes**: Prefer Claude 3.5 Sonnet (speed)
- **Architecture**: Prefer Claude 3 Opus (strategic thinking)

### Context Requirements
- **Small Context (<10k tokens)**: All models
- **Medium Context (10k-100k tokens)**: GPT-4 Turbo, Claude 3.5 Sonnet
- **Large Context (>100k tokens)**: Claude 3.5 Sonnet, Claude 3 Opus

## Default Model
**Claude 3.5 Sonnet** - Best balance of performance, speed, and cost

## Model Priority
1. Claude 3.5 Sonnet (default)
2. GPT-4 Turbo (coding tasks)
3. Claude 3 Opus (complex reasoning)
STRATEGY_EOF
)"
    
    # Create log files
    touch "$PROJECT_ROOT/.cursor/logs"/{execution.log,quality_gate_results.log,quality_gate_successes.log,quality_gate_failures.log} 2>/dev/null || true
    print_status "success" "Created log files"
}

# Function removed - hooks are now copied from framework/hooks/

# Function to set permissions
set_permissions() {
    print_status "info" "Setting permissions..."
    
    # Make scripts executable
    chmod +x "$PROJECT_ROOT/.cursor/hooks"/*.js 2>/dev/null || true
    
    print_status "success" "Permissions set"
}

# Function to verify setup
verify_setup() {
    print_status "info" "Verifying setup..."
    
    local total_checks=0
    local passed_checks=0
    
    # Function to run a check
    run_check() {
        local description="$1"
        local command="$2"
        
        total_checks=$((total_checks + 1))
        
        if eval "$command" >/dev/null 2>&1; then
            print_status "success" "$description"
            passed_checks=$((passed_checks + 1))
        else
            print_status "error" "$description"
        fi
    }
    
    echo ""
    echo -e "${BLUE}📋 Verification Results:${NC}"
    echo "========================"
    
    # Check core files
    run_check "Root .cursorrules exists" "[ -f '$PROJECT_ROOT/.cursorrules' ]"
    run_check "Root .cursorignore exists" "[ -f '$PROJECT_ROOT/.cursorignore' ]"
    run_check ".cursor directory exists" "[ -d '$PROJECT_ROOT/.cursor' ]"
    
    # Check directories
    run_check "Agent states directory exists" "[ -d '$PROJECT_ROOT/.cursor/agent_states' ]"
    run_check "Commands directory exists" "[ -d '$PROJECT_ROOT/.cursor/commands' ]"
    run_check "Rules directory exists" "[ -d '$PROJECT_ROOT/.cursor/rules' ]"
    run_check "Hooks directory exists" "[ -d '$PROJECT_ROOT/.cursor/hooks' ]"
    run_check "Workflows directory exists" "[ -d '$PROJECT_ROOT/.cursor/workflows' ]"
    run_check "Logs directory exists" "[ -d '$PROJECT_ROOT/.cursor/logs' ]"
    
    # Check key files - using PROJECT_ROOT which is development_framework_v2
    run_check "Mission Analyst rules exist" "[ -f '$PROJECT_ROOT/.cursor/rules/mission-analyst.mdc' ]"
    run_check "Mission Planner rules exist" "[ -f '$PROJECT_ROOT/.cursor/rules/mission-planner.mdc' ]"
    run_check "Mission Executor rules exist" "[ -f '$PROJECT_ROOT/.cursor/rules/mission-executor.mdc' ]"
    run_check "Mission-QA rules exist" "[ -f '$PROJECT_ROOT/.cursor/rules/mission-qa.mdc' ]"
    run_check "Mission Challenger rules exist" "[ -f '$PROJECT_ROOT/.cursor/rules/mission-challenger.mdc' ]"
    
    # Check core configuration files
    run_check "indexing.json exists" "[ -f '$PROJECT_ROOT/.cursor/indexing.json' ]"
    run_check "memories.json exists" "[ -f '$PROJECT_ROOT/.cursor/memories.json' ]"
    run_check "mcp-servers.json exists" "[ -f '$PROJECT_ROOT/.cursor/mcp-servers.json' ]"
    run_check "model-strategy.md exists" "[ -f '$PROJECT_ROOT/.cursor/model-strategy.md' ]"
    
    # Check project directories (only if they exist)
    if [ -d "$PROJECT_ROOT/project" ]; then
        run_check "Project tasks directory exists" "[ -d '$PROJECT_ROOT/project/dev/tasks' ]"
        run_check "Project bugs directory exists" "[ -d '$PROJECT_ROOT/project/dev/bugs' ]"
        run_check "Project docs directory exists" "[ -d '$PROJECT_ROOT/project/docs' ]"
    else
        print_status "info" "Skipping project directory checks (existing project integration)"
    fi
    
    echo ""
    echo -e "${BLUE}📊 Setup Results:${NC}"
    echo "=================="
    echo "Total checks: $total_checks"
    echo "Passed checks: $passed_checks"
    echo "Failed checks: $((total_checks - passed_checks))"
    
    if [ $passed_checks -eq $total_checks ]; then
        print_status "success" "All checks passed! Framework v2 setup complete."
        return 0
    else
        print_status "error" "Some checks failed. Please review the errors above."
        return 1
    fi
}

# Function to display completion message
display_completion() {
    echo ""
    echo -e "${GREEN}🎉 Framework v2 Setup Complete!${NC}"
    echo -e "${GREEN}===============================${NC}"
    echo ""
    echo -e "${BLUE}📋 Available Commands:${NC}"
    echo "  /mission-analyst    - Activate Mission Analyst persona"
    echo "  /mission-planner    - Activate Mission Planner persona"
    echo "  /mission-executor   - Activate Mission Executor persona"
    echo "  /mission-qa         - Activate Mission-QA persona"
    echo "  /mission-challenger - Activate Mission Challenger persona"
    echo ""
    echo -e "${BLUE}🔄 Available Workflows:${NC}"
    echo "  /workflow-standard  - Execute standard 5-persona workflow"
    echo "  /workflow-quick     - Execute quick 3-persona workflow"
    echo "  /workflow-research  - Execute research-focused workflow"
    echo "  /workflow-new-chat  - Intelligent file/folder analysis workflow"
    echo ""
    echo -e "${BLUE}📚 Documentation:${NC}"
    echo "  README_doc.md       - Framework overview and usage"
    echo "  development_framework_v2/docs/ - Comprehensive documentation"
    echo "  .cursor/rules/      - Persona-specific rules"
    echo "  .cursor/hooks/      - Workflow orchestration hooks"
    echo ""
    echo -e "${GREEN}🚀 Ready to start development with Framework v2!${NC}"
    echo ""
}

# Main execution
main() {
    check_directory
    detect_setup_mode
    clean_existing
    create_directories
    copy_framework_files
    set_permissions
    
    if verify_setup; then
        display_completion
        exit 0
    else
        print_status "error" "Setup verification failed. Please check the errors above."
        exit 1
    fi
}

# Run main function
main "$@"
