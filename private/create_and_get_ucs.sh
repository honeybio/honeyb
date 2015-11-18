#!/bin/bash -x

# Copyright (C) 2014-2015 Bespin Technologies Corp. - All Rights Reserved

function usage() {
  echo "usage: $0 host user"
  echo ""
  echo "This command generates a ucs and copies it to /tmp on the local machine."
  echo "Part of the honeyb.io command line suite for functions not supported by the"
  echo "F5 REST or SOAP api. The output is the destination file name."
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

HOSTNAME=$1
USER=$2
DATE=$(date +%Y%m%d)
SSH_CMD=$(which ssh)
SCP_CMD=$(which scp)
RSA_KEY=$HOME/.ssh/id_rsa
REMOVE_CMD=$(which rm)
UCS_CMD="tmsh save sys ucs"
OUTPUT_DIR=/var/tmp
OUTPUT_FILENAME=$DATE.$HOSTNAME.ucs
LOCAL_TMPDIR=/tmp

# Create ucs
${SSH_CMD} ${USER}@${HOSTNAME} "${UCS_CMD} ${OUTPUT_DIR}/${OUTPUT_FILENAME} > /dev/null 2>&1"
if [ $? ne '0' ]
  then
    echo "UCS creation failed"
    return 1
fi

# Grab ucs
${SCP_CMD} ${USER}@${HOSTNAME}:${OUTPUT_DIR}/${OUTPUT_FILENAME} ${LOCAL_TMPDIR}
if [ $? ne '0' ]
  then
    echo "UCS copy failed"
    return 2
fi

# Delete from Device
${SSH_CMD} ${USER}@${HOSTNAME} "${REMOVE_CMD} ${OUTPUT_DIR}/${OUTPUT_FILENAME}"
if [ $? ne '0' ]
  then
    echo "UCS deletion failed"
    return 3
fi
echo -n "$LOCAL_TMPDIR/$OUTPUT_FILENAME"
