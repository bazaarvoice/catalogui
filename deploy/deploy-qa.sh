#!/usr/bin/env bash
#
# @file Deploy to the qa environment.
#

# Get the current working directory.
DIR="$( cd "$(dirname "$0" )" && pwd)"

# Export the necessary environment variables for a qa deployment.
export BVFLYNN_ENDPOINT="qa-us-east-1"

# Run the shared deployment script.
"${DIR}/deploy.sh"
