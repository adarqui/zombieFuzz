#!/bin/bash -x

usage() {
	echo "$0 <username> <password> <login url>"
	exit 1
}

if [ $# -lt 3 ] ; then
	usage
fi

redis-cli publish zombie \
	"[{ \"op\": \"url\", \"url\": \"$3\" },
	{ \"op\": \"login\", \"data[username]\": \"$1\", \"data[password]\": \"$2\" },
	{ \"op\": \"clickLink\", \"link\": \"Sign In\" },
	{ \"op\": \"visit\", \"url\": \"$3\" },
	{ \"op\": \"visit\", \"url\": \"${3}/fdgdofgkdfoskfdogfsdko\" },
	{ \"op\": \"logout\" }]"
