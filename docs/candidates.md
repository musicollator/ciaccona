1. add record to  /_artists.yaml

(you may cut & paste from _candidates.yaml)

```
- firstname: Shunsuke
  lastname: Sato
  ▶:
    id: pnK6R5ej6Hg
    views: 974875
    published: Oct 4, 2018
```

2. set workInProgress property so that it does not interfere with production

```
- firstname: Shunsuke
  lastname: Sato
  workInProgress: true
  ▶:
    id: pnK6R5ej6Hg
    views: 974875
    published: Oct 4, 2018
```

3. create an empty file in the timings directory

the file MUST be named `<fullname without spaces>-<youtube video id>.js``

```
ShunsukeSato-pnK6R5ej6Hg.js
```

insert the following in the file

```
var pnK6R5ej6Hg = {
    bars: [
    ]
}
```

4. record timings

launch app on local host with query parameter wip=true

http://localhost:1010/ciaccona.html?wip=true

the video will appear at the bottom of the left offcanvas sliding menu of the ciaccona.html page under the category instrument:unkown

click on it, then show video to start recording the timings

seek to the beginning of the chaconne (that may not be the beginning of the video)

press 'spacebar' to reset the timings to empty array and to add the first entry

then start playing the video (obviously not with spacebar, click on the play button of the player)

then press 'p' on each bar

when everything is over, press space sto save the timings

look at the console to see where the timings file has been saved.

replace the empty 'bars' array of the ShunsukeSato-pnK6R5ej6Hg.js file with the full content of the timings file 

refresh the localhost browser and test.

5. remove the workInProgress property

add fullnameNospaceLowercaseNodiacritics (`shunsukesato`) to global.js, preferably in the alphabetical order, but it is not required

6. generate shunsukesato.html with all required OG infos

edit /video/_template.html, filter the loop over the artists to keep only `shunsukesato`

open http://localhost:1010/video/_template.html

_shunsukesato.html is saved automatically in the downloads directory, 
double check it 
move/rename it to 
/video/shunsukesato.html

6. create screenshot stationnary

open /pupeeter/index.js

tweak it to produce the kind of image desired (with or without full score, with player control or not, etc.)

[TO BE COMPLETED]

