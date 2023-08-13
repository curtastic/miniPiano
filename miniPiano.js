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

SHORTER NOTES EXAMPLE:
piano.play([7,9,,9,10,12], 100, 9000)
Longest noteLen allowed is 44100 (default)
*/
var piano = {
	play: function(song, tempo, noteLen) {
		tempo ||= 180
		noteLen ||= 44100
		if(this.interval) {
			clearInterval(this.interval)
		} else {
			this.contexts = [...Array(11).keys()].map(_=>new AudioContext)
		}
		
		var makeNote = (note, len) => {
			note = 130.81 * 1.06 ** note
			
			// V: note length in seconds
			var V = len,
				
				// Temp vars for guitar synthesis
				vv = [],
				pp = 0, ch = 0,
				
				// Modulation
				// This function generates the i'th sample of a sinusoidal signal with a specific frequency and amplitude
				b = (note, tt, aa, tick) => Math.sin(note / tt * 6.28 * aa + tick),
				
				// Instrument synthesis
				w = (note, tt) =>
				
				  // Piano
				  Math.sin(note / noteLen * tt * 6.28 + b(note, noteLen, tt, 0) ** 2 + .75 * b(note, noteLen, tt, .25) + .1 * b(note, noteLen, tt, .5)) * .1
				,
				// Sound samples
				D = []
			
			// Loop on all the samples
			for(tick = 0; tick < noteLen * V; tick++){
				// Fill the samples array
				D[tick] =
				
				  // The first 88 samples represent the note's attack
				  tick < 88 
				  ? tick / 88.2 * w(tick, note)
				  
				  // The other samples represent the rest of the note
				  : (1 - (tick - 88.2) / (noteLen * (V - .002))) ** ((.5 * Math.log(1e4 * note / noteLen)) ** 2) * w(tick, note)
			}
			return D
		}
		
		this.song = []
		if(this.contexts[9]) {
			for(var i=0; i<song.length; i++) {
				if(!song[i]) {
					this.song.push(0)
				} else {
					var b = this.contexts[i%10].createBuffer(1, 1e6, noteLen)
					b.getChannelData(0).set(makeNote(song[i], 2))
					this.song[i] = b
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
