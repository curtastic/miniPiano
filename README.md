# miniPiano
Mini piano tiny js code forked from vertfromage forked from xem.

Try the demo https://curtastic.com/miniPiano/demo.html

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

ToDo:

Add ability to have tempo for individual notes (full/half/quarter)

