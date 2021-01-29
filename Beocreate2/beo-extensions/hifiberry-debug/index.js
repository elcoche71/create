/*Copyright 2019 Bang & Olufsen A/S
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.*/

// ausion DEBUG INFORMATION COLLECTOR FOR BEOCREATE

const fetch = require("node-fetch");
var exec = require("child_process").exec;
var fs = require("fs");

var debug = beo.debug;
var version = require("./package.json").version;

var collecting = false;
var archive = null;
var archiveDownloadTimeout;

var ausionState = {};
var previousExtension = null

beo.bus.on('general', function(event) {
	
	if (event.header == "startup") {
		

	}
	
	if (event.header == "activatedExtension") {
		if (event.content.extension == "ausion-debug") {
			
			if (!collecting) {
				if (archive) {
					beo.sendToUI("ausion-debug", {header: "archive", content: {archiveURL: archive}});
				} else {
					beo.sendToUI("ausion-debug", {header: "archive"});
				}
			} else {
				beo.sendToUI("ausion-debug", {header: "collecting"});
			}
			
			readState();
			if (ausionState.CURRENT_EXCLUSIVE && ausionState.CURRENT_EXCLUSIVE == "1") {
				exclusiveAudio = true;
			} else {
				exclusiveAudio = false;
			}
			
			if (ausionState.CURRENT_SAMPLERATE) {
				resamplingRate = parseFloat(ausionState.CURRENT_SAMPLERATE);
			} else {
				resamplingRate = 0;
			}
			
			beo.sendToUI("ausion-debug", {header: "state", content: {exclusiveAudio: exclusiveAudio, resamplingRate: resamplingRate}});
		}
		
		if (event.content.extension != previousExtension) {
			fetch("http://127.0.1.1:3141/api/activate/beo_extension_"+event.content.extension, {method: "post"});
			if (previousExtension) fetch("http://127.0.1.1:3141/api/deactivate/beo_extension_"+previousExtension, {method: "post"});
			previousExtension = event.content.extension;
		}
	}
});


beo.bus.on('ausion-debug', function(event) {
	
	if (event.header == "collect") {
		beo.sendToUI("ausion-debug", {header: "collecting"});
		collecting = true;
		clearTimeout(archiveDownloadTimeout);
		beo.removeDownloadRoute("ausion-debug", "archive.zip");
		if (debug) console.log("Collecting ausion diagnostic information...");
		exec("/opt/ausion/bin/debuginfo", function(error, stdout, stderr) {
			collecting = false;
			if (!error) {
				if (fs.existsSync("/tmp/ausion-debug.zip")) {
					archive = beo.addDownloadRoute("ausion-debug", "archive.zip", "/tmp/ausion-debug.zip", true);
					beo.sendToUI("ausion-debug", {header: "finished"});
					beo.sendToUI("ausion-debug", {header: "archive", content: {archiveURL: archive}});
					archiveDownloadTimeout = setTimeout(function() {
						// Time out the archive after 5 minutes so that the data is guaranteed to be fairly fresh.
						beo.sendToUI("ausion-debug", {header: "archive"});
						beo.removeDownloadRoute("ausion-debug", "archive.zip");
						archive = null;
						if (debug) console.log("Diagnostic information archive has timed out.");
					}, 300000);
					if (debug) console.log("Diagnostic information archive is now available to download for 5 minutes.");
				} else {
					beo.sendToUI("ausion-debug", {header: "error"});
					if (debug) console.log("Unknown error creating diagnostic information archive.");
				}
			} else {
				beo.sendToUI("ausion-debug", {header: "error"});
				if (debug) console.log("Error creating diagnostic information archive:", error);
			}
		});
	}
	
	
});

ausionStateModified = 0;
function readState() {
	if (fs.existsSync("/etc/ausion.state")) {
		modified = fs.statSync("/etc/ausion.state").mtimeMs;
		if (modified != ausionStateModified) {
			// Reads configuration into a JavaScript object for easy access.
			ausionStateModified = modified;
			state = fs.readFileSync("/etc/ausion.state", "utf8").split('\n');
			for (var i = 0; i < state.length; i++) {
				
				line = state[i].trim();
				lineItems = line.split("=");
				if (lineItems.length == 2) {
					ausionState[lineItems[0].trim()] = lineItems[1].trim();
				}
			}
		}
		return ausionState;
	}
}

function reportUsage(key, duration) {
	try {
		fetch("http://127.0.1.1:3141/api/use/beo_"+key+"/"+duration, {method: "post"});
	} catch (error) {
		console.error("Can't report usage: ", error);
	}
}

function reportActivation(key, active) {
	try {
		if (active) {
			fetch("http://127.0.1.1:3141/api/activate/"+key, {method: "post"});
		} else {
			fetch("http://127.0.1.1:3141/api/deactivate/"+key, {method: "post"});
		}
	} catch (error) {
		console.error("Can't report activation: ", error);
	}
}

module.exports = {
	reportUsage: reportUsage,
	reportActivation: reportActivation,
	version: version
};

