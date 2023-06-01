import packeryLayout from 'https://cdn.jsdelivr.net/npm/packery@2.1.2/+esm'
import ImagesLoaded from "https://cdn.jsdelivr.net/npm/imagesloaded@5.0.0/+esm"
import codec from "/js/structure.js?v=1.0.2-alpha"
import { loadArtists } from "/js/artists.js?v=1.0.2-alpha"
import { colorArray } from "/js/colors.js?v=1.0.2-alpha"
import { shuffleArray, generateElement } from "/js/utils.js?v=1.0.2-alpha"
import { jigsawGenerator } from "/js/jigsawShield.js?v=1.0.2-alpha"
import MagnificentTitle from "/js/magnificent-title.js?v=1.0.2-alpha"

const getBackgroundFromArtistVariation = (a, v) => `url('https://musicollator.github.io/ciaccona-stationary/artists/${a}/${a}-${v}.webp')`

const template = (datum) => `
<div id="li-artist${datum.variation}" 
     class="list-artist hero"  
     data-index="${datum.index}" 
     data-artist="${datum.artist.index}" 
     data-variation="${datum.variation}" 
     data-fullnameNospaceLowercaseNodiacritics="${datum.artist.fullnameNospaceLowercaseNodiacritics}"
     style="background-image: ${datum.artist.artistVariationBackground}; overflow:visible;">
    <div class="select-artist d-flex flex-column justify-content-start${datum.artist.hideName}" 
        style="height:100%; overflow: hidden; ${typeof datum.artist.index === 'undefined' ? 'display: none; ' : ''}" >
        <div class="hero-intro flex-shrink-1 align-self-start" 
             title="Pin or unpin ${datum.artist.firstname} ${datum.artist.lastname}"
             style="padding-right: 0.5rem;">
             ${datum.artist.firstname}
        </div>
        <div class="hero-intro vert flex-grow-1" 
             title="Pin or unpin ${datum.artist.firstname} ${datum.artist.lastname}">
             ${datum.artist.lastname}
        </div>
    </div>
    <div class="select-variation flex-shrink-1 d-flex flex-column justify-content-evenly" 
        style="width: ${typeof datum.artist.index === 'undefined' ? '100%' : '3rem'}; height: 100%; overflow: visible;">
        <a class="puzzle-limited" href="#">
            <svg xmlns="http://www.w3.org/2000/svg" 
                id="gb-puzzle${datum.variation}-svg" 
                style="overflow: visible; transform: scale(${typeof datum.artist.index === 'undefined' ? '.5' : '1'});"
                viewBox="${datum.jigsaw.viewBox}">
                <path 
                    style=""
                    stroke="#${datum.stroke}" 
                    stroke-width="3" 
                    fill="#${datum.fill}c0" 
                    d="${datum.jigsaw.path}" style=""></path>
            </svg>
        </a>
    </div>
</div>`

let data = []
const colors = colorArray;
let numPuzzleWithNoPerformer
let randomNoPerformerPuzzleItemIndexArray
let arrayOfArtistsFiltered

function generateData2(arrayOfArtistsFiltered) {
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
    return data;
}

loadArtists().then(putainDeArtists => {

    const list = document.getElementById('list')

    list.querySelectorAll('.list-artist').forEach(E => E.remove())

    const artistBadge = `<div id="artist-badge" class="p-2 d-flex" style="white-space: nowrap; visibility: hidden; margin: 0 auto;">
    <span class="fullname align-self-center" style="color: #d0d0d0; font-size: 1.4rem;">&nbsp;</span>
    &nbsp;
    <img class="align-self-center" src="index.svg?v=1.0.2-alpha#close-circle-view" style="width:32px; height:32px;">
</div>
`

    list.appendChild(new MagnificentTitle('list-item', 1, artistBadge).templateForTheme)

    arrayOfArtistsFiltered = putainDeArtists.artists.filter(a => a.lastname !== '自分');
    numPuzzleWithNoPerformer = Math.max( 0 , jigsawGenerator.getJigsawItemsCount() - arrayOfArtistsFiltered.length)
    randomNoPerformerPuzzleItemIndexArray = new Array(numPuzzleWithNoPerformer).fill(0).map(x => {
        return Math.round(Math.random() * (jigsawGenerator.getJigsawItemsCount()-1))
    })

    data = generateData2(arrayOfArtistsFiltered)
    let i = 1;
    data.forEach(datum => {
        
        const separator = generateElement(`<div class="list-item" style="padding: 1rem;">${template(datum)}</div>`)
        list.appendChild(separator)

        i++
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
                coerce.artist = undefined
                data = generateData2(arrayOfArtistsFiltered)
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
                if (typeof coerce.artist !== 'undefined') {
                    artistBadge.style.visibility = 'inherit'
                    artistBadge.querySelector('.fullname').innerHTML = putainDeArtists.artists[coerce.artist].fullname
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
            document.querySelectorAll('.list-item:not(#magnificent-title-ciaccona):not(#separator-badge)').forEach(E => {
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
                    if (typeof coerce.variation !== 'undefined' || typeof coerce.artist !== 'undefined') {
                        whereDoIGo += `&v=${event.target.dataset.variation}`
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
                    coerce.variation = event.currentTarget.parentNode.dataset.variation
                    coerce.artist = undefined
                }
                data = generateData2(arrayOfArtistsFiltered)
                forceRedraw()
            }))
            document.querySelectorAll('.list-artist .select-artist').forEach(E => E.addEventListener('click', (event) => {
                event.stopPropagation()
                event.preventDefault()
                if (typeof coerce.artist !== 'undefined') {
                    coerce.artist = undefined
                } else {
                    coerce.artist = event.currentTarget.parentNode.dataset.artist
                    coerce.variation = undefined
                }
                data = generateData2(arrayOfArtistsFiltered)
                forceRedraw()
            }))
        }
    }
})
