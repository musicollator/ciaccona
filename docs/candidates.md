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
var javascriptized_youtube_video_id = {
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

update line ~28 of index-early replace e.g. 51 below by the number of artists in artists.yaml minus one (the one left apart is 自分)
```
 document.documentElement.style.setProperty('--lipc', `${1 + Math.floor(55 / listItemsPerRow)}`)
```

at this point, you may push to github and deploy, everything should work, but the next elements are needed to complete the work.

## 4. generate `<fullnameNospaceLowercaseNodiacritics>.html` 

this file contains facebook open graph info

edit `/video/_template.html`, filter the loop over the artists to keep only `<fullnameNospaceLowercaseNodiacritics>`, e.g. `rogerdugland`

open http://localhost:1010/video/_template.html in a browser

a file named `_<fullnameNospaceLowercaseNodiacritics>_.html` e.g. `_rogerdugland.html` is automatically generated and saved to the downloads directory

double check it, then rename it (no starting underscore) and move it to e.g. `/video/rogerdugland.html` 

## 5. create stationnary

open `/puppeteer/index.js`

tweak it to produce the kind of image desired (with or without full score, with player control or not, etc.)

then run index.js as a node project

it creates a `<fullnameNospaceLowercaseNodiacritics>` directory containing all 34~something screenshots, each taken at the start of a variation, under the `/puppeteer/artists` directory

move the directory to `ciaccona-stationary` repository

open terminal in this dir

create wepb files:
```
for f in *.(png)(N); do cwebp -q 4 ${f} -o ${f%%.*}.webp; done
```
create jpg files:
```
for f in *.(png)(N); do ffmpeg -i ${f} -qscale:v 8 ${f%%.*}.jpg; done
```

(see `_ffmpeg-cmd.txt` in ciaccona-stationery repo)

push to github

should take ~10 minutes for ciaccona-stationery github page to be deployed

## 7. create open graph screenshot

fiddle with puppeteer to create and select a nice screenshot

copy the screenshot png file to /screenshots, remove `-<variation_number>` from filename

convert to jpg (I use export from preview app on mac), the original png may be deleted

## 8. test and push to gihub

## 9. verify open graph data

open `/video/<fullnameNospaceLowercaseNodiacritics>.html` page with facebook debugger

e.g. https://ciaccona.cthiebaud.com/video/mayakimura.html

https://developers.facebook.com/tools/debug/

for convenience, copy full url from link in performers.html page


## 10. create announcement on ciaccona facebook page

https://www.facebook.com/ciacconabwv004/



e.g.

```
New performer #55, Laurine Phélut.

Video published on Youtube on Jun 22, 2020.

More about Laurine Phélut:
http://www.laurinephelut.fr/
https://www.youtube.com/@classicalguitar-passion
https://open.spotify.com/artist/2oK2RQBv4xshG5I2K1YsXh
https://www.instagram.com/laurine_phelut_guitar

#laurinephelut #BWV1004 #jsbach #ciaccona #chaconne

https://ciaccona.cthiebaud.com/video/laurinephelut.html
```

add announcement data to `_artists.yaml`

e.g.

```
  facebookPost:
    url: https://www.facebook.com/ciacconabwv004/posts/pfbid0fdc3ejDS2otrXmE6mRRZde8McgYAz62RRg7N7Vz5M3jRhydua9tD79hn4eHyTkuCl
    sort: 39
```

push to github

# WE'RE DONE!

