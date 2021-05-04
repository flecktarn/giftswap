var senderNames;
var map;
var namesLeft;
var delay = 5;

main()

$("#beginbutton").click(function(){
    main();
})

$("#resetbutton").click(function(){
    document.location.reload();
});




function shuffleArray(array) {
    let curId = array.length;
    // There remain elements to shuffle
    while (0 !== curId) {
        // Pick a remaining element
        let randId = Math.floor(Math.random() * curId);
        curId -= 1;
        // Swap it with the current element.
        let tmp = array[curId];
        array[curId] = array[randId];
        array[randId] = tmp;
    }
    return array;
}

$("#showrecipientbutton").click(function(){
    $("#hideme").show();
});

function removeValueFromArray(value,array){
    //assumes that there is only one instance
    let array2 = [...array];
    for(let i=0; i<array.length; i++){
        if(array2[i] == value) {
            array2.splice(i,1);
        }
    }
    return array2;
}

function checkClearance(){
    if($("#check1").is(':checked')
    && $("#check2").is(':checked')  ){
        $("#showrecipientbutton").prop('disabled',false);
    }
    else{
        $("#showrecipientbutton").prop('disabled',true);
    }
}

$('#showrecipientbutton').click(function(){
    $('#counter').html(5);
    $('#bar').animate({width:'toggle'},{duration:1000*delay,easing:'linear'});
    setTimeout(function(){
        $('#bar').animate({width:'toggle'},{duration:0,easing:'linear'});
        $('#hideme').hide()
        $('#check1').prop('checked',false);
        $('#check2').prop('checked',false);
        $("#showrecipientbutton").prop('disabled',true);
        iterate();
        }, 1000*delay);
    for(let i=0; i<5; i++){
        setTimeout(function(){$('#counter').html(i)},delay*1000-1000*i);
    }
});

function initialize(senderNames){
    map = []
    var recipientNames = [...senderNames]
    for(let i=0; i<senderNames.length; i++){
        //if there are only three people left we need to avoid leaving one sender with no one to send to
        if(recipientNames.length == 3){
            //shuffle the array
            recipientNames = shuffleArray(recipientNames);
            map.push([senderNames[i],recipientNames[1]]);
            map.push([senderNames[i+1],recipientNames[2]]);
            map.push([senderNames[i+2],recipientNames[0]]);
            
            //now escape

            for(let i=0; i<map.length; i++){
                console.log(map[i][0] + ' buys for ' + map[i][1]);
            }
            shuffleArray(map);
            return map;
        }
        else{
            let name = senderNames[i];
            let recipients = removeValueFromArray(name,recipientNames);
            let randomIndex = Math.floor(Math.random()*recipients.length);
            let chosenRecipient = recipients[randomIndex];
            let mapping = [name,chosenRecipient];
            map.push(mapping);
            recipientNames = removeValueFromArray(chosenRecipient,recipientNames);
        }

    }


}

function iterate(){
    if (map.length == 0){
        //the end
        $('#main').hide();
        $('#end').show();
        console.log('done');

    }
    else{
        $("#showrecipientbutton").prop('disabled',true);
        $('#name1').html(map[0][0]);
        $('#name2').html(map[0][0]);
        $('#name3').html(map[0][1]);
        map.shift();
    }
}

function duplicates(array){
    array.sort()
    for(let i=0; i<array.length-1; i++){
        if(array[i] == array[i+1]){
            return true;
        }
    }
    return false;
}


function main(){
senderNames = $('#names').val().split('\n');
//remove whitespace
let i = senderNames.length;    
while(i--) !/\S/.test(senderNames[i]) && senderNames.splice(i, 1);
if(senderNames.length < 3){
    alert("Please specify at least three participants.");
    return;
}
//check for duplicates
if (duplicates(senderNames)){
    alert("Duplicate entries detected, please ensure that each entry is unique.")
    return;
}

senderNames = shuffleArray(senderNames);
namesLeft = senderNames.length;
map = initialize(senderNames);
$('#start').hide();
$('#main').show();
$('#hideme').hide();
iterate();
}