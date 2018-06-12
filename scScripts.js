 var star = {
    _x: null,
    _y: null,
    _xSpeed: null,
    _ySpeed: null,
    _visible: true,

    //Create new star object with given starting position and speed
    //class functions exist to set other private variables
    //All inputs are double and function returns a new star
    create: function (x, y, xSpeed, ySpeed) {
        var obj = Object.create(this);
        obj._x = x;
        obj._y = y;
        obj._sizeX = 20;
        obj._sizeY = 20;
        obj._xSpeed=xSpeed;
        obj._ySpeed=ySpeed;
        obj._img = new Image();
        obj._img.src="images/star1.png";
        return obj;
    },

    setImage: function(img){
        this._img.src=img;
    },
    setSize: function(width,height){
        this._sizeX =width;
         this._sizeY =height;
    },

    //Update the new x and y of the star based on the speed.
    //drawing functionality is left for calling class
    //no input or return
    update: function () {
        this._x+=this._xSpeed;
        this._y+=this._ySpeed;

    },
};

// StarCatcher Scripts for the game made by Soft Dev 2015
    // when the web page window loads up, the game scripts will be read
window.onload = function() {
    //load canvas
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d"),
        w = canvas.width = 800,
        h = canvas.height = 500;
        var gameOn=false; gameStart= true, pause = true;
     deadStars=0
     var sc=5;
    //load images and x y location for images
    var starImg = new Image();
    starImg.src="images/star1.png";
    var player1Img = new Image();
    player1Img.src="images/plane1.png";
    var p2x=w/3, p2y=h/2;
    var player2Img = new Image();
    player2Img.src="images/plane2.png";
    var p1x=2/3*w, p1y=h/2;
    var p1Score = 0, p2Score=0

 // our stars are created using a single array with a class of information
          function createStars(sc) {    
                starCount=sc;
                starArray=[];

                // Create an array of stars
                for (var i = 0; i < starCount; i++) {
                    // this assigns each element in the array all the information for the star by 
                    // using the 'star' class, pass the starting x,y locations 
                    //  and speeds into the array.
                    if (i<starCount/2){

                   
                    starArray.push(star.create(20,i+50,Math.random()*5,Math.random()*5)); 
                    }
                else {starArray.push(star.create(w-20,i+50,-Math.random()*5,Math.random()*5));}
                }
            }

            createStars(sc);
   

    // moving stars around the screen and update the players movement
     //  scoring functions to place and score stars
    function scoring(k,wp) {
        starArray[k]._visible=false;
        starArray[k]._x = w+200
		starArray[k]._xSpeed =0;
        deadStars++;
        if (wp==1) {
            // need to place a small star next to player 1 score
            p1Score++;
            $("#p2ScoreDisp").text(p1Score);
        }
        else if (wp==2) {
            p2Score++;
            $("#p1ScoreDisp").text(p2Score);
        }
        if (deadStars== sc) setTimeout(function() {levelup()}, 2000);

        function levelup() {
            p2x=.9/2*w, p2y=h/1.1;
            p1x=1.1/2*w, p1y=h/1.1;
            sc =sc+5;
            createStars(sc);
            deadStars=0
        }
        if (p1Score+p2Score==15) if (p1Score>p2Score) {
            gameover1();
      

        } 
         if (p1Score+p2Score==15) if (p2Score>p1Score) {
            gameover2();
      

        }  
    } //not for function
    function starsUpdate () {
         //ctx.drawImage(background,0,0,w,h);
        
    //  draw star on screen only if visible
        for (var i = 0; i < starCount; i++) {
            starArray[i].update();
            if (starArray[i]._visible) {
			 ctx.drawImage(starArray[i]._img, starArray[i]._x, starArray[i]._y,starArray[i]._sizeX,starArray[i]._sizeY);
			}
            if (starArray[i]._x>w-starArray[i]._sizeX || starArray[i]._x<0) {starArray[i]._xSpeed = -starArray[i]._xSpeed}
            if (starArray[i]._y>h-starArray[i]._sizeY || starArray[i]._y<0) {starArray[i]._ySpeed = -starArray[i]._ySpeed}
             var d1=Math.sqrt(Math.pow(p1x-starArray[i]._x,2)+Math.pow(p1y-starArray[i]._y,2));
            var d2=Math.sqrt(Math.pow(p2x-starArray[i]._x,2)+Math.pow(p2y-starArray[i]._y,2));
            if (d1<25) {scoring(i,1)}
            if (d2<25) {scoring(i,2)}
        }//endFor
    }
     var keysDown = [];

    // if the key is held down, the keycode is placed in array
    // then it is deleted upon keyup command.  
    // playerUpdate will now control player movements and use the keysDown array

    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
    }, false);

    //  player 2 movement keyboard commands
    addEventListener("keyup", function (e) {

        if (e.keyCode == 87) { //  (key: w )
            p2y-=10;
        }
        if (e.keyCode == 83) { //  (key: s)
            p2y+=10;
        }
        if (e.keyCode == 65) { //  (key: a)
            p2x-=10;
        }
        if (e.keyCode == 68) { //  (key: d)
            p2x+=10;
        }
        

        if (e.keyCode == 32) { //  (key: space)
            gameOn= !gameOn;
            pause = !pause;
            main();
        }

        //take keycode out of array (not being held down anymore)
        delete keysDown[e.keyCode];
    }, false); 
    //Listens to app for keyboard actions
    addEventListener("keyup", function (e) {

        if (e.keyCode == 38) { //  (key: up arrow)
            p1y-=10;
        }
        if (e.keyCode == 40) { //  (key: down arrow)
            p1y+=10;
        }
        if (e.keyCode == 37) { //  (key: left arrow)
            p1x-=10;
        }
        if (e.keyCode == 39) { //  (key: right arrow)
            p1x+=10;
        }
         //take keycode out of array (not being held down anymore)
        delete keysDown[e.keyCode];
    }, false);    

   //player movement
    function playerUpdate() {
        //player two hodling down a key using the array keysDown
        if (87 in keysDown) {// P2 holding down the w key
            p2y -= 5;
        }
        if (83 in keysDown) { // P2 holding down (key: s)
            p2y += 5;
        }
        if (65 in keysDown) { // P2 holding down (key: a)
            p2x -= 5;
        }
        if (68 in keysDown) { // P2 holding down (key: d)
            p2x += 5;
        }

        // player one hodling key down
        if (37 in keysDown) { // P2 holding down (key: left arrow)
            p1x -= 5;
        }
        if (38 in keysDown) { // P2 holding down (key: up arrow)
            p1y -= 5;
        }
        if (39 in keysDown) { // P2 holding down (key: right arrow)
            p1x += 5;
        }
        if (40 in keysDown) { // P2 holding down (key: down arrow)
            p1y += 5;
        }

        
        

        //draw images of ships
        ctx.drawImage(player1Img, p1x, p1y, 40, 40);
        ctx.drawImage(player2Img, p2x, p2y, 40, 40);
    }
    function starter() {

         ctx.clearRect(0,0,w,h);
         ctx.fillStyle="black";
         ctx.fillRect(0,0,w,h);
         ctx.fillStyle="white";
         ctx.font="50px Sans-Serif";
         ctx.fillText("Spacebar to start",w/4,h/2);
         
          gameStart=false;
    }
     function paused() {
         ctx.clearRect(0,0,w,h);
         ctx.fillStyle="blue";
         ctx.fillRect(0,0,w,h);
         ctx.fillStyle="white";
        ctx.font="50px Sans-Serif"; 
        ctx.fillText("paused",w/2.5,h/2);
         
    }
    function gameover1() {
         
         ctx.fillStyle="rgba(86, 255, 14, 0.32)";
         ctx.fillRect(0,0,w,h);
         ctx.fillStyle="white";
        ctx.font="40px Sans-Serif"; 
        ctx.fillText("GAME OVER Player 1 WINS",w/4,h/4);
        gameOn  = false;
       setTimeout(function() {restarter()}, 3000);

    }
    function restarter() {
      pause=true;
     p1Score=0, p2Score=0;
     sc=5, deadStars=0;
    $("p1ScoreDisp").text(p1Score);
    $("p2ScoreDisp").text(p1Score);
    createStars(sc);
    starter();

   
}
    
    function gameover2() { 
         
         ctx.fillStyle="rgba(255, 0, 14, 0.26)";
         ctx.fillRect(0,0,w,h);
         ctx.fillStyle="white";
        ctx.font="40px Sans-Serif"; 
        ctx.fillText("GAME OVER Player 2 WINS",w/4,h/4);
        gameOn  = false;
        setTimeout(function() {restarter()}, 3000);
    }

    //Our main function which clears the screens 
    //  and redraws it all again through function updates,
    //  then calls itself out again
    function main(){
        ctx.clearRect(0,0,w,h);
        starsUpdate();
        playerUpdate();
       if(gameOn) {requestAnimationFrame(main);}
      
       if (pause){paused();}
   	 if (gameStart) {starter();}	
    }
    

    main();
}        