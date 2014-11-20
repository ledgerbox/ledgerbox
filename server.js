var restify = require('restify');

var server = restify.createServer({ name: 'app' });
server.use(restify.queryParser());
server.get(/.*/, restify.serveStatic({
    directory: 'static',
    default: 'html/main.html',
    maxAge : 1
}));

restify.defaultResponseHeaders = false

server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});
 
