//Just checks the specified url for any incoming requests and calls the callback with the data
module.exports=function(port, urlPath, _callback)
{
	var map = require('through2-map');
	var http = require('http');
	var url = require('url');
	var server = http.createServer(function(req,res)
	{
		var urlRequest = url.parse(req.url);
		//res.writeHead isn't being used yet, but we should send some response, even if it isn't being used by GitHub
		res.writeHead(200, {'Content-Type': 'application/json'});
		//Request URL should really be passed in as a parameter

		if(urlRequest.pathname.toLowerCase() == urlPath)
		{
			//Log the headers for now, later we should verify that the request
			//has really come from GitHub and not those nasty DDOS'ers
			console.log(req.headers);

			//var parsedHeader = JSON.parse(req.headers);
			//console.log("Incoming request from: " + parsedHead.host + " (" + parsedHead.x-real-ip + ") for event " + parsedHead.x-github-event);

			var data = '';
			req.on('data', function(chunk) 
			{
				//populate the data with the JSON from the GitHub request
				data += chunk;
			});

			//Called when request has finished being downloaded
			req.on('end', function()
			{
				_callback(JSON.parse(data));
			});
		};
	});
	server.listen(port);
}