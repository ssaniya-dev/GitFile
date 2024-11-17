#!/bin/bash
DEST_FOLDER="/home/azureuser/GitFile/backend/pdf.js/web"

if [ $# -eq 0 ]; then
    echo "Error: File name is required."
    exit 1
fi

FILE_NAME=$1

cp "$FILE_NAME" "$DEST_FOLDER"

echo "Visit https://editor.gitfile.tech/web/viewer.html?file=$(basename "$FILE_NAME") to edit your PDF"