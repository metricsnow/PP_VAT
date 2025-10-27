# Framework v2 Setup Guide

## Quick Setup

**One command to set up everything:**

```bash
./framework/scripts/setup.sh
```

That's it! The setup script will:
- ✅ Backup any existing configuration
- ✅ Create complete directory structure
- ✅ Copy all Framework v2 files
- ✅ Set up all personas and workflows
- ✅ Verify everything is working
- ✅ Display available commands

## What Gets Set Up

### Core Configuration
- `.cursorrules` - Framework rules and configuration
- `.cursorignore` - Files to ignore during indexing
- `.cursor/` - Complete Cursor configuration directory

### Directory Structure
```
project/
├── .cursor/                 # Cursor configuration
│   ├── agent_states/        # Persona state files
│   ├── commands/           # Command definitions
│   ├── rules/              # Persona-specific rules
│   ├── hooks/              # Workflow orchestration
│   ├── workflows/          # Workflow configurations
│   └── logs/               # Execution logs
└── project/dev/            # Development workspace (new projects only)
    ├── tasks/              # Enhancement tasks
    ├── bugs/               # Bug reports
    └── docs/               # Project documentation
```

### Available Commands

#### Persona Commands
- `/mission-analyst` - Deep research and analysis
- `/mission-planner` - Strategic planning and architecture  
- `/mission-executor` - Code implementation and testing
- `/mission-qa` - Quality assurance and validation
- `/mission-challenger` - Optimization and assumption validation

#### Workflow Commands
- `/workflow-standard` - Comprehensive 5-persona workflow
- `/workflow-quick` - Rapid 3-persona workflow
- `/workflow-research` - Research-focused workflow
- `/workflow-new-chat` - Intelligent file/folder analysis

#### Utility Commands
- `/publish` - Publish changes to GitHub
- `/bpmn-process-designer` - Create BPMN workflow diagrams

## Troubleshooting

### Setup Fails
If setup fails, check:
1. You're running from the `development_framework_v2` directory
2. You have write permissions to the project root
3. No processes are using the `.cursor` directory

### Verification Issues
The setup script includes automatic verification. If checks fail:
1. Check file permissions
2. Ensure all directories were created
3. Verify source files exist

### Backup Recovery
If you need to restore from backup:
1. Look for `.cursor-backup-YYYYMMDD-HHMMSS` directories
2. Copy the backup files back to project root
3. Re-run setup if needed

## Advanced Usage

### Custom Setup
If you need custom configuration:
1. Run `./scripts/setup.sh` first
2. Modify files in `.cursor/` as needed
3. Test with persona commands

### Development Mode
For development work:
1. Use `/workflow-new-chat` for intelligent analysis
2. Use `/mission-executor` for implementation
3. Use `/publish` to commit changes

## Next Steps

After setup:
1. **Test the framework**: Try `/mission-analyst` with a simple question
2. **Explore workflows**: Use `/workflow-quick` for rapid development
3. **Read documentation**: Check `docs/` for detailed guides
4. **Start developing**: Use `/workflow-new-chat` for file analysis

---

**🎉 That's it! Framework v2 is ready to use with a single, clear setup process.**