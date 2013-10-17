/*
 * zombieFuzz
 */

var 	zom = require('zombie'),
		assert = require('assert'),
		https = require('https'),
		redis = require('redis'),
		async = require('async'),
		winston = require('winston'),
		nconf = require('nconf'),
		express = require('express'),
		fs = require('fs');


_ = require('underscore');
$$ = require('jquery');





var c = {
	red : {
		chan : {},
	},
	sub : {
		chan : {},
	},
	opts: {
	},
	ops : {
	},
	express : {
	},
	http : {
		port : 80,
	},
	socks : {
	},
}



var init = {
	redis : function() {
		c.red.chan = redis.createClient();
		c.sub.chan = redis.createClient();
		c.sub.chan.subscribe('zombie')
	},
	hooks : function() {
		c.sub.chan.on('message', function(channel, message) {
			try {
				var js = JSON.parse(message)

				var browser_opts = {
					debug : true // make this on-the-fly configurable later
				}

				if(browser_opts.debug == true) {
					//console.log("Recieved subscribe event:", channel, message, "\n\n")
				}

				var browser = new zom(browser_opts)

				var state = {
					browser : browser,
				}

				state.browser.on('error', function(err) {
					console.log("error")
				})

				state.browser.on('done', function(err,data) {
				})

				async.eachSeries(js,
					function(item,cb) {
						if(item.op && c.ops[item.op]) {
							// fire an op
							var op = c.ops[item.op]
							return op(state,item,cb)
						} else {
							return cb()
						}
					}, function(err) {
						console.log("err", err)
					}
				)

			} catch(err) {
				console.log("sub:message:err", err)
			}
		})
	},
	uncaught : function() {
		process.on('uncaughtException', function(err) {
			console.log("uncaught", err)
		})
	},
	load : {
		general : function(dir) {
			try {
				var files = fs.readdirSync(dir)
				for (var v in files) {
					var file = files[v].split('.')[0]
					c.ops[file] = require('./' + dir + '/' + file)
				}
			} catch(err) {
				return
			}
		},
		public : function() {
			init.load.general('public')
		},
		private : function() {
			init.load.general('private')
		},
	},
	winston : function() {
		var config = {
			levels : {
				silly : 0,
				verbose : 1,
				info : 2,
				data : 3,
				warn : 4,
				debug : 5,
				error : 6
			},
			colors : {
				silly : 'magenta',
				verbose : 'cyan',
				info : 'green',
				data : 'grey',
				warn : 'yellow',
				debug : 'blue',
				error : 'red',
			}
		}
		winston = new (winston.Logger)({
			transports : [
				new (winston.transports.Console)({
					colorize : true
				})
			],
			levels : config.levels,
			colors : config.colors
		})
	},
	nconf : function() {
		nconf.argv().env()/*.file({ file: "./config.js" });*/
	},
	express_routes : function() {
		c.express.app.get('/configure/:name/:tag', function(req,res,next) {
			var name = req.param('name');
			var tag = req.param('tag');

			console.log("name:",name,"tag:",tag);
			req.session.zombie = {
				name : name,
				tag : tag,
				date : new Date().toString(),
			};

			res.json({ status : "Thanks." });
		});
		c.express.app.get('/configure', function(req,res,next) {
			return res.json(req.session);
		});
	},
	express : function() {

		if(!nconf.get('port')) {
			winston.info('Not starting the express server. To start, use --port=<port>');
			return;
		}

		c.express.app = express();
		c.express.app.use(express.logger());
		c.express.app.use(express.cookieParser());
		c.express.app.use(express.bodyParser());
		c.express.app.use(express.favicon());
		c.express.app.use(express.session({ secret : "zombierox" }));
		c.express.app.listen(nconf.get('port'));

		init.express_routes()
	},
	everything : function() {
		/* fix cert issue */
		https.globalAgent.options.secureProtocol = 'SSLv3_method';
		process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

		init.winston()

		winston.info('Initializing nconf');
		init.nconf();
		winston.info('Initializing express');
		init.express();
		winston.info('Initializing zombieFuzz')
		winston.info('Initializing public modules')
		init.load.public()
		winston.info('Initializing private modules')
		init.load.private()
		winston.info('Initiializing redis channels')
		init.redis()
		winston.info('Initializing hooks')
		init.hooks()

		winston.info('Here are the available ops:', { ops : _.keys(c.ops) })
	}
}


init.everything()
