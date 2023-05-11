import packeryLayout from 'https://cdn.jsdelivr.net/npm/packery@2.1.2/+esm'
import codec from "/js/structure.js?v=0.13.3"
import { colorArray } from "/js/colors.js?v=0.13.3"
import { loadArtists } from "/js/artists.js?v=0.13.3"
import { shuffleArray, generateElement } from "/js/utils.js?v=0.13.3"
import { jigsawGenerator } from '/js/jigsawShield.js?v=0.13.3'

const bg = (a, v) => `url('https://musicollator.github.io/ciaccona-stationary/artists/${a}/${a}-${v}.webp')`

const template = (data) => `
<div id="li-artist${data.v}" 
     class="list-artist hero"  
     data-index="${data.index}" 
     data-a="${data.a}" 
     data-v="${data.v}" 
     style="background-image: ${data.bg}; overflow:hidden;">
    <div class="d-flex flex-column justify-content-start${data.hideName}" style="height:100%;" >
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
    <a class="puzzle flex-shrink-1" href="#" title="Pin or unpin ${data.pinUnpinVariationTitle}">
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
</div>`

let data = []
let artists2
let arrayOfArtists = []
const colors = colorArray;

function generateData() {
    data = []
    let vi = 0
    arrayOfArtists.forEach(a => {
        if (a.fullnameNoSpaceLowercaseNoDiacritics === 'moi') {
            return;
        }
        const j = jigsawGenerator.getJigsawItem(vi + 1)
        const transX = parseInt(j.viewBox.replaceAll(/^([\.\d\-]+).*$/g, "$1"))
        const transY = parseInt(j.viewBox.replaceAll(/^[\.\d\-]+\s+([\.\d\-]+).*$/g, "$1"))
        const artistLastnameNoBreakingSpaces = a.lastname.replaceAll(/\s/gi, '&nbsp;');
        const datum = {
            index: vi,
            a: coerceArtist || a.fullnameNoSpaceLowercaseNoDiacritics,
            v: coerceVariation || vi % codec.variationsCount,
            puzzleHRef: coerceVariation ? '/' : `?v=${vi % codec.variationsCount}`,
            firstname: a.firstname,
            lastname: artistLastnameNoBreakingSpaces,
            bg: bg(coerceArtist || a.fullnameNoSpaceLowercaseNoDiacritics, coerceVariation || vi % codec.variationsCount),
            jigsaw: j,
            hideName: coerceArtist ? ' hide-name' : '',
            fill: colors[coerceVariation || vi % codec.variationsCount].puzzleColor_T,
            stroke: colors[coerceVariation || vi % codec.variationsCount].textColor_T,
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

    list.innerHTML += `
    <div id="li-ciaccona" 
        class="list-item d-flex align-items-center justify-content-around flex-column" 
        <div>
        <a class="magnificent-card p-2" href="/ciaccona.html" aria-label="Ciaccona...">
            &nbsp;
            <div style="margin: auto; font-size: 28px;">Ciaccona</div>
            &nbsp;
            <svg id="arrow_in_right" class="align-self-center" style="width:32px; height:32px;" viewBox="0 0 20 20">
                <path fill="#00000060" fill-rule="evenodd"
                    d="M7.392 5.06 5.938 6.408 8.366 9H0v2h8.366l-2.428 2.544 1.454 1.362 4.671-4.948L7.392 5.06ZM10 0v4h2V2h6v16h-6v-2h-2v4h10V0H10Z" />
            </svg>
            &nbsp;
        </a>
        <div id="li-artist" class="p-2" style="white-space: nowrap; display:none;">
            <span class="fullname" style="color: #d0d0d0; font-size: 1.4rem;"></span>
            <!--
            <a id="youtube-url" class="btn btn-lihjt icon-base icon-youtube_external_link text-muted" target="_youtube" href="#" aria-label="Original Video...">
            </a>
            <a id="social" class="share btn btn-lihjt icon-base icon-share text-muted" target="_facebook" href="#" aria-label="Share...">
            </a>
            --!
        </div>
        </div>
    </div>`

    arrayOfArtists = shuffle ? shuffleArray(artists.artists) : artists.artists
    data = generateData(arrayOfArtists)
    data.forEach(d => {
        list.innerHTML += `<div class="list-item">${template(d)}</div>`
    })

    const event = new Event("artistsLoaded");
    window.dispatchEvent(event);

    readyToPack.then((result) => {
        console.log("let's pack")
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

        function forceRedraw() {
            document.querySelectorAll('.list-item:not(#li-ciaccona)').forEach(E => {
                const i = E.children[0].dataset.index
                const newChild = generateElement(template(data[i]))
                E.replaceChild(newChild, E.children[0])
            })
            const artistBadge = document.getElementById('li-artist')
            if (coerceArtist) {
                artistBadge.style.display = 'inherit'
                artistBadge.querySelector('.fullname').innerHTML = artists2.getArtistFromNameNoSpaceLowercaseNoDiacritics(coerceArtist).fullname
                document.querySelectorAll('.list-artist .hero-intro:not(.vert)').forEach(E => E.style.display = 'none')
            } else {
                artistBadge.style.display = 'none'
                artistBadge.querySelector('.fullname').innerHTML = ''
                document.querySelectorAll('.list-artist .hero-intro:not(.vert)').forEach(E => E.style.display = 'inherit')
            }
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
            document.querySelectorAll('.list-artist .puzzle').forEach(E => E.addEventListener('click', (event) => {
                event.stopPropagation()
                event.preventDefault()
                if (coerceVariation) {
                    coerceVariation = undefined
                } else {
                    coerceVariation = event.currentTarget.parentNode.dataset.v
                }
                data = generateData(arrayOfArtists)
                forceRedraw()
            }))
            document.querySelectorAll('.list-artist .hero-intro').forEach(E => E.addEventListener('click', (event) => {
                event.stopPropagation()
                event.preventDefault()
                if (coerceArtist) {
                    coerceArtist = undefined
                } else {
                    coerceArtist = event.currentTarget.parentNode.parentNode.dataset.a
                }
                data = generateData(arrayOfArtists)
                forceRedraw()
            }))
            document.querySelectorAll('#li-artist').forEach(E => E.addEventListener('click', (event) => {
                event.stopPropagation()
                event.preventDefault()
                coerceArtist = undefined
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
$list.on('click', '.list-artist .puzzle', function (event) {
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
