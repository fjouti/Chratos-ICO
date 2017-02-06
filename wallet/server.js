const express 	= require("express");
const app 		= express();
const spawn 	= require("child_process").spawn;

app.get('/', function(req, res, next){
	console.log("healthcheck");
	res.send("OK");
});

app.get('/balance/:wallet', function (req, res, next) {
	var proc = spawn("bitcoin-cli", ["getbalance",req.params.wallet]);
	proc.stdout.on('data', function(data){
	    res.send(data.toString().trim());
	});

	proc.stderr.on('data', function(data){
		console.log(data.toString());
	    res.status(500).send(data.toString().trim());
	});

	proc.on('closed', function(code){
	    alert('Child exited with code ${code}');
	});
});

app.post('/create', function (req, res, next) {
	var proc = spawn("bitcoin-cli", ["getnewaddress"]);

	proc.stdout.on('data', function(data){
	    res.send(data.toString().trim());
	});

	proc.stderr.on('data', function(data){
   		res.send(500, data.toString());
	});
});

var server = app.listen(7575, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('App listening at http://%s:%s', host, port);
});