#!/bin/bash -x

# Copyright (C) 2014-2016 Honeyb.io - All Rights Reserved

function usage() {
  echo "usage: $0 host user"
  echo ""
  echo "This command gets the remote hostname of the BIG-IP."
  echo "Part of the honeyb.io command line suite for functions not supported by the"
  echo "F5 REST or SOAP api. The output is the destination file name."
  exit 1

}
if [ -z "$1" ]
  then
    echo "No host specified"
    usage
    return 1
fi

if [ -z "$2" ]
  then
    echo "No user specified"
    usage
    return 1
fi

HOSTNAME=$1
USER=$2
SSH_CMD=$(which ssh)


# Create ucs
${SSH_CMD} ${USER}@${HOSTNAME} 'echo $HOSTNAME'
