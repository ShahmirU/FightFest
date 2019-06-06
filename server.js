var express = require('express');
const request = require('request');
const cheerio = require('cheerio');

var app = express();

var roster = [];

app.use(express.static(__dirname + '/public'));

var rosterLink = 'https://www.bloodyelbow.com/2013/1/29/3928296/ufc-roster-current-list-fighters';

// ROUTES
app.get('/', function(request, response){
    response.send("FightFest");
});
/* Division Routes */
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
/* Prediction Route */
app.get('/predict', function(req, response){
    request(rosterLink, (error, 
        resp, html) => {
            var fighter1 = req.query.fighter1;
            var fighter2 = req.query.fighter2;
            if(!error && resp.statusCode == 200){
                const $ = cheerio.load(html);
                f1record = $(`td:contains(${fighter1})`).next().next().text().replace(/\([0-9]/g, "").replace("NC)", "").trim().split("–"); 
                f2record = $(`td:contains(${fighter2})`).next().next().text().replace(/\([0-9]/g, "").replace("NC)", "").trim().split("–"); 
                console.log(f1record);
                console.log(f2record);
                f1wins = Number(f1record[0]);
                f1losses = Number(f1record[1]);
                f2wins = Number(f2record[0]);
                f2losses = Number(f2record[1]);
                f1score = ((1.5*f1wins) - f1losses) + (0.1*(f1wins+f1losses));
                f2score = ((1.5*f2wins) - f2losses) + (0.1*(f2wins+f2losses));
                if(f1score > f2score){
                    response.send([fighter1, (f1score * 100) / (f1score + f2score)]);
                }
                else if(f2score > f1score){
                    response.send([fighter2, (f2score * 100) / (f1score + f2score)]);
                }
                else{
                    if(f1wins > f2wins){
                        response.send([fighter1, 51]);
                    }
                    else if (f1wins < f2wins){
                        response.send([fighter2, 51]);
                    }
                    else {
                        response.send([fighter1, 50]);
                    }
                }
            }
        });
});


function getRoster(tableID, response){;
    request(rosterLink, (error, 
        resp, html) => {
            if(!error && resp.statusCode == 200){
            const $ = cheerio.load(html);

            const heavyweightTable = $(tableID);
            roster = heavyweightTable.find('td img').parent().next().map(function(index, element){
                return $(element).text().trim().replace(/[↑↓*]/g, "") + "|".concat($(element).text().trim().replace("*", ""));
            }).get();
            roster.sort();
            response.send(roster);
            }
        });
}

app.listen(3000, function(){
    console.log("Server running on Port 3000");
});