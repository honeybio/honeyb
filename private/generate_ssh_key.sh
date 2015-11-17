#!/bin/bash

# Generate honeyb's ssh_keys and import into DB
# Copyright (C) 2014-2015 Bespin Technologies Corp. - All Rights Reserved

function usage() {
  echo "usage: $0 file"
  echo ""
  echo "This command generates an ssh key pair for the non-rest functions"
  echo "Part of the honeyb.io command line suite for functions not supported by the"
  echo "F5 REST or SOAP api. The output is the destination public key."
  exit 1

}
if [ -z "$1" ]
  then
    echo "No file specified"
    usage
fi

FILE=$1

# Theoretical security risk to keep the old SSH key, so remove it
# and create a new one. Causes additional overhead if the pub key
# is already deployed, but we can have an import key function later

if [ -f $HOME/.ssh/$FILE ]
  then
    rm -f $HOME/.ssh/$FILE
    rm -f $HOME/.ssh/$FILE.pub
fi



SSHKEYGEN_CMD=$(which ssh-keygen)

$SSHKEYGEN_CMD -f $HOME/.ssh/$FILE -N '' 2>&1 > /dev/null

cat $HOME/.ssh/$FILE.pub | tr -d '\n'
