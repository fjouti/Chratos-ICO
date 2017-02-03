const express = require("express");
const app = express();
const spawn = require("child_process").spawn;

app.get('/balance/:wallet', function (req, res, next) {
	res.send(req.params)
	spawn("bitcoin-cli ", [`getbalanceget ${req.params.wallet}`])
});

app.post('/create', function (req, res, next) {
	spawn("bitcoin-cli ", [`getnewaddress`])
});

var server = app.listen(7575, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('App listening at http://%s:%s', host, port);
});