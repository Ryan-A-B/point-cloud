#!/bin/bash
set -ex

docker run --rm -it \
    -v $(pwd):$(pwd) \
    -w $(pwd) \
    node:18 /bin/bash