import {getRandomNumber,getCssProp, detectCollision} from '/utils/utils.js'
Object.assign(window, {
    detectCollision
})

let game, block, hole, char, score, gameoverscreen, startScreen, gameStopped, isJumping, scoreTotal, gravityStopped

function getElements(){
    game=document.querySelector( '#game' )
    block=document.querySelector( '#block' )
    hole=document.querySelector( '#hole' )
    char=document.querySelector( '#char' )
    score=document.querySelector( '#score' )
    gameoverscreen=document.querySelector( '#gameoverscreen' )
    startScreen = document.querySelector('#startScreen')
    console.log(startScreen)
}

function setInitialValues(){
    gameStopped=false
    isJumping = false
    scoreTotal=0
    gravityStopped=false
}
function start(){
    getElements()
    startScreen.querySelector('button').addEventListener('click',_ =>{
        hideStart()
        gameInit()
    })
}
function setEventListeners(){
    window.addEventListener('resize',_ =>{
        if (gameStopped) return
        resetAllAnimations()
    })

    gameoverscreen.querySelector('button').addEventListener('click',_ =>{
        hideGameOver()
        startGravity()
        resetAllAnimations()
        resetScore()
        resetCharPosition()
        changeScore()
        startBGAnimation()
        setTimeout(_ => {
            gameStopped = false
        })
    })
    document.body.parentElement.addEventListener( 'click',_ =>{
        if(gameStopped) return 
        charJump()
    })
    document.onkeypress = function (e) {
        e = e || window.event
        if(e.keyCode ===32){
            if(gameStopped) return
            charJump()
        }
    }
}
function gameOver(){
    gameStopped = true
    showGameOver()
    stopBlockAnimation()
    stopGravity()
    stopBGAnimation()
console.log('game over')
}
function resetCharPosition(){
    char.style.top = '30vh'
    char.style.left = '25vw'
}
function resetScore(){
    scoreTotal=0
}
function changeScore(){
    score.innerText = `Score ${ scoreTotal.toString() }`
    gameoverscreen.querySelector('.score').innerText =score.innerText
}
function charJump(){
    isJumping = true
    let jumpCount = 0
    const jumpInterval = setInterval( _ =>{
        changeState({diff: -3, direction: 'up'})
        if(jumpCount>20){
            clearInterval(jumpInterval)
            isJumping=false
            jumpCount=0
        }
        jumpCount++
    }, 10)
}
function changeState({diff , direction}){
    charAnimation(direction)
    collisions()
    charPosition(diff)
}
function charAnimation(direction){
    if(direction === 'down'){
        char.classList.remove('go-up')
        char.classList.add('go-down')
    }
    else if(direction === 'up'){
        char.classList.add('go-up')
        char.classList.remove('go-down')
        
    }
}
let holeAmount=0;

function collisions(){
    const collisionBlock = detectCollision(char, block) 
    const collisionHole = detectCollision(char, hole, {y1: -46, y2: 47})
    
    if (collisionBlock && !collisionHole){
        //changeScore()
        return gameOver()
    }
    else if (collisionHole){
        scoreTotal++
        changeScore()

        if(gameStopped){
            return
        }
        holeAmount++
        if(holeAmount>150){
            holeAmount=0
        }
    }
}

function charPosition(diff){
    const characterTop = parseInt (getCssProp (char, 'top'))
    const changeTop = characterTop + diff
    if(changeTop<0){
        return
    }
    if(changeTop>window.innerHeight){
        return gameOver()
    }
    char.style.top = `${ changeTop }px`
}
function initRandomHoles(){
    hole.addEventListener('animationiteration', _ =>{
        const fromHeight = 40 * window.innerHeight / 100
        const toHeight = 95 * window.innerHeight / 100
        const randomTop = getRandomNumber (fromHeight,toHeight)
        hole.style.top = `-${ randomTop }px`
    })
}

function beginGravity(){
    setInterval(_ =>{
        if(isJumping || gravityStopped) return
        changeState({diff:5  , direction:'down'})
    }, 20)
}

function resetAllAnimations(){
    const seconds = 3
    const blockAnimationCss = `blockAnimation ${ seconds }s infinite linear`
    block.style.animation=blockAnimationCss
    hole.style.animation=blockAnimationCss
}
function showGameOver(){
    gameoverscreen.style.display = ''
}
function hideGameOver(){
    gameoverscreen.style.display = 'none'
}
function hideStart(){
    startScreen.style.display = 'none'
}

function stopBlockAnimation(){
    const blockLeft= block.getBoundingClientRect().x
    block.style.animation= ''
    hole.style.animation= ''

    block.style.left = `${blockLeft}px`
    hole.style.left = `${blockLeft}px`
}
function stopGravity(){
    gravityStopped = true
}
function startGravity(){
    gravityStopped = false
}
function startBGAnimation(){
    game.style.animation='bgAnimation 3s infinite linear'
}
function stopBGAnimation(){
    game.style.animation= ''
}


function gameInit(){
    getElements()
    setInitialValues()
    beginGravity()
    initRandomHoles()
    setEventListeners()
    resetAllAnimations()
    resetCharPosition()
    resetScore()
    startBGAnimation()
}
start()
