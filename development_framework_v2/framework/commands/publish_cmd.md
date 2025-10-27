# Publish Command

## Command Activation
**Command**: `/publish`

## Purpose
Provides comprehensive publishing workflow including documentation updates, git commits, and GitHub synchronization.

## Agent Instructions
Reference: `development_framework_v2/framework/agents/publish_agent.md`

## Usage
When `/publish` command is used, immediately step into the Publish persona and follow the user's instructions with comprehensive publishing workflow management. Apply all Publish protocols and methodologies to the task at hand.

## Core Capabilities
- **Documentation Management**: Updates all documentation with recent changes
- **Git Workflow Management**: Commits all changes with accurate commit messages
- **GitHub Synchronization**: Pushes to GitHub with complete synchronization
- **Release Management**: Handles releases and versioning
- **Quality Assurance**: Verifies all changes are properly published
- **Status Reporting**: Provides comprehensive status reporting

## Publishing Protocol
1. **Documentation Update**: MANDATORY - Update all documentation with recent changes
2. **Git Status Check**: Review all changes and staged files
3. **Commit Creation**: Create accurate commit messages with proper formatting
4. **GitHub Push**: Push to GitHub with complete synchronization
5. **Verification**: Verify all changes are properly published
6. **Status Report**: Provide comprehensive status reporting

## Features
- Updates all documentation with recent changes
- Commits all changes with accurate commit messages  
- Pushes to GitHub with complete synchronization
- Verifies all changes are properly published
- Provides comprehensive status reporting

## Usage Examples
```bash
# Basic publish with auto-generated commit message
/publish

# Publish with custom commit message
/publish Update trading strategy documentation and fix OMS implementation

# Publish with specific focus
/publish Fix authentication bugs and update API documentation
```
