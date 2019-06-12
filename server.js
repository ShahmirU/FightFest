var express = require('express');
const request = require('request');
const cheerio = require('cheerio');

var app = express();

var roster = [];

app.use(express.static(__dirname + '/public'));

var rosterLink = 'https://www.bloodyelbow.com/2013/1/29/3928296/ufc-roster-current-list-fighters';
// var jonesgoogle = 'https://en.wikipedia.org/wiki/List_of_current_UFC_fighters';
// request(jonesgoogle, (error, 
//     resp, html) => {
//         console.log(resp.statusCode);
//         if(!error && resp.statusCode == 200){
//             const $ = cheerio.load(html);
//             // var f1_sherdog = $('#JolIg').html();
//             var f1_sherdog = $(".wikitable sortable jquery-tablesorter").html();
//             console.log(f1_sherdog);
//         }
//     });

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
            var odds1 = Math.abs(Number(req.query.odds1));
            var odds2 = Math.abs(Number(req.query.odds2));
            console.log(odds1);
            console.log(odds2);
            if(!error && resp.statusCode == 200){
                const $ = cheerio.load(html);
                f1record = $(`td:contains(${fighter1})`).next().next().text().replace(/\([0-9]/g, "").replace("NC)", "").trim().split("–"); 
                f2record = $(`td:contains(${fighter2})`).next().next().text().replace(/\([0-9]/g, "").replace("NC)", "").trim().split("–"); 
                f1wins = Number(f1record[0]);
                f1losses = Number(f1record[1]);
                f2wins = Number(f2record[0]);
                f2losses = Number(f2record[1]);
                f1score = odds1 + (50 + (10*f1wins) - 7*f1losses) + (0.33*(f1wins+f1losses));
                f2score = odds2 + (50 + (10*f2wins) - 7*f2losses) + (0.33*(f2wins+f2losses));
                console.log(f1score);
                console.log(f2score);
                if(f1score > f2score){
                    response.send([fighter1, ((f1score)/(f1score + f2score))*100]);
                }
                else if(f2score > f1score){
                    response.send([fighter2, ((f2score)/(f1score + f2score))*100]);
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