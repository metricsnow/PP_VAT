# MCP Integration Setup

## Overview
This document describes how to integrate Git, Time, and Filesystem functionality into the Model Context Protocol (MCP) setup using official packages.

## Prerequisites
- `uvx` package manager (installed via `uv`)
- Git repository access
- MCP client (Cursor, Claude Desktop, etc.)

## Git MCP Server Integration

### Installation
The official `mcp-server-git` package can be run directly using `uvx` without separate installation:

```bash
uvx mcp-server-git --help
```

### Configuration
Add the following configuration to your MCP client settings file:

**For Cursor (.cursor/mcp-servers.json):**
```json
{
  "mcpServers": {
    "git": {
      "command": "uvx",
      "args": ["mcp-server-git", "--repository", "/path/to/your/git/repo"]
    }
  }
}
```

### Available Git Operations
- **`git_status`**: Shows the working tree status
- **`git_diff_unstaged`**: Shows changes in working directory not yet staged
- **`git_diff_staged`**: Shows changes that are staged for commit
- Repository cloning, branching, and commit operations

## Time MCP Server Integration

### Installation
The official `mcp-server-time` package can be run directly using `uvx`:

```bash
uvx mcp-server-time --help
```

### Configuration
Add the following configuration to your MCP client settings file:

**For Cursor (.cursor/mcp-servers.json):**
```json
{
  "mcpServers": {
    "time": {
      "command": "uvx",
      "args": [
        "mcp-server-time",
        "--local-timezone=Europe/Berlin"
      ]
    }
  }
}
```

### Available Time Operations
- **Current Time**: Get current time in specified timezone
- **Timezone Conversion**: Convert times between different timezones
- **Time Calculations**: Perform time-based calculations and comparisons
- **Date Formatting**: Format dates and times in various formats

## Filesystem MCP Server Integration

### Installation
The official `@modelcontextprotocol/server-filesystem` package is already configured:

```bash
npx @modelcontextprotocol/server-filesystem --help
```

### Configuration
The filesystem server is already configured in your MCP setup:

**For Cursor (.cursor/mcp-servers.json):**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "/Users/marcus/Coding_Framework"]
    }
  }
}
```

### Available Filesystem Operations
- **`read_file`**: Read the contents of a file
- **`write_file`**: Write content to a file
- **`edit_file`**: Edit a file with advanced pattern matching
- **`create_directory`**: Create a new directory
- **`list_directory`**: List contents of a directory
- **`move_file`**: Move or rename files and directories
- **`search_files`**: Search for files/directories using patterns
- **`get_file_info`**: Retrieve metadata of a file or directory

## Complete MCP Configuration

Your complete MCP configuration should look like this:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "${CONTEXT7_API_KEY}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "/Users/marcus/Coding_Framework"]
    },
    "git": {
      "command": "uvx",
      "args": ["mcp-server-git", "--repository", "/Users/marcus/Coding_Framework"]
    },
    "time": {
      "command": "uvx",
      "args": [
        "mcp-server-time",
        "--local-timezone=Europe/Berlin"
      ]
    }
  }
}
```

## Usage Examples

### Git Operations
```bash
# Check repository status
git_status("/Users/marcus/Coding_Framework")

# View unstaged changes
git_diff_unstaged("/Users/marcus/Coding_Framework")

# View staged changes
git_diff_staged("/Users/marcus/Coding_Framework")
```

### Time Operations
```bash
# Get current time
get_current_time()

# Convert timezone
convert_timezone("2024-01-01 12:00:00", "UTC", "Europe/Berlin")

# Calculate time difference
calculate_time_difference("2024-01-01", "2024-01-02")
```

### Filesystem Operations
```bash
# Read a file
read_file("/Users/marcus/Coding_Framework/README.md")

# List directory contents
list_directory("/Users/marcus/Coding_Framework")

# Search for files
search_files("/Users/marcus/Coding_Framework", "*.md")
```

## Troubleshooting

### Common Issues

1. **Permission Errors**
   - Ensure repository and file paths are accessible
   - Check Git repository permissions

2. **uvx Not Found**
   - Install `uv` package manager
   - Verify `uvx` is in your PATH

3. **Repository Not Found**
   - Verify the repository path is correct
   - Ensure the directory is a valid Git repository

4. **Timezone Issues**
   - Verify timezone format (e.g., "Europe/Berlin")
   - Check system timezone settings

### Debug Mode
Run with verbose logging:
```bash
uvx mcp-server-git --repository /path/to/repo --verbose
uvx mcp-server-time --local-timezone=Europe/Berlin
```

## Integration with Development Framework

The MCP servers integrate seamlessly with the development framework's workflow:

- **Mission Analyst**: Can analyze Git history, repository structure, and time-based data
- **Mission Planner**: Can plan tasks based on Git status, changes, and time constraints
- **Mission Executor**: Can execute Git operations, file operations, and time-based tasks
- **Mission-QA**: Can validate changes against Git history, file integrity, and time requirements

## Security Considerations

- Repository access is limited to the specified path
- Filesystem access is restricted to the specified directory
- No direct access to remote repositories without proper authentication
- All operations are performed locally on the specified paths
- Follow standard security practices for sensitive repositories and files

## References

- [Official MCP Documentation](https://modelcontextprotocol.io/)
- [Git MCP Server Package](https://pypi.org/project/mcp-server-git/)
- [Time MCP Server Package](https://pypi.org/project/mcp-server-time/)
- [Filesystem MCP Server Package](https://www.npmjs.com/package/@modelcontextprotocol/server-filesystem)
- [uv Package Manager](https://github.com/astral-sh/uv)
