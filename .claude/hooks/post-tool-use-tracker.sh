#!/bin/bash
set -e

# Post-tool-use hook that tracks edited files
# Runs after Edit, MultiEdit, or Write tools complete

# Read tool information from stdin
tool_info=$(cat)

# Extract relevant data
tool_name=$(echo "$tool_info" | jq -r '.tool_name // empty')
file_path=$(echo "$tool_info" | jq -r '.tool_input.file_path // empty')
session_id=$(echo "$tool_info" | jq -r '.session_id // empty')

# Skip if not an edit tool or no file path
if [[ ! "$tool_name" =~ ^(Edit|MultiEdit|Write)$ ]] || [[ -z "$file_path" ]]; then
    exit 0
fi

# Skip markdown files in workthrough
if [[ "$file_path" =~ workthrough/.*\.md$ ]]; then
    exit 0
fi

# Create cache directory
cache_dir="$CLAUDE_PROJECT_DIR/.claude/cache/${session_id:-default}"
mkdir -p "$cache_dir"

# Function to detect component/section type
detect_section() {
    local file="$1"
    local project_root="$CLAUDE_PROJECT_DIR"
    local relative_path="${file#$project_root/}"

    case "$relative_path" in
        src/app/*)
            echo "pages"
            ;;
        src/components/*)
            echo "components"
            ;;
        src/lib/*)
            echo "lib"
            ;;
        src/types/*)
            echo "types"
            ;;
        public/*)
            echo "public"
            ;;
        *)
            echo "other"
            ;;
    esac
}

# Detect section
section=$(detect_section "$file_path")

# Log edited file
echo "$(date +%s):$file_path:$section" >> "$cache_dir/edited-files.log"

# Update affected sections list
if ! grep -q "^$section$" "$cache_dir/affected-sections.txt" 2>/dev/null; then
    echo "$section" >> "$cache_dir/affected-sections.txt"
fi

exit 0
