'use strict'

const FLOOR = 'FLOOR'
const FLOOR_MAIN = 'FLOOR-MAIN'
const WALL = 'WALL'
const PLAYER = 'PLAYER'
const POINT = 'POINT'
const SUPERPOINT = 'SUPERPOINT'
const GHOST = 'GHOST'
const HURTGHOST = 'HURTGHOST'
const HURT = 'HURT'
const LIFE = 'LIFE'
const CHERRY = 'CHERRY'

const PLAYER_IMG = '<img src="img/oacmn.gif">'
const POINT_IMG = ' <img src="img/point.png">'
const SUPERPOINT_IMG = ' <img src="img/superpoint.png">'
const GHOST_IMG = ' <img src="img/ghost.png">'
const HURTGHOST_IMG = ' <img src="img/hurtghost.png">'
const HURT_IMG = ' <img src="img/hurt.png">'
const LIFE_IMG = '<img src="img/life.png">'
const CHERRY_IMG = '<img src="img/Cherry.png">'

var gBoard 
var gPlayerPos
var gGhostsPos = []
var gHurtGhostsPos = []
var gPointsCount 
var gLife = 3
var gIsHurt = false
var gGohstMoving
var gIsPacmanNotMove = false
var hurtGhostModOn 
var gHurtGohstMoving
var gScore = 0
// var gCherry 

function onInit() {
    gPlayerPos = {i: 9, j: 6, deg: 0}
    // gGhostsPos[0] = {i: 5, j: 5, prevElement: null , prevImg: ''}
    // gGhostsPos[1] = {i: 5, j: 6, prevElement: null , prevImg: ''}
    // gGhostsPos[2] = {i: 5, j: 7, prevElement: null , prevImg: ''}
    gGhostsPos = makeGhost()
    gBoard = creatBoard()
    runderBoard(gBoard)
    addPoints()
    currLife()
    gGohstMoving = setInterval(moveGhost,500)
    console.log(gPointsCount);
    // gCherry = setInterval(addRandomCherry,10000)
}
function makeGhost() {
    var res = []
    var currGhost = ''
    for (let i = 0; i < 4; i++) {
        console.log(i); 
        if (i < 3) {
             currGhost = {i: 7, j: 5 + i, prevElement: null , prevImg: ''}
        } else if (i === 3) {
             currGhost = {i: 6, j: 6 , prevElement: null , prevImg: ''}
        } 
        res.push(currGhost)
    }
    console.log(res);
    return res
}

function creatBoard() {
    var colSize = 15
    var rowSize = 13
    var res = []
    for (let i = 0; i < colSize; i++) {
        res[i]=[]
        for (let j = 0; j < rowSize; j++) {
            res[i][j] = { type: FLOOR, gameElement: null } 
            if (i === 0 || i === colSize -1 ||
                j === 0 || j === rowSize -1) {
                res[i][j].type = WALL
            }   
            if (i === 5 && j >= 3 && j <= 9) {
                res[i][j].type = FLOOR_MAIN
            } 
            if (i === 9 && j >= 3 && j <= 9) {
                res[i][j].type = FLOOR_MAIN
            } 
            if (i === 7 && j >= 5 && j <= 7) {
                res[i][j].type = FLOOR_MAIN
            } 
            if (j === 3 && i >= 6 && i <= 8) {
                res[i][j].type = FLOOR_MAIN
            } 
            if (j === 9 && i >= 6 && i <= 8) {
                res[i][j].type = FLOOR_MAIN
            } 

        }
    }
    creatBoardObstacleWall(res)

    res[gPlayerPos.i][gPlayerPos.j].gameElement = PLAYER
    res[gGhostsPos[0].i][gGhostsPos[0].j].gameElement = GHOST
    res[gGhostsPos[1].i][gGhostsPos[1].j].gameElement = GHOST
    res[gGhostsPos[2].i][gGhostsPos[2].j].gameElement = GHOST
    res[gGhostsPos[3].i][gGhostsPos[3].j].gameElement = GHOST
    res[1][1].gameElement = SUPERPOINT
    res[1][11].gameElement = SUPERPOINT
    res[13][1].gameElement = SUPERPOINT
    res[13][11].gameElement = SUPERPOINT


    return res
}

function creatBoardObstacleWall(res) {
    for (let i = 0; i < res.length; i++) {
        for (let j = 0; j < res[0].length; j++) {
            if (i === 2 && j >= 2 && j <= 10 ) {
                res[i][j].type = WALL
              }

              if (i === 12 && j >= 2 && j <= 10 ) {
                res[i][j].type = WALL
              }
            
              if (i === 8 && j >= 4 && j <= 8 ) {
                res[i][j].type = WALL
              }

              if (i === 4 && j >= 2 && j <= 4 ) {
                res[i][j].type = WALL
              }

              if (i === 4 && j >= 8 && j <= 10 ) {
                res[i][j].type = WALL
              }

              if (i === 10 && j >= 2 && j <= 4 ) {
                res[i][j].type = WALL
              }

              if (i === 10 && j >= 8 && j <= 10 ) {
                res[i][j].type = WALL
              }

              if (j === 10 && i >= 8 && i <= 9 ) {
                res[i][j].type = WALL
              }
              if (j === 10 && i >= 5 && i <= 6 ) {
                res[i][j].type = WALL
              }

              if (j === 2 && i >= 8 && i <= 9 ) {
                res[i][j].type = WALL
              }
              if (j === 2 && i >= 5 && i <= 6 ) {
                res[i][j].type = WALL
              }

        }
    }
    res[7][12].type = FLOOR
    res[7][0].type = FLOOR
   
    res[6][4].type = WALL
    res[7][4].type = WALL
    res[7][8].type = WALL
    res[6][8].type = WALL
    res[6][7].type = WALL
    res[6][5].type = WALL
  
}

function runderBoard(Board) {
    var strHtml =''

    for (let i = 0; i < Board.length; i++) {
        strHtml+= '\n <tr>'
        for (let j = 0; j < Board[i].length; j++) {
            const currCell = gBoard[i][j]
            var cellClass = getClassName({i: i ,j: j})
            if (currCell.type === FLOOR)cellClass += ' floor'
            else if (currCell.type === FLOOR_MAIN)cellClass += ' floor'
            else if (currCell.type === WALL)cellClass += ' wall'
            strHtml+= `\n <td class ="cell ${cellClass}" 
            title = "${i},${j}">`
            if (currCell.gameElement === PLAYER) {
                strHtml+= PLAYER_IMG
            }
            if (currCell.gameElement === GHOST) {
                strHtml+= GHOST_IMG
            }
            if (currCell.gameElement === SUPERPOINT) {
                strHtml+= SUPERPOINT_IMG
            }
            strHtml+= `</td>`
        }
        strHtml+= '\n <tr>'
    }
    const elBoard = document.querySelector('.board-content')
    elBoard.innerHTML=strHtml
}

function getClassName(location) {
    var cellclass = `cell-${location.i}-${location.j}`
    return cellclass
}

function ChecksForEmptySpace() {
    var res = []
    for (let i = 0; i < gBoard.length  ; i++) {
         for (let j = 0; j < gBoard[0].length; j++) {
        if (gBoard[i][j]===gBoard[6][6]||
            gBoard[i][j]===gBoard[7][5]||
            gBoard[i][j]===gBoard[7][7]) continue
        if(gBoard[i][j].gameElement === null && 
            gBoard[i][j].type === FLOOR ) {
        var currCell = {i: i, j: j}
        res.push(currCell)}
        }
    }
    return res
}

function addPoints() {
    var emptyCells = ChecksForEmptySpace()
    for (let i = 0; i < emptyCells.length; i++) {
        var currCell = emptyCells[i]
        gBoard[currCell.i][currCell.j].gameElement = POINT
        var currCellPos = {i:currCell.i, j: currCell.j}
        renderCell(currCellPos, POINT_IMG)
        
    }
    gPointsCount = emptyCells.length
}

function onKey(ev) {
var i = gPlayerPos.i
var j = gPlayerPos.j

switch (ev.key) {
    case 'ArrowLeft':
        gPlayerPos.deg = 180
        moveTo(i, j - 1)
        break
    case 'ArrowRight':
        gPlayerPos.deg = 0
        moveTo(i, j + 1)
        break
    case 'ArrowUp':
        gPlayerPos.deg = -90
        moveTo(i - 1, j)
        break
    case 'ArrowDown':
        gPlayerPos.deg = 90
        moveTo(i + 1, j)
        break
}
}

function getPacmanHTML(deg) {
    return ` <div style="transform: rotate(${deg}deg);">${PLAYER_IMG}</div>`
}

function moveTo(i,j) {

if (gIsPacmanNotMove) return

if (j < 0 || j > gBoard[0].length-1){
    secretPassages(i,j)
    return
}

const targetCell = gBoard[i][j]
 if (targetCell.type === WALL) return

 if (targetCell.gameElement === POINT) {
    gScore += 10
    updateScore()

    gPointsCount--
    console.log(gPointsCount);
    if (gPointsCount=== 0) {
        console.log('you win!'); 
    }
 }

 if (targetCell.gameElement === GHOST) {
    gLife--
    console.log(gLife);
    if (gLife=== 0) {
        console.log('you lose!'); 
    }
    gIsHurt = true
 }

 if (targetCell.gameElement === HURTGHOST) {
    gScore += 200
    updateScore()

    hideGhost(i,j) 

    setTimeout(GhostBacTolife,3500)
 } 


 if (targetCell.gameElement === SUPERPOINT) {
    gScore += 20
    updateScore()

    if (!hurtGhostModOn) {
        hurtGhost()
    }
 }

 if (targetCell.gameElement === CHERRY) {
    gScore += 200
    updateScore()

 }

 // prev
 gBoard[gPlayerPos.i][gPlayerPos.j].gameElement = null
 renderCell(gPlayerPos, '')

 // next 
 gBoard[i][j].gameElement = PLAYER
 gPlayerPos.i =i
 gPlayerPos.j =j
 renderCell(gPlayerPos, getPacmanHTML(gPlayerPos.deg))

 if (gIsHurt) {
    reset()
 }
}

function renderCell(location, value) {
    const cellSelector = '.' + getClassName(location)
    const elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value
}

function secretPassages(i,j) {
    // Checks if the player's next move goes through the secret passages
        switch (true) {
            case (j < 0):
                j = 12;
                break;
            case (j > gBoard[0].length - 1):
                j = 0;
                break;
        }
         renderCell(gPlayerPos, '')
         gPlayerPos.i = i
         gPlayerPos.j = j
         renderCell(gPlayerPos, PLAYER_IMG) 
}

function moveGhost() {
    for (let i = 0; i < gGhostsPos.length; i++) {
      var currGhost = gGhostsPos[i]
      ghostMove(currGhost)
    }
}

function ghostMove(currGhost) {
var possiblePos = emptyAround(currGhost.i,currGhost.j)
if (!possiblePos.length) return

if (possiblePos.length > 1) {
    nextPos = closestPosToPacman(possiblePos)
} else {
    var randomPos = getRandomInt(0, possiblePos.length)
    var nextPos = possiblePos[randomPos] 
}

if (gBoard[nextPos.i][nextPos.j].gameElement === PLAYER) {
    gLife--
    console.log(gLife);
    if (gLife=== 0) {
        console.log('you lose!'); 
    }
    gIsHurt = true
 }

  // prev
  if (currGhost.prevElement === 'POINT') {
    currGhost.prevImg = POINT_IMG
  } else if (currGhost.prevElement === 'SUPERPOINT') {
    currGhost.prevImg = SUPERPOINT_IMG
  }

  gBoard[currGhost.i][currGhost.j].gameElement = currGhost.prevElement
  renderCell(currGhost, currGhost.prevImg)

  //Updates the element that the ghost will cover
  // so that it moves to the next location in the next
  // step the element that was in a location cell will return

  currGhost.prevElement = gBoard[nextPos.i][nextPos.j].gameElement
  currGhost.prevImg = ''


  // next 
  gBoard[nextPos.i][nextPos.j].gameElement = GHOST
  currGhost.i = nextPos.i
  currGhost.j = nextPos.j
  renderCell(currGhost, GHOST_IMG)

  if (gIsHurt) {
    reset() 
}

}
 
function closestPosToPacman(arry) {
    var res = {i:0,j:0}
    var minDiffI = Infinity
    var minDiffJ = Infinity
    for (let i = 0; i < arry.length; i++) {
       var currPos = arry[i]
       var currDiifI = Math.abs(gPlayerPos.i - currPos.i)
       var currDiifJ = Math.abs(gPlayerPos.j - currPos.j)
       if (currDiifI <= minDiffI && currDiifJ <= minDiffJ) {
        minDiffI = currDiifI
        minDiffJ = currDiifJ
        res = {i:currPos.i,j:currPos.j}
       }
    }
    return res
}

function emptyAround(rowIdx,colIdx) {
    var res = []
    var possibleMove = [
        {i:rowIdx+1, j: colIdx},
        {i:rowIdx-1, j: colIdx},
        {i:rowIdx, j: colIdx+1},
        {i:rowIdx, j: colIdx-1},
    ]
    for (let i = 0; i < possibleMove.length; i++) { 
        if (possibleMove[i].j < 0 || possibleMove[i].j > gBoard[0].length-1) continue 
        else if (gBoard[possibleMove[i].i][possibleMove[i].j].type === WALL) continue 
        else if (gBoard[possibleMove[i].i][possibleMove[i].j].gameElement === GHOST) continue 
        else if (gBoard[possibleMove[i].i][possibleMove[i].j].gameElement === HURTGHOST) continue 
        res.push(possibleMove[i])
    }

    return res
}

function reset() {
    currLife()
    gIsPacmanNotMove = true
    gIsHurt = false
    clearInterval(gGohstMoving)
    gBoard[gPlayerPos.i][gPlayerPos.j].gameElement = PLAYER
    renderCell(gPlayerPos, HURT_IMG)

    if (gLife === 0) return

    setTimeout (()=>{
    resetGhostPos()
    // לבדוק את הקוד הזה כי יש כאן טעות
    gBoard[gPlayerPos.i][gPlayerPos.j].gameElement = PLAYER
    renderCell(gPlayerPos, PLAYER_IMG)

    gGohstMoving = setInterval(moveGhost,500)
    gIsPacmanNotMove = false
    moveTo(9,6)
    },2000)
}

function resetGhostPos() {
    for (let i = 0; i < gGhostsPos.length; i++) {
        var currGhost = gGhostsPos[i]
        gBoard[currGhost.i][currGhost.j].gameElement = null
        console.log(currGhost.prevImg);
        renderCell(currGhost, currGhost.prevImg)
    }
    
    gGhostsPos.splice(0,gGhostsPos.length)
    console.log(gGhostsPos);
    gGhostsPos = makeGhost()

    for (let i = 0; i < gGhostsPos.length; i++) {
        var currGhost = gGhostsPos[i]
        gBoard[currGhost.i][currGhost.j].gameElement = GHOST
        renderCell(currGhost, GHOST_IMG)
    }
}

function hurtGhost() { 
    hurtGhostModOn = true
    clearInterval(gGohstMoving)

    gHurtGhostsPos = gGhostsPos.splice(0,gGhostsPos.length)
  
    for (let j = 0; j < gHurtGhostsPos.length; j++) {
        var currHurtGhost = gHurtGhostsPos[j]
        gBoard[currHurtGhost.i][currHurtGhost.j].gameElement = HURTGHOST
        renderCell(currHurtGhost, HURTGHOST_IMG)
    }

    gHurtGohstMoving = setInterval(moveHurtGhost,300)

   setTimeout(stopHurtGhost,3000)
}

function moveHurtGhost() {
    for (let i = 0; i < gHurtGhostsPos.length; i++) {
      var currGhost = gHurtGhostsPos[i]
      hurtGhostMove(currGhost)
    }
}

function hurtGhostMove(currGhost) {
    var possiblePos = emptyAround(currGhost.i,currGhost.j)
    if (!possiblePos.length) return

    if (possiblePos.length > 1) {
        nextPos = farthestPosToPacman(possiblePos)
    } else {
        var randomPos = getRandomInt(0, possiblePos.length)
        var nextPos = possiblePos[randomPos] 
    }
    
    if (gBoard[nextPos.i][nextPos.j].gameElement === PLAYER) {
        return
     }
    
      // prev
      if (currGhost.prevElement === 'POINT') {
        currGhost.prevImg = POINT_IMG
      } else if (currGhost.prevElement === 'SUPERPOINT') {
        currGhost.prevImg = SUPERPOINT_IMG
      }
    
      gBoard[currGhost.i][currGhost.j].gameElement = currGhost.prevElement
      renderCell(currGhost, currGhost.prevImg)
    
      //Updates the element that the ghost will cover
      // so that it moves to the next location in the next
      // step the element that was in a location cell will return
    
      currGhost.prevElement = gBoard[nextPos.i][nextPos.j].gameElement
      currGhost.prevImg = ''
    
    
      // next 
      gBoard[nextPos.i][nextPos.j].gameElement = HURTGHOST
      currGhost.i = nextPos.i
      currGhost.j = nextPos.j
      renderCell(currGhost, HURTGHOST_IMG)
    

}

function farthestPosToPacman(arry) {
    var res = {i:0,j:0}
    var maxDiffI = -Infinity
    var maxDiffJ = -Infinity
    for (let i = 0; i < arry.length; i++) {
       var currPos = arry[i]
       var currDiifI = Math.abs(gPlayerPos.i - currPos.i)
       var currDiifJ = Math.abs(gPlayerPos.j - currPos.j)
       if (currDiifI >= maxDiffI && currDiifJ >= maxDiffJ) {
        maxDiffI = currDiifI
        maxDiffJ = currDiifJ
        res = {i:currPos.i,j:currPos.j}
       }
    }
    return res
}

function hideGhost(colIdx, rowIdx) {
    console.log(colIdx, rowIdx);
    
    for (let i = 0; i < gHurtGhostsPos.length; i++) {
        var currGhost = gHurtGhostsPos[i]
        if (colIdx === currGhost.i && rowIdx === currGhost.j) {
            gHurtGhostsPos.splice(i,1)
        }
    }
}

function stopHurtGhost() { 
    hurtGhostModOn = false
    clearInterval(gHurtGohstMoving)

    gGhostsPos = gHurtGhostsPos.splice(0,gHurtGhostsPos.length)
 
  
    for (let j = 0; j < gGhostsPos.length; j++) {
        var currHurtGhost = gGhostsPos[j]
        gBoard[currHurtGhost.i][currHurtGhost.j].gameElement = GHOST
        renderCell(currHurtGhost, GHOST_IMG)
    }

    gGohstMoving = setInterval(moveGhost,500)
}

function GhostBacTolife() {
    var newGhost = {i: 7, j: 6, prevElement: null , prevImg: ''}
    gGhostsPos.push(newGhost)
}

function updateScore() {
    const elScore = document.querySelector('.score')
    elScore.innerHTML = gScore
}

function currLife() {
    const elLives = document.querySelector('.lives')
    var strHTML = ''
    for (let i = 0; i < gLife; i++) {
        strHTML+= LIFE_IMG
    }
    elLives.innerHTML = strHTML
}

function addRandomCherry() {
    // Looking for a random cell
    var emptyCells = ChecksForEmptySpace()
    if (!emptyCells.length) return
    var randomCell = getRandomInt(0, emptyCells.length-1)
    var theChosenCell = emptyCells[randomCell]

    // Updates the board
    gBoard[theChosenCell.i][theChosenCell.j].gameElement = CHERRY
    //Updates the DOM
    renderCell(theChosenCell,CHERRY_IMG)
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

