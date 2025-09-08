/* VARIABLES */
//REFACTOR SCREEN CODES
let hope, score, streak, hiStreak, negStreak;

let playButton, screenNo;
let instBut, instStoBut, instGameBut, backBut, backImg;
let tutBut, lockBut, tutButImg, lockButImg;
let buttonImgs;

let song0, song1, song2, song3;

let butImg1, butImg2;

let l_cursor, r_cursor, transparent;//TEMPORARY VARIABLE NAMES -- WILL CHANGE WHEN NOT SO SLEEPY
let new_note, notes; 
let frames_touching;
let noteMus, bgMus, isPaused, missNote, hurtsfx;
let frames_passed;

let time_to_pause_notes;

let tolm; //time of last mistake

let bar, meter, barImg, metImg;
let character, chImgIdle, chImgStrum,chImgNote, chImgHurt;
let kImg, kImg1,kImg2,kImg3,kImg4;

let finish, finSprite, finImg, square, squareVis;
let retryButton, contButton, menuButton;

/* PRELOAD LOADS FILES */
function preload(){
  butImg1 = loadImage('assets/buttonspr/instGameBut.png');
  butImg2 = loadImage('assets/buttonspr/instStoryBut.png');
  instImgGame = loadImage('assets/instr_game.png');
  instImgStory = loadImage('assets/instr_story2.png');

  tutButImg = loadImage('assets/buttonspr/tutBut.png');
  lockButImg = loadImage('assets/buttonspr/lockBut.png');

  backImg = loadImage('assets/buttonspr/backBut.png');
  
  noteMus = createAudio('assets/music/tutorial_song_guitar.mp3') //TEMPO IS 90
  bgMus = createAudio('assets/music/tutorial_song_no_guitar.mp3')
  hurtsfx = loadSound('assets/sfx/hurtSFX.mp3');
  transparent = loadImage('assets/Empty.png')

  barImg = loadImage('assets/hope.png');
  metImg = loadImage('assets/hope_meter_2.png');

  chImgIdle = loadImage('assets/chrspr/chr_idle.png');
  chImgStrum = loadImage('assets/chrspr/chr_strum.png');
  chImgNote = loadImage('assets/chrspr/chr_note.png');
  chImgHurt = loadImage('assets/chrspr/chr_hurt.png');

  kImg1 = loadImage('assets/kidspr/kid_1.png');
  kImg2 = loadImage('assets/kidspr/kid_2.png');
  kImg3 = loadImage('assets/kidspr/kid_3.png');
  kImg4 = loadImage('assets/kidspr/kid_4.png');

  finish = loadSound('assets/sfx/finishsfx.mp3');
  finImg = loadImage('assets/finish.png')
  
}

/* SETUP RUNS ONCE */
function setup() {
  createCanvas(400,400);
  playButton = new Sprite(200,250,100,50,'k')
  playButton.text = 'Play'
  playButton.fill = 'yellow'
  instBut = new Sprite(200,325,100,50,'k')
  instBut.text = 'Instructions'
  instBut.fill = 'gray'
  screenNo = 0;

  instGameBut = new Sprite(butImg1,-300,175,100,50,'k')
  instStoBut = new Sprite(butImg2,-300,275,100,50,'k')
  //instStoBut.strokeWeight = 10

  backBut = new Sprite(backImg,44.5,376,60,34,'k')
  backBut.visible = false

  song0  = new Sprite(tutButImg,-200,100,60,34,'k')
  song1  = new Sprite(lockButImg,-200,175,60,34,'k')
  song2  = new Sprite(lockButImg,-200,250,60,34,'k')
  song3  = new Sprite(lockButImg,-200,325,60,34,'k')
  
  l_cursor = new Sprite(170,250,50,7,'d')
  r_cursor = new Sprite(230,250,50,7,'d')
  l_cursor.rotationLock = true
  r_cursor.rotationLock = true
  l_cursor.fill = 'blue'
  r_cursor.fill = 'darkviolet'
  l_cursor.visible = false
  r_cursor.visible = false
  
  
  notes = new Group()
  notes.y = 10;
  notes.x = 200;
  notes.height = 7
  notes.width = 50
  notes.collider = 'k'
  
  score = 0;
  streak = 0;
  hiStreak = 0;
  negStreak = 0;

  frameRate(30)
  frames_passed = 0;
  isPaused = true
  tolm = -61
  time_to_pause_notes = 30    //1 sec

  buttonImgs = [butImg1, butImg2, tutButImg, lockButImg] //for buttons with the same size
  for (let i = 0; i < buttonImgs.length; i++) {
    buttonImgs[i].resize(100,0)
  }
  backImg.resize(60,0)
  metImg.resize(120,325)
  barImg.resize(120,325)
  chImgIdle.resize(80,0)
  chImgStrum.resize(80,0)
  chImgNote.resize(80,0)
  chImgHurt.resize(80,0)
  kImg1.resize(61,0)
  kImg2.resize(61,0)
  kImg3.resize(61,0)
  kImg4.resize(61,0)
  finImg.resize(0,50)

  character = new Sprite(chImgIdle,70,220,10,10);
  character.ticks = 100;
  character.visible = false

  square = new Sprite(800,800,400,400,'k');
  square.fill = 'skyblue';
  square.rotationLock = true;
  square.shapeColor.setAlpha(0);
  squareVis = 0;

  finSprite = new Sprite(finImg,200,-200,10,10, 'k');
  
  retryButton = new Sprite(125,-50,70,35, 'k');
  menuButton = new Sprite(200,-50,70,35, 'k');
  contButton = new Sprite(275,-50,70,35, 'k');
  retryButton.text = 'Retry';
  menuButton.text = 'Menu';
  contButton.text = 'Continue';
  //retryButton.visible = false;
  //menuButton.visible = false;
  //contButton.visible = false;

}

/* DRAW LOOP REPEATS */
function draw() {
  clear()
  if (screenNo == 0) {
    background(100)
    textSize(40)
    text('Bunker Tunes',200-(textWidth('Bunker Tunes')/2), 125)
    textSize(12)
    text('Press left and right Arrow keys (or A & D)\n   when the notes land on your cursor', 200-(textWidth('Press left and right Arrow keys (or A & D) \nwhen the notes land on your cursor')/2),150)
    text('Be careful with the timing', 200-(textWidth('Be careful with the timing')/2),185)
    //text('your objective is to cheer up the survivors in this bunker', 200-(textWidth('your objective is to cheer up the survivors in this bunker')/2),220)
    //text('gee this would be a whole lot less crowded if i had an instructions section', 200-(textWidth('gee this would be a whole lot less crowded if i had an instructions section')/2),240)
    //text('(COMING SOON DW GANG)', 200-(textWidth('(COMING SOON DW GANG)')/2),260)
    if (playButton.mouse.presses()) {
      screenNo = 1;
      playButton.pos = {x: -200,y: -200}
      instBut.pos = {x: -300,y: -300}
      song0.x = 200;
      song1.x = 200;
      song2.x = 200;
      song3.x = 200;
      backBut.visible = true;
    }
    if (instBut.mouse.presses()) {
      screenNo = -1;
      playButton.pos = {x: -200,y: -200}
      instBut.pos = {x: -300,y: -300}
      instGameBut.x = 200;
      instStoBut.x = 200;
      backBut.visible = true;
    }
  } else if (screenNo == 1) { //level select
    background(0)
    if (song0.mouse.presses()) {
      screenNo = 2;
      song0.x = -200;
      song1.x = -200;
      song2.x = -200;
      song3.x = -200;
      backBut.visible = false
      character.visible = true;
      l_cursor.visible = true;
      r_cursor.visible = true;
      textSize(12)
      //level setup
      hope = 12;
    }
    if (backBut.mouse.presses()) {
      screenNo = 0;
      song0.x = -200;
      song1.x = -200;
      song2.x = -200;
      song3.x = -200;
      backBut.visible = false
      playButton.pos = {x: 200,y: 250}
      instBut.pos = {x: 200,y: 325}
    }

  } else if (screenNo == 2) { //maybe change this level name to Practice instead?
    runGame()
  } else if (screenNo == 5) {
    square.textColor = 'yellow'
    square.textSize = 15
    square.strokeWeight = 0;
    square.text = '\n\nScore: ' + score + '\n\n Highest Streak: ' + hiStreak;
    retryButton.y = 300;
    menuButton.y = 300;
    contButton.y = 300;
  } else if (screenNo == -1) { //instructions
    background(0)
    
    if (instGameBut.mouse.presses()) {
      screenNo = -2;
      instGameBut.x = -300;
      instStoBut.x = -300;
    }
    if (instStoBut.mouse.presses()) {
      screenNo = -3;
      instGameBut.x = -300;
      instStoBut.x = -300;
    }
    if (backBut.mouse.presses()) {
      screenNo = 0;
      playButton.pos = {x: 200,y: 250}
      instBut.pos = {x: 200,y: 325}
      instGameBut.x = -300;
      instStoBut.x = -300;
      backBut.visible = false
    }
  } else if (screenNo == -2) { //gameplay
    background(instImgGame)
    if (backBut.mouse.presses()) {
      screenNo = -1;
      instGameBut.x = 200;
      instStoBut.x = 200;
      backBut.visible = true
    }
  } else if (screenNo == -3) { //story
    background(instImgStory)
    if (backBut.mouse.presses()) {
      screenNo = -1;
      instGameBut.x = 200;
      instStoBut.x = 200;
      backBut.visible = true
    }
  }
  //allSprites.debug = mouse.pressing();
}




/* FUNCTIONS */

