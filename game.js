const config = {
    type:Phaser.AUTO,
    width:800,
    height:600,
    physics:{
        default:'arcade',
        arcade:{
            gravity:{y:200}
        }
    },
    scene:{
        preload:preload,
        create:create,
        update:update
    }
};

const game = new Phaser.Game(config);
function preload(){
    this.load.image('sky','assets/sky.png');
    this.load.image('ground','assets/ground3.jpg');
    this.load.image('star','assets/star.png');
    this.load.image('bomb','assets/bumb.png');
    this.load.spritesheet('dude','assets/dude.png',{frameWidth:32,frameHeight:48});
}
function create(){

 this.add.image(400,300,'sky');
 plateforms = this.physics.add.staticGroup();
 plateforms.create(60,490,'ground'); plateforms.create(190,490,'ground'); plateforms.create(320,490,'ground'); plateforms.create(450,490,'ground');
 plateforms.create(600,400,'ground');
 plateforms.create(750,220,'ground');
 plateforms.create(180,220,'ground');

 player = this.physics.add.sprite(100,400,'dude');
 player.setBounce(0.2);
 player.setCollideWorldBounds(true);
//  player.body.setGravityY(350);
 this.physics.add.collider(player,plateforms);
 cursors = this.input.keyboard.createCursorKeys();
 this.anims.create({
    key:'left',
    frames:this.anims.generateFrameNumbers('dude',{start:0,end:3}),
    frameRate:10,
    repeat: -1
});

this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
});
this.anims.create({
    key: 'turn',
    frames: [{key: 'dude' ,frame:4 }],
    frameRate: 10,
    repeat: -1
});

stars = this.physics.add.group({
    key:'star',
    repeat:11,
    setXY:{ x:12, y:0 ,stepX:70 }
});
stars.children.iterate(function(child){
child.setBounceY(Phaser.Math.FloatBetween(1,0.8));
});

this.physics.add.collider(stars,plateforms);
this.physics.add.overlap(player,stars,collectStar,null,this);

let score = 0;
let scoreText;
bombs = this.physics.add.group();
this.physics.add.collider(bombs,plateforms);
this.physics.add.collider(player,bombs,hitBomb,null,this);

function hitBomb(player,bomb){
   this.physics.pause();
   player.setTint(0xff0000);
   player.anims.play('turn');

   gameOver = true;
}
function collectStar(player,star){
    star.disableBody(true,true);

    score += 10;
    scoreText.setText('Score : '+ score);
    if(stars.countActive(true) === 0 ){
        stars.children.iterate(function(child){
           child.enableBody(true,child.x ,0 , true ,true);
        });
        let x = (player.x < 400) ? Phaser.Math.Between(400,800) : Phaser.Math.Between(0,400);
        let bomb = bombs.create(x,16,'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-100,110),20); 
    }
}

scoreText = this.add.text(16,16,'score: 0',{ fontSize: '32px' , fill: '#fff'});

}
 function update(){
 
if(cursors.left.isDown){
    player.setVelocityX(-260);
    player.anims.play('left');
}
else if(cursors.right.isDown){
 player.setVelocityX(260);
 player.anims.play('right',true);
}
else{
    player.setVelocityX(0);
    player.anims.play('turn');
}
 if(cursors.up.isDown){
    player.setVelocityY(-330);
  
   }
}

