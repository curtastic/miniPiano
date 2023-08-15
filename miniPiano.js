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
	songs: {},
	// song is an array of numbers from 1 to 99. Leave gaps for empty space.
	// tempo is the speed of the song in milliseconds between each note. Default is 180.
	// noteLen is how long all notes are held down. From 0-1. Default is 1.
	play: function(song, tempo, noteLen) {
		noteLen = (noteLen||1)*44100 | 0
		this.contexts ||= [...Array(9).keys()].map(_=>new AudioContext)
		
		var cachedSong = this.songs[song]
		if(!cachedSong) {
			cachedSong = this.songs[song] = song.map((note, i) => {
				if(note) {
					// This note's length in seconds
					var seconds = 2,
						// Modulation
						// This function generates the j'th sample of a sinusoidal signal with a specific frequency and amplitude
						b = (note, add) => Math.sin(note*6.28 + add),
						// Instrument synthesis
						w = note => b(note, b(note,0)**2 + b(note,.25)*.75 + b(note,.5)*.1) * .1,
						// Array of sound samples
						a = [],
						j
					
					// Negative number means this note is twice as long (a whole note)
					if(note < 0) {
						note *= -1
						seconds = 4
					}
					
					// With a decimal point means this note is half as long (a quarter note)
					if(note < 1) {
						note *= 100
						seconds = 1
					}
					note = 65.406 * 1.06 ** note / noteLen
					
					// Loop on all the samples
					for(j = noteLen * seconds; j--;) {
						// Fill the samples array
						a[j] =
							// The first 88 samples represent the note's attack
							(j < 88 ?
								j / 88.2
								// The other samples represent the rest of the note
								: (1 - (j - 88.2) / (noteLen * (seconds - .002))) ** ((Math.log(1e4 * note) / 2) ** 2)
							) * w(j * note)
					}
					
					b = this.contexts[0].createBuffer(1, noteLen * seconds, noteLen)
					b.getChannelData(0).set(a)
					return b
				}
			})
		}
		this.song = cachedSong
		
		this.i = 0
		clearInterval(this.interval)
		this.interval = setInterval(i => {
			if(this.i < this.song.length) {
				i = this.i++
				if(this.song[i]) {
					var ctx = this.contexts[i%8],
						source = ctx.createBufferSource()
					source.buffer = this.song[i]
					source.connect(ctx.destination)
					source.start()
				}
			} else {
				this.i = 0
			}
		}, tempo || 180)
	}
}
