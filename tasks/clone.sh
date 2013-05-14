#!/usr/bin/env bash
set -e

REPOS=$1
BRANCH=$2
LOCALREPOS=$3

function show_usage {
    echo "Usage: $0 <repository> <branch> <local repository>";
    exit 1
}

if [[ $1 = '-h' || -z $LOCALREPOS || -z $BRANCH || -z REPOS ]]; then
    show_usage
fi

mkdir -p $LOCALREPOS

if [[ ! -d "$LOCALREPOS" ]]; then
    git clone "$REPOS" "$LOCALREPOS"
else
    cd "$LOCALREPOS"
    git remote update
    git checkout "$BRANCH"
    git checkout .
    git clean -f -d
    git pull
fi
