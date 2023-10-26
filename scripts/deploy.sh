#!/bin/bash

SCRIPT_PATH="${BASH_SOURCE:-$0}"
ABS_SCRIPT_PATH="$(realpath "${SCRIPT_PATH}")"
ABS_DIRECTORY="$(dirname "${ABS_SCRIPT_PATH}")"

cd "${ABS_DIRECTORY}/.."
rm -rf ./dist
npx next build --profile

aws s3 sync ./dist s3://jonrc-simulator


