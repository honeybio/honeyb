#!/bin/bash -x

# Copyright (C) 2014-2015 Bespin Technologies Corp. - All Rights Reserved

function usage() {
  echo "usage: $0 host user ihealth-username ihealth-password"
  echo ""
  echo "This command generates a qkview and copies it to /tmp on the local machine."
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
IHEALTH_USER=$3
IHEALTH_PASS=$4
DATE=$(date +%Y%m%d)
SSH_CMD=$(which ssh)
SCP_CMD=$(which scp)
RSA_KEY=$HOME/.ssh/id_rsa
REMOVE_CMD=$(which rm)
QKVIEW_CMD="/usr/bin/qkview -f"
OUTPUT_DIR=/var/tmp
OUTPUT_FILENAME=$DATE.$HOSTNAME.qkview
LOCAL_TMPDIR=/tmp/
CURL_CMD=$(which curl)
COOKIE_FILE=/tmp/cookie_file.$$
CURL_UPLOAD_OPTS="-o - -F qkview=@${LOCAL_TMPDIR}/${OUTPUT_FILENAME} -F 'visible_in_gui=True'"
AUTH_URI="https://api.f5.com/auth/pub/sso/login/ihealth-api"
POST_URI="https://ihealth-api.f5.com/qkview-analyzer/api/qkviews"

# Create qkview
${SSH_CMD} ${USER}@${HOSTNAME} "${QKVIEW_CMD} ${OUTPUT_DIR}/${OUTPUT_FILENAME}"
if [ $? ne '0' ]
  then
    echo "qkview creation failed"
    return
fi

# Grab qkview
${SCP_CMD} ${USER}@${HOSTNAME}:${OUTPUT_DIR}/${OUTPUT_FILENAME} ${LOCAL_TMPDIR}
if [ $? ne '0' ]
  then
    echo "qkview copy failed"
    return
fi

# Delete from Device
${SSH_CMD} ${USER}@${HOSTNAME} "${REMOVE_CMD} ${OUTPUT_DIR}/${OUTPUT_FILENAME}"
if [ $? ne '0' ]
  then
    echo "qkview deletion failed"
    return
fi

#curl -H"Accept: application/vnd.f5.ihealth.api" --cookie cookiefile --cookie-jar cookiefile -o - -F qkview=@<location of tarball>

# Auth command
$CURL_CMD -H"Content-type: application/json" --cookie-jar ${COOKIE_FILE} -o - --data-ascii "{\"user_id\": \"${IHEALTH_USER}\", \"user_secret\": \"$IHEALTH_PASS\"}" ${AUTH_URI}
$CURL_CMD -H"Accept: application/vnd.f5.ihealth.api" --cookie ${COOKIE_FILE} --cookie-jar ${COOKIE_FILE} ${CURL_UPLOAD_OPTS} ${POST_URI}
rm -f ${LOCAL_TMPDIR}/${OUTPUT_FILENAME}
echo ${UPLOAD_OUT}
#echo "${OUTPUT_DIR}/${OUTPUT_FILENAME}"
