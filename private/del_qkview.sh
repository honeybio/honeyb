#!/bin/bash -x

# Copyright (C) 2014-2015 Bespin Technologies Corp. - All Rights Reserved

function usage() {
  echo "usage: $0 ihealth-user ihealth-password qkviewID"
  echo ""
  echo "This command deletes a specified qkview from ihealth."
  echo "Part of the honeyb.io command line suite for functions not supported by the"
  echo "F5 REST or SOAP api. The output is the JSON list of ids."
  return 1

}
if [ -z "$1" ]
  then
    echo "No user specified"
    usage
fi

if [ -z "$2" ]
  then
    echo "No password specified"
    usage
fi

if [ -z "$3" ]
  then
    echo "No qkview ID specified"
    usage
fi

IHEALTH_USER=$1
IHEALTH_PASS=$2
QKVIEW_ID=$3
CURL_CMD=$(which curl)
COOKIE_FILE=/tmp/cookie_file.$$
AUTH_URI="https://api.f5.com/auth/pub/sso/login/ihealth-api"
QKVIEW_URI="https://ihealth-api.f5.com/qkview-analyzer/api/qkviews"

#curl -X DELETE -H"Accept: application/vnd.f5.ihealth.api" --user-agent "MyGreatiHealthClient" --cookie cookiefile --cookie-jar cookiefile -o - https://ihealth-api.f5.com/qkview-analyzer/api/qkviews

# Auth command
$CURL_CMD -H"Content-type: application/json" --cookie-jar ${COOKIE_FILE} -o - --data-ascii "{\"user_id\": \"${IHEALTH_USER}\", \"user_secret\": \"$IHEALTH_PASS\"}" ${AUTH_URI}
$CURL_CMD -X DELETE -H"Accept: application/vnd.f5.ihealth.api+json" --cookie ${COOKIE_FILE} --cookie-jar ${COOKIE_FILE} ${LIST_URI} 2>/tmp/${QKVIEW_ID}.del.err
