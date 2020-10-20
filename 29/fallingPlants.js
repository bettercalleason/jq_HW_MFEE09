let isStart = false;
$('.info2').show();

$('.info2').click(function () {
    isStart = true;
    $('.info2').hide();
    $('.hp').css('width', '100');
})

//define:elderly movement
let elderly = $('.elderly');
let elderlyStyle = document.querySelector('.elderly').style;
let forward = "scale(1,1)";
let backward = "scale(-1,1)";

// elderly move by keybord
$(document).on('keydown', function (event) {
    if (!isStart) return;
    let code = event.which;
    let elderlyPosition = elderly.css('left');
    // elderly forward
    if (code == 39) {
        elderlyStyle.WebkitTransform = forward;
        if (parseInt(elderlyPosition) < 672) elderly.css('left', '+=5');
        // keydown alert
        $(".info").text("唉唷 使用健步如飛招式!").css('color','black').show().delay(1500).hide(0);
    }
    // elderly backward
    if (code == 37) {
        elderlyStyle.WebkitTransform = backward;
        if (parseInt(elderlyPosition) > 0) elderly.css('left', '-=5');
        // keydown alert
        $(".info")
          .text("唉唷 使用健步如飛招式!")
          .css("color", "black")
          .show()
          .delay(1500)
          .hide(0);
    }
});
// elderly move by mouse-forward
$('#rightBtn').click(function () {
    if (!isStart) return;
    let elderlyPosition = elderly.css('left');
    elderlyStyle.WebkitTransform = forward;
    if (parseInt(elderlyPosition) < 672) elderly.css('left', '+=10');
});

// elderly move by mouse-backward
$('#leftBtn').click(function () {
    if (!isStart) return;
    let elderlyPosition = elderly.css('left');
    elderlyStyle.WebkitTransform = backward;
    if (parseInt(elderlyPosition) > 0) elderly.css('left', '-=10');
});

// coin
function newCoin() {
    let coin = document.createElement('img');
    let idVal = new Date();
    coin.src = "./img/coin.png";
    coin.id = idVal.getTime();
    coin.style.position = "absolute";
    coin.style.top = '-30px';
    coin.style.left = (Math.floor(Math.random() * (768 - 0 + 1) + 0)) + 'px'; //randomly set plant
    coin.style.transition = '1s';
    document.querySelector('#coin').appendChild(coin);

    return coin;
};

function coinFall() {
    let coinId = newCoin().id;
    // all coins fall 
    let coinFallInterval = setInterval(() => {
        // actually is 336px, but it will add 48 finally due to setinterval
        if (parseInt($('#' + coinId).css('top')) < 288) {
            $('#' + coinId).css('top', "+=48");

            //compare if elderly get coin
            let coinB = parseInt($('#' + coinId).css('top')) + 32;
            let coinL = parseInt($('#' + coinId).css('left'));
            let coinR = parseInt($('#' + coinId).css('left')) + 32;
            let elderlyT = (400 - 128 - 48); //(-48)setinterval problem
            let elderlyL = parseInt(elderly.css('left')) + (40); //cut white area of img
            let elderlyR = parseInt(elderly.css('left')) + (128 - 40); //cut white area of img
            let compareL = (coinL <= elderlyR && coinL >= elderlyL);
            let compareR = (coinR >= elderlyL && coinR <= elderlyR);

            if (coinB >= elderlyT) {
                if (compareL || compareR) {
                    if (parseInt($('.hp').css('width')) < 100) { //width won't be 0
                        if (parseInt($('.hp').css('width')) <= 0) {
                            isStart = false;
                            $(".info2")
                              .text("Game Over! 請愛護行人")
                              .css("color", "red")
                              .show();
                        } else {
                            if (!isStart) return;
                            $('#' + coinId).remove();
                            $('.hp').css('width', '+=10');
                            $('.info').css('color', 'black').text('撿到錢,呷百二').show().delay(1500).hide(0);
                        }
                    }
                }
            }
        } else {
            // remove plant after arriving bottom during 2s
            $('#' + coinId).css('top', '336').delay(2000).remove();
        }
    }, 500);
}

// produce one falling coin every 2s 
let coinInterval = setInterval(() => {
    if (!isStart) return;
    coinFall();
}, 2000);


//plant
function newPlant() {
    let plant = document.createElement('img');
    let idVal = new Date();
    plant.src = "./img/plant-pot.png";
    plant.id = idVal.getTime();
    plant.style.position = "absolute";
    plant.style.top = '48px'; //fit balcont photo height
    plant.style.left = (Math.floor(Math.random() * (736 - 0 + 1) + 0)) + 'px'; //randomly set plant
    plant.style.transition = '1s';
    document.querySelector('#plant').appendChild(plant);

    return plant;
};

function plantFall() {
    let plantId = newPlant().id;
    // all plants fall 
    let plantFallInterval = setInterval(() => {
        // actually is 336px, but it will add 48 finally due to setinterval
        if (parseInt($('#' + plantId).css('top')) < 288) {
            $('#' + plantId).css('top', "+=48");

            // compare if plant hit elderly
            let plantB = parseInt($('#' + plantId).css('top')) + 64;
            let plantL = parseInt($('#' + plantId).css('left'));
            let plantR = parseInt($('#' + plantId).css('left')) + 64;
            let elderlyT = (400 - 128 - 48); //(-48)setinterval problem
            let elderlyL = parseInt(elderly.css('left')) + (40); //cut white area of img
            let elderlyR = parseInt(elderly.css('left')) + (128 - 40); //cut white area of img
            let compareL = (plantL <= elderlyR && plantL >= elderlyL);
            let compareR = (plantR >= elderlyL && plantR <= elderlyR);

            if (plantB >= elderlyT) {
                if (compareL || compareR) {
                    if (parseInt($('.hp').css('width')) < 10) { //width won't be 0
                        $('.hp').css('width', 0);
                        $('.blood>img').show().delay(2000).hide(0);
                        isStart = false;
                        $(".info2")
                          .text("Game Over! 請愛護行人")
                          .css("color", "red")
                          .show();
                    } else {
                        if (!isStart) return;
                        $('#' + plantId).remove();
                        $('.hp').css('width', '-=20');
                        $('.info').css('color', 'red').text('夭壽喔!物件毋通黑白囥!!').show().delay(2000).hide(0);
                        $('.blood>img').show().delay(3000).hide(0);
                    }
                }
            }
        } else {
            // remove plant after arriving bottom during 2s
            $('#' + plantId).css('top', '336').delay(2000).remove();
        }
    }, 1000);
}

// produce one falling plant per sec 
let plantInterval = setInterval(() => {
    if (!isStart) return;
    plantFall();
}, 1000);