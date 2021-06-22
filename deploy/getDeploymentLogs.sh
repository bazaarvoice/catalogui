#!/usr/bin/env bash
#
# @file Get the logs from live instances and copy them into the logs folders.
#
# The aggregated logs from a flynn deployment can be reached using the flynn
# log command:
#
# flynn -c <cluster> -a <app> log
#
# It's recommended to use the -r option to get the raw Bunyan logs. Omitting
# this flag will add a timestamp to each entry that will prevent Bunyan from
# parsing the log correctly, making it more difficult to read.
#
# It's also recommended to not tail the logs using the -f option. When tailing
# the logs, you only get what happens after running the log command, not
# before. This limits its usefulness.
#
# This script runs this flynn command with the -r flag for each environment.
# It then pipes the output into files in the logs folder.
#
# If a flynn deployment isn't up, it'll spit out an error when trying to get
# its log. This can be annoying, if say, dev isn't spun up. So we send errors
# to /dev/null.
#
# Environment Variables:
# BVFLYNN_APP_SCOPE (ex: qa|prod)
#

set -o errexit
set -o nounset

# Get the logs directory
DIR="$( cd "$( dirname "$0" )" && pwd)"
PROJECT_DIR="${DIR}/.."
LOGS_DIR="${PROJECT_DIR}/logs"
# Lowercase the repo name to get the app name as that's what bvflynn does by default
APP_NAME="$(basename `git rev-parse --show-toplevel` | tr '[:upper:]' '[:lower:]')"
BVFLYNN_APP_SCOPE="${BVFLYNN_APP_SCOPE:-}"

if [ ! -z "${BVFLYNN_APP_SCOPE}" ]; then
    APP_NAME="${BVFLYNN_APP_SCOPE}-${APP_NAME}"
fi

mkdir -p "${LOGS_DIR}"

# sbx logs
flynn -c sbx-qa-us-east-1 -a "${APP_NAME}" log -r > "${LOGS_DIR}/sbx.log" 2>/dev/null

# qa logs
flynn -c qa-us-east-1 -a "${APP_NAME}" log -r > "${LOGS_DIR}/qa.log" 2>/dev/null

# prod logs
flynn -c prod-us-east-1 -a "${APP_NAME}" log -r > "${LOGS_DIR}/prod.log" 2>/dev/null
