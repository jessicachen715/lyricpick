'use strict';
const Alexa = require('alexa-sdk');
const musixmatchkey = '8b7654870c8395335a30eb19039218f6';

//=========================================================================================================================================
//TODO: The items below this comment need your attention
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this:  var APP_ID = "amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1";
var APP_ID = undefined;

//This function returns a descriptive sentence about your data.  Before a user starts a quiz, they can ask about a specific data element,
//like "Ohio."  The skill will speak the sentence from this function, pulling the data values from the appropriate record in your data.
function getSpeechDescription(item)
{
    //var sentence = item.Lyric + " is the " + item.StatehoodOrder + "th state, admitted to the Union in " + item.StatehoodYear + ".  The capital of " + item.Lyric + " is " + item.Capital + ", and the abbreviation for " + item.Lyric + " is <break strength='strong'/><say-as interpret-as='spell-out'>" + item.Abbreviation + "</say-as>.  I've added " + item.Lyric + " to your Alexa app.  Which other state or capital would you like to know about?";
    var sentence = "Description goes here";
    return sentence;
}

//We have provided two ways to create your quiz questions.  The default way is to phrase all of your questions like: "What is X of Y?"
//If this approach doesn't work for your data, take a look at the commented code in this function.  You can write a different question
//structure for each property of your data.
function getQuestion(counter, property, item)
{
    switch(property)
    {
        case "Song":
            return "Here is your " + counter + "th question.  What is the song title of " + item.Lyric + "?";

            //return "Here is your " + counter + "th question.  What is the song title of " + item.Lyric + "?" + data2[2].artist;
        //break;
        default:
            return "Here is your " + counter + "th question.  What is the " + formatCasing(property) + " of " + item.Lyric + "?";
            //return "Here is your " + counter + "th question.  What is the " + formatCasing(property) + " of " + item.Lyric + "?" + data2[2].artist;
    }
}

//This is the function that returns an answer to your user during the quiz.  Much like the "getQuestion" function above, you can use a
//switch() statement to create different responses for each property in your data.  For example, when this quiz has an answer that includes
//a state abbreviation, we add some SSML to make sure that Alexa spells that abbreviation out (instead of trying to pronounce it.)
function getAnswer(property, item)
{
    switch(property)
    {
        case "Song":
            return "The song title of " + item.Lyric + " is " + item[property] + ". ";
        //break;
        default:
            return "The " + formatCasing(property) + " of " + item.Lyric + " is " + item[property] + ". ";
        //break;
    }
}
function Song(artist,title,mmid,mmidartist) {
    this.artist = artist;
    this.title = title;
    this.mmid = mmid;
    this.mmidartist = mmidartist;
    this.lyric = selectLine(getLyrics(mmid));
}
//pagenum can default 1
//takes in the pagenum
//returns an array of 25 Songs
function getSongs(pageNum) {
    var result = [];
    var songs = []
    //get list of songs in json
    var https = require('https');
    var response = {
        host: '//api.musixmatch.com',
        port: 443,
        path: '/ws/1.1/chart.tracks.get?page=' + encodeURIComponent(pageNum) + '&page_size=25&country=us&f_has_lyrics=1&apikey=' + musixmatchAPIkey,
        method: 'GET' }
    //parse list of songs from json to array
    var jsonCount = Object.keys(response.message.body.track_list).length;
    for (var i = 0; i < jsonCount; i++) {
        songs.push(new Song(response.message.body.track_list[i].track.artist_name,response.message.body.track_list[i].track.track_name,response.message.body.track_list[i].track.commontrack_id,response.message.body.track_list[i].track.artist_id));
    }
    return result
}

function getLyrics(mmid) {
    var result = [];
    //get lyrics in json
    var https = require('https');
    var response = {
        host: '//api.musixmatch.com',
        port: 443,
        path: '/ws/1.1/track.lyrics.get?commontrack_id=' + encodeURIComponent(mmid) + '&apikey=' + musixmatchAPIkey,
        method: 'GET'
    }
    //get lyrics_body from json
    var lyricsBody = response.message.body.lyrics.lyrics_body;
    //var lyricsBody = Object.keys(response.message.body.lyrics.lyrics_body);
    
    //parse lyrics and clean up
    lyrics = lyricsBody.split('\n');
    lyrics = lyrics.filter(function(entry) { return entry.trim() != ''; });
    lyrics = lyrics.filter(function (entry) {return !entry.startsWith("**")});

    return lyrics;
}
function selectLine(lyrics) {
    var lineNum = Math.random(0, lyrics.length - 1);
    return lyrics[lineNum] + '\n' + lyrics[lineNum + 1];
}



//This is a list of positive speechcons that this skill will use when a user gets a correct answer.  For a full list of supported
//speechcons, go here: https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speechcon-reference
var speechConsCorrect = ["Booya", "All righty", "Bam", "Bazinga", "Bingo", "Boom", "Bravo", "Cha Ching", "Cheers", "Dynomite",
"Hip hip hooray", "Hurrah", "Hurray", "Huzzah", "Oh dear.  Just kidding.  Hurray", "Kaboom", "Kaching", "Oh snap", "Phew",
"Righto", "Way to go", "Well done", "Whee", "Woo hoo", "Yay", "Wowza", "Yowsa"];

//This is a list of negative speechcons that this skill will use when a user gets an incorrect answer.  For a full list of supported
//speechcons, go here: https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speechcon-reference
var speechConsWrong = ["Argh", "Aw man", "Blarg", "Blast", "Boo", "Bummer", "Darn", "D'oh", "Dun dun dun", "Eek", "Honk", "Le sigh",
"Mamma mia", "Oh boy", "Oh dear", "Oof", "Ouch", "Ruh roh", "Shucks", "Uh oh", "Wah wah", "Whoops a daisy", "Yikes"];

//This is the welcome message for when a user starts the skill without a specific intent.
var WELCOME_MESSAGE = "Welcome to Lyric Pick!  You can ask me to start a quiz.";
//soon will have other intents of selecting a particular artist ot difficulty

//This is the message a user will hear when they start a quiz.
var START_QUIZ_MESSAGE = "OK.  I will give you 10 lines of lyrics and either ask for the artist or song title.";

//This is the message a user will hear when they try to cancel or stop the skill, or when they finish a quiz.
var EXIT_SKILL_MESSAGE = "Thank you for playing Lyric Pick!  Let's play again soon!";

//This is the message a user will hear after they ask (and hear) about a specific data element.
var REPROMPT_SPEECH = "Which other state or capital would you like to know about?";

//This is the message a user will hear when they ask Alexa for help in your skill.
var HELP_MESSAGE = "I don't do much except play games. Would you like to start a quiz?";


//This is the response a user will receive when they ask about something we weren't expecting.  For example, say "pizza" to your
//skill when it starts.  This is the response you will receive.
function getBadAnswer(item) { return "I'm sorry. " + item + " is not something I know very much about in this skill. " + HELP_MESSAGE; }

//This is the message a user will receive after each question of a quiz.  It reminds them of their current score.
function getCurrentScore(score, counter) { return "Your current score is " + score + " out of " + counter + ". "; }

//This is the message a user will receive after they complete a quiz.  It tells them their final score.
function getFinalScore(score, counter) { return "Your final score is " + score + " out of " + counter + ". "; }

//These next four values are for the Alexa cards that are created when a user asks about one of the data elements.
//This only happens outside of a quiz.

//If you don't want to use cards in your skill, set the USE_CARDS_FLAG to false.  If you set it to true, you will need an image for each
//item in your data.
var USE_CARDS_FLAG = true;

//This is what your card title will be.  For our example, we use the name of the state the user requested.
function getCardTitle(item) { return item.Lyric;}

//This is the small version of the card image.  We use our data as the naming convention for our images so that we can dynamically
//generate the URL to the image.  The small image should be 720x400 in dimension.
function getSmallImage(item) { return "https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/state_flag/720x400/" + item.Abbreviation + "._TTH_.png"; }

//This is the large version of the card image.  It should be 1200x800 pixels in dimension.
function getLargeImage(item) { return "https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/state_flag/1200x800/" + item.Abbreviation + "._TTH_.png"; }

//=========================================================================================================================================
//TODO: Replace this data with your own.
//=========================================================================================================================================
var data = [
                { Lyric: "You've got to hold on to what we've got", Artist: "Bon Jovi", Song: "Living on a Prayer" },
                { Lyric: "You were made to go out and get her", Artist: "The Beatles", Song: "Hey Jude" },
                { Lyric: "I took my baby on a Saturday bang", Artist: "Michael Jackson", Song: "Black or White" },
                { Lyric: "Look inside you and be strong", Artist: "Mariah Carey", Song: "Hero" },
                { Lyric: "Let me see what spring is like", Artist: "Frank Sinatra", Song: "Fly me to the moon" },
                { Lyric: "You've got to make a big impression", Artist: "Christina Aguilera", Song: "Genie in a Bottle" },
                { Lyric: "You think you've got the right but I think you've got it wrong", Artist: "Toni Basil", Song: "Mickey" },
                { Lyric: "But above all this I wish you love", Artist: "Whitney Houston", Song: "I will always love you" },
                { Lyric: "There's a fire starting in my heart", Artist: "Adele", Song: "Rolling in the Deep" },
                { Lyric: "I played with your heart, got lost in the game", Artist: "Britney Spears", Song: "Oops I did it again" }

];
var data2 = [new Song('someone','title',123455,1224353),new Song('someone','title',123455,1224353),new Song('someone','title',123455,1224353)];

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

var counter = 0;

var states = {
    START: "_START",
    QUIZ: "_QUIZ"
};

const handlers = {
     "LaunchRequest": function() {
        this.handler.state = states.START;
        this.emitWithState("Start");
     },
    "QuizIntent": function() {
        this.handler.state = states.QUIZ;
        this.emitWithState("Quiz");
    },
    "AnswerIntent": function() {
        this.handler.state = states.START;
        this.emitWithState("AnswerIntent");
    },
    "AMAZON.HelpIntent": function() {
        this.emit(":ask", HELP_MESSAGE, HELP_MESSAGE);
    },
    "Unhandled": function() {
        this.handler.state = states.START;
        this.emitWithState("Start");
    }
};

var startHandlers = Alexa.CreateStateHandler(states.START,{
    "Start": function() {
        this.emit(":ask", WELCOME_MESSAGE, HELP_MESSAGE);
    },
    "AnswerIntent": function() {
        var item = getItem(this.event.request.intent.slots);

        if (item && item[Object.getOwnPropertyNames(data[0])[0]] != undefined)
        {
          console.log("\nMEMO's TEST\n");
            if (USE_CARDS_FLAG)
            {
                var imageObj = {smallImageUrl: getSmallImage(item), largeImageUrl: getLargeImage(item)};
                this.emit(":askWithCard", getSpeechDescription(item), REPROMPT_SPEECH, getCardTitle(item), getTextDescription(item), imageObj);
            }
            else
            {
                this.emit(":ask", getSpeechDescription(item), REPROMPT_SPEECH);
            }
        }
        else
        {
            this.emit(":ask", getBadAnswer(item), getBadAnswer(item));

        }
    },
    "QuizIntent": function() {
        this.handler.state = states.QUIZ;
        this.emitWithState("Quiz");
    },
    "AMAZON.StopIntent": function() {
        this.emit(":tell", EXIT_SKILL_MESSAGE);
    },
    "AMAZON.CancelIntent": function() {
        this.emit(":tell", EXIT_SKILL_MESSAGE);
    },
    "AMAZON.HelpIntent": function() {
        this.emit(":ask", HELP_MESSAGE, HELP_MESSAGE);
    },
    "Unhandled": function() {
        this.emitWithState("Start");
    }
});


var quizHandlers = Alexa.CreateStateHandler(states.QUIZ,{
    "Quiz": function() {
        this.attributes["response"] = "";
        this.attributes["counter"] = 0;
        this.attributes["quizscore"] = 0;
        this.emitWithState("AskQuestion");
        //this.data2 = getSongs();
    },
    "AskQuestion": function() {
        if (this.attributes["counter"] == 0)
        {
            this.attributes["response"] = START_QUIZ_MESSAGE + " ";
        }

        var random = getRandom(0, data.length-1);
        var item = data[random];
        //var property = 1;
        //old data
        var propertyArray = Object.getOwnPropertyNames(item);
        var property = propertyArray[getRandom(1, propertyArray.length - 1)];

        this.attributes["quizitem"] = item;
        this.attributes["quizproperty"] = property;
        this.attributes["counter"]++;

        var question = getQuestion(this.attributes["counter"], property, item);
        var speech = this.attributes["response"] + question;

        this.emit(":ask", speech, question);
    },
    "AnswerIntent": function() {
        var response = "";
        var item = this.attributes["quizitem"];
        var property = this.attributes["quizproperty"]

        var correct = compareSlots(this.event.request.intent.slots, item[property]);

        if (correct)
        {
            response = getSpeechCon(true);
            this.attributes["quizscore"]++;
        }
        else
        {
            response = getSpeechCon(false);
        }

        response += getAnswer(property, item);

        if (this.attributes["counter"] < 10)
        {
            response += getCurrentScore(this.attributes["quizscore"], this.attributes["counter"]);
            this.attributes["response"] = response;
            this.emitWithState("AskQuestion");
        }
        else
        {
            response += getFinalScore(this.attributes["quizscore"], this.attributes["counter"]);
            this.emit(":tell", response + " " + EXIT_SKILL_MESSAGE);
        }
    },
    "AMAZON.StartOverIntent": function() {
        this.emitWithState("Quiz");
    },
    "AMAZON.StopIntent": function() {
        this.emit(":tell", EXIT_SKILL_MESSAGE);
    },
    "AMAZON.CancelIntent": function() {
        this.emit(":tell", EXIT_SKILL_MESSAGE);
    },
    "AMAZON.HelpIntent": function() {
        this.emit(":ask", HELP_MESSAGE, HELP_MESSAGE);
    },
    "Unhandled": function() {
        this.emitWithState("AnswerIntent");
    }
});

function compareSlots(slots, value)
{
    for (var slot in slots)
    {
        if (slots[slot].value != undefined)
        {
            if (slots[slot].value.toString().toLowerCase() == value.toString().toLowerCase())
            {
                return true;
            }
        }
    }
    return false;
}

function getRandom(min, max)
{
    return Math.floor(Math.random() * (max-min+1)+min);
}

function getRandomSymbolSpeech(symbol)
{
    return "<say-as interpret-as='spell-out'>" + symbol + "</say-as>";
}

function getItem(slots)
{
    var propertyArray = Object.getOwnPropertyNames(data[0]);
    var value;

    for (var slot in slots)
    {
        if (slots[slot].value !== undefined)
        {
            value = slots[slot].value;
            for (var property in propertyArray)
            {
                var item = data.filter(x => x[propertyArray[property]].toString().toLowerCase() === slots[slot].value.toString().toLowerCase());
                if (item.length > 0)
                {
                    return item[0];
                }
            }
        }
    }
    return value;
}

function getSpeechCon(type)
{
    var speechCon = "";
    if (type) return "<say-as interpret-as='interjection'>" + speechConsCorrect[getRandom(0, speechConsCorrect.length-1)] + "! </say-as><break strength='strong'/>";
    else return "<say-as interpret-as='interjection'>" + speechConsWrong[getRandom(0, speechConsWrong.length-1)] + " </say-as><break strength='strong'/>";
}

function formatCasing(key)
{
    key = key.split(/(?=[A-Z])/).join(" ");
    return key;
}

function getTextDescription(item)
{
    var text = "";

    for (var key in item)
    {
        text += formatCasing(key) + ": " + item[key] + "\n";
    }
    return text;
}

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers, startHandlers, quizHandlers);
    alexa.execute();
};
