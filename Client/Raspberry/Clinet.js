#! /usr/bin/env node
var net = require('net');
//var GPIO = require('onoff').Gpio, led = new GPIO(23, 'out'), button = new GPIO(18, 'in', 'both');

var GPIO = require('onoff').Gpio, led1 = new GPIO(17, 'out'), led2 = new GPIO(22, 'out'), led3 = new GPIO(27, 'out');
var button1 = new GPIO(18, 'in', 'both'), button2 = new GPIO(23, 'in', 'both'), button3 = new GPIO(24, 'in', 'both');

var Bleacon = require('bleacon');

//Bleacon.startAdvertising('e2c56db5dffb48d2b060d0f5a71096e0', 0, 0, -59);
Bleacon.startAdvertising('abcd', 0, 0, -59);
Bleacon.startScanning();

var be;
var flag = false;

Bleacon.on('discover', function(bleacon) {
  	console.log('bleacon found: ' + JSON.stringify(bleacon));
	be = bleacon;
	flag = true;
});




function light1(err, state) {
	if(state == 1) {
		led1.writeSync(0);
		console.log('button1 on');
		var client = new net.Socket();
		client.connect(8080,'14.63.197.49',function() {
			console.log('connected');
			var jsonObj = {
				type: 'raspRequest',
				username: 'help',
				latitude: 38.45183448,
				longitude: 126.12684616,
				light: 'green'
			};	
			var jsonObjBe = {
				type: 'raspRequest',
				username: 'help',
				latitude: 37.45183448,
				longitude: 127.12684616,
				light: 'green'
			};
			
			if (flag) {
				if(be.proximity == 'near'|| be.proximity == 'immediate') {
					var accountStr = JSON.stringify(jsonObjBe);
					client.write(accountStr);
					//client.write(JSON.stringify(be));
				}
				else if(be.proximity == 'far') {
					var accountStr = JSON.stringify(jsonObj);
					client.write(accountStr);
					//client.write(JSON.stringify(be));
				}
				flag = false;
			}
		});

		setTimeout(asdasd, 3000);

		client.on('data', function(data) {
		console.log('Received: ' + data);
		client.destroy();
		});

		client.on('close', function() {
			console.log('Connection closed');
		});
	}
	else {
		console.log('off');
	}

}

function asdasd() {
	led3.writeSync(1);
}


function light2(err, state) {
	if(state == 1) {
		led2.writeSync(0);
		console.log('button2 on');
		var client = new net.Socket();
		client.connect(8080,'14.63.197.49',function() {
			console.log('connected');
			var jsonObj = {
				type: 'raspRequest',
				username: 'help',
				latitude: 37.45183448,
				longitude: 127.12684616,
				light: 'yellow'
			};
			var jsonObjBe = {
				type: 'raspRequest',
				username: 'help',
				latitude: 37.45183448,
				longitude: 127.12684616,
				light: 'yellow'
			};
			
			if (flag) {
				if(be.proximity == 'near'|| be.proximity == 'immediate') {
					var accountStr = JSON.stringify(jsonObjBe);
					client.write(accountStr);
					//client.write(JSON.stringify(be));
				}
				else if(be.proximity == 'far') {
					var accountStr = JSON.stringify(jsonObj);
					client.write(accountStr);
					//client.write(JSON.stringify(be));
				}
				flag = false;
			}
		});

		setTimeout(asdasd, 3000);

		client.on('data', function(data) {
		console.log('Received: ' + data);
		client.destroy();
		});

		client.on('close', function() {
			console.log('Connection closed');
		});
	}
	else {
		led2.writeSync(1);
		console.log('off');
	}
}
function light3(err, state) {
	if(state == 1) {
		led3.writeSync(0);
		console.log('button3 on');
		var client = new net.Socket();
		client.connect(8080,'14.63.197.49',function() {
			console.log('connected');
			var jsonObj = {
				type: 'raspResponse',
				username: 'help',
				latitude: 37.45183448,
				longitude: 127.12684616,
				light: 'red'
			};
			var jsonObjBe = {
				type: 'raspResponse',
				username: 'help',
				latitude: 37.45183448,
				longitude: 127.12684616,
				light: 'red'
			};
			
			if (flag) {
				if(be.proximity == 'near'|| be.proximity == 'immediate') {
					var accountStr = JSON.stringify(jsonObjBe);
					client.write(accountStr);
					//client.write(JSON.stringify(be));
				}
				else if(be.proximity == 'far') {
					var accountStr = JSON.stringify(jsonObj);
					client.write(accountStr);
					//client.write(JSON.stringify(be));
				}
				flag = false;
			}
		});

		client.on('data', function(data) {
		console.log('Received: ' + data);
		client.destroy();
		});

		client.on('close', function() {
			console.log('Connection closed');
		});
	}
	else {
		led3.writeSync(1);
		console.log('off');
	}
}



console.log('start');
button1.watch(light1);
button2.watch(light2);
button3.watch(light3);



////////////////////////////////////////

