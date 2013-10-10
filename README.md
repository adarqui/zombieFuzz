# INFO

zombie is very cool. zombieFuzz will become a little concept fuzzer to throw data at web apps. Right now it performs a few functions (public/...js). To see some example usages, check ./scripts

To launch the fuzzer, run the following command:

node fuzz.js

This will cause fuzz to contact redis and subscribe to "zombie" events.


Now you will be able to publish a json array to redis. This array can contain custom sequences which will cause zombieFuzz to perform those actions in sequence. For example, in the script.login.logout.sh shell script:

   "[{ \"op\": \"url\", \"url\": \"$3\" },
   { \"op\": \"login\", \"data[username]\": \"$1\", \"data[password]\": \"$2\", \"button\": \"Sign In\" },
   { \"op\": \"logout\" }]"

You can see that we first visit the url specified by $3, then we login using $1 $2, then we logout. Notice how we also specify the "name" selectors in the login operation. Using this "format", we will eventually be able to piece together hundreds of operations in a variety of sequences. There will be methods to fill input objects & ajax params with random, preformatted, and attack data.

peace!
