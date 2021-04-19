document.addEventListener('DOMContentLoaded', ()=>{
const grid = document.querySelector('.grid');
let squares = Array.from(grid.querySelectorAll('.grid div'));
const scoreDisplay = document.querySelector('#score');
const startBtn = document.querySelector('#start-button');

let timerId;
let score = 0;

const width = 10;
// console.log(squares)

  //The Tetrominoes
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
  ]

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
  ]

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ]

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ]

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ]

  let colors = ['red','orange','darkorange', 'green', 'blueviolet'];
  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];


  let currentPosition = 4;
  let currentRotation = 0;


  //for the next incoming shape
  let nextRandom = 0;

  //randomly select a Tetromino and its first rotation 
  let random = Math.floor(Math.random()* theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  function control(e){
      if(e.keyCode == 37){
          moveLeft();
      }
      else if(e.keyCode == 38){
        rotate();
      } else if(e.keyCode == 39){
        moveRight();
      } else if(e.keyCode == 40){
            moveDown() 
      }
  }

  document.addEventListener('keyup',control);

   document.querySelector("#game-mode").addEventListener('change', level);
   let speed;
  
  function level(){
       let selectedLevel = this.value;
      
       if(selectedLevel == 'e'){
           speed = 1000;   
       }
       if(selectedLevel == "m"){
           speed = 500;
       }
       if(selectedLevel == "h"){
           speed = 200;
       
       }
       return;
  }

  //draw the first tetromino
  function draw(){
        current.forEach(index =>{
        squares[currentPosition + index].classList.add('tetromino');
        squares[currentPosition + index].style.backgroundColor =colors[random];
    })
  }


  //Undraws the shape from the screen
  function unDraw(){
      current.forEach(index => {
          squares[currentPosition + index].classList.remove('tetromino');
          squares[currentPosition + index].style.backgroundColor = "";
      })
  }
 


  //moves the shapes down intervally
  function moveDown(){
      unDraw();
      currentPosition += width;
      draw();
      freeze();

  }

  //Freeze function that stops an action
  function freeze(){
      //checks if the next line below contains a div of class taken
      if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
          current.forEach(index => squares[currentPosition + index].classList.add('taken'));

          //get a new teromino  to start dropping down
          random = nextRandom;
          nextRandom = Math.floor(Math.random() * theTetrominoes.length);
          current = theTetrominoes[random][currentRotation];
          currentPosition = 4;
          draw(); 
          displayShape();
          addScore();
          gameOver();
      }
  }

    //moves the tetromino to the left
  function moveLeft(){
      unDraw();

      //checks if the tetrimino is at the edge of the width if true returns no reminder else otherwise
      const  isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);

      if(!isAtLeftEdge){
        //move the item to the left by reducing the currentPosition of the shape
          currentPosition -= 1;
      }

      //if terimino moves to the space of the shape that has a clas of taken then push it back 1 space
      if(current.some(index => squares[currentPosition + index ].classList.contains('taken'))){
          currentPosition += 1;
      }

      draw();


  }



   //moves the tetromino to the right
   function moveRight(){
    unDraw();

    //checks if the tetrimino is at the edge of the width if true returns no reminder else otherwise
    const  isAtRightEdge = current.some(index => (currentPosition + index) % width === width-1);

    if(!isAtRightEdge){
      //move the item to the right by reducing the currentPosition of the shape
        currentPosition+=1;
    }

    //if terimino moves to the space of the shape that has a clas of taken then push it back 1 space
    if(current.some(index => squares[currentPosition + index ].classList.contains('taken'))){
        currentPosition -= 1;
    }

    draw();
}


//The next function rotates the tetromino
function rotate(){
    unDraw();
    currentRotation++;

    //Checks if the current rotation has gotten to 4 and sends it back to the previous shapes in the array.
    if(currentRotation === current.length){
        currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    draw();
}

//Show the next up-coming tetromino in the mini-grid display
const displaySquares = document.querySelectorAll('.mini-grid div');


const displayWidth = 4;
let displayIndex  = 0;


//Tetrominos without rotations
const upNextTetrominoes = [
    [1,displayWidth+1, displayWidth*2+1,2], // lTetromino
    [0,displayWidth, displayWidth+1, displayWidth*2+1],  //zTetromino
    [1,displayWidth,displayWidth+1,displayWidth+2], //tTetromino
    [0,1,displayWidth, displayWidth + 1],  //oTetromino
    [1,displayWidth+1,displayWidth*2+1,displayWidth*3+1] //iTetromino
]



//displays the shape in the mini-grid display
function displayShape(){
    //remove any trace of a tetromino form from the entire grid
    displaySquares.forEach(square =>{
        square.classList.remove('tetromino');
        square.style.backgroundColor = '';
       

    })
    upNextTetrominoes[nextRandom].forEach(index =>{
        displaySquares[displayIndex + index].classList.add('tetromino');
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
}


startBtn.addEventListener('click',()=>{

    if(speed == null){
        alert("Please select a difficulty level");
    }
    else{
        
        if(timerId){

            clearInterval(timerId);
            timerId = null;
        }else{

            timerId = setInterval(moveDown,speed);
            nextRandom = Math.floor(Math.random()* theTetrominoes.length);
     
        }
    }
 
})


//add score
function addScore(){
    for(let i= 0; i < 199; i +=width){

        //represents the rows in our div
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
    

        //if every index in our row contains the class of taken
        if(row.every(index => squares[index].classList.contains('taken'))){
            
            //increment our score by by 10
            score+=10;
            scoreDisplay.innerHTML = score;

            //removes the class of taken from the row
            row.forEach(index => {
                squares[index].classList.remove('taken');
                squares[index].classList.remove('tetromino');
                squares[index].style.backgroundColor = "";

            })
            const suqaresRemoved = squares.splice(i,width);
            squares = suqaresRemoved.concat(squares);
            squares.forEach(cell => grid.appendChild(cell));
        }
    }
}




//game over
function gameOver(){
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){

       let end = document.querySelector('#gameOver')
      end.innerText = 'Game Over';
        clearInterval(timerId);
    }
}


//   draw(); 
})


