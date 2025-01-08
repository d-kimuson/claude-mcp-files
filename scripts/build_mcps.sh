#!/usr/bin/env bash

set -euxo pipefail

function npm_install_and_build() {
  local dir=$1

  pushd ./mcps/$dir
  npm ci
  npm run build
  popd
}

# npm_install_and_build "command-executor-mcp"
