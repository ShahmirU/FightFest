const init = function(e){
	//let winner = document.querySelector("#winning_fighter");
	let fighter1 = document.location.search.replace(/^.*?\=/,'').split('|')[0].replace(new RegExp("%20", "g"), ' ');
    let fighter2 = document.location.search.replace(/^.*?\=/,'').split('|')[1].replace(new RegExp("%20", "g"), ' ');
    let odds1 = document.location.search.replace(/^.*?\=.*odds\=/,'').split('|')[0];
    let odds2 = document.location.search.replace(/^.*?\=.*odds\=/,'').split('|')[1];
	console.log(fighter1);
    console.log(fighter2);
    console.log(odds1);
	console.log(odds2);
	predict_winner(fighter1, fighter2, odds1, odds2);
}

function predict_winner(fighter1, fighter2, odds1, odds2){
	$(document).ready(function () {
        $.get('/predict'+'?fighter1='+fighter1+'&fighter2='+fighter2+'&odds1='+odds1+'&odds2='+odds2, function(data){
            if(!data){
                console.log("Unable to predict winner");
                alert("Error: Unable to predict winner");
            }
            else{
                console.log(data);
                document.querySelector("#winning_fighter").innerHTML = data[0].replace("↓", "").replace("↑", "");
                document.querySelector("#winning_probability").innerHTML = Math.round(data[1]) + '%';
                // var image = document.getElementById("winner-img");
                // image.src = "https://media.gettyimages.com/photos/conor-mcgregor-before-his-match-against-khabib-nurmagomedov-in-ufc-picture-id1052272316?k=6&m=1052272316&s=612x612&w=0&h=btuM29yhHh-D-PX7MlsdrXSzQiddv4nk9KAayX4vZKo="
                // console.log(image.src);
                // image.alt = data[0].replace("↓", "").replace("↑", "");
            }
        })
    });  
}

document.addEventListener('DOMContentLoaded', function(){
	init();
});