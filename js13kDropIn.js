//** All the funny variables are because some of the original variable names were in my game, 
//** so I had to change them to keep it from crashing.
//** If someone else uses this code and it won't work they may need to change other variables */
// https://xem.github.io/js1k19/miniSynth/
//***PIANO****
mySong = [1,1,1,2,2,3,3,4,28,25,28,23,25,24,21,21,21];
let on = false;	 
var timerId;
const builtSong =[];

function buildsong(mySong, len, piano){
    mySong.forEach(element => {
            builtSong.push(getD(element,len,piano));
            console.log(builtSong.length);
    });
    console.log("buildsong...");
}

function playTheSong(song){
    let elm = 0;
    timerId= setTimeout(function run() {
    console.log(elm);
    if(elm==song.length){
        elm=0;
        console.log("reached end");
    }
    playTheNote(song[elm]);
    elm++;
    timerId = setTimeout(run, 1000);
    }, 1000);
    on = true;
console.log("play song...");
}

function playTheNote(D){
    A = new AudioContext,
    mm = A.createBuffer(1, 1e6, 44100),
    mm.getChannelData(0).set(D),
    ss = A.createBufferSource(),
    ss.buffer = mm,
    ss.connect(A.destination),
    ss.start()
}

function getF(i){ return 130.81 * 1.06 ** i;}

function getD(note, len, piano){
    note = getF(note);
    for(

        // V: note length in seconds
        V = len,
        
        // O: piano is selected
        uh = piano,
        
        // Temp vars for guitar synthesis
        vv = [],
        pp = ch = 0,
        
        // Modulation
        // This function generates the i'th sample of a sinusoidal signal with a specific frequency and amplitude
        b = (note, tt, aa, tick) => Math.sin(note / tt * 6.28 * aa + tick),
        
        // Instrument synthesis
        w = (note, tt) =>
        
          uh
        
          // Piano
          ? Math.sin(note / 44100 * tt * 6.28 + b(note, 44100, tt, 0) ** 2 + .75 * b(note, 44100, tt, .25) + .1 * b(note, 44100, tt, .5))
          
          // Guitar
          : (
            P = 44100 / tt,
            rr = 0,
            vv.length <= 1 + ~~P
            ? (vv.push(2 * Math.random() - 1), vv[vv.length - 1])
            : (vv[pp] = .5 * (
              vv[pp >= vv.length - 1 ? 0 : pp + 1] + vv[pp]
              ),
              pp >= ~~P && (
                pp < 1 + ~~P 
                ? ch % 100 >= ~~(100 * (P - ~~P)) &&(rr = 1, vv[pp+1] = .5 * (vv[0] + vv[pp + 1]), ch++)
                : rr = 1
              ),
              pp = rr ? 0 : pp + 1,
              vv[pp]
            )
          ),
        // Sound samples
        D = [],
        
        // Loop on all the samples
        tick = 0;
        tick < 44100 * V;
        tick++
        ){
        
        // Fill the samples array
        D[tick] =
        
          // The first 88 samples represent the note's attack
          tick < 88 
          ? tick / 88.2 * w(tick, note) 
          
          // The other samples represent the rest of the note
          : (1 - (tick - 88.2) / (44100 * (V - .002))) ** (uh ? (.5 * Math.log(1e4 * note / 44100)) ** 2 : 1) * w(tick, note);
        }
        return D;

}
//***END PIANO****

//How to use in game: Either play a whole song as an array
// ex: mySong = [1,1,1,2,2,3,3,4,28,25,28,23,25,24,21,21,21];
// Use buildSong(song, len, piano); and playTheSong(builtsong);
// or/and play individual notes
// ex: playNote(getF(32),3,false);
// To use in onClick:
onclick = e => {
if(!on){
    on=true;
    // build the song
    buildsong(mySong, 3, true);

    // play the song
    playTheSong(builtSong);
    }
}

// Play individual notes:
let notePlay =false;
if(notePlay){
    let buildNote = getD(32, 3, false); // false for guitar
    playNote(buildNote);
}