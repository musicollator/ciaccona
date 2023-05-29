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

the key of the youtube must be "javascriptized"

1. all '-' are replaced with '_' 
2. an id starting with a number is prefixed with '_' 
cf. class Artist in artists.js

e.g. `5X-pCvEhxUE` becomes `_5X_pCvEhxUE`

```
var <javascriptized youtube video id> = {
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

when everything is over, press 's' sto save the timings

look at the console to see where the timings file has been saved.

replace the empty 'bars' array of the ShunsukeSato-pnK6R5ej6Hg.js file with the full content of the timings file 

refresh the localhost browser and test.

5. remove the workInProgress property

add fullnameNospaceLowercaseNodiacritics (`shunsukesato`) to global.js (preferably in the alphabetical order, but order is not required)

fernandocordella

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

a directory named <fullnameNospaceLowercaseNodiacritics> has been created under /puppeteer/artists

move the directory to ciaccona-stationary repo

open terminal in this moved dir
create wepb files 
for f in *.(png)(N); do cwebp -q 4 ${f} -o ${f%%.*}.webp; done
create jpg files
for f in *.(png)(N); do ffmpeg -i ${f} -qscale:v 8 ${f%%.*}.jpg; done

cf. _ffmpeg-cmd.txt in ciaccona-stationery reop
push to github
should take a bit less thatn 10 minutes for ciaccona-stationery github page to be deployed

7. create screenshot for facebook open graph

fiddle with puppeteer to make a nice screenshot

copy png to /screenshots, remove -<variation_number> from filename
convert to jpg (I use export from preview app on mac)

8. test and push to gihub

9. verify /video/<fullnameNospaceLowercaseNodiacritics>.html page with  facebook debbuger

get url from performers.html page

https://developers.facebook.com/tools/debug/

10. create annoucement on ciaccona facebook page

https://www.facebook.com/ciacconabwv004/


New performer #39, Fernando Cordella (@fernandoturconicordella).

Fernando Cordella is the first artist from the South American continent to be featured in the application, and I hope it won't be the last, as he gives us a rousing performance.

More about Fernando Cordella:
https://www.bachbrasil.com/
https://www.youtube.com/c/fernandocordella
https://www.facebook.com/profile.php?id=100049192845054
https://www.facebook.com/bachbrasil/
https://twitter.com/CordellaCravo

#fernandocordella #BWV1004 #jsbach #ciaccona #chaconne

https://ciaccona.cthiebaud.com/video/fernandocordella.html






[TO BE COMPLETED]

