// This simple game disk can be used as a starting point to create a new adventure.
// Change anything you want, add new rooms, etc.




// THE START

const darlene = {
    roomId: 'home', // Set this to the ID of the room you want the player to start in.
    rooms: [
      {
        id: 'home', // Unique identifier for this room. Entering a room will set the disk's roomId to this.
        name: 'Your home', // Displayed each time the player enters the room.
        desc: `You are in front of your house.`, // Displayed when the player first enters the room.
        firstDesc:`To the !!North!! is your farm, to the !!East!! is the path through the valley, and to the West is the pass over the mountains.`,
        items: [
          {
            name: ['Flask', 'bottle'],
            desc: 'It is shiny.', // Displayed when the player looks at the item.
            longName: "On the floor ahead of you lies your empty flask.",
            isTakeable: true,
            isFull: false,
            onUse: function () {
              if (disk.roomId === 'riverbed') {
                  takeItem ('water')
              }else if(getRoom(disk.roomId).name === 'Desert'){
                disk.desertCount = 0;
                println('You feel refreshed.');
              }else{
                disk.desertCount = 0;
                println('You feel refreshed, but perhaps there was a better time...');
              }
            }
            // onUse: () => println(`The flask is empty.`), // Called when the player uses the item.
          }
        ],
        exits: [
          {
            dir: 'north',
            id: 'failedCrops'
          },
          {
            dir: 'east',
            id: 'valley'
          },
          {
            dir: 'west',
            id: 'mountainPass'
          },
        ],
      },

// THE NORTHERN ROUTE 

      {
        id: 'failedCrops',
        name: 'Failed Crops',   
        desc: `Your failure lies before you. The crops have grown less than half the amount you’d wished for, and will sustain you little in this harsh climate.`,
        items: [
          {
            name: ['Jerky',],
            desc: 'Tasty tasty jerky', // Displayed when the player looks at the item.
            longName: "Just one piece of food is ready to eat - a piece of jerky hanging in front of you.",
            isTakeable: true,
            onUse: () => {
              if(disk.roomId === 'valleyWolf'){
                println('The animal takes the food gratefully, and runs off into the distance. Despite the danger, you are glad you did not have to kill it.');
                enterRoom('valley')
              }
            },
          }
        ],
        exits: [
          {
            dir: 'south',
            id: 'home',
          },
        ],
      },
      
// THE EASTERN ROUTE


      {
        id: 'valley',
        name: 'Valley',
        desc: `A thin, winding valley reaches before you. `,
        firstDesc: `The twisting rockwalls around you prevent you from seeing more than 50ft ahead, but it is clear that there are paths to the North, East and South. \n You notice tracks tramped around in circles. Darlene has been here.`,
        onEnter:function(data){
          var hut = getRoom('hut');
          var valleyWolf = getRoom('valleyWolf');
          if(hut.visits === 1 && valleyWolf.visits === 0){
            enterRoom('valleyWolf');
          }
        },
        exits: [
          {
            dir: 'west',
            id: 'home',
          },
          {
            dir: 'north',
            id: 'hut',
          },
          {
            dir: 'east',
            id: 'deadEnd',
          },
          {
            dir: 'south',
            id: 'riverbed',
          }
        ]
      },
      
      {
        id: 'hut',
        name: 'Old Cabin',
        desc: `A rickety old cabin has been built in a small nook against the other side of the valley.`,
        firstDesc: `You&apos;ve never seen it before, but feel compelled to enter. \n Inside, everything is worn and broken, and little life remains except some old furniture - it must have been abandoned some time ago. There is however a small table ahead.`,
        items: [
          {
            name: ['gun', 'rifle', 'henry', 'Henry Western', 'Western', 'shotgun',],
            desc: 'It has Henry Western emblazoned on the side.', // Displayed when the player looks at the item.
            longName: `There is a rusty shotgun atop it, with Henry Western emblazoned upon its strap.`,
            isTakeable: true,
            loaded:1,
            onUse: function () {
              var gun = getItemInInventory('gun');
              if (disk.roomId === 'valleyWolf') {
                println ('You fire your only shot at the poor beast and miss. It scatters into the distance. You’re unlikely to see him again, but you feel restless with him on the loose regardless.')
                enterRoom ('valley')
              }else if(disk.roomId === 'mine'){
                if(gun.loaded == 1){
                  println ('You fire a shot into the bear. Mid run, the beast stumbles. Turning away from them both, it cowers away into the storm, leaving you and your wife be.')
                  println ('Darlene looks at you with a gleam in her eye.')
                  println ('She’s safe now, and she has something to tell you...')
                  helper.runEnding();
                }else{
                  println ('The gun is not loaded. The bear presses towards Darlene at pace.');
                  println ('You can fight him barehanded, or flee.');
                  helper.runEnding();
                }
                
              }
              gun.loaded = 0;
            },
            onTake: function () {
              println(`You take the gun - there is a single shell in its chamber`)
            }
          },
          
          {
            name: 'rope',
            desc: `It looks strong enough to climb with.`,
            longName: `A rope hangs on a hook underneath.`,
            isTakeable: true, // Allows the player to take the item.
            onUse: () => {
              // Remove the block on the room's only exit.
              const room = getRoom('sheerEdge');
              const exit = getExit('north', room.exits);
              if (exit.block) {
                delete exit.block;
                println(`You attach the rope securely to a nearby rock, and begin your descent.`);
              } else {
                println(`There is nothing to use the rope on.`);
              }
            },
          }
        ],
        exits: [
          {
            dir: 'south',
            id: 'valley',
          }
        ],
      },

       {
        id: 'valleyWolf',
        name: 'A Wolf Attacks',
        desc: `On your return from the cabin, you hear a fierce growl.\nIt is small, but it looks as though it hasn’t eaten for weeks - something you can see not just in his bony frame, but in the wild look in his eyes.`,
        firstDesc: ``,
        exits: [
          {
            dir: 'south',
            id: 'valleywithwolf',
          }
        ],
      },

      {
        id: 'deadEnd',
        name: 'Dead end',
        desc: `At the other end of the valley, a dead end faces you.`,
        firstDesc: `It doesn’t appear as though Darlene has been this way.\nYou can only go West, the way you came.`,
        exits: [
          {
            dir: 'west',
            id: 'valley',
          }
        ],
      },

      {
        id: 'riverbed',
        name: 'Stream',
        desc: `A small stream has eeked its way in from the mountain, glittering in the sunshine. `,
        firstDesc: `Darlene has clearly been here. Why didn’t she come straight back?`,
        items: [
          {
            name: ['Water'],
            desc: 'Very refreshing.', // Displayed when the player looks at the item.
            longName: "The water looks delicious.",
            isTakeable: false,
            onTake: function () {
              var theFlask = getItemInInventory('flask')
              if(typeof(theFlask) !== "undefined"){
                if(theFlask.isFull){
                  println(`its only a 500ml flask, there only so much water it can hold.`);
                }else{
                  println(`You fill your flask.`);
                }
                theFlask.isFull = true;
              }else{
                println(`You cup your hands but this isn't a reliable container.`);
              }
            },
            onUse: function () {
               
            }
          }
        ],
        exits: [
          {
            dir: 'north',
            id: 'valley',
          }
        ],
      },


// THE WESTERN ROUTE

      {
        id: 'mountainPass',
        name: 'Mountain Pass',
        desc: `A thin road climbs up into the mountains, following up alongside and above the valley.`,
        firstDesc: `Darlene has been here.\nAs you rise up the mountain, the path splits to the North, West and South, and it is not clear where she went.\nYou can take any path, or return down to your home to the East.`,
        exits: [
          {
            dir: 'north',
            id: 'topOfMountain',
          },
          {
            dir: 'east',
            id: 'home',
          },
          {
            dir: 'south',
            id: 'scaryRocks',
          },
          {
            dir: 'west',
            id: 'rockWall',
          },
        ],
      },

      {
        id: 'rockWall',
        name: 'Dead end',
        desc: `A sheer wall faces you on all sides but East, with no way up.\nYou can only go East, back where you came from.`,
        exits: [
          {
            dir: 'east',
            id: 'mountainPass',
          }
        ],
      },
    

      {
        id: 'scaryRocks',
        name: 'Unstable path',
        desc: `All ahead this way are unstable looking rocks.\nIt would be foolish to do anything but turn around.`,
        exits: [
          {
            dir: 'north',
            id: 'mountainPass',
          },
          {
            dir: 'east',
            id: 'rockDeath',
          },
          {
            dir: 'south',
            id: 'rockDeath',
          },
          {
            dir: 'west',
            id: 'rockDeath',
          }
        ],
      },

      {
        id: 'rockDeath',
        name: 'Unstable path',
        desc: `The stones slip from beneath your feet, and start a huge rockslide.\nFor a moment, you manage to hold yourself up, but soon your feet get stuck beneath the slide, and you are forced to the ground while it continues moving at speed.\nIt’s not long before you are entirely buried under moving rock, forcing your breath from you until you can fight no longer.\nYou died.`,
      },



// THE SUMMIT

      {
        id: 'topOfMountain',
        name: 'The Summit',
        desc: `The view reaches on forever, bringing you back some small semblance of the dream you and Darlene came here for.  `,
        firstDesc: `To the South is the path back down, to the East the edge over your valley, to the West a cave, and another edge to the North.`,
        exits: [
          {
            dir: 'north',
            id: 'sheerEdge',
          },
          {
            dir: 'east',
            id: 'edgeOverValley',
          },
          {
            dir: 'south',
            id: 'topOfMountain',
          },
          {
            dir: 'west',
            id: 'cave',
          },
        ],
      },
    
      {
        id: 'edgeOverValley',
        name: 'Overlooking the Valley',
        desc: `On the edge over the valley, you can see your house below.`,
        firstDesc: `There is no sensible way down here, except to go back the way you came - to jump would be to die.`,
        exits: [
          {
            dir: 'west',
            id: 'topOfMountain',
          },
          {
            dir: 'east',
            id: 'valleyDeath',
          },
          {
            dir: 'north',
            id: 'valleyDeath',
          },
          {
            dir: 'south',
            id: 'valleyDeath',
          },
        ],
      },

      {
        id: 'valleyDeath',
        name: 'Overlooking the Valley',
        desc: `You fall violently to your death, catching a final glimpse of your failed dream as the darkness takes you.\nYou died.`,
      },


      {
        id: 'cave',
        name: 'Cave',
        desc: `A small cave faces you.`,
        firstDesc: `There are no signs of Darlene, nor anything else for that matter.\nYou can only go East, the way you came.`,
        exits: [
          {
            dir: 'East',
            id: 'The Summit',
          }
        ],
      },


      {
        id: 'sheerEdge',
        name: 'Sheer Edge',
        desc: `A sheer edge faces you, looking over desert sands and more mountains ahead.`,
        firstDesc: `Darlene has been here, but a rockslide has followed her, blocking the path down.`,
        exits: [
          {
            dir: 'south',
            id: 'topOfMountain',
          },
          {
            dir: 'north',
            id: 'desert',
            block: `It’s no longer safe without the right gear.`,
          },
        ],
      },


// The Desert (row 1)

      {
        id: 'desert',
        name: 'Desert',
        desc: `You are in a large desert.`,
        firstDesc: `A storm is raging, blowing sands impeding your vision.\nYou can go North, East, West, or up the rope Southwards.`,
        exits: [
          {
            dir: 'north',
            id: 'voice',
          },
          {
            dir: 'east',
            id: 'nothing',
          },
          {
            dir: 'south',
            id: 'sheerEdge',
          },
          {
            dir: 'west',
            id: 'nothing2',
          },
        ],
      },

     

      {
        id: 'nothing',
        name: 'Desert',
        desc: `The sandstorm rages.`,
        firstDesc: `High rocks face you to the South and East. You can go West, or North.`,
        exits: [
          {
            dir: 'north',
            id: 'nothing3',
          },
          {
            dir: 'west',
            id: 'desert',
          },
        ],
      },

      {
        id: 'nothing2',
        name: 'Desert',
        desc: `You have to raise your arm to prevent the wind from blowing sand into your face.`,
        firstDesc: `To the South and West, there is nothing but jagged rock, blocking your path. You can go East, or North.`,
        exits: [
          {
            dir: 'north',
            id: 'nothing4',
          },
          {
            dir: 'east',
            id: 'desert',
          },
        ],
      },


// The Desert (row 2)

{
  id: 'voice',
  name: 'Desert',
  desc: `It’s Darlene. It sounds as if she’s calling for you, but you cannot understand what she is saying.`,
  firstDesc: `You can head in any direction.`,
  exits: [
    {
      dir: 'north',
      id: 'voice2',
    },
    {
      dir: 'east',
      id: 'nothing4',
    },
    {
      dir: 'south',
      id: 'desert',
    },
    {
      dir: 'west',
      id: 'nothing3',
    },
  ],
},

{
  id: 'nothing4',
  name: 'Desert',
  desc: `You can hear Darlene’s voice faintly.\nYou shout, but you hear no return.`,
  firstDesc: `A rockwall faces to the West. You can either go North, East, or South.`,
  exits: [
    {
      dir: 'north',
      id: 'nothing6',
    },
    {
      dir: 'east',
      id: 'voice',
    },
    {
      dir: 'south',
      id: 'nothing2',
    },
  ],
},

{
  id: 'nothing3',
  name: 'Desert',
  desc: `You can hear your wife’s voice, but you can’t make out what she is saying.`,
  firstDesc: `The path is blocked to the East, but you can head North, West or South.`,
  exits: [
    {
      dir: 'north',
      id: 'nothing5',
    },
    {
      dir: 'east',
      id: 'voice',
    },
    {
      dir: 'south',
      id: 'nothing',
    },
  ],
},

// The Desert (row 3)

{
  id: 'voice2',
  name: 'Desert',
  desc: `The sun beats down heavily upon you.\nDarlene can hear your voice and understand it; you’re getting close.\nShe’s urging you to come, and quickly.\nHer voice seems to vibrate in your ears however, and a violent ringing begins as the world shakes around you. You suddenly realise you are in desperate need of a drink.`,
  firstDesc: `You can head in any direction.`,
  exits: [
    {
      dir: 'north',
      id: 'mine',
    },
    {
      dir: 'east',
      id: 'nothing5',
    },
    {
      dir: 'south',
      id: 'voice',
    },
    {
      dir: 'west',
      id: 'nothing6',
    },
  ],
},

{
  id: 'nothing6',
  name: 'Desert',
  desc: `You can only just make out her voice, muffled by the storm.`,
  firstDesc: `Your path is blocked to the North and West, but you can get East or South.`,
  exits: [
    {
      dir: 'east',
      id: 'voice2',
    },
    {
      dir: 'south',
      id: 'nothing4',
    },
    {
      dir: 'south',
      id: 'nothing',
    },
  ],
},

{
  id: 'nothing5',
  name: 'Desert',
  desc: `Her voice is quiet, and she cannot hear you. The storm rages. `,
  firstDesc: `There is a rockwall to the North and East, but you can still head South or West.`,
  exits: [
    {
      dir: 'south',
      id: 'nothing3',
    },
    {
      dir: 'west',
      id: 'voice2',
    },
  ],
},

// {
//   id: 'desertDeath',
//   name: 'Desert',
//   desc: `You feel your parched mouth try to etch a cry to Darlene, but nothing comes out. \nEverything turns red, then black, as her voice fades away.`,
// },


// The Mine (endgame)

{
  id: 'mine',
  name: 'Abandoned Mine',
  desc: `Darlene’s voice gets clearer and clearer as you approach through the storm.\nYou approach the remnants of a mine, abandoned some years ago.\nAlmost falling in, you stop before a small well. Your wife is just 10ft below, and it looks like she has only sprained her ankle.\nYou are both desperately glad to see your spouse, and tell each other so.\nAs you prepare to lift her out, she says she has something to tell you, she has found another well nearby, full of oil! Everything is finally going to be okay. And, she says, there is something else...\nA low growl sounds from behind you. A great bear rears onto its hind legs and roars, then begins to pounce towards Darlene.`,
  firstDesc: `There is a rockwall to the North and East, but you can still head South or West.`,
  exits: [
    {
      dir: 'xxx',
      id: 'xxx',
    },
  ],
},



// room template

      {
        id: 'xxxxx',
        name: 'Dead end',
        desc: `xxx`,
        firstDesc: `xxx`,
        exits: [
          {
            dir: 'south',
            id: 'xxx',
          }
        ],
      },



//       {
//         id: 'hxxxxxxut',
//         name: 'Dead end',
//         desc: `xxx`,
//         firstDesc: `xxx`,
//         exits: [
//           {
//             dir: 'south',
//             id: 'xxx',
//           }
//         ],
//       },





// Ending brackets (nothing after this)


    ],
  };

  var helper = {
    aniTimeout:0,
    aniCallback:0,
    anim: (elements, classAni, aniDelay, callback, counter) => {
      if(typeof (counter) === 'undefined'){
        var aniCounter = 0;
        var delayCounter = 0;
        if (typeof (elements.length) === 'undefined') {
          elements.length = 1;
          elementsTemp = elements;
          elements = [];
          elements[0] = elementsTemp;
        }
      }else{
        aniCounter = counter[0];
        delayCounter = counter[1];
        aniCounter++;
        delayCounter++;
      }
      if(typeof(elements[aniCounter]) !== 'undefined'){
        if (!elements[aniCounter].classList.contains(classAni)) {
          helper.animTimeout(elements, aniDelay, classAni, callback, aniCounter, delayCounter);
        } 
      }else{
        setTimeout(callback, aniDelay[delayCounter]*1000)
      }
    },
    animTimeout: (loopElements, loopDelay, classAni, callback, aniCounter, delayCounter) => {
      helper.aniCallback = {
        loopElements:loopElements,
        classAni:classAni,
        loopDelay:loopDelay,
        counter: [aniCounter, delayCounter],
        run: () => {
          if(typeof(loopElements[aniCounter]) !== 'undefined'){
            helper.anim(loopElements, classAni, loopDelay, callback, [aniCounter, delayCounter]);
          }else{
            setTimeout(callback, loopDelay[delayCounter]*1000)
          }
        }
      }
      aniTimeout = setTimeout(() => {
        loopElements[aniCounter].className = loopElements[aniCounter].className + ' ' + classAni;
        helper.aniCallback.run();
      }, loopDelay[delayCounter]*1000); 
      
    },
    animSkip: () =>{
      clearTimeout(aniTimeout);
      // we need to skip all animations before this one here 
      for(var i = helper.aniCallback.counter[0]; i > 0; i--){
        console.log(helper.aniCallback.loopElements[i-1]);
        helper.aniCallback.loopElements[i].classList.add(helper.aniCallback.classAni+'Skip');
      }
      helper.aniCallback.loopElements[helper.aniCallback.counter[0]].classList.add(helper.aniCallback.classAni+'Skip');
      helper.aniCallback.run();
    },
    die:(deathMessage) => {
      if(typeof(deathMessage) === "undefined" || deathMessage.length === 0){
        deathMessage = 'Yep you&apos;re definitely dead, I checked...';
      }
      // darlene = {};
      helper.fadeAudio(false, "ost");
      helper.toggleAudio(true, "deathEnd");
      document.getElementById('deathScree').getElementsByTagName('p')[0].innerHTML = deathMessage;
      document.getElementById('deathScree').className='';
      document.getElementById('btnRestart').addEventListener('click', function(event) {
        window.document.location = window.document.location
      });
    },
    toggleAudio: (state, track) => {
      if(state){
          document.getElementById("audioOn").classList = ""
          document.getElementById("audioOff").classList.add("hide")
          document.getElementById(track).play();
          document.getElementById(track).volume = 0.3;
      }else{
          document.getElementById("audioOn").classList.add("hide")
          document.getElementById("audioOff").classList = ""
          document.getElementById(track).pause();
      }
    },
    fadeAudio: (dir, track) => {
      if(dir){
        
      }else{
        while(document.getElementById(track).volume > 0){
          var temp = document.getElementById(track).volume
          temp = (temp - 0.0001).toFixed(4);
          console.log(temp)
          document.getElementById(track).volume = temp;
        }
      }
    },
    runEnding: (dir, track) => {

    }
  }


var theBody = document.getElementById('theBody');
var firstEnter = 0
theBody.addEventListener('keyup', function(event) {
  if (event.keyCode === 13) {
    firstEnter++
    if(firstEnter == 1){
      event.preventDefault();
      helper.toggleAudio(true, "ost");
      startingAnim()
    }else{
      if(typeof(disk) === "undefined"){
        //helper.animSkip();
      }
    }
  }
});

document.getElementById("audioOff").addEventListener("click", function(){
  helper.toggleAudio(true, "ost");
})
document.getElementById("audioOn").addEventListener("click", function(){
  helper.toggleAudio(false, "ost");
})


function startingAnim(){
  helper.anim(document.getElementById('titleWrapper'), 'fadeOut', [0,5], () =>{
    document.getElementById('titleWrapper').classList.add('hide');
    document.getElementById('introText').classList.add('show');
    helper.anim(document.getElementById('introText').getElementsByTagName('p'), 'fadeIn', [1,3,3,3,3,5], () =>{
      document.getElementsByClassName('input')[0].className = 'input';
      // helper.anim(document.getElementsByClassName('input'), 'fadeIn')
      loadDisk(darlene);
    })
  })
}