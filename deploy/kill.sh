#!/usr/bin/env bash
#
# The shared flynn delete script.
# This is an alias for a relatively easy command. We alias it to avoid human
# error, such as accidentally taking down prod.
#
# Environment Variables:
# BVFLYNN_ENDPOINT (ex: qa-us-east-1|prod-us-east-1)
# BVFLYNN_APP_SCOPE (ex: qa|prod)
#

set -o errexit
set -o nounset

# Lowercase the repo name to get the app name as that's what bvflynn does by default
APP_NAME="vh"
BVFLYNN_APP_SCOPE="${BVFLYNN_APP_SCOPE:-}"

if [ ! -z "${BVFLYNN_APP_SCOPE}" ]; then
    APP_NAME="${BVFLYNN_APP_SCOPE}-${APP_NAME}"
fi

flynn -c "${BVFLYNN_ENDPOINT}" -a "${APP_NAME}" delete
