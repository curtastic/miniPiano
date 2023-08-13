/* miniPiano
EXAMPLE USE:
piano.play([7,9,,9,10,12])
Numbers are note pitch.
Leave gaps to make silence.
Loops forever.

TO STOP:
piano.play([])

FAST TEMPO EXAMPLE:
piano.play([7,9,,9,10,12], 100)

ALL NOTES ARE TWICE AS SHORT EXAMPLE:
piano.play([7,9,,9,10,12], 100, .5)
Longest noteLen allowed is 1 (default)

SOME NOTES ARE LONGER EXAMPLE:
piano.play([7,-9,,9,10,-12,,])
Use negative numbers to make a note twice as long.
This won't make it take up 2 slots in your array.

SOME NOTES ARE SHORTER EXAMPLE:
piano.play([.11,,.11,,-11,,,,.09,,.09,,-9,,])
Use a dot to make a note half as long.
To play a 9 (lower A) short, use .09 not .9

*/
var piano = {
	play: function(song, tempo, noteLen) {
		tempo ||= 180
		noteLen = (noteLen||1)*44100 | 0
		if(this.interval) {
			clearInterval(this.interval)
		} else {
			this.contexts = [...Array(11).keys()].map(_=>new AudioContext)
		}
		
		var makeBuf = i => {
			// V: note length in seconds
			var note = song[i],
				V = 2,
				len = noteLen
			if(note < 0) {
				note *= -1
				V = 4
			}
			if(note < 1) {
				note *= 100
				V = 1
			}
			note = 130.81 * 1.06 ** note
			
			var 
				// Temp vars for guitar synthesis
				vv = [],
				pp = 0, ch = 0,
				
				// Modulation
				// This function generates the i'th sample of a sinusoidal signal with a specific frequency and amplitude
				b = (note, tt, aa, tick) => Math.sin(note / tt * 6.28 * aa + tick),
				
				// Instrument synthesis
				w = (note, tt) =>
				
				  // Piano
				  Math.sin(note / len * tt * 6.28 + b(note, len, tt, 0) ** 2 + .75 * b(note, len, tt, .25) + .1 * b(note, len, tt, .5)) * .1
				,
				// Sound samples
				D = []
			
			// Loop on all the samples
			for(tick = 0; tick < len * V; tick++){
				// Fill the samples array
				D[tick] =
				
				  // The first 88 samples represent the note's attack
				  tick < 88 
				  ? tick / 88.2 * w(tick, note)
				  
				  // The other samples represent the rest of the note
				  : (1 - (tick - 88.2) / (len * (V - .002))) ** ((Math.log(1e4 * note / len) / 2) ** 2) * w(tick, note)
			}
			
			var b = this.contexts[i%10].createBuffer(1, D.length, noteLen)
			b.getChannelData(0).set(D)
			return b
		}
		
		this.song = []
		if(this.contexts[9]) {
			for(var i=0; i<song.length; i++) {
				if(!song[i]) {
					this.song.push(0)
				} else {
					this.song[i] = makeBuf(i)
				}
			}
		}
		
		var notePlay = i => {
			if(this.song[i]) {
				var ctx = this.contexts[i%10]
				var source = ctx.createBufferSource()
				source.buffer = this.song[i]
				source.connect(ctx.destination)
				source.start()
			}
		}
		
		this.noteI = 0
		this.interval = setInterval(_ => {
			if(this.noteI >= this.song.length) {
				this.noteI = 0
			} else {
				notePlay(this.noteI++)
			}
		}, tempo)
	}
}
