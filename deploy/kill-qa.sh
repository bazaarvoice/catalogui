#!/usr/bin/env bash

DIR="$( cd "$(dirname "$0" )" && pwd)"

export BVFLYNN_ENDPOINT="qa-us-east-1"

"${DIR}/kill.sh"
