import packeryLayout from 'https://cdn.jsdelivr.net/npm/packery@2.1.2/+esm'
import ImagesLoaded from "https://cdn.jsdelivr.net/npm/imagesloaded@5.0.0/+esm"
import config from "/js/config.js?v=2.0.0"
import codec from "/js/structure.js?v=2.0.0"
import { theArtists } from "/js/artists.js?v=2.0.0"
import { shuffleArray, generateElement } from "/js/utils.js?v=2.0.0"
import createTimings from "/js/timings.js?v=2.0.0"
import Ω from "/js/dom.js?v=2.0.0"

let localCoerceVariation = undefined

const bg = (a, v) => `url('https://musicollator.github.io/ciaccona-stationary/artists/${a}/${a}-${v}.webp')`

const template = (data, first) => `
<div id="li-artist${data.v}" 
     class="list-artist hero"  
     data-index="${data.index}" 
     data-a="${data.a}" 
     data-v="${data.v}" 
     style="background-image: ${data.bg}; overflow:hidden;">
    <div class="d-flex flex-column justify-content-start" style="height:100%; ${first ? 'visibility: hidden;' : ''}" >
        <div class="hero-intro flex-shrink-1; align-self-start;" 
             style="padding-right: 0.5rem;">
             ${data.name}
        </div>
    </div>
</div>`

let data = []
let arrayOfArtists = []

function generateData() {
    data = []
    let vi = 0

    let shuffledV = shuffleArray(Array.from(Array(codec.variationsCount), (_, index) => index))

    arrayOfArtists.forEach(a => {
        const v = vi % codec.variationsCount
        const name = a.completeName ?? a.fullname
        const artistFullnameNoBreakingSpaces = name.replaceAll(/\s/gi, '&nbsp;');
        const datum = {
            instrument: a.instrument,
            index: vi,
            a: a.fullnameNoSpaceLowercaseNoDiacritics,
            v: v,
            name: artistFullnameNoBreakingSpaces,
            bg: bg(a.fullnameNoSpaceLowercaseNoDiacritics, shuffledV[vi % shuffledV.length]),
        }
        data.push(datum)
        vi++
    })
    return data;
}

const list = document.getElementById('list')

list.querySelectorAll('.list-artist').forEach(E => E.remove())

arrayOfArtists = theArtists.artists.sort((a, b) => {
    if (a.instrument === b.instrument) {
        if (a.lastname === 'Moi') {
            return 1
        } else if (b.lastname === 'Moi') {
            return -1
        } else {
            return a.lastname.localeCompare(b.lastname)
        }
    }
    return a.instrument.localeCompare(b.instrument)
})

const iconMap = {
    '1Violin': 'icon-violin',
    '2Double_Bass': 'icon-violin',
    '3String_Trio': 'icon-violin',
    '4Plucked_Strings': 'icon-ukulele',
    '5Keyboard': 'icon-keyboard',
    '6Harp': 'icon-harp',
    '7Cimbalom': 'icon-cimbalom',
    '8Flute': 'icon-flute',
    '9Marimba': 'icon-xylophone ',
}

data = generateData()

let previousInstrument = "_"

data.forEach(d => {
    if (d.instrument !== previousInstrument) {
        const instr = d.instrument.replaceAll(/\d/gi, '').replaceAll(/_/gi, '&#xA0;')
        list.innerHTML += `
<div class="list-item divider d-flex justify-content-between">
    <div class="icon-base ${iconMap[d.instrument]}" style="margin-top: .3rem;"></div>
    <div>${instr}</div>
</div>`

        previousInstrument = d.instrument
    }
    list.innerHTML += `<div class="list-item">${template(d, true)}</div>`
})

var listArtistElements = document.querySelectorAll('.list-artist')
const imgLoad = new ImagesLoaded(listArtistElements, { background: true }, function () {
});
imgLoad.on('progress', function (instance, image) {
    image.element.querySelectorAll('.list-artist > *').forEach(E => E.style.visibility = 'inherit')
});

const event = new Event("artistsLoaded");
window.dispatchEvent(event);

readyToPack.then((result) => {
    console.log("about to create packery ...")
    const thePackery = new packeryLayout('#list', {
        itemSelector: ".list-item",
        percentPosition: false,
        initLayout: false,
        gutter: '#list .gutter-sizer',
        resize: true
    })

    thePackery.on('layoutComplete', function () {
        console.log("Packery layout complete");
    })

    thePackery.layout()

    setEventListeners()

    function setEventListeners() {
        // https://getbootstrap.com/docs/5.2/components/offcanvas/#via-javascript
        const offcanvasElementList = document.querySelectorAll('.offcanvas')
        const offcanvasList = [...offcanvasElementList].map(offcanvasEl => new bootstrap.Offcanvas(offcanvasEl))
        document.querySelectorAll('.list-artist').forEach(element => {
            element.addEventListener('click', (event) => {
                event.stopPropagation()
                event.preventDefault()
                // https://github.com/sampotts/plyr#the-source-setter
                createTimings(event.currentTarget.dataset.a).then((artist) => {
                    Ω.showArtist(artist)
                    // console.log('ABOUT TO CHANGE VIDEO', artist['▶'].youtubeUrl)
                    config.plyrPlayer.source = {
                        type: 'video',
                        sources: [
                            {
                                src: artist['▶'].youtubeUrl,
                                provider: 'youtube',
                            },
                        ],
                    };
                })
                offcanvasList.forEach(oc => oc.hide())

                // https://developer.mozilla.org/en-US/docs/Web/API/History/pushState and https://stackoverflow.com/a/3354511/1070215 
                const url = new URL(location);
                url.searchParams.set("a", event.currentTarget.dataset.a);
                history.pushState({}, "", url);
            })
        })
        offcanvasElementList.forEach(element => {
            element.addEventListener('show.bs.offcanvas', (event) => {
                if (localCoerceVariation) {
                    document.querySelectorAll('.list-artist').forEach(la => {
                        la.style.backgroundImage = bg(la.dataset.a, localCoerceVariation)
                    })
                }
            })
        })
        document.querySelectorAll('#dismiss-offcanvas').forEach(element => element.addEventListener('click', (event) => {
            offcanvasList.forEach(oc => oc.hide())
        }))
        document.querySelectorAll('.brick.has-score').forEach(element => element.addEventListener('click', (event) => {
            localCoerceVariation = element.dataset.variation
            offcanvasList.forEach(oc => oc.show())
        }))
    }
})

