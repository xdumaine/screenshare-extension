var data_sources = ['screen', 'window'],
    desktopMediaRequestId = '';

chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function (msg) {
        if (msg.request) {
            delete msg.request;
            requestScreenSharing(port, msg);
        }

        if (msg.check) {
            delete msg.check;
            msg.ping = true;
            port.postMessage(msg);
        }

        if (msg.cancel) {
            cancelScreenSharing(msg);
        }
    });
});

function requestScreenSharing(port, msg) {
    desktopMediaRequestId = chrome.desktopCapture.chooseDesktopMedia(data_sources, port.sender.tab, function(streamId) {
        if (streamId) {
            msg.success = true;
            msg.streamId = streamId;
        } else {
            msg.cancel = true;
        }
        port.postMessage(msg);
    });
}

function cancelScreenSharing(msg) {
    if (desktopMediaRequestId) {
        chrome.desktopCapture.cancelChooseDesktopMedia(desktopMediaRequestId);
    }
}
