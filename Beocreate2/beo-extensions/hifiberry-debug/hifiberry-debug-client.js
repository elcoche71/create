var ausion_debug = (function() {

var newVersion = null;
var archiveURL = null;


$(document).on("ausion-debug", function(event, data) {
	
	if (data.header == "collecting") {
		$("#diagnostic-collect-button").addClass("disabled");
		$("#diagnostic-collecting").removeClass("hidden");
		$("#diagnostic-archive").addClass("hidden");
	}
	
	if (data.header == "finished") {
		$("#diagnostic-collect-button").removeClass("disabled");
		$("#diagnostic-collecting").addClass("hidden");
	}
	
	if (data.header == "archive") {
		if (data.content && data.content.archiveURL) {
			archiveURL = data.content.archiveURL;
			
			$("#diagnostic-collect-button").removeClass("black").addClass("grey");
			$("#diagnostic-archive").removeClass("hidden");
		} else {
			$("#diagnostic-archive").addClass("hidden");
			$("#diagnostic-collect-button").removeClass("grey").addClass("black");
		}
	}
	
	if (data.header == "state") {
		if (data.content.exclusiveAudio) {
			$("#exclusive-audio-status").text("Yes");
			$("#exclusive-audio-on-explanation").removeClass("hidden");
			$("#exclusive-audio-off-explanation").addClass("hidden");
			$("#software-resampling-menu-item").addClass("disabled");
		} else {
			$("#exclusive-audio-status").text("No");
			$("#exclusive-audio-on-explanation").addClass("hidden");
			$("#exclusive-audio-off-explanation").removeClass("hidden");
			$("#software-resampling-menu-item").removeClass("disabled");
			
		}
		
		if (data.content.resamplingRate) {
			$("#resampling-rate").text(data.content.resamplingRate/1000+" kHz");
		} else {
			$("#resampling-rate").text("Unknown");
		}
	}
});


function collect() {
	beo.send({target: "ausion-debug", header: "collect"});
}

function download() {
	window.location = archiveURL;
}


return {
	collect: collect,
	download: download
};

})();