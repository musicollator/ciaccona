import packeryLayout from 'https://cdn.jsdelivr.net/npm/packery@2.1.2/+esm'
import ImagesLoaded from "https://cdn.jsdelivr.net/npm/imagesloaded@5.0.0/+esm"
import codec from "/js/structure.js?v=1.0.5"
import { colorArray } from "/js/colors.js?v=1.0.5"
import { loadArtists } from "/js/artists.js?v=1.0.5"
import { shuffleArray, generateElement } from "/js/utils.js?v=1.0.5"
import { jigsawGenerator } from '/js/jigsawShield.js?v=1.0.5'
import MagnificentTitle from "/js/magnificent-title.js?v=1.0.5"

const bg = (a, v) => `url('https://musicollator.github.io/ciaccona-stationary/artists/${a}/${a}-${v}.webp')`

const template = (data, first) => `
<div id="li-artist${data.v}" 
     class="list-artist hero"  
     data-index="${data.index}" 
     data-a="${data.a}" 
     data-v="${data.v}" 
     style="background-image: ${data.bg}; overflow:visible;">
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
    <div class="flex-shrink-1 d-flex flex-column justify-content-evenly" style="width: 3rem; height: 100%; overflow: visible;">
        <a class="puzzle-limited" href="#" title="Pin or unpin ${data.pinUnpinVariationTitle}" style="${first ? 'visibility: hidden;' : ''}">
            <svg xmlns="http://www.w3.org/2000/svg" 
                id="gb-puzzle${data.v}-svg" 
                style="overflow: visible; transform: scale(.667);"
                viewBox="${data.jigsaw.viewBox}">
                <path stroke="#${data.stroke ? data.stroke : 'C8B273'}" 
                    stroke-width="3" 
                    fill="#${data.fill ? data.fill : '57728ba0'}" 
                    d="${data.jigsaw.path}" style=""></path>
            </svg>
        </a>
        <div class="fw-bold font-monospace" style="margin-left: auto; margin-right: auto; font-size: larger;">
        ${data.number}
        </div>
    </div>
</div>`


/*
    <!--
    <div class="d-flex flex-column justify-content-evenly" style="width: 3rem; overflow: visible;">
        <svg xmlns="http://www.w3.org/2000/svg" id="gb-puzzle1-svg" class="clipboard-puzzle" width="80%" height="60%" style="visibility: inherit; overflow: visible; transform: scale(.667);" viewBox="0 240 120 120">
                <!-- 
                data-clipboard-text="https://ciaccona.cthiebaud.com/?a=amandinebeyer&v=1"
                title="copy link to clipboard"
                -->
                <path stroke="#ffffff80" stroke-width="3" fill="#d2cf1880" d="M 0,240 C 24 234.25 51.09 254.46 44.34 235.32 C 37.59 216.18 75.87 216.18 63.48 235.32 C 51.09 254.46 96 233.55 120 240  L 120 360 C 96 357.34 47.52 373.52 62.85 354.38 C 78.18 335.24 39.9 335.24 43.71 354.38 C 47.52 373.52 24 364.97 0 360 L 0 240"></path>
        </svg>
        <div id="gb-variation1" class="fw-bold" data-a="amandinebeyer" data-v="1" style="color: #ffffff80; padding: .333rem;">
            1
        </div>
    </div>
    -->
*/

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
        const datum = {
            index: vi,
            number: v === 0 || 34 <= v ? '' : v,
            a: coerceArtist || a.fullnameNoSpaceLowercaseNoDiacritics,
            v: v,
            firstname: a.firstname,
            lastname: artistLastnameNoBreakingSpaces,
            bg: bg(coerceArtist || a.fullnameNoSpaceLowercaseNoDiacritics, v),
            jigsaw: j,
            hideName: coerceArtist ? ' hide-name' : '',
            fill: colors[v].puzzleColor,
            stroke: colors[v].textColor,
            pinUnpinVariationTitle: vi == 0 ? "theme" : vi == codec.variationsCount - 1 ? "final chord" : `variation n°${vi}`,
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
        image.element.querySelectorAll('.list-artist *').forEach(E => E.style.visibility = 'inherit')
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

/*
function orderItems(reorder) {
    var itemElems = thePackery.getItemElements()
    let vi = 0
    itemElems.forEach(function (itemElem) {
        // console.log(i, itemElem)
        const v = reorder || typeof itemElem.dataset.v === 'undefined' ? vi : itemElem.dataset.v
        if (itemElem.dataset.a) {
            let bgFull
            const a = itemElem.dataset.a
            if (a === 'moi') {
                // bgFull = { 'background-color': '#28282b' }
                itemElem.style.backgroundColor = '#28282b'
            } else {
                // bgFull = { 'background-image': bg(itemElem.dataset.a, v) }
                itemElem.style.backgroundImage = bg(itemElem.dataset.a, v)
            }
        }
        vi++
    });
}
orderItems()
$list.on('dragItemPositioned', function () {
    orderItems(true)
});

$list.on('fitComplete', function (item) {
    orderItems()
    $list.packery('shiftLayout');
})
$list.on('click', '.list-artist .puzzle-limited', function (event) {
    event.stopPropagation()
    event.preventDefault()
    const target = event.currentTarget.parentNode;
    window.location = `/puzzle/?a=${target.dataset.a}&v=${target.dataset.v}`
})
function removeLarges() {
    const $wereLarges = $('.list-artist.large');
    $wereLarges.each((index, wasLarge) => {
        wasLarge.classList.remove('large')
        let item = $list.packery('getItem', wasLarge)
        if (item && item.previousPosition) {
            // fit back in previous position
            console.log('about to fit')
            $list.packery('fit', wasLarge, item.previousPosition.x, item.previousPosition.y);
            // remove previous position
            delete item.previousPosition;
        }
    })
}
$('body').on('click', function (event) {
    event.stopPropagation()
    event.preventDefault()
    removeLarges()
})
$list.on('click', '.list-artist .grabber', function (event) {
    event.stopPropagation()
})
$list.on('click', '.list-artist', function (event) {
    event.stopPropagation()
    event.preventDefault()
    var target = event.currentTarget;
    var targetWasLarge = target.classList.contains('large');
    removeLarges()
    if (!targetWasLarge) {
        target.classList.add('large');
        var item = $list.packery('getItem', target)
        // save previous position
        item.previousPosition = {
            x: item.position.x,
            y: item.position.y
        };
        console.log('about to fit')
        $list.packery('fit', target);
    }
});
*/
