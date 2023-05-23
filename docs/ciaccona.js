import isotopeLayout from 'https://cdn.jsdelivr.net/npm/isotope-layout@3.0.6/+esm'
import config from "/js/config.js?v=2.2.21"
import { togglePlayer } from "/js/playerSingleton.js?v=2.2.21"
import { createColoredBadges } from "/js/colors.js?v=2.2.21"
import { createPlayerSingleton, showPlayer } from "/js/playerSingleton.js?v=2.2.21"
import Ω from "/js/dom.js?v=2.2.21"

// transform windows loaded event into promise
const windowLoaded = new Promise((resolve) => {
    window.addEventListener('load', (event) => {
        resolve(event)
    })
})

document.getElementById('version').innerHTML = ver

const about = new Ω.About()

// tidyfication of menu items
/*
document.querySelectorAll('#videos-menu span.c').forEach((e) => e.innerHTML = "")
if (fullameNoSpaceLowercaseNoDiacritics) {
    const menuItem = document.querySelector(`#videos-menu a[data-name-no-space-lowercase-no-diacritics="${fullameNoSpaceLowercaseNoDiacritics}"]`)
    if (menuItem) {
        menuItem.classList.add('disabled')
        menuItem.querySelector(`span.c`).innerHTML = "&#10004;&nbsp;"
    }
    const theContainerCol = document.getElementById('theContainerCol')
    if (theContainerCol) theContainerCol.classList.add('push2right')
} else {
    const menuItem = document.querySelector(`#videos-menu a[data-name-no-space-lowercase-no-diacritics=""]`)
    if (menuItem) {
        menuItem.classList.add('disabled')
        menuItem.querySelector('span.c').innerHTML = "&#10004;&nbsp;"
    }
}
*/

function ouvreLesYeux() {
    (badgeArtistEyeElement => {
        if (!badgeArtistEyeElement) return;

        (playerWrapper => {
            if (!playerWrapper) return;
            if (playerWrapper.style.visibility === 'visible') {
                badgeArtistEyeElement.classList.remove('icon-eye_open')
                badgeArtistEyeElement.classList.add('icon-eye_close')
            } else {
                badgeArtistEyeElement.classList.remove('icon-eye_close')
                badgeArtistEyeElement.classList.add('icon-eye_open')
            }
        })(document.getElementById('playerWrapper'));

        badgeArtistEyeElement.addEventListener('click', (event) => {
            event.stopPropagation()
            event.preventDefault()
            const isPlayerVisible = togglePlayer()
            if (typeof isPlayerVisible !== 'undefined') {
                if (isPlayerVisible) {
                    badgeArtistEyeElement.classList.remove('icon-eye_open')
                    badgeArtistEyeElement.classList.add('icon-eye_close')
                } else {
                    badgeArtistEyeElement.classList.remove('icon-eye_close')
                    badgeArtistEyeElement.classList.add('icon-eye_open')
                }
            }
        })

    })(document.querySelector('.artist#badge-artist #eye'))
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * 
createColoredBadges('grid');
Ω.setPuzzleClickHandlers()
Ω.showScoreDisplay()
Ω.showScoreInBricks()

// elaborate a bit some config values 
const autoplayChecked = document.getElementById('autoplayChecked')
if (autoplayChecked) {
    if (config.autoplay) autoplayChecked.checked = true
} else {
    console.log('NO AUTOPLAY CHECK BOX ?!')
}

(grid => {
    if (!grid) return

    // omega seven
    const Ω7 = (x, y, z) => {
        const _ = document.getElementById(x)
        if (_) { _[y] = z }
    }

    const scoreDisplayRadioButtonId = `${config.scoreDisplay}RadioButton`
    Ω7(scoreDisplayRadioButtonId, 'checked', true) // document.getElementById(scoreDisplayRadioButtonId).checked = true
    grid.dataset.scoreDisplay = config.scoreDisplay

    const scoreInBricksRadioButtonId = `${config.scoreInBricks}RadioButton`
    Ω7(scoreInBricksRadioButtonId, 'checked', true) // document.getElementById(scoreInBricksRadioButtonId).checked = true
    grid.dataset.scoreInBricks = config.scoreInBricks

})(document.getElementById('grid'));


// loading 
const hideLoading = () => {

    showPlayer(undefined)

    const loadingE = document.getElementById('loading')
    if (loadingE) {
        document.querySelectorAll('#config-menu, #videos-menu').forEach(elem => elem.style.visibility = 'visible')

        loadingE.style.display = 'none'
        console.log('loading dismissed')

        console.log('shout allesistvollbracht event...')
        window.dispatchEvent(new Event('allesistvollbracht'));
    }
}

const event = new Event("ciacconaLoaded");
window.dispatchEvent(event);

// everything
const allPromises = new Map()
// names of promises, for bookkeeping
const PLAYER = "PLAYER", ISOTOPE = "ISOTOPE";

// 1. promise resolves when 1) timings for this artist have been loaded, then 2) video player is ready
if (coerce.fullameNoSpaceLowercaseNoDiacritics) {

    let artistObject = config.theArtists.getArtistFromNameNoSpaceLowercaseNoDiacritics(coerce.fullameNoSpaceLowercaseNoDiacritics)

    allPromises.set(
        PLAYER,
        createPlayerSingleton(artistObject, coerce.no_plyr_event)
    )
}

// 2. create and flood color bricks into isotope
allPromises.set(
    ISOTOPE,
    new Promise((resolve, reject) => {

        readyToIsotope.then(result => {
            console.log('about to create isotope ...')
            const theIsotope = new isotopeLayout('#grid', {
                itemSelector: "#theContainer #theContainerCol .ciaccona#grid .grid-brick",
                sortBy: 'id',
                getSortData: {
                    id: '[data-sort]'
                },
                percentPosition: true,
            })
            theIsotope.on('layoutComplete', function () {
                console.log("Isotope layout complete");
            })

            // big buffer of everything that needs to be done AFTER bricks are ready
            Ω.afterIsotope(theIsotope)

            resolve({ key: ISOTOPE, value: theIsotope })
        })
    })
)

// when all promises are done
Promise.allSettled([...allPromises.values()]).then((results) => {

    // transform results in something more readable (well, really?)
    const map = new Map(results
        .filter((result) => {
            const add = (
                result.status === 'fulfilled' &&
                result.value != null &&
                result.value.key != null &&
                result.value.value != null)
            if (!add) {
                console.log('some issue with this promise', result)
            }
            return add
        })
        .map((result) => {
            return [result.value.key, result.value.value]
        }));

    console.log(`All promises settled. Promises fullfilled: ${map.size} / ${results.length}`, results)

    const isotopeResult = map.get(ISOTOPE)
    const playerResult = map.get(PLAYER)

    ouvreLesYeux()

    if (isotopeResult) {
        isotopeResult.on('arrangeComplete', function (filteredItems) {
            console.log('isotope arrangeComplete')
            hideLoading()
        })
        if (!playerResult) {
            console.log("change isotope filter to hide artist name")
            isotopeResult.arrange({ filter: ':not(.artist)' })
        } else {
            console.log("change isotope filter to show artist name")
            isotopeResult.arrange({ filter: '*' })

            if (coerce.variation) {
                const e = document.getElementById(`gb${coerce.variation}`)
                if (e) {
                    e.classList.add('selected')
                    e.scrollIntoView({ behavior: "smooth", block: "center" })
                }
            }
        }
    } else {
        throw new Error("some issue with isotope ?")
    }

}).catch((error) => {

    hideLoading();

    console.error(error)

    return error
})

