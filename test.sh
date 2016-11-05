#!/bin/bash -e

export RES_REPO=bat-repo
export RES_PARAMS=$1

setupTestEnv() {
  echo "Starting Testing Env setup" $RES_REPO
  pushd /build/IN/$RES_REPO/gitRepo
  npm install
  popd

  pushd /build/IN/$RES_PARAMS
  ls -al
  cat version.json
  popd

  echo "Completed Testing Env setup" $RES_REPO
}


main() {
  setupTestEnv
}

main
