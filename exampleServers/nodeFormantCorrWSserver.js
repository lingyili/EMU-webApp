var fs = require('fs');
var userName = 'klaus';

var labelData;

var path2dataRoot = '../app/testData/';
var path2configFile = '../app/testData/customConfig.json';
var portNr = 8080;

var curUttList = [];
var curStrippedUttList = [];

var WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({
		port: portNr
	});

wss.on('connection', function(ws) {

	ws.on('message', function(message) {
		// console.log('received: %s', message);
		var mJSO = JSON.parse(message);

		// getProtocolType method
		if (mJSO.type === 'getProtocol') {
			ws.send(JSON.stringify({
				'callback_id': mJSO.callback_id,
				'data': {
					'protocol': 'emuLVC-websocket-protocol',
					'version': '0.0.1'
				}
			}), undefined, 0);
		}

		// getUserManagment method
		if (mJSO.type === 'getDoUserManagement') {
			ws.send(JSON.stringify({
				'callback_id': mJSO.callback_id,
				'data': 'YES'
			}), undefined, 0);
		}

		// getUttList method
		if (mJSO.type === 'getUttList') {
			fs.readFile(path2dataRoot + mJSO.usrName + '.json', 'utf8', function(err, data) {
				if (err) {
					console.log('Error: ' + err);
					ws.send(JSON.stringify({
						'callback_id': mJSO.callback_id,
						'data': 'NO USER FOUND'
					}), undefined, 0);
					return;
				} else {
					var labelData = JSON.parse(data);
					curUttList = labelData;
					// curStrippedUttList = stripUttList(labelData);

					ws.send(JSON.stringify({
						'callback_id': mJSO.callback_id,
						'dataType': 'uttList',
						'data': labelData
					}), undefined, 0);
					// ws.send(labelData);
				}

			});
		}

		// getUttList method
		if (mJSO.type === 'getConfigFile') {
			fs.readFile(path2configFile, 'utf8', function(err, data) {
				if (err) {
					console.log('Error: ' + err);
					return;
				} else {
					var labelData = JSON.parse(data);
					curUttList = labelData;
					// curStrippedUttList = stripUttList(labelData);

					ws.send(JSON.stringify({
						'callback_id': mJSO.callback_id,
						'dataType': 'uttList',
						'data': labelData
					}), undefined, 0);
					// ws.send(labelData);
				}

			});
		}


		// method like static get file method
		if (mJSO.type === 'getSSFFfile' || mJSO.type === 'getESPSfile' || mJSO.type === 'getAudioFile') {
			console.log(mJSO.fileName)
			fs.readFile(path2dataRoot + mJSO.fileName, 'binary', function(err, data) {
				if (err) {
					console.log('Error: ' + err);
					return;
				} else {
					ws.send(JSON.stringify({
						'type': mJSO.type,
						'callback_id': mJSO.callback_id,
						'fileName': mJSO.fileName,
						'data': data
					}), undefined, 0);
				}
			});
		}

		// saveUttList method
		if (mJSO.type === 'saveUttList') {
			console.log('saveUttList');
			var outputPath = path2dataRoot + mJSO.usrName + '.json';
			if (fs.existsSync(outputPath)) {
				console.log('Writing to file: %s', outputPath);
				fs.writeFile(outputPath, JSON.stringify(JSON.parse(mJSO.data), null, 2), function(err) {
					if (err) {
						console.log('ERROR while saving uttList')
						console.log(err);
						ws.send(JSON.stringify({
							'callback_id': mJSO.callback_id,
							'type': mJSO.type,
							'status': 'FAILURE',
							'details': 'error writing file'
						}), undefined, 0);
					} else {
						console.log("uttList saved");
						ws.send(JSON.stringify({
							'callback_id': mJSO.callback_id,
							'type': mJSO.type,
							'status': 'SUCCESS'
						}), undefined, 0);
					}
				});

			}
			ws.send(JSON.stringify({
				'callback_id': mJSO.callback_id,
				'type': mJSO.type,
				'status': 'FAILURE',
				'details': 'file not found'
			}), undefined, 0);
		}
		// saveSSFFfile
		if (mJSO.type === 'saveSSFFfile') {
			var view = new Buffer(mJSO.data, 'base64');
			console.log('Writing SSFF to file: ' + mJSO.fileURL)
			fs.writeFile(path2dataRoot + mJSO.fileURL, view, function(err) {
				if (err) {
					console.log('ERROR while saving ssff file')
					console.log(err);
					ws.send(JSON.stringify({
						'callback_id': mJSO.callback_id,
						'type': mJSO.type,
						'status': 'FAILURE',
						'details': 'error writing file'
					}), undefined, 0);
				} else {
					console.log('ssffFile saved');
					ws.send(JSON.stringify({
						'callback_id': mJSO.callback_id,
						'type': mJSO.type,
						'status': 'SUCCESS'
					}), undefined, 0);
				}
			});
		}

	});
});

function stripUttList(list) {
	var sF; // stripped file
	list.forEach(function(utt) {
		utt.files.forEach(function(file, fIdx) {
			sF = file.split('/')[file.split('/').length - 1];
			utt.files[fIdx] = sF;
			console.log(sF);
		})

	})
}