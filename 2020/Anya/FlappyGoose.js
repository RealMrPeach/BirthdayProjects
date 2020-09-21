let canvas = document.getElementById("draw")
let ctx = canvas.getContext('2d')

let goose = document.getElementById("player")
let pipe_up = document.getElementById("pipe_up")
let pipe_down = document.getElementById("pipe_down")

let gameContainer = document.getElementById("gameContainer")
let pauseButton = document.getElementById("pauseButton")
let startButton = document.getElementById("startBtn")
let pausePage = document.getElementById("pausePage")
let resume = document.getElementById("resume")
let returnMenu = document.getElementById("return")

let scoreDisplay = document.getElementById("score")
let endPage = document.getElementById("endPage")
let restart = document.getElementById("restart")
let endReturn = document.getElementById("endReturn")
let highscoreDisplay = document.getElementById("highscore")
let finalScore = document.getElementById("endScore")

let player = {

    width: 90,
    height: 60,
    x: 0,
    y: 0,

    vely: 0
}

class obstacles {
    constructor(x1, y1, h1, x2, y2, h2, passed){
        this.x1 = x1
        this.y1 = y1
        this.h1 = h1

        this.x2 = x2
        this.y2 = y2
        this.h2 = h2

        this.width = 120;

        this.passed = passed
    }

    draw(){
        ctx.fillStyle = "red"
        ctx.drawImage(pipe_down, this.x2, this.y2, this.width, 1080 * this.width / 281)
        ctx.drawImage(pipe_up, this.x1, this.y1 - (1080*this.width / 281 - this.h1), this.width, 1080 * this.width / 281)
    }

    move(){
        this.x1 -= 10
        this.x2 -= 10    
    }
}

const GRAVITY = 0.9

const SPACEBAR = 32

let offset = 0

let gameover = false
let gamePaused = false

let startPress = false

let frameOffset = 0
let frames = 0
let score = 0

if(localStorage.getItem("highscore") == null){
    localStorage.setItem("highscore", 0)
}

let highscore = localStorage.getItem("highscore")

let keys = []
let obstaclesArray = []

let background = new Image()
background.src = "https://i.imgur.com/yU0SB2h.jpg"

function keyDown(event){
    keys[event.keyCode] = true

}

function keyUp(event){
    delete keys[event.keyCode]
}

function pauseGame(event){
    if(gameover == false && gamePaused == false){
        gamePaused = true
        pausePage.style.display = "flex"
    }
}

function resumeGame(event){
    if(gameover == false && gamePaused == true){
        gamePaused = false
        pausePage.style.display = "none"
        endPage.style.display = "none"
        requestAnimationFrame(nextFrame)
    }
}

function returnToMenu(event){
    if(gamePaused == true || gameover == true){
        pausePage.style.display = "none"
        endPage.style.display = "none"
        gameContainer.style.display = "none"
        container.style.display = "flex"
    }
}

function pageOnload(){
    
    document.addEventListener("keydown", keyDown)
    document.addEventListener("keyup", keyUp)

    pauseButton.addEventListener("click", pauseGame)
    resume.addEventListener("click", resumeGame)
    
    returnMenu.addEventListener("click", returnToMenu)

    endReturn.addEventListener("click", returnToMenu)
    restart.addEventListener("click", reset)
}

function reset(){

    endPage.style.display = "none"

    gameover = false
    gamePaused = false
    startPress = false

    frames = 0
    score = 0

    keys = []
    obstaclesArray = []

    player.vely = 0
    frameOffset = 0
    offset = 0
    scoreDisplay.innerHTML = "Score: " + score

    player.x = 0.15 * canvas.width
    player.y = canvas.height / 2 - player.height /2

    requestAnimationFrame(nextFrame)
    
}

function init(){
    gameContainer.style.display = "block"
    container.style.display = "none"
    pauseButton.style.display = "block"
    scoreDisplay.style.display = "flex"

    canvas.height = window.innerHeight
    canvas.width = window.innerWidth

    reset()
}

function jump(){

    if(SPACEBAR in keys){
        player.vely += 2
        startPress = true
    }    

    if(startPress == true && player.vely > -10){
        player.vely -= GRAVITY
    }

    if(player.y >= 0 && player.y + player.height <= canvas.height){
        player.y -= player.vely
    }else if(player.y <= 0) {
        player.vely = 0
        player.y += 3
    } else if(player.y + player.height >= canvas.height){
        gameover = true
    }
}

function newObstacle(){
    if(frames % (120 - frameOffset) == 0 && frames != 0){
        console.log(frames)
        let randomHeight = canvas.height / 4 + canvas.height * (Math.random() / 3)
        let obstacle = new obstacles(canvas.width + 20, 0, randomHeight, canvas.width + 20, randomHeight + 225, canvas.height - (randomHeight + 225), false)
        
        obstaclesArray.push(obstacle)
    }
}

function doesCollide(rect1, rect2){
    if(rect1.x + rect1.width > rect2.x1 && 
            rect1.x < rect2.x1 + rect2.width && 
            rect1.y < rect2.y1 + rect2.h1
            || rect1.x + rect1.width > rect2.x2 && 
            rect1.x < rect2.x1 + rect2.width && 
            rect1.y + rect1.height > rect2.y2){
                return true
            }

}

function scoreCheck(rect1, rect2){
    if(rect1.x > rect2.x1 + rect2.width && rect2.passed == false){
        return true
    }
}

function offScreen(rect1){
    if(rect1.x1 + rect1.width < 0){
        return true
    }
}

function nextFrame(time){

    if(startPress == true){
        frames++
    }

    newObstacle()

    jump()
    
    for(obstacle of obstaclesArray){
        obstacle.move()
    }


    for(let i = obstaclesArray.length - 1; i > -1; i--){
        if(offScreen(obstaclesArray[i])){
            obstaclesArray.splice(i, 1)
            break
        }
        if(doesCollide(player, obstaclesArray[i])){
            gameover = true
        }
        if(scoreCheck(player, obstaclesArray[i])){
            score++
            
            if(frameOffset < 60 && score != 0 && score % 5 == 0){
                frameOffset = score * 6
            }

            scoreDisplay.innerHTML = "Score: " + score
            obstaclesArray[i].passed = true
        }

    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.drawImage(background, 0 - offset, 0, canvas.width, canvas.height)
    ctx.drawImage(background, canvas.width - offset, 0, canvas.width,canvas.height)

    if(offset < canvas.width) {
        offset += 2
    } else {
        offset = 0
    }

    for(obstacle of obstaclesArray){
        obstacle.draw()
    }

    ctx.fillStyle = "black"

    ctx.drawImage(goose, player.x, player.y, player.width, player.height)

    if(gameover == false && gamePaused == false){
        setTimeout(() => {
            requestAnimationFrame(nextFrame);
          }, 1000 / 60)
    }else if(gameover == true){
        endPage.style.display = "flex"
        finalScore.innerHTML = "Score: " + score

        if(score > highscore){
            localStorage.setItem("highscore", score)
            highscore = score
        }

        highscoreDisplay.innerHTML = "Highscore: " + highscore
    }
}

window.onload = pageOnload

startButton.onclick = init
