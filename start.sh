#!/bin/bash
set -ex

docker run --rm -it \
    --network host \
    -p 3000:3000 \
    -v $(pwd):$(pwd) \
    -w $(pwd) \
    node:18 yarn start