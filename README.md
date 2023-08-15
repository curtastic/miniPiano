# miniPiano
Mini piano tiny js code forked from vertfromage forked from xem.

Less than 0.8KB minified!

Try the demo https://curtastic.com/miniPiano/demo.html

FULL EXAMPLE:
```
<html>
	<body>
		<script src="miniPiano.js"></script>
		<button onclick="piano.play([28,,28,,-28,,,,28,,28,,-28,,,,28,,31,,24,,,26,-28,,,,,])">
			Jingle Bells ▶
		</button>
	</body>
</html>
```
Numbers are note pitch.
Leave gaps to make silence.
Loops forever.

TO STOP:
```
piano.play([])
```

FAST TEMPO EXAMPLE:
```
piano.play([7,9,,9,10,12], 100)
```

ALL NOTES ARE TWICE AS SHORT EXAMPLE:
```
piano.play([7,9,,9,10,12], 100, .5)
```
Longest noteLen allowed is 1 (default)

SOME NOTES ARE LONGER EXAMPLE:
```
piano.play([7,-9,,9,10,-12,,])
```
Use negative numbers to make a note twice as long.
This won't make it take up 2 slots in your array.

SOME NOTES ARE SHORTER EXAMPLE:
```
piano.play([.11,,.11,,-11,,,,.09,,.09,,-9,,])
```
Use a dot to make a note half as long.
To play a 9 (lower A) short, use .09 not .9
