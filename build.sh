#!/bin/sh
currentWorkingDir=`pwd`
cd ~/projects/carmi
node $NODE_DEBUG_OPTION /Users/davidsu/projects/carmi/bin/carmi --no-cache --debug --format iife --source /Users/davidsu/projects/tmp/carmi-playground/carmiShit.carmi.js
cd $pwd
