// Heroku defines the environment variable PORT, and requires the binding address to be 0.0.0.0
var host = process.env.HOST ? '0.0.0.0' : '127.0.0.1';
var port = process.env.PORT || 8080;

var cors_proxy = require('./lib/cors-anywhere');
cors_proxy.createServer({
    // requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: [
        'cookie',
        'cookie2',
        // Strip Heroku-specific headers
        'x-heroku-queue-wait-time',
        'x-heroku-queue-depth',
        'x-heroku-dynos-in-use',
        'x-request-start'
    ],
    httpProxyOptions: {
        // Do not add X-Forwarded-For, etc. headers, because Heroku already adds it.
        xfwd: false
    }
}).listen(port, host, function() {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});

// Keep Heroku From Idling, every 5 mins.
var keepAlive = require('keep-alive')

keepAlive.add(process.env.HOST, 5*1000*60);