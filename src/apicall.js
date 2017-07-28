// alexa-cookbook sample code

// There are three sections, Text Strings, Skill Code, and Helper Function(s).
// You can copy and paste the entire file contents as the code for a new Lambda function,
//  or copy & paste section #3, the helper function, to the bottom of your existing Lambda code.


// 1. Text strings =====================================================================================================
//    Modify these strings and messages to change the behavior of your Lambda function

var myRequest = 'Florida';
const musixmatchkey = '8b7654870c8395335a30eb19039218f6';

// 2. Skill Code =======================================================================================================


var Alexa = require('alexa-sdk');

exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);

    // alexa.appId = 'amzn1.echo-sdk-ams.app.1234';
    // alexa.dynamoDBTableName = 'YourTableName'; // creates new table for session.attributes

    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('MyIntent');
    },

    'MyIntent': function () {

        httpsGet(myRequest, parseSongJson);

    }
};
function parseSongJson(response) {
    console.log('Inside ParseSongJSON');
    console.log(response);
    console.log('End Response');
    return;
    var jsonCount = Object.keys(response.message.body.track_list).length;
    for (var i = 0; i < jsonCount; i++) {
        this.emit(response.message.body.track_list[i].track.artist_name);
        songs.push(new Song(response.message.body.track_list[i].track.artist_name, response.message.body.track_list[i].track.track_name, response.message.body.track_list[i].track.commontrack_id, response.message.body.track_list[i].track.artist_id));
    }
    return result
}


function Song(artist, title, mmid, mmidartist) {
    this.artist = artist;
    this.title = title;
    this.mmid = mmid;
    this.mmidartist = mmidartist;
    this.lyric = selectLine(getLyrics(mmid));
}

//    END of Intent Handlers {} ========================================================================================
// 3. Helper Function  =================================================================================================


var https = require('https');
// https is a default part of Node.JS.  Read the developer doc:  https://nodejs.org/api/https.html
// try other APIs such as the current bitcoin price : https://btc-e.com/api/2/btc_usd/ticker  returns ticker.last

function httpsGet(myData, callback) {

    // GET is a web service request that is fully defined by a URL string
    // Try GET in your browser:
    // https://cp6gckjt97.execute-api.us-east-1.amazonaws.com/prod/stateresource?usstate=New%20Jersey
    var pageNum = 1;

    // Update these options with the details of the web service you would like to call
    var options = {
        host: 'api.musixmatch.com',
        port: 443,
        path: '/ws/1.1/chart.tracks.get?page=' + encodeURIComponent(pageNum) + '&page_size=25&country=us&f_has_lyrics=1&apikey=' + musixmatchkey,
        method: 'GET',

        // if x509 certs are required:
        // key: fs.readFileSync('certs/my-key.pem'),
        // cert: fs.readFileSync('certs/my-cert.pem')
    };

    var req = https.request(options, res => {
        res.setEncoding('utf8');
        var returnData = "";

        res.on('data', chunk => {
            returnData = returnData + chunk;
        });

        res.on('end', () => {
            // we have now received the raw return data in the returnData variable.
            // We can see it in the log output via:
            // console.log(JSON.stringify(returnData))
            // we may need to parse through it to extract the needed data

            callback(returnData);  // this will execute whatever function the caller defined, with one argument

        });

    });
    req.end();

}


function httpsGet2(myData, callback) {

    // GET is a web service request that is fully defined by a URL string
    // Try GET in your browser:
    // https://cp6gckjt97.execute-api.us-east-1.amazonaws.com/prod/stateresource?usstate=New%20Jersey


    // Update these options with the details of the web service you would like to call
    var options = {
        host: 'cp6gckjt97.execute-api.us-east-1.amazonaws.com',
        port: 443,
        path: '/prod/stateresource?usstate=' + encodeURIComponent(myData),
        method: 'GET',

        // if x509 certs are required:
        // key: fs.readFileSync('certs/my-key.pem'),
        // cert: fs.readFileSync('certs/my-cert.pem')
    };

    var req = https.request(options, res => {
        res.setEncoding('utf8');
        var returnData = "";

        res.on('data', chunk => {
            returnData = returnData + chunk;
        });

        res.on('end', () => {
            // we have now received the raw return data in the returnData variable.
            // We can see it in the log output via:
            // console.log(JSON.stringify(returnData))
            // we may need to parse through it to extract the needed data

            var pop = JSON.parse(returnData).population;

            callback(pop);  // this will execute whatever function the caller defined, with one argument

        });

    });
    req.end();

}