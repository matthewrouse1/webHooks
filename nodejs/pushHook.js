var argv = require('optimist').argv;
var help = "## pushHook Help ## \n" +
			"-d Use default options \n" +
			"-h Print this help message \n" +
			"-p Port to listen on (default: 4567) \n" +
			"-u URL to listen on (default: /payload) \n";
//Check to see that either Help or (Port and URL) or Defaults was specified
//This looks a little unnatural with only 4 parameters, probably should
//think of a better way to do this...
if ((argv.h || (!argv.p || !argv.u)) && !argv.d)
{
	console.log(help);
	return;
};
var port = argv.p ? argv.p : 4567;
var url = argv.u ? argv.u : '/payload';
var mailer = require('./mailer.js');
var server = require('./incomingServer.js');
var getFileData = require('./getFileData.js');
var emailAddresses = getFileData('./emailAddresses.txt');
var branchesToWatch = getFileData('./branches.txt');
console.log	("Email Recipients List: ");
for(var i = 0; i <emailAddresses.length; i++)
{
	console.log(emailAddresses[i]);
};
console.log("Watched Branches List:");
for(var i = 0; i < branchesToWatch.length; i++)
{
	console.log	(branchesToWatch[i]);
};
server(port, url, function(parsedJSON) {

	if(parsedJSON == undefined)
	{
		return;
	}

	var branch = parsedJSON.ref;
	if(branch.indexOf('refs/heads/') > -1)
	{
		branch = branch.substr(11);
	};

	//Needs to repl the commits rather than getting the head commit, and print the ID + author for those commits.
	var message = "A Change has been detected on '" + branch + "'"; //+ " by " + parsedJSON.head_commit.author.name + " the commit message was " + parsedJSON.head_commit.message; 

	console.log(message);

	for(var i = 0; i < branchesToWatch.length; i++)
	{
		if(branch.indexOf(branchesToWatch[i]) > -1)
		{				
			var commitMessage = "\n\n";
			for(var l = 0; l < parsedJSON.commits.length; l ++)
			{
				commitMessage = commitMessage + "\n Message: '" + parsedJSON.commits[l].message + "'\n ID: " + parsedJSON.commits[l].id + "\n Author: '" + parsedJSON.commits[l].author.name + "\n\n";
			};

			for(var j = 0; j <emailAddresses.length; j++)
			{
				console.log("Emailing: " + emailAddresses[j]);
				mailer(
						emailAddresses[j],
						"gitWatcher@advancedcomputersoftware.com",
						"Changes found on " + branch, 
						message + commitMessage
						);
			};
		}
	}	
});
console.log("Server is listening on port " + port);