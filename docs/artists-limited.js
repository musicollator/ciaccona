import packeryLayout from 'https://cdn.jsdelivr.net/npm/packery@2.1.2/+esm'
import ImagesLoaded from "https://cdn.jsdelivr.net/npm/imagesloaded@5.0.0/+esm"
import codec from "/js/structure.js?v=1.0.4"
import { loadArtists } from "/js/artists.js?v=1.0.4"
import { shuffleArray, generateElement } from "/js/utils.js?v=1.0.4"
import { jigsawGenerator } from '/js/jigsawShield.js?v=1.0.4'

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
let artists2
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

loadArtists().then((artists) => {
    artists2 = artists

    const list = document.getElementById('list')

    list.querySelectorAll('.list-artist').forEach(E => E.remove())

    arrayOfArtists = artists.artists.toSorted((a, b) => {
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
    data = generateData()
    let previousInstrument = "_"
    data.forEach(d => {
        if (d.instrument !== previousInstrument) {
            const instr = d.instrument.replaceAll(/\d/gi, '').replaceAll(/_/gi, '&#xA0;')
            list.innerHTML += `<div class="list-item" style="height: 32px; line-height: 40px; color: aliceblue; border-top: 1px aliceblue solid;">${instr}</div>`

            previousInstrument = d.instrument
        }
        list.innerHTML += `<div class="list-item">${template(d, true)}</div>`
    })

    var listArtistElements = document.querySelectorAll('.list-artist')
    const imgLoad = new ImagesLoaded(listArtistElements, { background: true }, function () {
    });
    imgLoad.on('progress', function (instance, image) {
        image.element.querySelectorAll('.list-artist *').forEach(E => E.style.visibility = 'inherit')
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

        setListener()

        function setListener() {
            document.querySelectorAll('.list-artist').forEach(element => element.addEventListener('click', (event) => {
                event.stopPropagation()
                event.preventDefault()
                window.location = `/ciaccona.html?a=${event.target.dataset.a}`
            }))
        }
    })
})
