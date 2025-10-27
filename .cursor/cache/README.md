# Cache Directory

## Purpose
This directory stores framework cache files for performance optimization.

## Usage
- **Performance Cache**: Cached computation results
- **Context Cache**: Cached context for persona switches
- **State Cache**: Cached state between executions

## Current Status
**Empty by design** - Cache files are automatically generated during framework usage.

## Framework Integration
Cache is used by:
- State management - Cached states between persona switches
- Performance optimization - Cached expensive operations
- Context management - Cached context for better performance

## Cache Management
- Cache files are automatically created
- Cache can be cleared by deleting files in this directory
- Cache is not version controlled (gitignored)

