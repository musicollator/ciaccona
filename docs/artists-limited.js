import ImagesLoaded from "https://cdn.jsdelivr.net/npm/imagesloaded@5.0.0/+esm"
import packeryLayout from 'https://cdn.jsdelivr.net/npm/packery@2.1.2/+esm'
import config from "/js/config.js?v=1.0.3-beta"
import codec from "/js/structure.js?v=1.0.3-beta"
import { createPlayerSingleton } from "/js/playerSingleton.js?v=1.0.3-beta"
import { shuffleArray, generateElement } from "/js/utils.js?v=1.0.3-beta"
import { loadArtists } from "/js/artists.js?v=1.0.3-beta"

const bg = (a, v) => `url('https://musicollator.github.io/ciaccona-stationary/artists/${a}/${a}-${v}.webp')`

const iconMap = {
    '1Violin': 'violin',
    '2Double_Bass': 'violin',
    '3Ensemble': 'violin',
    '4Plucked_Strings': 'ukulele',
    '5Keyboard': 'keyboard',
    '6Harp': 'harp',
    '7Cimbalom': 'cimbalom',
    '8Flute': 'flute',
    '9Marimba': 'xylophone',
}

const templateDivider = (instrumentKey, instrumentDisplayName) => `
<div class="list-item divider d-flex justify-content-between" style="border-radius: 2rem 0 0 2rem;">
    <div class="icon-base icon-${iconMap[instrumentKey]}" style="align-self: center; border-radius: 2rem;"></div>
    <div class="flex-grow-1" style="align-self: center; text-align: right; margin-right: 0.5rem;">${instrumentDisplayName}</div>
    <div id="${instrumentKey}" style="align-self: center; font-size:smaller;">&nbsp;</div>
</div>`

const template = (data) => `
<div class="list-item">
    <div id="li-artist${data.v}" 
        class="list-artist hero"  
        data-index="${data.i}" 
        data-a="${data.a}" 
        data-v="${data.v}" 
        data-i="${data.bg}"
        title="${data.n}"
        style="background-image: ${data.bg}; overflow:hidden;">
        <div class="d-flex flex-column justify-content-start" style="height:100%;" >
            <div class="hero-intro flex-shrink-1 align-self-start"
                style="padding-right: 0.5rem;">
                ${data.n}
            </div>
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

        if (!coerce.wip) {
            if (!coerce.validateFullameNospaceLowercaseNodiacritics(a.fullnameNospaceLowercaseNodiacritics)) {
                return
            }
            if (a.workInProgress) {
                return
            }
        }
        // console.log(a.fullnameNospaceLowercaseNodiacritics)

        const v = vi % codec.variationsCount
        const name = a.completeName ?? a.fullname
        const artistFullnameNoBreakingSpaces = name.replaceAll(/\s/gi, '&#xA0;' /* No-Break Space */);
        const datum = {
            instrument: a.instrument,
            i: vi,
            a: a.fullnameNospaceLowercaseNodiacritics,
            v: v,
            n: artistFullnameNoBreakingSpaces,
            bg: bg(a.fullnameNospaceLowercaseNodiacritics, shuffledV[vi % shuffledV.length]),
        }
        data.push(datum)
        vi++
    })
    return data;
}

loadArtists().then(putainDeArtists => {
    (list => {
        if (!list) return

        list.querySelectorAll('.list-item').forEach(E => E.remove())

        arrayOfArtists = putainDeArtists.artists.sort((a, b) => {
            if (a.instrument === b.instrument) {
                if (a.lastname === '自分') {
                    return 1
                } else if (b.lastname === '自分') {
                    return -1
                } else {
                    return a.lastname.localeCompare(b.lastname)
                }
            }
            return a.instrument.localeCompare(b.instrument)
        })

        data = generateData()

        const instrumentsCount = new Map()
        let previousInstrument = "_"
        data.forEach(d => {
            instrumentsCount.set(d.instrument, (instrumentsCount.get(d.instrument) || 0) + 1)
            if (d.instrument !== previousInstrument) {
                const instrumentDisplayName = d.instrument.replaceAll(/\d/gi, '').replaceAll(/_/gi, '&#xA0;' /* No-Break Space */)

                list.appendChild(generateElement(templateDivider(d.instrument, instrumentDisplayName)))

                previousInstrument = d.instrument
            }
            list.appendChild(generateElement(template(d)))
        })
        for (let [key, value] of instrumentsCount) {
            document.getElementById(key).innerHTML = `(${value})`
        }

        var listArtistElements = document.querySelectorAll('.list-artist')
        const imgLoad = new ImagesLoaded(listArtistElements, { background: true }, function () {
            console.log('All ImagesLoaded')
        });
        imgLoad.on('progress', function (instance, image) {
            // console.log('image loaded', image)
            image.element.style.visibility = 'inherit'
        });

        {
            console.log("about to create packery ...")
            const thePackery = new packeryLayout(list, {
                itemSelector: "#list .list-item",
                gutter: 10,
                initLayout: false,
                resize: true,
                percentPosition: false
            })

            thePackery.on('layoutComplete', function () {
                console.log("Packery layout complete");
            })

            thePackery.layout()

            function setEventListeners() {
                // https://getbootstrap.com/docs/5.2/components/offcanvas/#via-javascript
                /*
                const offcanvasElementList = document.querySelectorAll('.offcanvas')
                const offcanvasList = [...offcanvasElementList].map(offcanvasEl => new bootstrap.Offcanvas(offcanvasEl))
                */
                const offcanvasElement = document.getElementById('theOffcanvas')
                if (typeof config.offcanvasElementBootstrapped === 'undefined') config.offcanvasElementBootstrapped = new bootstrap.Offcanvas(offcanvasElement)

                document.querySelectorAll('.list-artist').forEach(element => {
                    element.addEventListener('click', (event) => {
                        event.stopPropagation()
                        event.preventDefault()

                        if (coerce.color?.candidate) {
                            coerce.variation = coerce.color?.candidate
                        }

                        config.offcanvasElementBootstrapped.hide()

                        let artistObject = putainDeArtists.getArtistFromFullnameNospaceLowercaseNodiacritics(event.currentTarget.dataset.a)

                        createPlayerSingleton(artistObject).then(result => {
                            const artistAndTimings = result.value
                            coerce.fullnameNospaceLowercaseNodiacritics = artistAndTimings.fullnameNospaceLowercaseNodiacritics

                            // https://developer.mozilla.org/en-US/docs/Web/API/History/pushState and https://stackoverflow.com/a/3354511/1070215 
                            const url = new URL(location);
                            url.searchParams.set("a", artistAndTimings.fullnameNospaceLowercaseNodiacritics);
                            if (typeof coerce.variation !== 'undefined') {
                                url.searchParams.set("v", coerce.variation);
                            }
                            history.pushState({}, "", url);
                        })
                    })
                })

                offcanvasElement.addEventListener('show.bs.offcanvas', (event) => {
                    if (coerce.color) {
                        offcanvasElement.classList.add(coerce.color.clazz)
                        offcanvasElement.classList.add(coerce.color.tonality)
                        document.querySelectorAll(`.list-artist[data-a="${coerce.fullnameNospaceLowercaseNodiacritics}"]`).forEach(la => {
                            la.classList.add('thisIsTheOne')
                        })
                        if (typeof coerce.color.candidate !== 'undefined') {
                            document.querySelectorAll('.list-artist').forEach(la => {
                                la.style.backgroundImage = bg(la.dataset.a, coerce.color.candidate)
                            })
                            return
                        }
                    }
                    document.querySelectorAll('.list-artist').forEach(la => {
                        la.style.backgroundImage = la.dataset.i
                    })
                })
                offcanvasElement.addEventListener('hidden.bs.offcanvas', (event) => {
                    if (coerce.color) {
                        offcanvasElement.classList.remove(coerce.color.clazz)
                        offcanvasElement.classList.remove(coerce.color.tonality)
                    }
                    document.querySelectorAll(`.list-artist`).forEach(la => {
                        la.classList.remove('thisIsTheOne')
                    })
                    coerce.color = undefined
                })

                document.querySelectorAll('#dismiss-offcanvas').forEach(element => element.addEventListener('click', (event) => {
                    config.offcanvasElementBootstrapped.hide()
                }))
            }

            setEventListeners()

        }

    })(document.getElementById('list'))
})
