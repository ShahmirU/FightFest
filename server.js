var express = require('express');
const request = require('request');
const cheerio = require('cheerio');

var mma = require('./mma-api/lib/mma')
var app = express();

var roster = [];

app.use(express.static(__dirname + '/public'));

var rosterLink = 'https://www.bloodyelbow.com/2013/1/29/3928296/ufc-roster-current-list-fighters';

//mma.fighter("Jon Jones", function(data) {
//    console.log(data);
//  });


// ROUTES
app.get('/', function(request, response){
    response.send("FightFest");
});
app.get('/heavyweight', function(req, response){
    getRoster('#5S8t1L', response);
})
app.get('/lightheavyweight', function(req, response){
    getRoster('#9jQkgS', response);
})
app.get('/middleweight', function(req, response){
    getRoster('#BxAkcF', response);
})
app.get('/welterweight', function(req, response){
    getRoster('#ZpXvWW', response);
})
app.get('/lightweight', function(req, response){
    getRoster('#cRZnR2', response);
})
app.get('/featherweight', function(req, response){
    getRoster('#9vzGr0', response);
})
app.get('/bantamweight', function(req, response){
    getRoster('#j2vMkX', response);
})
app.get('/flyweight', function(req, response){
    getRoster('#i2pAdK', response);
})
app.get('/womensfeatherweight', function(req, response){
    getRoster('#5qxOwM', response);
})
app.get('/womensbantamweight', function(req, response){
    getRoster('#6myNOQ', response);
})
app.get('/womensflyweight', function(req, response){
    getRoster('#GQxa5c', response);
})
app.get('/womensstrawweight', function(req, response){
    getRoster('#NopyuT', response);
})


function getRoster(tableID, response){;
    request(rosterLink, (error, 
        resp, html) => {
            if(!error && resp.statusCode == 200){
            const $ = cheerio.load(html);

            const heavyweightTable = $(tableID);
            roster = heavyweightTable.find('td img').parent().next().map(function(index, element){
                return $(element).text().trim().replace(/[↑↓*]/g, "") + "|".concat($(element).text().trim().replace("*", "").toLowerCase().replace(" ", ""));
            }).get();
            console.log(roster);
            roster.sort();
            response.send(roster);
            }
        });
}

app.listen(3000, function(){
    console.log("Server running on Port 3000");
});