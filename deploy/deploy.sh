#!/usr/bin/env bash
#
# The shared bvflynn deployment script.
# Downloads bvflynn if needed, exports needed environment variables,
# and deploys the application.
#
# Environment Variables:
# BVFLYNN_TEAM (ex: firebird-devs@bazaarvoice.com)
# BVFLYNN_ENDPOINT (ex: qa-us-east-1|prod-us-east-1)
# BVFLYNN_APP_SCOPE (ex: qa|prod)
#

set -o errexit
set -o nounset

# Set the current working directory and the project root directory.
DIR="$( cd "$( dirname "$0" )" && pwd)"
PROJECT_DIR="${DIR}/.."

# If the bvflynn command isn't available, go download bvflynn from S3.
if ! command -v bvflynn; then
    curl -sL https://s3.amazonaws.com/bvflynn/bin/bvflynn-bootstrap | bash
fi

# --------------------------------------------------------------------------
# Export Flynn-related variables.
# --------------------------------------------------------------------------

# These declarations just ensure that these variables have been exported outside
# this function, i.e. in a Jenkins job.
export BVFLYNN_TEAM="globalplatformservices@bazaarvoice.com"
export BVFLYNN_ENDPOINT="${BVFLYNN_ENDPOINT}"
export BVFLYNN_APP_SCOPE="${BVFLYNN_APP_SCOPE:-}"
export BVFLYNN_APP="catalogui"

# --------------------------------------------------------------------------
# Run the deployment.
# --------------------------------------------------------------------------
cd "${PROJECT_DIR}"

# Actually deploy the application.
bvflynn push

# Add metadata for what version of the app was just deployed.
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
REVISION="$(git rev-parse --short HEAD)"

flynn -c "${BVFLYNN_ENDPOINT}" meta set version="$BRANCH:$REVISION"
