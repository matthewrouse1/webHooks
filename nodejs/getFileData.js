module.exports = function(fileName)
{
	var fs = require('fs');
	var returnValues = [];
	var buffer = fs.readFileSync(fileName);
	var splitLines = buffer.toString().split('\n');
	for(var i = 0; i < splitLines.length; i++)
	{
		if(splitLines[i].indexOf('#') == 0) continue;
		returnValues[returnValues.length] = splitLines[i];
	}
	return returnValues;
};