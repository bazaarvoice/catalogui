#!/usr/bin/env bash

DIR="$( cd "$(dirname "$0" )" && pwd)"

export BVFLYNN_ENDPOINT="prod-us-east-1"

"${DIR}/kill.sh"
