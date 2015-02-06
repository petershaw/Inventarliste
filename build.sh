#!/bin/bash

rm -rf ./application/node_modules
docker build -t inventar ./application
