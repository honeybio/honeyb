#!/bin/bash

# Add ssh key to device for UCS & QKview operations
# Copyright (C) 2014-2015 Bespin Technologies Corp. - All Rights Reserved

function usage() {
  echo "usage: $0 host user password pubkey"
  echo ""
  echo "This command copies an ssh key to a device for passwordless connections"
  echo "Part of the honeyb.io command line suite for functions not supported by the"
  echo "F5 REST or SOAP api. The output is the destination public key."
  exit 1

}
if [ -z "$1" ]
  then
    echo "No host specified"
    usage
fi

if [ -z "$2" ]
  then
    echo "No user specified"
    usage
fi

if [ -z "$3" ]
  then
    echo "No password specified"
    usage
fi

if [ -z "$4" ]
  then
    echo "No public key specified"
    usage
fi

HOST=$1
USER=$2
PASS=$3
PUBKEY=$4

SSHKEYSCAN=$(which ssh-keyscan)
SSHPASS=$(which sshpass)
SSH_CMD=$(which ssh)
COPY_CMD="echo \"$PUBKEY\" >> /root/.ssh/authorized_keys"

# Add the key to the local known_hosts file
$SSHKEYSCAN $HOST >> ~/.ssh/known_hosts
$SSHPASS -p $PASS $SSH_CMD $USER@$HOST $COPY_CMD
echo -n $?
