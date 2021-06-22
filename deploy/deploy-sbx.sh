#!/usr/bin/env bash
#
# @file Deploy to the sbx environment.
#

# Get the current working directory.
DIR="$( cd "$(dirname "$0" )" && pwd)"

# Export the necessary environment variables for a sandbox qa deployment.
export BVFLYNN_ENDPOINT="sbx-qa-us-east-1"

# Run the shared deployment script.
"${DIR}/deploy.sh"
