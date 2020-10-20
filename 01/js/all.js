let bulletIntervel = null;
let bulletRight = parseInt($(".bullet").css("left"));

let bulletNow = null;
let totalWidth = parseInt("-680px");
let move = 20;
let point = 0; //分數
let hitedAsteroidArr = [];
let bulletCount = 10;
let isStop = false;


$('.start-again').on("click",function(){
    window.location.reload()
});

let arrBulletCount = function() {
    $('.bullet-count').text(bulletCount.toString())
}

$(document).on("keydown", function (e) {
    if(isStop)
        return
    if (e.which === 32) {
        let jetTop = parseInt($(".jet").css("top"))+50;
        let bulletLeft = parseInt($(".jet").css("left"))+100;
        let d = new Date();
        let id = d.getTime();
        let bulletSound = new Audio("./sound/bullet-lazer.mp3");
        if($('.bullet').length < 10){
            bulletSound.play();
            $(".box").append(
                `<div class="bullet" id="b_${id}" style="top: ${jetTop}px;left: ${bulletLeft}px;"></div>`
            );
            bulletCount --;
            arrBulletCount();
        }
    }
});

$(document).on("keydown", function (e) {
    if(isStop)
        return            
    let keycode = e.which;
    if (keycode === 37) {
    //左
    let newLeft = parseInt($(".jet").css("left"));
    if (newLeft > 0) {
        $(".jet").css("left", "-=20");
    }
    } else if (keycode === 38) {
    //上
    let newTop = parseInt($(".jet").css("top"));
    if (newTop > 0) {
        $(".jet").css("top", "-=20");
    }
    } else if (keycode === 39) {
    //右
    let newRight = parseInt($(".jet").css("left"));
    if (newRight < 700 - move) {
        $(".jet").css("left", "+=20");
    }
    } else if (keycode === 40) {
    //下
    let newDown = parseInt($(".jet").css("top"));
    if (newDown < 320 - move) {
        $(".jet").css("top", "+=20");
    }
    }
});

// 子彈
setInterval(function () {
    // $('.bullet').css('right','-=20');
    $(".bullet")
    .css("left", "+=20")
    .each(function () {
        if (parseInt($(this).css("left")) >= 780) {
            $(this).remove();
            bulletCount ++;
            arrBulletCount();
        }
    });
}, 200);


$(".game-cover :button").on("click",function(){
    $('.game-cover').css("display","none");            
    $('#count-down').trigger('play');
    setTimeout(function(){
        $('#bgm').trigger('play');
    },3000);
    
    let startTimeout = setTimeout(function(){
        if(isStop) clearTimeout(startTimeout);
        //隕石隨機出現
        let astRandTop = null;
        let astRandInterval = setInterval(function(){
            astRandTop = Math.floor(Math.random() * 340)
            let d = new Date()
            let id = d.getTime()
            $(".wrap").append(`<div class="asteroid" id="a_${id}" style="top:${astRandTop}px">
            <img src="./imgs/asteroid.svg" alt="">
                                            </div>`)
        },1000);
    },4000);


});
$(".game-cover :button").on("mouseenter",function(){
    // let btnSound = new Audio("./sound/btn.wav");
    // btnSound.play();
    $('#start-btn').trigger('play');
    isStop = false
});



// 隕石移動
let astMove = setInterval(function () {
    $(".asteroid").css("left", "-=10")
    .each(function () {
        //隕石出界移除
        if (parseInt($(this).css("right")) >= 740) {
            $(this).remove();
        }
    });
}, 100);
// 檢查飛機撞擊
let checkjHitJet = function (asteroidID){
    let asteroid = $(`#${asteroidID}`)
     // 飛機右上 X座標
    let jetRightTopX = parseInt($(".jet").css("left")) + 125
    let jetRightTopY = parseInt($(".jet").css("top"))
    // 飛機右下 Y座標
    let jetRightBottomX = parseInt($(".jet").css("left")) + 125
    let jetRightBottomY = parseInt($(".jet").css("top")) + 100

    // 隕石 X座標
    let astLeftTopX = parseInt(asteroid.css("left"))
    let astLeftTopY = parseInt(asteroid.css("top"))
    // 隕石 Y座標
    let astLeftBottomX = parseInt(asteroid.css("left"))
    let astLeftBottomY = parseInt(asteroid.css("top")) + 60
    
    //飛機掛掉
    let jetCrack = function(){
        $('#jet-explot').trigger('play');
        // $('#game-over-sound').trigger('play');                
        $('.jet>img').attr("src","./imgs/explosions-1.png");
        $('#bgm').trigger('pause');
        $('#bgm').get().currentTime = 0;
        isStop = true;
        clearInterval(astMove);
        setTimeout(function(){
            $('#jet-explot').trigger('pause');
            $('.game-over').css("display","block");
            $('#game-over-sound').trigger('play');
            $('.asteroid').remove();
        },1000);                
    }

    //判斷撞擊
    if( jetRightTopX >= astLeftTopX){

        // 隕石左上 <= 飛機右上 <= 隕石左下
        let statusA = astLeftTopY <= jetRightTopY && jetRightTopY <= astLeftBottomY

        // 隕石左上 <= 飛機右下 <= 隕石左下
        let statusB = astLeftTopY <= jetRightBottomY && jetRightBottomY <= astLeftBottomY

        // 飛機右上 <= 隕石左上 && 飛機右下 <= 隕石左下
        let statusC = jetRightTopY <= astLeftTopY && jetRightBottomY >= astLeftBottomY
        

        if( statusA || statusB || statusC ){
            return jetCrack();
        }
    }
}

// 檢查子彈撞擊
let checkHitBullet = function(asteroidID) {
    let asteroid = $(`#${asteroidID}`)
    
    if($('.bullet').length > 0)
    $('.bullet').each(function (index){
        let bulletID = $('.bullet').eq(index).attr('id')
        let bullet = $(`#${bulletID}`)
        
        // 子彈右上座標
        let bulletTopX = parseInt(bullet.css("left"))+20
        let bulletTopY = parseInt(bullet.css("top"))
        // 子彈右下
        let bulletBottomX = parseInt(bullet.css("left"))+20
        let bulletBottomY = parseInt(bullet.css("top"))+5

        // 隕石 X 座標
        let astLeftTopX = parseInt(asteroid.css("left"))
        // 隕石左上座標
        let astLeftTopY = parseInt(asteroid.css("top"))
        // 隕石左下座標
        let astLeftBottomY = parseInt(asteroid.css("top")) + 60

        // let astExplot = new Audio("./sound/ast-explot.mp3");
        let astCrack = function(){
            if(hitedAsteroidArr.indexOf(asteroidID) === -1)
                hitedAsteroidArr.push(asteroidID)
            point = hitedAsteroidArr.length
            asteroid.children('img').attr("src","./imgs/explosions-2.png");                    
            bullet.remove();
            bulletCount ++;
            arrBulletCount();
            $('.point').text(point.toString())
            let t = setTimeout(function(){
                $('#ast-explot').trigger('play');
                asteroid.remove();
                clearTimeout(t);
            },100)
        }

        if( bulletTopX >= astLeftTopX){
            // 隕石左上 <= 子彈右上 <= 隕石左下
            let statusA = astLeftTopY <= bulletTopY && bulletTopY <= astLeftBottomY
            // 隕石左上 <= 子彈右下 <= 隕石左下
            let statusB = astLeftTopY <= bulletBottomY && bulletBottomY <= astLeftBottomY
            // 子彈右上 >= 隕石左上 && 子彈右下 <= 隕石左下
            let statusC = bulletTopY >= astLeftTopY && bulletBottomY <= astLeftBottomY

            if( statusA ){
                astCrack();
            }
            else if ( statusB ){
                astCrack();                        
            }
            else if ( statusC ){
                astCrack();
            }
        }
    })
}

let checkItemsPosition = setInterval(function(){            
    if($('.asteroid').length > 0)
        $('.asteroid').each(function (index){
            let asteroidID = $('.asteroid').eq(index).attr('id')
                checkjHitJet(asteroidID)
                checkHitBullet(asteroidID)
            }
        )
},10);