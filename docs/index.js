import packeryLayout from 'https://cdn.jsdelivr.net/npm/packery@2.1.2/+esm'
import ImagesLoaded from "https://cdn.jsdelivr.net/npm/imagesloaded@5.0.0/+esm"
import codec from "/js/structure.js?v=1.0.4-beta.2"
import { loadArtists } from "/js/artists.js?v=1.0.4-beta.2"
import { colorArray } from "/js/colors.js?v=1.0.4-beta.2"
import { shuffleArray, generateElement } from "/js/utils.js?v=1.0.4-beta.2"
import { JigsawShield } from "/js/jigsawShield.js?v=1.0.4-beta.2"
import MagnificentTitle from "/js/magnificent-title.js?v=1.0.4-beta.2"

const getBackgroundFromArtistVariation = (a, v) => `url('https://musicollator.github.io/ciaccona-stationary/artists/${a}/${a}-${v}.webp')`

const artistBadge = `
<div id="artist-badge" 
    class="p-2 d-flex" 
    style="white-space: nowrap; visibility: hidden; margin: 0 auto;">
    <span class="fullname align-self-center" 
        style="color: #d0d0d0; font-size: 1.4rem;">
        &nbsp;
    </span>
    &nbsp;
    <img class="align-self-center" 
        src="index.svg?v=1.0.4-beta.2#close-circle-view" 
        style="width:32px; height:32px;">
</div>`

const template = (datum) => `
<div id="li-artist${datum.index}" 
     class="list-artist hero"  
     data-index="${datum.index}" 
     data-artist="${datum.artist.index}" 
     data-variation="${datum.variation}" 
     data-fullnamenospacelowercasenodiacritics="${datum.artist.fullnameNospaceLowercaseNodiacritics}"
     style="background-image: ${datum.artist.artistVariationBackground}; overflow:visible;">
    <div class="select-artist d-flex flex-column justify-content-start ${datum.artist.coerced ? 'hide-name' : ''}" 
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
        style="width: ${typeof datum.artist.index === 'undefined' ? '100%' : '3rem'}; height: 150%; overflow: visible;">
        <a class="puzzle-limited" href="#">
            <svg xmlns="http://www.w3.org/2000/svg" 
                id="gb-puzzle${datum.variation}-svg" 
                style="overflow: visible; transform: scale(${typeof datum.artist.index === 'undefined' ? '.5' : '1'});"
                viewBox="${datum.jigsawItem.viewBox}">
                <path 
                    style=""
                    stroke="#${datum.stroke}" 
                    stroke-width="3" 
                    fill="#${datum.fill}c0" 
                    d="${datum.jigsawItem.path}" style=""></path>
            </svg>
        </a>
    </div>
</div>`

const listItemWrapper = (template, datum) => `<div class="list-item ${typeof datum.artist.index === 'undefined' ? 'on-top' : ''}" style="padding: 1rem;">${template(datum)}</div>`

const colors = colorArray;
let arrayOfArtistsFiltered
let jigsawOnSteroids

function generateData(arrayOfArtistsFiltered) {
    const data = []

    let grabbableArtistIndex = 0
    for (let i = 0; i < jigsawOnSteroids.jigsaw.getJigsawItemsCount() - 1; i++) {
        const indexJigsawItem = i + 1;
        const indexVariation = (typeof coerce.variation === 'undefined' ? i : coerce.variation) % codec.variationsCount
        const indexColor = (typeof coerce.variation === 'undefined' ? i : coerce.variation) % colors.length
        let artist = {}
        if (typeof jigsawOnSteroids.itemsWithNoPerformer.find(x => x == i) === 'undefined') {
            const ai = (typeof coerce.artist === 'undefined' ? grabbableArtistIndex : coerce.artist) % arrayOfArtistsFiltered.length
            const a = arrayOfArtistsFiltered[ai]
            artist = {
                index: ai,
                coerced: typeof coerce.artist !== 'undefined',
                firstname: a.firstname,
                lastname: a.lastname,
                fullnameNospaceLowercaseNodiacritics: a.fullnameNospaceLowercaseNodiacritics,
                artistVariationBackground: getBackgroundFromArtistVariation(a.fullnameNospaceLowercaseNodiacritics, indexVariation),
            }
            grabbableArtistIndex++
        }

        const datum = {
            index: i,
            artist: artist,
            variation: indexVariation,
            jigsawItem: jigsawOnSteroids.jigsaw.getJigsawItem(indexJigsawItem),
            fill: colors[indexColor].p_rgb,
            stroke: colors[indexColor].stripeColor,
        }
        data.push(datum)
    }
    return data;
}

function createJigsawOnSteroids(artistArrayLength) {
    const j = new JigsawShield()
    const jigsawItemsWithNoPerformerCount = Math.max(0, (j.getJigsawItemsCount() - 1 /* this 1 is the title */) - artistArrayLength)
    const jigsawItemsWithNoPerformerRandomArray = new Array(jigsawItemsWithNoPerformerCount).fill(0).map(x => Math.round(Math.random() * (j.getJigsawItemsCount() - 1 - 1 /* this 1 is the title */)))
    console.log("j.getJigsawItemsCount()", j.getJigsawItemsCount(), "artistArrayLength", artistArrayLength, jigsawItemsWithNoPerformerRandomArray)
    return {
        jigsaw: j,
        itemsWithNoPerformer: jigsawItemsWithNoPerformerRandomArray
    }
}

loadArtists().then(putainDeArtists => {

    const list = document.getElementById('list')

    list.querySelectorAll('.list-artist').forEach(E => E.remove())

    list.appendChild(new MagnificentTitle('list-item', 1, artistBadge).templateForTheme)

    arrayOfArtistsFiltered = putainDeArtists.artists.filter(a => a.lastname !== '自分' && !a.workInProgress)
    arrayOfArtistsFiltered = coerce.shuffle ? shuffleArray(arrayOfArtistsFiltered) : arrayOfArtistsFiltered

    jigsawOnSteroids = createJigsawOnSteroids(arrayOfArtistsFiltered.length)

    const data = generateData(arrayOfArtistsFiltered)
    data.forEach(datum => {
        const separator = generateElement(listItemWrapper(template, datum))
        list.appendChild(separator)
    })

    const listArtistElements = document.querySelectorAll('.list-artist')
    const imgLoad = new ImagesLoaded(listArtistElements, { background: true }, function () {
    });
    imgLoad.on('progress', function (instance, image) {
        image.element.style.visibility = 'inherit'
    });

    // let's go
    {
        // console.log("about to create packery ...")
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

        setListeners()

        const artistBadge = document.getElementById('artist-badge')
        if (artistBadge) {
            artistBadge.addEventListener('click', (event) => {
                event.stopPropagation()
                event.preventDefault()
                coerce.artist = undefined
                forceRedraw(generateData(arrayOfArtistsFiltered))
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
                    artistBadge.querySelector('.fullname').innerHTML = arrayOfArtistsFiltered[coerce.artist].fullname
                    document.querySelectorAll('.list-artist .hero-intro:not(.vert)').forEach(E => E.style.display = 'none')
                } else {
                    artistBadge.style.visibility = 'hidden'
                    artistBadge.querySelector('.fullname').innerHTML = '&nbsp;'
                    document.querySelectorAll('.list-artist .hero-intro:not(.vert)').forEach(E => E.style.display = 'inherit')
                }
            }
        }

        displayArtist()

        function forceRedraw(data) {
            let doLayout = false
            document.querySelectorAll('.list-item:not(#magnificent-title-ciaccona)').forEach(E => {
                try {
                    const i = parseInt(E.children[0].dataset.index)
                    if (data.length <= i) {
                        E.remove()
                        thePackery.remove(E)
                        doLayout = true
                    } else {
                        const qwe = template(data[i])
                        const newChild = generateElement(qwe)
                        E.replaceChild(newChild, E.children[0])
                        data[i].done = true
                    }
                } catch (error) {
                    console.error(error)
                }
            })
            data.filter(datum => typeof datum.done === 'undefined').forEach(datum => {
                const listItem = generateElement(listItemWrapper(template, datum))
                list.appendChild(listItem)
                thePackery.appended(listItem)
                doLayout = true
            })
            if (doLayout) thePackery.layout()
            displayArtist()
            setListeners()
        }

        window.addEventListener("newJigsawGenerator", (event) => {
            // console.log('...heard newJigsawGenerator event, let us re-generate default jigsawOnSteroids ...')
            jigsawOnSteroids = createJigsawOnSteroids(arrayOfArtistsFiltered.length)
            forceRedraw(generateData(arrayOfArtistsFiltered))
        });

        function setListeners() {
            // https://codepen.io/desandro/pen/WxjJJW/
            document.querySelectorAll('.list-artist').forEach(E => E.addEventListener('click', (event) => {
                // console.log('currentTarget', event.currentTarget, 'target', event.target)
                if (event.currentTarget === event.target) {
                    event.stopPropagation()
                    event.preventDefault()
                    let whereDoIGo = `/ciaccona.html?a=${event.target.dataset.fullnamenospacelowercasenodiacritics}`
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
                    // coerce.artist = undefined
                    
                    if (typeof coerce.artist !== 'undefined') {
                        let whereDoIGo = `/puzzle?a=${arrayOfArtistsFiltered[coerce.artist].fullnameNospaceLowercaseNodiacritics}&v=${ event.currentTarget.parentNode.dataset.variation}`
                        window.location = whereDoIGo
                    }
                }
                forceRedraw(generateData(arrayOfArtistsFiltered))
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
                forceRedraw(generateData(arrayOfArtistsFiltered))
            }))
        }
    }
})
