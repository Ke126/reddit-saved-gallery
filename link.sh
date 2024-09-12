#!/usr/bin/env bash

SHARED_DIR="./shared"
PROJECT_DIRS=("./api" "./query" "./reddit")

for PROJECT in "${PROJECT_DIRS[@]}"; do
    PROJECT_DIR="${PROJECT}/src/shared"

    # delete contents of $PROJECT_DIR
    rm -rf "$PROJECT_DIR"/*

    # create hard links for each file in ./shared
    for FILE in "$SHARED_DIR"/*; do
        FILENAME=$(basename "$FILE")
        ln "$FILE" "$PROJECT_DIR/$FILENAME"
        echo "Hard link created for ${PROJECT}/src/shared/${FILENAME}"
    done

    echo "Finished creating all hard links for ${PROJECT}"
done
