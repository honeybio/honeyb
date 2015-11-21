#!/bin/bash -x

# Copyright (C) 2014-2015 Bespin Technologies Corp. - All Rights Reserved

function usage() {
  echo "usage: $0 ihealth-user ihealth-password qkviewID"
  echo ""
  echo "This command checks ihealth for current qkviews and returns them to stdout."
  echo "Part of the honeyb.io command line suite for functions not supported by the"
  echo "F5 REST or SOAP api. The output is the JSON list of ids."
  return 1

}
if [ -z "$1" ]
  then
    echo "No user specified"
    usage
    return 1
fi

if [ -z "$2" ]
  then
    echo "No password specified"
    usage
    return 1
fi

if [ -z "$3" ]
  then
    echo "No qkview ID specified"
    usage
    return 1
fi

IHEALTH_USER=$1
IHEALTH_PASS=$2
QKVIEW_ID=$3
CURL_CMD=$(which curl)
COOKIE_FILE=/tmp/cookie_file.$$
AUTH_URI="https://api.f5.com/auth/pub/sso/login/ihealth-api"
LIST_URI="https://ihealth-api.f5.com/qkview-analyzer/api/qkviews"
META_URI="https://ihealth-api.f5.com/qkview-analyzer/api/qkviews/${QKVIEW_ID}"
DIAG_URI="https://ihealth-api.f5.com/qkview-analyzer/api/qkviews/${QKVIEW_ID}/diagnostics"

#curl -H"Accept: application/vnd.f5.ihealth.api" --cookie cookiefile --cookie-jar cookiefile -o - -F qkview=@<location of tarball>

# Auth command
$CURL_CMD -H"Content-type: application/json" --cookie-jar ${COOKIE_FILE} -o - --data-ascii "{\"user_id\": \"${IHEALTH_USER}\", \"user_secret\": \"$IHEALTH_PASS\"}" ${AUTH_URI}
$CURL_CMD -H"Accept: application/vnd.f5.ihealth.api+json" --cookie ${COOKIE_FILE} --cookie-jar ${COOKIE_FILE} ${LIST_URI} 2>/tmp/${QKVIEW_ID}.item.err
$CURL_CMD -H"Accept: application/vnd.f5.ihealth.api+json" --cookie ${COOKIE_FILE} --cookie-jar ${COOKIE_FILE} ${META_URI} > /tmp/${QKVIEW_ID}.meta.json 2>/tmp/${QKVIEW_ID}.meta.err
$CURL_CMD -H"Accept: application/vnd.f5.ihealth.api+json" --cookie ${COOKIE_FILE} --cookie-jar ${COOKIE_FILE} ${DIAG_URI} > /tmp/${QKVIEW_ID}.diag.json 2>/tmp/${QKVIEW_ID}.diag.err
