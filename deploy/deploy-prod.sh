#!/usr/bin/env bash
#
# @file Deploy to the prod environment.
#

# Get the current working directory.
DIR="$( cd "$(dirname "$0" )" && pwd)"

# Export the necessary environment variables for a production deployment.
export BVFLYNN_ENDPOINT="prod-us-east-1"

# Run the shared deployment script.
"${DIR}/deploy.sh"
