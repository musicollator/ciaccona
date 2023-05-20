import packeryLayout from 'https://cdn.jsdelivr.net/npm/packery@2.1.2/+esm'
import ImagesLoaded from "https://cdn.jsdelivr.net/npm/imagesloaded@5.0.0/+esm"
import codec from "/js/structure.js?v=2.1.0"
import { colorArray } from "/js/colors.js?v=2.1.0"
import { theArtists } from "/js/artists.js?v=2.1.0"
import { shuffleArray, generateElement } from "/js/utils.js?v=2.1.0"
import { jigsawGenerator } from '/js/jigsawShield.js?v=2.1.0'
import MagnificentTitle from "/js/magnificent-title.js?v=2.1.0"

const abg = (a, v) => `url('https://musicollator.github.io/ciaccona-stationary/artists/${a}/${a}-${v}.webp')`

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

const template = (data, first) => `
<div id="li-artist${data.v}" 
     class="list-artist hero"  
     data-index="${data.index}" 
     data-a="${data.a}" 
     data-v="${data.v}" 
     style="background-image: ${data.abg}; overflow:visible;">
    <div class="d-flex flex-column justify-content-start${data.hideName}" style="height:100%; overflow: hidden; ${first ? 'visibility: hidden;' : ''}" >
        <div class="hero-intro flex-shrink-1; align-self-start;" 
             title="Pin or unpin ${data.firstname} ${data.lastname}"
             style="padding-right: 0.5rem;">
             ${data.firstname}
        </div>
        <div class="hero-intro vert flex-grow-1;" 
             title="Pin or unpin ${data.firstname} ${data.lastname}">
             ${data.lastname}
        </div>
    </div>
    <div class="flex-shrink-1 d-flex flex-column justify-content-evenly" style="width: 3rem; height: 100%; overflow: visible; ${first ? 'visibility: hidden;' : ''}">
        <a class="puzzle-limited" href="#" title="Pin or unpin ${data.pinUnpinVariationTitle}">
            <svg xmlns="http://www.w3.org/2000/svg" 
                id="gb-puzzle${data.v}-svg" 
                style="overflow: visible; transform: scale(.75);"
                viewBox="${data.jigsaw.viewBox}">
                <defs>
                    <pattern id='pattern${data.v}_0'  patternUnits='userSpaceOnUse' width='40' height='40' patternTransform="scale(2)">>
                        <rect x='0' y='0' width='100%' height='100%' fill='#${data.s1}' />
                        <path d='M0 0l10 20L20 0H0zm10 20l10 20 10-20H10z' stroke-width='1' stroke='none' fill='#${data.s2}' />
                        <path d='M20 0l10 20L40 0zm10 20l10 20 10-20zm-40 0L0 40l10-20z' stroke-width='1' stroke='none' fill='#${data.s2}' />
                    </pattern>
                    <pattern id='pattern${data.v}_1' patternUnits='userSpaceOnUse' width='50' height='100' patternTransform='scale(1.5) rotate(0)'>
                        <rect x='0' y='0' width='100%' height='100%' fill='#${data.s1}' />
                        <path d='M12.5 0L0 25l12.5 25L25 25 12.5 0zm25 50L25 75l12.5 25L50 75 37.5 50z' stroke-width='1' stroke='none' fill='#${data.s2}' />
                        <path d='M37.5 0L50 25 37.5 50 25 25zm-25 50L25 75l-12.5 25L0 75z' stroke-width='1' stroke='none' fill='#${data.s2}' />
                    </pattern>
                    <pattern id='pattern${data.v}_2' patternUnits='userSpaceOnUse' width='40' height='40' patternTransform='scale(2) rotate(0)'>
                        <rect x='0' y='0' width='100%' height='100%' fill='#${data.s1}' />
                        <path d='M20 20v20h20V20zm5 5h10v10H25zM0 0v20h20V0zm5 5h10v10H5z' stroke-width='1' stroke='none' fill='#${data.s2}' />
                        <path d='M5 25h10v10H5zM25 5h10v10H25z' stroke-width='1' stroke='none' fill='#${data.s2}' />
                    </pattern>
                    <pattern id='pattern${data.v}_3' patternUnits='userSpaceOnUse' width='20' height='20' patternTransform='scale(2) rotate(0)'>
                        <rect x='0' y='0' width='100%' height='100%' fill='#${data.s1}' />
                        <path
                            d='M-10-10A10 10 0 00-20 0a10 10 0 0010 10A10 10 0 010 0a10 10 0 00-10-10zM10-10A10 10 0 000 0a10 10 0 0110 10A10 10 0 0120 0a10 10 0 00-10-10zM30-10A10 10 0 0020 0a10 10 0 0110 10A10 10 0 0140 0a10 10 0 00-10-10zM-10 10a10 10 0 00-10 10 10 10 0 0010 10A10 10 0 010 20a10 10 0 00-10-10zM10 10A10 10 0 000 20a10 10 0 0110 10 10 10 0 0110-10 10 10 0 00-10-10zM30 10a10 10 0 00-10 10 10 10 0 0110 10 10 10 0 0110-10 10 10 0 00-10-10z'
                            stroke-width='1' stroke='none' fill='#${data.s2}' />
                    </pattern>
                    <pattern id='pattern${data.v}_4' patternUnits='userSpaceOnUse' width='40' height='40' patternTransform='scale(2) rotate(0)'>
                        <rect x='0' y='0' width='100%' height='100%' fill='#${data.s1}' />
                        <path d='M20 0L0 10v10l20-10zm0 10v10l20 10V20z' stroke-width='1' stroke='none' fill='#${data.s2}' />
                        <path d='M20-10V0l20 10V0zm0 30L0 30v10l20-10zm0 10v10l20 10V40z' stroke-width='1' stroke='none' fill='#${data.s2}' />
                    </pattern>
                    <pattern id='pattern${data.v}_5' patternUnits='userSpaceOnUse' width='40' height='40' patternTransform='scale(1) rotate(0)'>
                        <rect x='0' y='0' width='100%' height='100%' fill='#${data.s1}' />
                        <path
                            d='M45.69 13.342c-1.677.945-3.557 1.6-5.48 1.588-1.922-.012-3.795-.691-5.462-1.653-1.668-.962-3.156-2.202-4.637-3.435-1.48-1.232-2.97-2.47-4.641-3.427-1.67-.957-3.547-1.628-5.47-1.628-1.923 0-3.8.67-5.47 1.628-1.67.956-3.161 2.195-4.641 3.427-1.48 1.233-2.97 2.473-4.637 3.435-1.667.962-3.54 1.641-5.463 1.653-1.922.012-3.802-.643-5.478-1.588v13.316c1.676-.945 3.556-1.6 5.478-1.588 1.923.012 3.796.691 5.463 1.653 1.668.962 3.156 2.202 4.637 3.435 1.48 1.232 2.97 2.47 4.641 3.427 1.67.957 3.547 1.628 5.47 1.628 1.923 0 3.8-.67 5.47-1.628 1.67-.956 3.161-2.195 4.641-3.427 1.48-1.233 2.97-2.473 4.637-3.435 1.667-.962 3.54-1.641 5.463-1.653 1.922-.012 3.802.643 5.478 1.588z'
                            stroke-width='1' stroke='none' fill='#${data.s2}' />
                    </pattern>
                    <pattern id='pattern${data.v}_6' patternUnits='userSpaceOnUse' width='75' height='150' patternTransform='scale(1.2) rotate(0)'>
                    <rect x='0' y='0' width='100%' height='100%' fill='#${data.s1}' />
                    <path
                        d='M37.5 0L75 25V0H37.5zm0 0v50.02l18.78-12.5L37.5 0zm0 0L0 25l18.78 12.51L37.5 0zM18.78 37.51L0 74.97l37.5-24.95-18.72-12.5zm18.72 12.5v24.96H75L37.5 50.02zM75 74.98V25.01L56.28 37.5 75 74.97zm0 0l-37.5 25 18.78 12.5L75 74.99zM56.28 112.5L37.5 150 75 125l-18.72-12.51zM37.5 150L0 125v25h37.5zm0 0V99.98l-18.72 12.5L37.5 150zm-18.72-37.51L0 74.97V125l18.78-12.5zM0 74.97l37.5 25.01v-25H0z'
                        stroke-width='1' stroke='none' fill='#${data.s2}' />
                    </pattern>
                    <pattern id='pattern${data.v}_7' patternUnits='userSpaceOnUse' width='34.129' height='45' patternTransform='scale(1.2) rotate(0)'>
                        <rect x='0' y='0' width='100%' height='100%' fill='#${data.s2}' />
                        <path
                            d='M2.51 1.597A23.682 23.682 0 000 1.72v32.65c2.18-2 4.176-4.072 5.844-5.915 3.188-3.523 9.14-2.133 10.242 2.488a5.048 5.048 0 01-.467 3.649c-1.5 2.829-3.843 2.848-5.616 2.316-1.343-.403-2.579.882-2.085 2.193.878 2.334 3.46 4.9 10.724 4.18 5.05-.5 10.712-4.53 15.487-8.911V1.72c-7.355.728-16.01 8.948-21.33 14.827-3.188 3.522-9.14 2.133-10.242-2.489a5.05 5.05 0 01.466-3.648C4.525 7.58 6.867 7.56 8.64 8.092c1.342.403 2.578-.88 2.085-2.192-.77-2.042-2.842-4.262-8.214-4.303z'
                            stroke-width='1' stroke='none' fill='#${data.s1}' />
                    </pattern>
                    <pattern id='pattern${data.v}_8' patternUnits='userSpaceOnUse' width='50' height='50' patternTransform='scale(2) rotate(0)'>
                        <rect x='0' y='0' width='100%' height='100%' fill='#${data.s1}' />
                        <path d='M0 0v50h50V0zm.88.88h23.24v23.24H.87zm25 0h23.24v23.24H25.87zm-25 25h23.24v23.24H.87zm25 0h23.24v23.24H25.87z' stroke-width='1' stroke='none'
                            fill='#${data.s2}' />
                        <path
                            d='M0 0v9.31A9.3 9.3 0 0 0 9.31.01V0zm40.69 0a9.3 9.3 0 0 0 9.3 9.31V0zm-15.7 13.76a11.23 11.23 0 1 0 0 22.47 11.23 11.23 0 0 0 0-22.47zM0 40.69V50h9.31A9.3 9.3 0 0 0 0 40.7zm50 0a9.3 9.3 0 0 0-9.31 9.3V50h9.3z'
                            stroke-width='1' stroke='none' fill='#${data.s2}' />
                        <path d='M18.91 0a6.1 6.1 0 0 0 12.18 0zM0 18.9v12.2a6.1 6.1 0 0 0 0-12.2zm50 0a6.1 6.1 0 1 0 0 12.2zm-25 25a6.1 6.1 0 0 0-6.1 6.1h12.2a6.1 6.1 0 0 0-6.1-6.1z'
                            stroke-width='1' stroke='none' fill='#${data.s2}' />
                    </pattern>
                    <pattern id='pattern${data.v}_9' patternUnits='userSpaceOnUse' width='26.55' height='25' patternTransform='scale(1.5) rotate(0)'>
                        <rect x='0' y='0' width='100%' height='100%' fill='#${data.s2}' />
                        <path
                            d='M0 10.86v3.22c2.7.08 4.9 2.31 4.9 5.03V25h3.2v-5.9c0-4.48-3.63-8.16-8.1-8.24ZM18.17 25h3.21v-5.9a5.05 5.05 0 0 1 5.03-5.02h.14v-3.21h-.14a8.27 8.27 0 0 0-8.24 8.24zm3.21-25h-3.21v1.64a5.05 5.05 0 0 1-5.03 5.02A5.05 5.05 0 0 1 8.1 1.64V0H4.89v1.64c0 4.53 3.7 8.24 8.25 8.24 4.53 0 8.24-3.7 8.24-8.24z'
                            stroke-width='1' stroke='none' fill='#${data.s1}' />
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
    const pattern = getRandomInt(10)
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
            fill: tonality ? `url(#pattern${v}_${pattern})` : `#${colors[v].puzzleColor}`,
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

{
    const artists = artists2 = theArtists

    const list = document.getElementById('list')

    list.querySelectorAll('.list-artist').forEach(E => E.remove())

    const artistBadge = `<div id="artist-badge" class="p-2 d-flex" style="white-space: nowrap; visibility: hidden; margin: 0 auto;">
    <span class="fullname align-self-center" style="color: #d0d0d0; font-size: 1.4rem;">&nbsp;</span>
    &nbsp;
    <img class="align-self-center" src="index.svg?v=2.1.0#close-circle-view" style="width:32px; height:32px;">
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
}
