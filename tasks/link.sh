#!/usr/bin/env bash
set -e
TO=$1
FROM=$2

function show_usage {
    echo "Usage: $0 <to> <from>";
    exit 1
}

if [[ $1 = "-h" || -z $TO || -z $FROM ]]; then
    show_usage
fi

mkdir -p `dirname $FROM`

ln -snf "$TO" "$FROM"