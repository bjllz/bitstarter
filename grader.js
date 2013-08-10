#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html
   - Cheerio is used to manipulate html files in the server side, by the command load
   - it returns an JSON object to manipulate
   
 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy
   - this is a module to interact with the command line and node.js

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
   - JSON is an object with method to seriaize(stringify) and deserialize (parse)
*/



/*the program is not working for  URL reading yet*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var rest=require('restler'); 
var URL_DEFAULT="http://google.com";
var util=require('util');

/*var assertUrlExists=function(url){
    var resultHTML=function(result,response){
	if(result instanceof Error){
	    console.error('Errorsimo : ' + util.format(response.message));
	    proccess.exit(1);
	}

	return result;
    };

return rest.get(url).on('complete',resultHTML);

//the restler object runs the get method to get the URL especified
// the 'on' specifies when 'complete' run resultHTML function

};*/


var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};
/* This method is used to return an Object to manipulate*/

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

/*This function reads the JSON file specified and returns it deserialized*/
var loadChecks = function(checksfile) {
     
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);// first get the HTML object to manipulate, it turns it from string to an object
   /* $ = cheerioHtmlFile(urlFile);// not working as it seems the return of the restler.get is not a string */
    var checks = loadChecks(checksfile).sort();//Load de JSON which is an array, it is just a file with an array, there is no JSON files.
    var out = {};//Create an object called out 
    for(var ii in checks) {// checks in the array starting from index 0
        var present = $(checks[ii]).length > 0;//this is a boolean comparission
        out[checks[ii]] = present;// assigns true or false to the key in the object
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
.option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
/*.option('-u --url <url_to_file>','URL to file',clone(assertUrlExists),URL_DEFAULT)*/
        .parse(process.argv);
    var checkJson = checkHtmlFile(program.file, program.checks);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
