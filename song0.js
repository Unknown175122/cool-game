function runGame() {
  background(0)
  visualElements() //draw stuff to screen
  updateChr()
  if (hope <= 0){ //oh no! you lost.
    //frames_passed -= 1-bgMus.speed();
    //if (bgMus.speed()-0.01 > 0.1){
    //  bgMus.speed(bgMus.speed()-0.01)
    //  noteMus.speed(noteMus.speed()-0.01)
    //}
    //print(bgMus.speed())
    //print(frames_passed)
    print('aaa');
    bgMus.stop()
    noteMus.stop()
    eolTasks() 
    return;
  }
  updateNotes() //if hope's not lost, move notes + detect when coliision
  
  if (streak > hiStreak) { //sets hiStreak
    hiStreak = streak;
  }
  noteChoreography() //adds notes when needed

    //if ((frames_touching > 5) || ((frames_touching > 0) && (frames_touching < 2))) { //if your timing's wack, set tolm to now and reset for next note
      //missNote = true      //ADJUST FOR PLAYABILITY
      //tolm = frames_passed
      //print('missed note')
      //frames_touching = null
    //} else 
  manageMus()

  displayFinish() //activates finish animation when its time (sends to screen 5 when done)
  eolTasks() //end of loop tasks
}

function displayFinish() {
  if (frames_passed == 750) {   //ending!
    finish.play();
    finSprite.y = -25;
    finSprite.vel.y = 1;
  } else if (finSprite.y >= 250) {
      finSprite.vel.y = -1 * finSprite.vel.y/2;
  } else if ((frames_passed > 750) && (frames_passed < 800)) {
    finSprite.vel.y += 2;
  } 
  if ((frames_passed > 850) && (frames_passed < 870)) {
    finSprite.vel.y = 0
    //finSprite.moveTo(200,175,5) //16 frames
    finSprite.moveTo(200,125,8); //16 frames
  } else if (squareVis == 255) {
    screenNo = 5;
  } else if (frames_passed >= 870) {
    square.pos = {x: 200, y: 200}
    squareVis += 5;
    square.shapeColor.setAlpha(squareVis);
  }
}

function eolTasks() {
  l_cursor.y = 250; //must be 'd' so colliding works
  r_cursor.y = 250;
  frames_passed += 1;
  frames_touching = null
}

function manageMus() {
  if ((tolm +time_to_pause_notes < frames_passed)) { //unmute mus after ttpn
    missNote = false
  }
    //print(frames_touching)

  if (frames_passed >= 82) { //wait 2secs to start mus
    if (missNote) { //pause if missed note
      bgMus.volume(1)
      noteMus.volume(0)
      if (!isPaused) {
        hurtsfx.play()
      }
      isPaused = true
    } else {
      if (isPaused) { //unpause if paused
        //noteMus.play()
        noteMus.volume(1)
        //bgMus.volume(0)
        //noteMus.time(frames_passed/30) //HOLY #### I DID IT!!!!!!! <-- me figuring out stuff
        isPaused = false
      }
    }
  }
  if (frames_passed == 82) { //start music on time
    bgMus.play()
    noteMus.play()
  }
  
}

function updateChr() {
  //updates the playerImage
  if (missNote) {
    character.image = chImgHurt;
    character.ticks = 15;
  } else if (frames_touching != null) {
    character.image = chImgNote;
    character.ticks = 0;
  } else if ((((frames_passed == 140) || (frames_passed == 220)) || ((frames_passed == 380) || (frames_passed == 460))) || (frames_passed == 525)) {
    character.image = chImgStrum;
    character.ticks = 10;
  } else if (character.ticks >= 20) {
    character.image = chImgIdle;
  } else {
    character.ticks += 1;
  }
}

function updateNotes() {
  for (let i = 0; i < notes.length; i++) { //for however many notes there are
    notes[i].y +=3;          //add 1 y to every note

    if ((l_cursor.colliding(notes[i]) && ((kb.presses('left')) || (kb.presses('a')))) > 0) {
      frames_touching = l_cursor.colliding(notes[i]); //record on how many frames it was hit         //6 total ; 2-5 ig is good enuf, 34 and 1011 are ok ; subject to change
      notes[i].life = 0; //kills the note
      score += 10 + (10 * round(streak/4));
      hope += 10 + (10 * round(streak/4));
      streak += 1;
      negStreak = 0;
    } else if ((r_cursor.colliding(notes[i]) > 0) && ((kb.presses('right')) || (kb.presses('d')))) { //if hit note (right)
      frames_touching = r_cursor.colliding(notes[i]); 
      notes[i].life = 0;
      score += 10 + (10 * round(streak/4)); //Score cannot be minused
      hope += 10 + (10 * round(streak/4)); //hope can
      streak += 1;
      negStreak = 0;
    }

    //gets rid of a note immediately after it stops touching the cursor
    if ((l_cursor.colliding(notes[i])) || (r_cursor.colliding(notes[i]))) {
      notes[i].touchingCursor = true;
    } else if (notes[i].touchingCursor) {
      notes[i].touchingCursor = false;
      if (notes.includes(notes[i])) {
        missNote = true;
        tolm = frames_passed;
        notes[i].life = 0;
        hope += -5 + (5 * negStreak); //hope being minused
        streak = 0;
        negStreak -= 1;
      }
    }
  }
}

function visualElements() {
  fill(255)
  text('Score: ' + score, 10,10)
  text('Streak: ' + streak, 345,10)
  text('Press left and right\nArrow keys and \nhit notes on time', 10,40) //cheer up the little kid
  stroke('red')
  line(140,265,260,265)
  stroke(200)
  line(200,0,200,325)
  stroke(255)
  line(140,0,140,325)
  line(260,0,260,325)
  line(140,320,260,320)
  strokeWeight(2)
  line(140,325,260,325)

  strokeWeight(1)
  stroke(0)

  fill(255)
  image(barImg, 280,279 - ((249/220)*hope));//300-score*(13/10)) //245x550
  image(metImg, 280,30) //245x550
  fill(0)
  rect(310,355,90,45)
  fill(255)
  //rect(70,220,10,10)
  if (score < 30) {
    kImg = kImg1
  } else if (score < 130) {
    kImg = kImg2
  } else if (score < 200) {
    kImg = kImg3
  } else {
    kImg = kImg4
  }
  image(kImg,280,200)
}

function l_note(ticks) {
  if (frames_passed == ticks) { //adds left note on frame ticks
    new_note = new notes.Sprite()  //CODE FOR ADDING NOTES!!!!!!
    new_note.x = 170;
    new_note.fill = 'dodgerblue'
    new_note.touchingCursor = false;
  }
}

function r_note(ticks) {
  if (frames_passed == ticks) { //adds right note on frame ticks
    new_note = new notes.Sprite()  //CODE FOR ADDING NOTES!!!!!!
    new_note.x = 230;
    new_note.fill = 'blueviolet'
    new_note.touchingCursor = false;
  }
}

function noteChoreography() {  //every frame is ~0.05 beats //20 frames per beat
  //if (frames_passed == 0) { 
    //new_note = new notes.Sprite()  //CODE FOR ADDING NOTES!!!!!!
    //new_note.x = 230;                    //170 or 230
  //}
  r_note(0); //adds note on frame 0
  l_note(78)
  r_note(155)
  l_note(195)
  r_note(235)
  l_note(325)
  r_note(400)
  l_note(485)//its
  r_note(520)//all
  l_note(560)//right
  if (frames_passed == 360) {
    noteMus.time((frames_passed-82) /30)  //duct tape
    bgMus.time((frames_passed-82) /30)    //apparently the fps is slower??? than 30fps???
  }                                    //or faster??? idk???
  if (frames_passed == 553) {
    noteMus.time((frames_passed-82) /30)  //duct tape
    bgMus.time((frames_passed-82) /30)
  }
}
