#!/bin/bash

# Log
log() {
  CYAN='\033[0;36m'
  NONE='\033[0m'
  echo "${CYAN}$1${NONE}"
}

# Initialize ethql submodule
log "Initializing ethql submodule..."
git submodule update --init

# Install ethql dependencies
log "Installing ethql dependencies..."
cd lib/ethql && yarn

# Install client dependencies
log "Installing client dependencies..."
cd ../../client && yarn