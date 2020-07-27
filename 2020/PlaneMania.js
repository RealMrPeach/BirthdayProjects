let gameContainer = document.getElementById("gameContainer")
let menuContainer = document.getElementById("menuContainer")

let pauseBtn = document.getElementById("pauseBtn")
let pausePage = document.getElementById("pausePage")
let startBtn = document.getElementById("startBtn")
let resume = document.getElementById("resume")
let returnToMenu = document.getElementById("returnToMenu")

let livesDisplay = document.getElementById("lives")
let scoreDisplay = document.getElementById("score")
let waveDisplay = document.getElementById("wave")


let gameoverPage = document.getElementById("gameoverPage")
let gameoverScoreDisplay = document.getElementById("finalScore")
let highscoreDisplay = document.getElementById("highscore")
let gameoverRestart = document.getElementById("restart")
let gameoverReturntoMenu = document.getElementById("gameoverReturntoMenu")


let life1 = document.getElementById("life1")
let life2 = document.getElementById("life2")
let life3 = document.getElementById("life3")

let canvas = document.getElementById("draw")
let ctx = canvas.getContext('2d')

let shooterJet = document.getElementById("pewpewjet")
let regJet = document.getElementById("regjet")
let fastJet = document.getElementById("fastjet")
let characterJet = document.getElementById("charjet")

let background = new Image()
background.src = "https://i.imgur.com/30ZLLkB.png"

let frames = 0

let keys = []
let activeBullets = []
let activeEnemies = []

let gamePaused = false
let gameover = false;

const UPKEY = 87
const DOWNEKEY = 83

let wave = 0
let score = 0
let lives = 3
let enemiesKilled = 0

if(localStorage.getItem("highscore") == null){

    localStorage.setItem("highscore", 0)

}

let highscore = localStorage.getItem("highscore")


class bullets {
    constructor(x, y, type){
        this.x = x
        this.y = y
        this.width = 20
        this.height = 10
        this.type = type
        this.vel = 7
    }
    
    move(){
        switch(this.type){
            case "friendly":
                this.x += this.vel
                break
            case "hostile":
                this.x -= this.vel
                break
        }
    }

    draw(){
        

        switch(this.type){
            case "friendly":
                ctx.fillStyle = "#d4e022"
                ctx.fillRect(this.x, this.y, this.width, this.height)
                break
            case "hostile":
                ctx.fillStyle = "red"
                ctx.fillRect(this.x, this.y, this.width, this.height)
                break
        }
    }

}

class enemies {
    constructor(x, y, type){
        this.x = x 
        this.y = y
        this.width = 90
        this.height = 50
        this.type = type

        this.vel = 2.75
    }

    shoot(){
        let bullet = new bullets(this.x - 20, this.y + this.height / 2 - 5, "hostile")
        activeBullets.push(bullet)
    }

    move(){
        switch(this.type){
            case 0:
                this.x -= this.vel
                break
            case 1:
                this.x -= 1.5 * this.vel
                break
            case 2: 
                if(this.x > canvas.width - 150){
                    this.x -= this.vel
                } else {
                    if(frames % 180 == 0){
                        this.shoot()
                    }
                }
        }
    }

    draw(){
        


        switch(this.type){
            case 0:
                ctx.drawImage(regJet, this.x, this.y, this.width, this.height)
                break
            case 1:
                ctx.drawImage(fastJet, this.x, this.y, this.width, this.height)
                break
            case 2: 
                ctx.drawImage(shooterJet, this.x, this.y, this.width, this.height)
                break
        }

    }

}

let character = {

    width: 90,
    height: 50,
    x: 0,
    y: 0,
    vel: 4.5,

    move: function(){
        if(UPKEY in keys && this.y > 0){
            this.y -= this.vel
        }
        if(DOWNEKEY in keys && this.y + this.height < canvas.height){
            this.y += this.vel
        }

        
    },

    draw: function(){
        ctx.drawImage(characterJet, this.x, this.y, this.width, this.height)
    },

    shoot: function(){
        let bullet = new bullets(this.x + this.width, this.y + this.height / 2 - 5, "friendly")
        activeBullets.push(bullet)
    }
}


function reset(){

    gameoverPage.style.display = "none"

    activeBullets = []
    activeEnemies = []

    character.x = 10
    character.y = canvas.height / 2 - character.height / 2
    
    score = 0
    wave = 0
    lives = 3
    enemiesKilled = 0
    gameover = false
    gamePaused = false

    scoreDisplay.innerHTML = "Score: 0"

    enemyGeneration()

    requestAnimationFrame(nextFrame)
}

function startClick(){
    menuContainer.style.display = "none"
    gameContainer.style.display = "flex"
    pauseBtn.style.display = "block"
    livesDisplay.style.display = "flex"
    scoreDisplay.style.display = "flex"
    waveDisplay.style.display = "flex"
    

    
    reset()
}

function defaultLoads(){
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    document.addEventListener("keydown", keyDown)
    document.addEventListener("keyup", keyUp)

    canvas.addEventListener("click", shoot)

    pauseBtn.addEventListener("click", pauseGame)
    returnToMenu.addEventListener("click", menuReturn)
    resume.addEventListener("click", gameResume)

    gameoverRestart.addEventListener("click", reset)
    gameoverReturntoMenu.addEventListener("click", menuReturn)
}

function endGame(){
    gameoverPage.style.display = "flex"
    gameoverScoreDisplay.innerHTML = "Score: " + score
    
    if(score > highscore){
        localStorage.setItem("highscore", score)
        highscore = score
    }

    highscoreDisplay.innerHTML = "Highscore: " + highscore

    
}


function keyDown(event){
    keys[event.keyCode] = true
}

function keyUp(event){
    delete keys[event.keyCode]
}

function shoot(event){
    character.shoot()
}

function doesCollide(rect1, rect2){
    if(rect1.x < rect2.x + rect2.width
        && rect1.x + rect1.width > rect2.x
        && rect1.y < rect2.y + rect2.height
        && rect1.y + rect1.height > rect2.y){
            return true
        } else {
            return false
        }
}

function pauseGame(){
    if(gameover == false && gamePaused == false){
        gamePaused = true
        pausePage.style.display = "block"
    }
}

function menuReturn(){
    pausePage.style.display = "none"
    gameoverPage.style.display = "none"

    gameover = true
    
    gameContainer.style.display = "none"
    menuContainer.style.display = "flex"
}

function gameResume(){

    pausePage.style.display = "none"

    gamePaused = false
    requestAnimationFrame(nextFrame)
}


function enemyGeneration(){
    setTimeout(() => {
        if(activeEnemies.length == 0 && enemiesKilled == wave * 5){

            enemiesKilled = 0
            
            wave++
            
            if(wave > 1){
                score += (wave * 10)
            }

            scoreDisplay.innerHTML = "Score: " + score

            waveDisplay.innerHTML = "Wave: " + wave
    
            let totaltime = 0
    
            for(let i = 0; i < wave * 5; i++){
    
                let offset = 1000 + Math.random() * (1000 - wave * 10)
    
                if(offset < 300){
                    offset = 300
                }
    
                setTimeout(() => {
    
                    let typeDetermine = Math.floor(Math.random() * 10 + 1)
                    let typeSet
    
                    if(typeDetermine < 6){
                        typeSet = 0
                    } else if(typeDetermine > 5 && typeDetermine < 9){
                        typeSet = 1
                    } else {
                        typeSet = 2
                    }
    
    
                    let enemy = new enemies(canvas.width + 100, 200 + Math.random() * (canvas.height - 200) - character.height, typeSet)
                    activeEnemies.push(enemy)
    
                }, offset + totaltime)
    
                totaltime += offset
                
    
            }
        }
    }, 1500)
    
}


function nextFrame(time){
    frames++

    character.move()
    
    for(let i = activeBullets.length - 1; i > -1; i--){
        if(activeBullets[i].x < canvas.width && activeBullets[i].x + activeBullets[i].width > 0){
            activeBullets[i].move()
        } else {
            activeBullets.splice(i, 1)
        }

    }

    for(let i = activeEnemies.length - 1; i > -1; i--){
        if(activeEnemies[i].x > -activeEnemies[i].width){
            activeEnemies[i].move()
        } else if(lives > 1) {
            lives -= 1
            activeEnemies.splice(i, 1)
            enemiesKilled++
        } else {
            gameover = true
        }

    }


    for(let i = activeEnemies.length - 1; i > -1; i--){

        if(doesCollide(activeEnemies[i], character)){
            gameover = true
            break
        }

        for(let j = activeBullets.length - 1; j > -1; j--){
            if(activeBullets[j].type != "hostile" && doesCollide(activeEnemies[i], activeBullets[j])){

                activeBullets.splice(j, 1)
                activeEnemies.splice(i, 1)
                score++
                enemiesKilled++
                enemyGeneration()
                scoreDisplay.innerHTML = "Score: " + score
                break
            }


        }
        
    }

    for(let i = activeBullets.length - 1; i > -1; i--){
        if(activeBullets[i].type === "hostile" && doesCollide(character, activeBullets[i])){
            if(lives > 1){
                lives -= 1
                activeBullets.splice(i, 1)
                break
            } else {
                gameover = true
                break
            }
        }
    }


    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.drawImage(background, 0, 0)

    character.draw()
    
    for(let bullet of activeBullets){
        bullet.draw()
    }

    for(let enemy of activeEnemies){
        enemy.draw()
    }

    switch(lives){
        case 3:
            life3.style.display = "block"
            life2.style.display = "block"
            life1.style.display = "block"
            break
        case 2:
            life3.style.display = "none"
            life2.style.display = "block"
            life1.style.display = "block"
            break
        case 1:
            life3.style.display = "none"
            life2.style.display = "none"
            life1.style.display = "block"
            break
        case 0:
            life3.style.display = "none"
            life2.style.display = "none"
            life1.style.display = "none"
            break
    }

    



    if(gameover == false && gamePaused == false){
        requestAnimationFrame(nextFrame)
    } else if(gameover == true) {
        life3.style.display = "none"
        life2.style.display = "none"
        life1.style.display = "none"

        endGame()
    }
}

window.onload = defaultLoads

startBtn.onclick = startClick