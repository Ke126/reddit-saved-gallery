#!/usr/bin/env bash

DIRECTORY="./etc/letsencrypt/live/$DOMAIN"

# fail healthcheck if no certificate is found
if [[ ! -d "$DIRECTORY" || -z "$( ls -A $DIRECTORY )" ]]; then
    echo "No certificate for $DOMAIN found"
    exit 1
else
    echo "Found existing certificate for $DOMAIN"
    exit 0
fi