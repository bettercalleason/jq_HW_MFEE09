const colors = ["Blue", "Red", "Green", "Yellow"]
let correctInt = 0

function startGame() {
    setInterval(timer, 1000)
    reset()
}

function checkColor(color, correctAnswer) {
    if (color === correctAnswer) {
        correctInt++;
        $('#checkmark').addClass('fadeAway')
    } else {
        $('#wrong').addClass('fadeAway')
    }

    setTimeout(function () {
        $('#checkmark').removeClass('fadeAway')
        $('#wrong').removeClass('fadeAway')
    }, 500);
    reset()
    $('#correct').html(correctInt)
}

function reset() {

    $('#start').css('display', 'none')

    const random = Math.floor(Math.random() * 4)
    let correctAnswer = colors[random]

    $('#color1').html(correctAnswer)
    $('#color2').css('color', correctAnswer)

    if (random + 1 == 4) {
        $('#color2').html(colors[random - 3])
    } else {
        $('#color2').html(colors[random + 1])
    }

    if (random - 1 == -1) {
        $('#color1').css('color', colors[random + 3])
    } else {
        $('#color1').css('color', colors[random - 1])
    }

    $('#color1').css('display', 'block')
    $('#color2').css('display', 'block')


    addClick('Blue', correctAnswer)
    addClick('Red', correctAnswer)
    addClick('Green', correctAnswer)
    addClick('Yellow', correctAnswer)
}

function addClick(color, correctAnswer) {
    var colorSpan = document.getElementById(color);
    let onclick = "checkColor('".concat(color, "','", correctAnswer, "')");
    colorSpan.setAttribute("onclick", onclick);
}


let countdown = 30
function timer() {
    $('#time').html(countdown)
    if (countdown == 0) {
        clearInterval(timer)
        alert('Game over. Score:' + correctInt)
        location.reload()
    }
    countdown--;
}