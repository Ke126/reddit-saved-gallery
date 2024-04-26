#!/usr/bin/env bash

# Set path to your shared directory
shared_dir="./shared"

# List of project directories (replace with actual project names)
project_dirs=("./api" "./query" "./reddit")

# Loop through each project directory
for project in "${project_dirs[@]}"; do
    project_dir="${project}/src/shared"

    # Step 1: Delete contents of project/shared/
    rm -rf "$project_dir"/*

    # Step 2: Create hard links for each file in shared/
    for file in "$shared_dir"/*; do
        # Extract the filename (without path) from $file
        filename=$(basename "$file")

        # Create a hard link in project/shared/
        ln "$file" "$project_dir/$filename"
        echo "Hard link created for ${project}/src/shared/${filename}"
    done

    echo "Hard links created for ${project}!"
done