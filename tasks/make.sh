#!/usr/bin/env bash
set -e

FOLDER=$1
TARGET=$2

function show_usage {
    echo "Usage: $0 <folder> <target>";
    exit 1
}

if [[ $1 = '-h' || -z $FOLDER ]]; then
    show_usage
fi

if [[ ! -d "${FOLDER}" ]]; then
    echo "${FOLDER} doesn't exist."
    exit 1
fi

cd "${FOLDER}";

if [[ ! -e "${FOLDER}/Makefile" ]]; then
    echo "Makefile doesn't exist."
    exit 1
fi

make ${TARGET} 
