import packeryLayout from 'https://cdn.jsdelivr.net/npm/packery@2.1.2/+esm'
import ImagesLoaded from "https://cdn.jsdelivr.net/npm/imagesloaded@5.0.0/+esm"
import config from "/js/config.js?v=1.0.2-alpha.4"
import codec from "/js/structure.js?v=1.0.2-alpha.4"
import { loadArtists } from "/js/artists.js?v=1.0.2-alpha.4"
import { colorArray } from "/js/colors.js?v=1.0.2-alpha.4"
import { shuffleArray, generateElement } from "/js/utils.js?v=1.0.2-alpha.4"
import { jigsawGenerator } from "/js/jigsawShield.js?v=1.0.2-alpha.4"
import MagnificentTitle from "/js/magnificent-title.js?v=1.0.2-alpha.4"

config.shuffleReplicator = undefined
const getBackgroundFromArtistVariation = (a, v) => `url('https://musicollator.github.io/ciaccona-stationary/artists/${a}/${a}-${v}.webp')`

const artistBadge = `<div id="artist-badge" class="p-2 d-flex" style="white-space: nowrap; visibility: hidden; margin: 0 auto;">
<span class="fullname align-self-center" style="color: #d0d0d0; font-size: 1.4rem;">&nbsp;</span>
&nbsp;
<img class="align-self-center" src="index.svg?v=1.0.2-alpha.4#close-circle-view" style="width:32px; height:32px;">
</div>
`
const separatorTemplate = (data) => `
<div class="list2-artist"
     data-index="${data.index}" 
     data-artist="${data.artist.index}" 
     data-variation="${data.variation}"
     data-fullnameNospaceLowercaseNodiacritics="${data.artist.fullnameNospaceLowercaseNodiacritics}"
     style="background-image: ${data.artist.artistVariationBackground}; position: relative; height: 100%; width: 100%; border-radius: 0 12rem 12rem 0;"> 
    <div style="position: absolute; top: 0; left: 0; bottom: 0; right: 0; overflow: hidden; ">
        <div class="select-artist hero2 d-flex flex-column ${data.artist.hideName}" 
            style="position:absolute; top: 0; left: 0; z-index:2; ${typeof data.artist.index === 'undefined' ? 'display: none; ' : ''}" >
            <div class="hero-intro flex-shrink-1 align-self-start" 
                title="Pin or unpin ${data.artist.firstname} ${data.artist.lastname}"
                style="padding-right: 0.5rem;">
                ${data.artist.firstname}
            </div>
            <div class="hero-intro vert flex-grow-1" 
                title="Pin or unpin ${data.artist.firstname} ${data.artist.lastname}"
                style="">
                <span>${data.artist.lastname}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
        </div>
    </div>
    <div class="d-flex" style="position: absolute; top: 0; left: 0; bottom: 0; right: 0; z-index:3;">
        <a class="puzzle-limited select2-variation" 
        class="justify-content-end"
            href="#">
            <span>&nbsp;</span>
            <svg id="gb-puzzle${data.variation}-svg" 
            
                style="transform: scale(${typeof data.artist.index === 'undefined' ? 1 : .2}); overflow: visible; "
                viewBox="${data.jigsaw.viewBox}">
                <path stroke="#ffffff80" 
                    stroke-width="0" 
                    fill="#${data.fill}d0" 
                    d="${data.jigsaw.path}" style=""></path>
            </svg>
        </a>
    </div>
</div>`

const template = (data) => `
<div id="li-artist${data.v}" 
     class="list-artist hero"  
     data-index="${data.index}" 
     data-a="${data.a}" 
     data-v="${data.v}" 
     style="background-image: ${data.artistVariationBackground};">
    <div class="select-artist d-flex flex-column justify-content-start${data.hideName}" style="height:100%; " >
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
    <div class="select-variation flex-shrink-1 d-flex flex-column justify-content-evenly" style="width: 3rem; height: 100%; ">
        <a class="puzzle-limited" href="#" title="Pin or unpin ${data.pinUnpinVariationTitle}">
            <svg xmlns="http://www.w3.org/2000/svg" 
                id="gb-puzzle${data.v}-svg" 
                style="transform: scale(.75);"
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

const colors = colorArray;
let numPuzzleWithNoPerformer
let randomNoPerformerPuzzleItemIndexArray
let arrayOfArtistsFiltered


function generateData(arrayOfArtistsFiltered) {
    let data = []

    let indexArtistGlobal = 0
    for (let i = 0; i < jigsawGenerator.getJigsawItemsCount() - 1; i++) {
        const indexPuzzle = i + 1;
        const indexVariation = typeof coerce.variation === 'undefined' ? indexPuzzle % codec.variationsCount : coerce.variation
        const indexColor = indexVariation % colors.length
        let artist = {}
        if (typeof randomNoPerformerPuzzleItemIndexArray.find(x => x == i) === 'undefined') {
            const indexArtist = typeof coerce.artist === 'undefined' ? indexArtistGlobal : coerce.artist
            console.log('indexArtistGlobal', indexArtistGlobal, 'arrayOfArtistsFiltered.length', arrayOfArtistsFiltered.length)
            artist = {
                index: indexArtist,
                firstname: arrayOfArtistsFiltered[indexArtist].firstname,
                lastname: arrayOfArtistsFiltered[indexArtist].lastname,
                hideName: typeof coerce.artist !== 'undefined' ? ' hide-name' : '',
                fullnameNospaceLowercaseNodiacritics: arrayOfArtistsFiltered[indexArtist].fullnameNospaceLowercaseNodiacritics,
                artistVariationBackground: getBackgroundFromArtistVariation(arrayOfArtistsFiltered[indexArtist].fullnameNospaceLowercaseNodiacritics, indexVariation),
            }
            indexArtistGlobal++
        }

        const datum = {
            index: i,
            artist: artist,
            variation: indexVariation,
            justify: 'justify-content-start',
            jigsaw: jigsawGenerator.getJigsawItem(indexPuzzle),
            fill: colors[indexColor].p_rgb,
            stroke: colors[indexColor].stripeColor,
        }
        data.push(datum)
    }
    /*
    let vi = 0

    arrayOfArtistsFiltered.forEach(a => {
        if (a.fullnameNospaceLowercaseNodiacritics === '自分') {
            return;
        }
        if (!coerce.validateFullameNospaceLowercaseNodiacritics(a.fullnameNospaceLowercaseNodiacritics)) {
            return
        }
        if (a.workInProgress) {
            return
        }
        const v = typeof coerce.variation === 'undefined' ? vi % codec.variationsCount : coerce.variation
        const fnnslcnd = typeof coerce.fullnameNospaceLowercaseNodiacritics === 'undefined' ? a.fullnameNospaceLowercaseNodiacritics : coerce.fullnameNospaceLowercaseNodiacritics
        const j = jigsawGenerator.getJigsawItem(v + 1)
        const transX = parseInt(j.viewBox.replaceAll(/^([\.\d\-]+).*$/g, "$1"))
        const transY = parseInt(j.viewBox.replaceAll(/^[\.\d\-]+\s+([\.\d\-]+).*$/g, "$1"))
        const artistLastnameNoBreakingSpaces = a.lastname.replaceAll(/\s/gi, '&nbsp;');

        const tonality = codec.isMajor(v) ? "Δ" : "";
        const c2 = colors[v]

        const datum = {
            index: vi,
            number: v === 0 || 34 <= v ? '' : v,
            a: fnnslcnd,
            v: v,
            firstname: a.firstname,
            lastname: artistLastnameNoBreakingSpaces,
            artistVariationBackground: getBackgroundFromArtistVariation(fnnslcnd, v),
            jigsaw: j,
            hideName: coerce.fullnameNospaceLowercaseNodiacritics ? ' hide-name' : '',
            fill: tonality ? `url(#pattern${v}_${pattern})` : `#${colors[v].puzzleColor}`,
            stroke: colors[v].textColor,
            pinUnpinVariationTitle: vi == 0 ? "theme" : vi == codec.variationsCount - 1 ? "final chord" : `variation n°${vi}`,
            s1: c2.p_rgb,
            s2: c2.stripeColor,
        }
        data.push(datum)
        vi++
    })
    */
    return data;
}

loadArtists().then(putainDeArtists => {

    const list = document.getElementById('list')

    list.querySelectorAll('.list2-artist').forEach(E => E.remove())

    list.appendChild(new MagnificentTitle('list-item', 1, artistBadge).templateForTheme)

    arrayOfArtistsFiltered = putainDeArtists.artists.filter(a => a.lastname !== '自分');
    numPuzzleWithNoPerformer = Math.max( 0 , jigsawGenerator.getJigsawItemsCount() - arrayOfArtistsFiltered.length)
    randomNoPerformerPuzzleItemIndexArray = new Array(numPuzzleWithNoPerformer).fill(0).map(x => {
        return Math.round(Math.random() * (jigsawGenerator.getJigsawItemsCount()-1))
    })
    let data = generateData(putainDeArtists.artists)
    let i = 1;
    data.forEach(datum => {
        `<div class="list-item">${separatorTemplate(datum)}</div>`
        const separator = generateElement(`<div class="list-item" style="padding: 1rem;">${separatorTemplate(datum)}</div>`)
        list.appendChild(separator)
        /*
            if (0 === (i % jigsawGenerator.getJigsawItemsCount())) {
            }
            */
        /*
        if (getRandomHiddenPuzzle !== 0 && getRandomHiddenPuzzle === (i % jigsawGenerator.getJigsawItemsCount())) {
            const v = (i - 1) % codec.variationsCount
            const separator = generateElement(separatorTemplate({
                justify: 'justify-content-center',
                jig: jigsawGenerator.getJigsawItem(i % jigsawGenerator.getJigsawItemsCount()),
                fill: colors[v].p_rgb,
                stroke: colors[v].stripeColor,
            }))
            list.appendChild(separator)
        } else {
            list.appendChild(generateElement(`<div class="list-item">${template(datum)}</div>`))
        }
        */
        i++
    })

    const listArtistElements = document.querySelectorAll('.list2-artist')
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
            // gutter: '#list .gutter-sizer',
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
                coerce.artist = undefined
                data = generateData(arrayOfArtistsFiltered)
                forceRedraw(data)
            })
        }

        function displayArtist() {
            if (typeof coerce.variation !== 'undefined') {
                document.querySelectorAll('.list2-artist .puzzle-limited').forEach(e => e.classList.add('pushed'))
            }
            if (typeof coerce.fullnameNospaceLowercaseNodiacritics !== 'undefined') {
                document.querySelectorAll('.list2-artist .hero-intro').forEach(e => e.classList.add('pushed'))
            }
            const artistBadge = document.getElementById('artist-badge')
            if (artistBadge) {
                if (typeof coerce.artist !== 'undefined') {
                    artistBadge.style.visibility = 'inherit'
                    artistBadge.querySelector('.fullname').innerHTML = putainDeArtists.artists[coerce.artist].fullname
                    document.querySelectorAll('.list2-artist .hero-intro:not(.vert)').forEach(E => E.style.display = 'none')
                } else {
                    artistBadge.style.visibility = 'hidden'
                    artistBadge.querySelector('.fullname').innerHTML = '&nbsp;'
                    document.querySelectorAll('.list2-artist .hero-intro:not(.vert)').forEach(E => E.style.display = 'inherit')
                }
            }
        }

        displayArtist()

        function forceRedraw(dataParam) {
            document.querySelectorAll('.list-item:not(#magnificent-title-ciaccona):not(#separator-badge)').forEach(E => {
                const i = parseInt(E.children[0].dataset.index)
                const newChild = generateElement(separatorTemplate(dataParam[i]))
                E.replaceChild(newChild, E.children[0])
            })
            displayArtist()
            setListener()
        }

        function setListener() {
            // https://codepen.io/desandro/pen/WxjJJW/
            document.querySelectorAll('.list2-artist').forEach(E => E.addEventListener('click', (event) => {
                console.log('currentTarget', event.currentTarget, 'target', event.target)
                if (event.currentTarget.classList.contains('list2-artist')) {
                    event.stopPropagation()
                    event.preventDefault()
                    let whereDoIGo = `/ciaccona.html?a=${event.currentTarget.dataset.a}`
                    if (typeof coerce.variation !== 'undefined' || typeof coerce.fullnameNospaceLowercaseNodiacritics !== 'undefined') {
                        whereDoIGo += `&v=${event.currentTarget.dataset.v}`
                    }
                    window.location = whereDoIGo
                }
            }))
            document.querySelectorAll('.list2-artist .select2-variation').forEach(E => E.addEventListener('click', (event) => {
                event.stopPropagation()
                event.preventDefault()
                if (typeof coerce.variation !== 'undefined') {
                    coerce.variation = undefined
                } else {
                    coerce.variation = event.currentTarget.parentNode.parentNode.dataset.variation
                    coerce.artist = undefined
                }
                forceRedraw(generateData(arrayOfArtistsFiltered))
            }))
            document.querySelectorAll('.list2-artist .select-artist').forEach(E => E.addEventListener('click', (event) => {
                event.stopPropagation()
                event.preventDefault()
                if (typeof coerce.artist !== 'undefined') {
                    coerce.artist = undefined
                } else {
                    coerce.artist = event.currentTarget.parentNode.parentNode.dataset.artist
                    coerce.variation = undefined
                }
                forceRedraw(generateData(arrayOfArtistsFiltered))
            }))
        }
    }
})
