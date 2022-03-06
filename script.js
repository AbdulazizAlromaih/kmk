"use strict";
const eight_puzzle = document.getElementById('eight_puzzle');
const headerMsg = document.getElementById('header-message');
let begin = false;
let moves = 0;
let row, cell;
let board = [
  1,2,3,
  4,5,6,
  7,null,8,
];
const random = (min,max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
} 

const change = () => {
  let currenttile;
  for(let row=1; row<=3; ++row) {
    for(let col=1; col<=3; ++col) {
      currenttile = (row-1)*3+col;
      document.getElementById(`square-${currenttile}`).innerHTML = board[currenttile - 1];
    }
  }
}

for(let i=1;i<=3;++i) {
  row = document.createElement('tr')
  eight_puzzle.appendChild(row)
  for(let j=1;j<=3;++j) {
    cell = document.createElement('td')
    cell.innerHTML = board[((i-1)*3+j)-1]
    cell.setAttribute('id',`square-${(i-1)*3+j}`)
    cell.onclick = e => {
      move((i-1)*3+j)
    }
    row.appendChild(cell)
  }
}

const arrayMaxMin = (x,y) => {
  return x.every((object,index) => object === y[index])
}
const game = (row,col, vh, dir) => {
  if(vh==='ud') {
    const index = ((row-1)*3+col)-(3*dir)-1
    const val = board[index]
    if(val===null && (((row-1)*3+col)-(3*dir))<10 && ((row-1)*3+col)-(3*dir)>0) {
      return {status: true, emptyIndex: index}
    } else {
      return {status: false, emptyIndex: null};
    }
  } else if(vh==='lr') {
    const index = ((row-1)*3+(col+dir))-1
    const val = board[index]
    if(val===null && (col+dir<4 && col+dir>0)) {
      return {status: true, emptyIndex: index}
    } else {
      return {status: false, emptyIndex: null};
    }
  }
}
const move = sq => {
  if(board[sq-1]===null) {
    return;
  }
  let column;
  if(sq%3===0) {
    column = 3
  } else {
    column = sq % 3
  }
  let row = ((sq - column) / 3) + 1
  const games = {
    'ud1': 1,
    'ud2': -1,
    'lr1': 1,
    'lr2': -1
  };
  let gameLog = []
  Object.keys(games).forEach(object => {
    const currentgame = game(row,column,object.slice(0,-1),games[object])
    gameLog.push(currentgame.status)
    if(currentgame.status) {
      board[currentgame.emptyIndex] = board[sq-1]
      board[sq-1] = null
    }
  });
  change();
  headerMsg.innerHTML = null
  if(begin===true && arrayMaxMin(board,[1,2,3,4,5,6,7,8,null])) {
    headerMsg.innerHTML = '<div class="alert alert-success" role="alert"> Great You got it! </div>'
    begin = false
    moves = 0
    return true
  }
  if(gameLog.some(object=>object)) {
    begin = true
    return true;
  } else {
    return false;
  }
}
const Randomize = depth => {
  try {
    let cMove = move(random(1,9))
    if(cMove) {
      Randomize(depth-1)
    } else {
      Randomize(depth)
    }
  } catch(err) {
    return;
  }
  moves = 0
  change();
}