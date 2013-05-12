#!/usr/bin/env bash
set -e
LOCALREPOS=$1
BRANCH=$2
TARGET=$3

function show_usage {
    echo "Usage: $0 <local repository> <branch> <target>";
    exit 1
}

if [[ $1 = "-h" || -z $TARGET || -z $BRANCH || -z $LOCALREPOS ]]; then
    show_usage
fi

cd $LOCALREPOS;

TMPTARGET="${TARGET}".TMP

mkdir -p "$TARGET";

git archive "$BRANCH" | tar -x -C "$TARGET"

if [[ ${PIPESTATUS[0]} != 0 ]];then
    exit 1;
fi

