function populate(s1, s2, s3){
    var s1 = document.getElementById(s1);
    var s2 = document.getElementById(s2);
    var s3 = document.getElementById(s3);
    s2.innerHTML = "";
    s3.innerHTML = "";
    var optionArray = [];

    $(document).ready(function () {
        $.get('/'+s1.value.toLowerCase().replace(" ", "").replace("'", ""), function(data){
            if(!data){
                console.log("Unable to obtain fighter details");
                alert("Error: Unable to obtain fighter details");
            }
            else{
                optionArray = data;
                optionArray.unshift("|");
                pairToOption(optionArray, s2, s3);
            }
        })
    });    
}

function pairToOption(optionArray, s2, s3){
    for (var option in optionArray){
        var pair = optionArray[option].split("|");
        var newOption1 = document.createElement("option");
        var newOption2 = document.createElement("option");
        newOption1.value = newOption2.value = pair[1];
        newOption1.innerHTML = newOption2.innerHTML = pair[0];
        s2.options.add(newOption1);
        s3.options.add(newOption2);
    }
}

const predict = function(e){
    let btn = document.querySelector('#predictbutton');
    btn.addEventListener('click', function(){
        var x = document.getElementById('fighter1');
        var y = document.getElementById('fighter2');
        if(x.value == '' | y.value == ''){
            alert('Please select two fighters');
        }
        else if (x.value == y.value){
            alert('You cannot choose the same fighter');
        }
        else{
            window.document.location = './Prediction.html' + '?fighters=' +
            x.value + '|' + y.value;
        }
    });
};

document.addEventListener('DOMContentLoaded', function(){
    predict();
});