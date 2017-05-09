// In 'C:\Users\hong\Documents\workspace\graduateWork'

var net = require('net');
var mongoose = require('mongoose');
var gcm = require('node-gcm');
var fs = require('fs');
var spawn = require('child_process').spawn;
var iconv = require('iconv-lite');
iconv.extendNodeEncodings();
// show server ip address
var interfaces = require('os').networkInterfaces();
for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
        var alias = iface[i];
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
            console.log(alias.address);
    }
}

var message = new gcm.Message();

var server_api_key = 'AIzaSyA1q8fr2nexzL6fkZmBtKtsEgnlWN1AHKI';//'AIzaSyAH_oXjEPf7L0km8jr876wXnfmsgimVBrQ';
var sender = new gcm.Sender(server_api_key);
var registrationIds = [];

var token = 'ca6Ppz_cdQc:APA91bFGvCyJ_1HheROvjoU59P_oIBdbGpUqQJtWnv4oIMAXgENNc8SHP8-SFxeFvJlOWCXbZe8KBGLcLyAkpILSjhR13D4yK6dQMBuPsWRcpY9ukKEcZWEsSMlODqJ4y8MEIHxfG1Af';//'dEAihPF7Zhk:APA91bFYnBcZF4hdl-0IQD4apl9wUc3-XLhidm7NtXznLkUVnM0wbrn3Ncygd_tRqp0BMg3e2L6rpyhR_e4GfWSuSJI5j2s_N8f4Mn3WC4clarlZCtRnxH20TDWVr_sYv_QbcmD4rKDK';
var token2 = 'c4MpFkb6w5E:APA91bH0raWnj0Q2LZ2NzdukxgX_gbpMugeBtgiqqo9EHAEB4lV84MTlTIvwNB0xFS4Vxg2HSuCTv6l1E6ZLoPPW9gsQylBZW8cYnXG7qZi7C_X9HolyVOk_-w7SMPJhVP3WOVGUy-Bb';
registrationIds.push(token);
registrationIds.push(token2);

// database

mongoose.connect("mongodb://hong:honghong@ds153765.mlab.com:53765/graduate"); // encryption
var db = mongoose.connection;
db.once("open", function() {
    console.log("DB connected!");
});
db.on("error", function(err) {
    console.log("DB error : ", err);
});
var userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    location: {
        latitude: Number,
        longitude: Number,
        address: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    token: {
        type: String,
        required: true
    }
});
var User = mongoose.model('user', userSchema);


// var msg = "37.454879,127.145410";
// var message = new gcm.Message({
//     collapseKey: 'demo',
//     delayWhileIdle: true,
//     timeToLive: 3,
//     data: {
//         title: 'Someone need your help',
//         message: msg
//     }
// });
// sender.send(message, registrationIds, 4, function (err, result) {
//     console.log(result);
// });

var server = net.createServer(function(socket) {
    console.log("#red[Client connected to the server with ip: " + socket.remoteAddress + "]");

    socket.on("error", function(error) {
        console.log("error" + error);
    });
    socket.on("close", function() {
        console.log("#red[Client has disconnected" + socket.remoteAddress + "]");
    });
    var flag = false;
    socket.on("data", function(data) {
        try {
            var packet = JSON.parse(data);
            console.log(packet);

            // 도움을 주겠다고 핸드폰에서 버튼을 눌렀을 때
            if (packet.type == "andRequest") {
                //if (packet.request == "ok") {
                //    flag = true;
                    console.log(packet.username, " want to help");

                    // var ids = [];
                    // if (packet.username == "help") {
                    //     ids.push(token2);
                    // } else  {
                    //     ids.push(token);
                    // }
                    //
                    // var msg = "0, 0, 0";
                    // var message = new gcm.Message({
                    //     collapseKey: 'demo',
                    //     delayWhileIdle: true,
                    //     timeToLive: 3,
                    //     data: {
                    //         title: 'Someone already pushes button',
                    //         message: msg
                    //     }
                    // });
                    // //socket.write('Echo server\n');
                    //
                    // sender.send(message, ids, 4, function (err, result) {
                    //     console.log(result);
                    // });
                //}
            }

            // 안드로이드에서 코멘트가 작성되면
            else if (packet.type == "andResponse") {
                var tmp = packet.content;
                console.log(tmp);
                var id = spawn(
                'java', ['-jar', 'komoran.jar', tmp]
                );

                id.stdout.on('data', function (data) {
                    var komo = data.toString();
                    //process.stdout.write(data.toString());
                });
            }

            // 도움을 준 후에 코멘트 작성하기
            else if (packet.type == "raspResponse") {// && flag === true
                console.log("------------", flag);
                flag = false;

                var msg = "0, 0, 0";
                var message = new gcm.Message({
                    collapseKey: 'demo',
                    delayWhileIdle: true,
                    timeToLive: 3,
                    data: {
                        title: 'Please write comment',
                        message: msg
                    }
                });
                //socket.write('Echo server\n');

                sender.send(message, registrationIds, 4, function (err, result) {
                    console.log(result);
                });

                spawn(
                  'java', ['-jar', 'twitter.jar', '도움을 받았어요']
                );
            }

            // 라즈베리파이로 도움을 요청했을 때
            else if (packet.type == "raspRequest") {
                flag = true;
                //"C:/Users/hong/Documents/workspace/graduateWork/top3Words.txt"
                fs.readFile("/home/93hong/graduate/top3Words.txt", 'utf-8', function(err, content) {
                    if (err) {
                        console.error("Could not list the directory.", err);
                        throw err;
                    }
                    console.log(content);
                    var words = content.split(",");
                    var msg = "1" + packet.username + "," + packet.latitude + "," + packet.longitude + "," + packet.light;
                    var message = new gcm.Message({
                        collapseKey: 'demo',
                        delayWhileIdle: true,
                        timeToLive: 3,
                        data: {
                            title: words,
                            message: msg
                        }
                    });
                    sender.send(message, registrationIds, 4, function (err, result) {
                        console.log(result);
                    });
                  });


                /////////////////////////////////////////////////////////////////////////
                //// execute .jar file 'twitterBot.jar'
                // 트윗하기
                spawn(
                  'java', ['-jar', 'twitter.jar', '도움이 필요해요']
                );
            /////////////////////////////////////////////////////////////////////////
            }
        } catch (e) {
            console.log("Else " + e.message);
        }
    });
});

server.listen(8080, function() {
    //'listening' listener
    console.log('Server is listening for incoming connections');
});
