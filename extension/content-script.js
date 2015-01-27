var port = chrome.runtime.connect(chrome.runtime.id);

port.onMessage.addListener(function(msg) {
	window.postMessage(msg, '*');
});

window.addEventListener('message', function(event) {
	// We only accept messages from ourselves
	if (event.source != window) {
		return;
	}

	if (event.data.request ||
		event.data.cancel ||
		event.data.check) {
		port.postMessage(event.data);
	}
}, false);

window.postMessage({ ping: true }, '*');
