import packeryLayout from 'https://cdn.jsdelivr.net/npm/packery@2.1.2/+esm'
import ImagesLoaded from "https://cdn.jsdelivr.net/npm/imagesloaded@5.0.0/+esm"
import codec from "/js/structure.js?v=1.0.1-alpha.3"
import { loadArtists } from "/js/artists.js?v=1.0.1-alpha.3"
import { colorArray } from "/js/colors.js?v=1.0.1-alpha.3"
import { shuffleArray, generateElement } from "/js/utils.js?v=1.0.1-alpha.3"
import { jigsawGenerator } from "/js/jigsawShield.js?v=1.0.1-alpha.3"
import MagnificentTitle from "/js/magnificent-title.js?v=1.0.1-alpha.3"

const abg = (a, v) => `url('https://musicollator.github.io/ciaccona-stationary/artists/${a}/${a}-${v}.webp')`

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const template = (data) => `
<div id="li-artist${data.v}" 
     class="list-artist hero"  
     data-index="${data.index}" 
     data-a="${data.a}" 
     data-v="${data.v}" 
     style="background-image: ${data.abg}; overflow:visible;">
    <div class="select-artist d-flex flex-column justify-content-start${data.hideName}" style="height:100%; overflow: hidden;" >
        <div class="hero-intro flex-shrink-1 align-self-start" 
             title="Pin or unpin ${data.firstname} ${data.lastname}"
             style="padding-right: 0.5rem;">
             ${data.firstname}
        </div>
        <div class="hero-intro vert flex-grow-1" 
             title="Pin or unpin ${data.firstname} ${data.lastname}">
             ${data.lastname}
        </div>
    </div>
    <div class="select-variation flex-shrink-1 d-flex flex-column justify-content-evenly" style="width: 3rem; height: 100%; overflow: visible;">
        <a class="puzzle-limited" href="#" title="Pin or unpin ${data.pinUnpinVariationTitle}">
            <svg xmlns="http://www.w3.org/2000/svg" 
                id="gb-puzzle${data.v}-svg" 
                style="overflow: visible; transform: scale(.75);"
                viewBox="${data.jigsaw.viewBox}">
                <path stroke="#${data.stroke ? data.stroke : 'C8B273'}" 
                    stroke-width="3" 
                    fill="${data.fill ? data.fill : '#57728ba0'}" 
                    d="${data.jigsaw.path}" style=""></path>
            </svg>
        </a>
        <div class="fw-bold font-monospace" style="margin-left: auto; margin-right: auto; font-size: larger;">
        ${data.number}
        </div>
    </div>
</div>`

let data = []
const colors = colorArray;

function generateData(arrayOfArtists) {
    data = []
    let vi = 0
    // const pattern = getRandomInt(10)
    arrayOfArtists.forEach(a => {
        if (a.fullnameNospaceLowercaseNodiacritics === 'moi') {
            return;
        }
        if (!coerce.validateFullameNospaceLowercaseNodiacritics(a.fullnameNospaceLowercaseNodiacritics)) {
            return
        }
        const v = typeof coerce.variation === 'undefined' ? vi % codec.variationsCount : coerce.variation
        const j = jigsawGenerator.getJigsawItem(v + 1)
        const transX = parseInt(j.viewBox.replaceAll(/^([\.\d\-]+).*$/g, "$1"))
        const transY = parseInt(j.viewBox.replaceAll(/^[\.\d\-]+\s+([\.\d\-]+).*$/g, "$1"))
        const artistLastnameNoBreakingSpaces = a.lastname.replaceAll(/\s/gi, '&nbsp;');

        const tonality = codec.isMajor(v) ? "Δ" : "";
        const c2 = colors[v]

        const datum = {
            index: vi,
            number: v === 0 || 34 <= v ? '' : v,
            a: coerce.fullnameNospaceLowercaseNodiacritics || a.fullnameNospaceLowercaseNodiacritics,
            v: v,
            firstname: a.firstname,
            lastname: artistLastnameNoBreakingSpaces,
            abg: abg(coerce.fullnameNospaceLowercaseNodiacritics || a.fullnameNospaceLowercaseNodiacritics, v),
            jigsaw: j,
            hideName: coerce.fullnameNospaceLowercaseNodiacritics ? ' hide-name' : '',
            fill: /* tonality ? `url(#pattern${v}_${pattern})` : */ `#${colors[v].puzzleColor}`,
            stroke: colors[v].textColor,
            pinUnpinVariationTitle: vi == 0 ? "theme" : vi == codec.variationsCount - 1 ? "final chord" : `variation n°${vi}`,
            s1: c2.p_rgb,
            s2: c2.stripeColor,
        }
        data.push(datum)
        vi++
    })
    return data;
}

loadArtists().then(putainDeArtists => {


    const list = document.getElementById('list')

    list.querySelectorAll('.list-artist').forEach(E => E.remove())

    const artistBadge = `<div id="artist-badge" class="p-2 d-flex" style="white-space: nowrap; visibility: hidden; margin: 0 auto;">
    <span class="fullname align-self-center" style="color: #d0d0d0; font-size: 1.4rem;">&nbsp;</span>
    &nbsp;
    <img class="align-self-center" src="index.svg?v=1.0.1-alpha.3#close-circle-view" style="width:32px; height:32px;">
</div>
`

    list.appendChild(new MagnificentTitle('list-item', 1, artistBadge).templateForTheme)

    let arrayOfArtists = coerce.shuffle ? shuffleArray(putainDeArtists.artists) : putainDeArtists.artists
    data = generateData(arrayOfArtists)
    data.forEach(d => {
        list.appendChild(generateElement(`<div class="list-item">${template(d)}</div>`))
    })

    const listArtistElements = document.querySelectorAll('.list-artist')
    const imgLoad = new ImagesLoaded(listArtistElements, { background: true }, function () {
    });
    imgLoad.on('progress', function (instance, image) {
        // console.log('image loaded', image)
        image.element.style.visibility = 'inherit'
    });

    {
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

        const artistBadge = document.getElementById('artist-badge')
        if (artistBadge) {
            artistBadge.addEventListener('click', (event) => {
                event.stopPropagation()
                event.preventDefault()
                coerce.fullnameNospaceLowercaseNodiacritics = undefined
                data = generateData(arrayOfArtists)
                forceRedraw()
            })
        }

        function displayArtist() {
            if (typeof coerce.variation !== 'undefined') {
                document.querySelectorAll('.list-artist .puzzle-limited').forEach(e => e.classList.add('pushed'))
            }
            if (typeof coerce.fullnameNospaceLowercaseNodiacritics !== 'undefined') {
                document.querySelectorAll('.list-artist .hero-intro').forEach(e => e.classList.add('pushed'))
            }
            const artistBadge = document.getElementById('artist-badge')
            if (artistBadge) {
                if (typeof coerce.fullnameNospaceLowercaseNodiacritics !== 'undefined') {
                    artistBadge.style.visibility = 'inherit'
                    artistBadge.querySelector('.fullname').innerHTML = putainDeArtists.getArtistFromFullnameNospaceLowercaseNodiacritics(coerce.fullnameNospaceLowercaseNodiacritics).fullname
                    document.querySelectorAll('.list-artist .hero-intro:not(.vert)').forEach(E => E.style.display = 'none')
                } else {
                    artistBadge.style.visibility = 'hidden'
                    artistBadge.querySelector('.fullname').innerHTML = '&nbsp;'
                    document.querySelectorAll('.list-artist .hero-intro:not(.vert)').forEach(E => E.style.display = 'inherit')
                }
            }
        }

        displayArtist()

        function forceRedraw() {
            document.querySelectorAll('.list-item:not(#magnificent-title-ciaccona)').forEach(E => {
                const i = parseInt(E.children[0].dataset.index)
                const newChild = generateElement(template(data[i]))
                E.replaceChild(newChild, E.children[0])
            })
            displayArtist()
            setListener()
        }

        function setListener() {
            // https://codepen.io/desandro/pen/WxjJJW/
            document.querySelectorAll('.list-artist').forEach(E => E.addEventListener('click', (event) => {
                console.log('currentTarget', event.currentTarget, 'target', event.target)
                if (event.currentTarget === event.target) {
                    event.stopPropagation()
                    event.preventDefault()
                    let whereDoIGo = `/ciaccona.html?a=${event.target.dataset.a}`
                    if (typeof coerce.variation !== 'undefined' || typeof coerce.fullnameNospaceLowercaseNodiacritics !== 'undefined') {
                        whereDoIGo += `&v=${event.target.dataset.v}`
                    }
                    window.location = whereDoIGo
                }
            }))
            document.querySelectorAll('.list-artist .select-variation').forEach(E => E.addEventListener('click', (event) => {
                event.stopPropagation()
                event.preventDefault()
                if (typeof coerce.variation !== 'undefined') {
                    coerce.variation = undefined
                } else {
                    coerce.variation = event.currentTarget.parentNode.dataset.v
                    coerce.fullnameNospaceLowercaseNodiacritics = undefined
                }
                data = generateData(arrayOfArtists)
                forceRedraw()
            }))
            document.querySelectorAll('.list-artist .select-artist').forEach(E => E.addEventListener('click', (event) => {
                event.stopPropagation()
                event.preventDefault()
                if (typeof coerce.fullnameNospaceLowercaseNodiacritics !== 'undefined') {
                    coerce.fullnameNospaceLowercaseNodiacritics = undefined
                } else {
                    coerce.fullnameNospaceLowercaseNodiacritics = event.currentTarget.parentNode.dataset.a
                    coerce.variation = undefined
                }
                data = generateData(arrayOfArtists)
                forceRedraw()
            }))
        }
    }
})
