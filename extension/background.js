var data_sources = ['screen', 'window'],
    desktopMediaRequestId = '';

chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(function (msg) {
    if(msg.type === 'SS_UI_REQUEST') {
      requestScreenSharing(port, msg);
    }

    if(msg.type === 'SS_UI_CHECK') {
        msg.type = 'SS_PING';
        port.postMessage(msg);
    }

    if(msg.type === 'SS_UI_CANCEL') {
      cancelScreenSharing(msg);
    }
  });
});

function requestScreenSharing(port, msg) {
  // https://developer.chrome.com/extensions/desktopCapture
  // params:
  //  - 'data_sources' Set of sources that should be shown to the user.
  //  - 'targetTab' Tab for which the stream is created.
  //  - 'streamId' String that can be passed to getUserMedia() API
  desktopMediaRequestId = chrome.desktopCapture.chooseDesktopMedia(data_sources, port.sender.tab, function(streamId) {
    if (streamId) {
      msg.type = 'SS_DIALOG_SUCCESS';
      msg.streamId = streamId;
    } else {
      msg.type = 'SS_DIALOG_CANCEL';
    }
    port.postMessage(msg);
  });
}

function cancelScreenSharing(msg) {
  // cancelChooseDesktopMedia crashes on the Mac
  // See: http://stackoverflow.com/q/23361743/980524
  if (desktopMediaRequestId) {
     chrome.desktopCapture.cancelChooseDesktopMedia(desktopMediaRequestId);
  }
}
