#!/bin/bash -x

usage() {
	echo "$0 <url>"
	exit 1
}

if [ $# -lt 1 ] ; then
	usage
fi

redis-cli publish zombie \
	"[{ \"op\": \"visit\", \"url\": \"$1\" },
	{ \"op\": \"inputs\" },
	{ \"op\": \"inputs\", \"fields\": \"type=text\"},
	{ \"op\": \"inputs\", \"fields\": \"name=user\"},
	{ \"op\": \"inputs\", \"fields\": \"name=passwrd\"}]"
