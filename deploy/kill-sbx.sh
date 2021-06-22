#!/usr/bin/env bash

DIR="$( cd "$(dirname "$0" )" && pwd)"

export BVFLYNN_ENDPOINT="sbx-qa-us-east-1"

"${DIR}/kill.sh"
