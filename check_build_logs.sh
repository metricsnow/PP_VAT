#!/bin/bash
# Script to check Cloud Build logs

echo "Checking recent Cloud Build logs..."
echo ""

# Get the most recent build
RECENT_BUILD=$(gcloud builds list --limit 1 --format="value(id)")

if [ -z "$RECENT_BUILD" ]; then
    echo "No builds found."
    exit 1
fi

echo "Most recent build ID: $RECENT_BUILD"
echo ""

# Get logs for the most recent build
gcloud builds log $RECENT_BUILD

