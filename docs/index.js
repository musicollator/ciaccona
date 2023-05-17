import packeryLayout from 'https://cdn.jsdelivr.net/npm/packery@2.1.2/+esm'
import ImagesLoaded from "https://cdn.jsdelivr.net/npm/imagesloaded@5.0.0/+esm"
import codec from "/js/structure.js?v=1.0.6"
import { colorArray } from "/js/colors.js?v=1.0.6"
import { loadArtists } from "/js/artists.js?v=1.0.6"
import { shuffleArray, generateElement } from "/js/utils.js?v=1.0.6"
import { jigsawGenerator } from '/js/jigsawShield.js?v=1.0.6'
import MagnificentTitle from "/js/magnificent-title.js?v=1.0.6"

const abg = (a, v) => `url('https://musicollator.github.io/ciaccona-stationary/artists/${a}/${a}-${v}.webp')`

const template = (data, first) => `
<div id="li-artist${data.v}" 
     class="list-artist hero"  
     data-index="${data.index}" 
     data-a="${data.a}" 
     data-v="${data.v}" 
     style="background-image: ${data.abg}; overflow:visible;">
    <div class="d-flex flex-column justify-content-start${data.hideName}" style="height:100%; overflow: hidden; ${first ? 'visibility: hidden;' : ''}" >
    <!--
        <div class="hero-intro flex-shrink-1; align-self-start;" 
             title="Pin or unpin ${data.firstname} ${data.lastname}"
             style="padding-right: 0.5rem;">
             ${data.firstname}
        </div>
        <div class="hero-intro vert flex-grow-1;" 
             title="Pin or unpin ${data.firstname} ${data.lastname}">
             ${data.lastname}
        </div>
        -->
    </div>
    <div class="flex-shrink-1 d-flex flex-column justify-content-evenly" style="width: 3rem; height: 100%; overflow: visible; ${first ? 'visibility: hidden;' : ''}">
        <a class="puzzle-limited" href="#" title="Pin or unpin ${data.pinUnpinVariationTitle}">
            <svg xmlns="http://www.w3.org/2000/svg" 
                id="gb-puzzle${data.v}-svg" 
                style="overflow: visible; transform: scale(.75);"
                viewBox="${data.jigsaw.viewBox}">
                <defs>
                    <pattern id='pattern${data.v}'  patternUnits='userSpaceOnUse' width='40' height='40' patternTransform="scale(1.5)">>
                        <rect x='0' y='0' width='100%' height='100%' fill='#${data.s1}' />
                        <path d='M0 0l10 20L20 0H0zm10 20l10 20 10-20H10z' stroke-width='1' stroke='none' fill='#${data.s2}' />
                        <path d='M20 0l10 20L40 0zm10 20l10 20 10-20zm-40 0L0 40l10-20z' stroke-width='1' stroke='none' fill='#${data.s2}' />
                    </pattern>
                </defs>
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
let artists2
// let arrayOfArtists = []
const colors = colorArray;

function generateData(arrayOfArtists) {
    data = []
    let vi = 0
    arrayOfArtists.forEach(a => {
        if (a.fullnameNoSpaceLowercaseNoDiacritics === 'moi') {
            return;
        }
        const v = typeof coerceVariation === 'undefined' ? vi % codec.variationsCount : coerceVariation
        const j = jigsawGenerator.getJigsawItem(v + 1)
        const transX = parseInt(j.viewBox.replaceAll(/^([\.\d\-]+).*$/g, "$1"))
        const transY = parseInt(j.viewBox.replaceAll(/^[\.\d\-]+\s+([\.\d\-]+).*$/g, "$1"))
        const artistLastnameNoBreakingSpaces = a.lastname.replaceAll(/\s/gi, '&nbsp;');

        const tonality = codec.isMajor(v) ? "Δ" : "";
        const c2 = colors[v]

        const datum = {
            index: vi,
            number: v === 0 || 34 <= v ? '' : v,
            a: coerceArtist || a.fullnameNoSpaceLowercaseNoDiacritics,
            v: v,
            firstname: a.firstname,
            lastname: artistLastnameNoBreakingSpaces,
            abg: abg(coerceArtist || a.fullnameNoSpaceLowercaseNoDiacritics, v),
            jigsaw: j,
            hideName: coerceArtist ? ' hide-name' : '',
            fill: tonality ?  `url(#pattern${v})`  : `#${colors[v].puzzleColor}`,
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

loadArtists().then((artists) => {
    artists2 = artists

    const list = document.getElementById('list')

    list.querySelectorAll('.list-artist').forEach(E => E.remove())

    const artistBadge = `<div id="artist-badge" class="p-2" style="white-space: nowrap; visibility: hidden; margin: 0 auto;">
    <span class="fullname" style="color: #d0d0d0; font-size: 1.4rem;">&nbsp;</span>
    <!--
    <a id="youtube-url" class="btn btn-lihjt icon-base icon-youtube_external_link text-muted" target="_youtube" href="#" aria-label="Original Video...">
    </a>
    <a id="social" class="share btn btn-lihjt icon-base icon-share text-muted" target="_facebook" href="#" aria-label="Share...">
    </a>
    --!
</div>
`

    list.appendChild(new MagnificentTitle('list-item', 1, artistBadge).templateForTheme)

    let arrayOfArtists = shuffle ? shuffleArray(artists.artists) : artists.artists
    data = generateData(arrayOfArtists)
    data.forEach(d => {
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
            itemSelector: ".list-item", // #theContainer #theContainerCol .artists#list 
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
                coerceArtist = undefined
                data = generateData(arrayOfArtists)
                forceRedraw()
            })
        }

        function displayArtist() {
            if (typeof coerceVariation !== 'undefined') {
                document.querySelectorAll('.list-artist .puzzle-limited').forEach(e => e.classList.add('pushed'))
            }
            if (typeof coerceArtist !== 'undefined') {
                document.querySelectorAll('.list-artist .hero-intro').forEach(e => e.classList.add('pushed'))
            }
            const artistBadge = document.getElementById('artist-badge')
            if (artistBadge) {
                if (typeof coerceArtist !== 'undefined') {
                    artistBadge.style.visibility = 'inherit'
                    artistBadge.querySelector('.fullname').innerHTML = artists2.getArtistFromNameNoSpaceLowercaseNoDiacritics(coerceArtist).fullname
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
                    window.location = `/ciaccona.html?a=${event.target.dataset.a}&v=${event.target.dataset.v}`
                }
            }))
            document.querySelectorAll('.list-artist .puzzle-limited').forEach(E => E.addEventListener('click', (event) => {
                event.stopPropagation()
                event.preventDefault()
                if (typeof coerceVariation !== 'undefined') {
                    coerceVariation = undefined
                } else {
                    coerceVariation = parseInt(event.currentTarget.parentNode.parentNode.dataset.v)
                    coerceArtist = undefined
                }
                data = generateData(arrayOfArtists)
                forceRedraw()
            }))
            document.querySelectorAll('.list-artist .hero-intro').forEach(E => E.addEventListener('click', (event) => {
                event.stopPropagation()
                event.preventDefault()
                if (typeof coerceArtist !== 'undefined') {
                    coerceArtist = undefined
                } else {
                    coerceArtist = event.currentTarget.parentNode.parentNode.dataset.a
                    coerceVariation = undefined
                }
                data = generateData(arrayOfArtists)
                forceRedraw()
            }))
        }
    })
})
