# How to add a performer

## 1. add performer data to  /_artists.yaml

(you may cut & paste it from _candidates.yaml)


```
- firstname: Roger
  lastname: Dugland
  ▶:
    id: QWERTYUIOP
    views: 12
    published: Jan 1, 1070
```

set workInProgress property to true so that data does not interfere with production


```
- firstname: Roger
  lastname: Dugland
  workInProgress: true
  ▶:
    id: QWERTYUIOP
    views: 12
    published: Jan 1, 1070
```

## 2. create an empty file in the timings directory

file must be named `<titlecase fullname without spaces>-<youtube video id>.js`, e.g.:

```
RogerDugland-QWERTYUIOP.js
```

file content must be:

```
var <javascriptized youtube video id> = {
    bars: [
    ]
}
```

youtube video id must be "javascriptized":

* all '-' are replaced with '_' 
* an id starting with a number is prefixed with '_' 

see class Artist in artists.js for the actual code

e.g. `0QWERT-YUIOP` becomes `_0QWERT_YUIOP`


## 3. record timings

launch app on local host with query parameter wip=true

http://localhost:1010/ciaccona.html?wip=true

the video will appear at the bottom of the left offcanvas sliding menu of the ciaccona.html page under the category instrument:unkown

click on it, then show video to start recording

seek to the beginning of the chaconne (that may not be the beginning of the video)

press 'spacebar' to reset the recording to a timestamp array with one element

start playing the video (obviously not with 'spacebar', click instead on the play button of the player controls)

press 'p' on each bar

when everything is over, press 's' to save the timings

look at the console to see where the timings file has been saved

replace the empty `bars` array of the `RogerDugland-QWERTYUIOP.js` file with the full content of the timings file

refresh the localhost browser and test

if test is ok, remove the workInProgress property

add `<fullnameNospaceLowercaseNodiacritics>` (e.g. `rogerdugland`) to global.js (preferably in the alphabetical order, but ordering is not mandatory)

at this point, you can push to githu and deploy, everything should work, but the next elements are needed to complete the work.

## 4. generate `rogerdugland.html` 

this file contains facebook and twitter open graph infoss

edit `/video/_template.html`, filter the loop over the artists to keep only `rogerdugland`

open http://localhost:1010/video/_template.html in a browser

a file named `_rogerdugland.html` is automatically generated and saved to the downloads directory

double check it, then rename it (no starting underscore) and move it to `/video/rogerdugland.html` 

## 5. create stationnary

open `/pupeeter/index.js`

tweak it to produce the kind of image desired (with or without full score, with player control or not, etc.)

then run index.js as a node project

it creates a `<fullnameNospaceLowercaseNodiacritics>` directory at /puppeteer/artists

move the directory to `ciaccona-stationary` repo

open terminal in this dir

create wepb files 
```
for f in *.(png)(N); do cwebp -q 4 ${f} -o ${f%%.*}.webp; done
```
create jpg files
```
for f in *.(png)(N); do ffmpeg -i ${f} -qscale:v 8 ${f%%.*}.jpg; done
```

(see _ffmpeg-cmd.txt in ciaccona-stationery repo)

push to github

should take a bit less thatn 10 minutes for ciaccona-stationery github page to be deployed

## 7. create open graph screenshot


fiddle with puppeteer to create and select a nice screenshot

copy png to /screenshots, remove -<variation_number> from filename
convert to jpg (I use export from preview app on mac)

## 8. test and push to gihub

## 9. verify open graph data

oepn `/video/<fullnameNospaceLowercaseNodiacritics>.html` page with facebook debbuger

for convenience, get full url from left link in performers.html page

past url to

https://developers.facebook.com/tools/debug/

## 10. create anouncement on ciaccona facebook page

https://www.facebook.com/ciacconabwv004/

e.g.

```
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
```
