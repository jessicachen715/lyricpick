// alexa-cookbook sample code

// There are three sections, Text Strings, Skill Code, and Helper Function(s).
// You can copy and paste the entire file contents as the code for a new Lambda function,
//  or copy & paste section #3, the helper function, to the bottom of your existing Lambda code.


// 1. Text strings =====================================================================================================
//    Modify these strings and messages to change the behavior of your Lambda function

var myRequest = 'Florida';
const musixmatchkey = '8b7654870c8395335a30eb19039218f6';
var songs = 'testing';

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
        myRequest = 1;
        var songs = [];
        getSongs(myRequest, (res) => {
            songs = parseSongJson(res);
            console.log('inside of request' + songs);
            console.log('The song is ' + songs[0].title + ' by ' + songs[0].artist);
            this.emit(':tell', 'The song is ' + songs[0].title + ' by ' + songs[0].artist);
        });
        console.log('outside of request' + songs);
        console.log('THIS IS AFTER GET SONGS IS CALLED');
        //this.emit(':tell', 'The song is ' + songs[0].title + ' by ' + songs[0].artist);

    }
};




//    END of Intent Handlers {} ========================================================================================
// 3. Helper Function  =================================================================================================


///////////////API call methods///////////////

var https = require('https');
function getSongs(pageNum, callback) {
    var options = {
        host: 'api.musixmatch.com',
        port: 443,
        path: '/ws/1.1/chart.tracks.get?page=' + encodeURIComponent(pageNum) + '&page_size=25&country=us&f_has_lyrics=1&apikey=' + musixmatchkey,
        method: 'GET',
    };
    var req = https.request(options, res => {
        res.setEncoding('utf8');
        var returnData = "";

        res.on('data', chunk => {
            returnData = returnData + chunk;
        });

        res.on('end', () => {
            callback(returnData);
        });
    });
    req.end();
}

function getLyrics(mmid, callback) {
    var options = {
        host: 'api.musixmatch.com',
        port: 443,
        path: '/ws/1.1/track.lyrics.get?commontrack_id=' + encodeURIComponent(mmid) + '&apikey=' + musixmatchAPIkey,
        method: 'GET',
    };
    var req = https.request(options, res => {
        res.setEncoding('utf8');
        var returnData = "";

        res.on('data', chunk => {
            returnData = returnData + chunk;
        });

        res.on('end', () => {
            callback(returnData);
        });
    });
    req.end();
}


///////////////JSON parser methods///////////////
function parseSongJson(response) {
    var songs = [];
    var parsedResponse = JSON.parse(response);
    //console.log(parsedResponse.message);
    var jsonCount = parsedResponse.message.body.track_list.length;

    for (var i = 0; i < jsonCount; i++) {
        console.log(i);
        songs.push(new Song(parsedResponse.message.body.track_list[i].track.artist_name, parsedResponse.message.body.track_list[i].track.track_name, parsedResponse.message.body.track_list[i].track.commontrack_id, parsedResponse.message.body.track_list[i].track.artist_id));
    }

    //console.log(songs);
    return songs;
}
function parseLyricsJson(response) {
    var lyricsBody = JSON.parse(response).message.body.lyrics.lyrics_body;
    console.log(lyricsBody);

    var lyrics = lyricsBody.split('\n');
    console.log(lyrics);
    lyrics = lyrics.filter(function (entry) { return entry.trim() != ''; });
    lyrics = lyrics.filter(function (entry) { return !entry.startsWith("**") });
    console.log(lyrics);
    return lyrics;
}


///////////////Helper Functions///////////////
//could be improved later
function selectLine(lyrics) {
    var lineNum = Math.random(0, lyrics.length - 1);
    return lyrics[lineNum] + '\n' + lyrics[lineNum + 1];
}


///////////////Classes///////////////
function Song(artist, title, mmid, mmidartist) {
    this.artist = artist;
    this.title = title;
    this.mmid = mmid;
    this.mmidartist = mmidartist;
    //this.lyric = selectLine(getLyrics(mmid));
}
