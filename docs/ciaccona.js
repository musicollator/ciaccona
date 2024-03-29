import isotopeLayout from 'https://cdn.jsdelivr.net/npm/isotope-layout@3.0.6/+esm'
import config from "/js/config.js?v=1.0.4-beta.2"
import { togglePlayer } from "/js/playerSingleton.js?v=1.0.4-beta.2"
import { createColoredBadges } from "/js/colors.js?v=1.0.4-beta.2"
import { createPlayerSingleton, showPlayer } from "/js/playerSingleton.js?v=1.0.4-beta.2"
import { loadArtists } from "/js/artists.js?v=1.0.4-beta.2"
import Ω from "/js/dom.js?v=1.0.4-beta.2"

document.getElementById('version').innerHTML = ver

const about = new Ω.About()

// * * * * * * * * * * * * * * * * * * * * * * * * * * * 
createColoredBadges('grid');
Ω.setSwipe()
Ω.setPuzzleClickHandlers()
Ω.showScoreDisplay()
Ω.showScoreInBricks()

// elaborate a bit some config values 
const autoplayChecked = document.getElementById('autoplayChecked')
if (autoplayChecked) {
    if (config.autoplay) autoplayChecked.checked = true
} else {
    console.log('NO AUTOPLAY CHECKBOX ?!')
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

    showPlayer()

    const loadingE = document.getElementById('loading')
    if (loadingE) {
        document.querySelectorAll('#config-menu, #videos-menu').forEach(elem => elem.style.visibility = 'visible')

        loadingE.style.display = 'none'
        console.log('loading dismissed')

        console.log('shout allesistvollbracht event...')
        window.dispatchEvent(new Event('allesistvollbracht'));
    }
}

// everything
const allPromises = new Map()
// names of promises, for bookkeeping
const PLAYER = "PLAYER", ISOTOPE = "ISOTOPE";

// 1. promise resolves when 1) timings for this artist have been loaded, then 2) video player is ready
if (coerce.fullnameNospaceLowercaseNodiacritics) {

    allPromises.set(
        PLAYER,
        loadArtists().then(putainDeArtists => {
            let artistObject = putainDeArtists.getArtistFromFullnameNospaceLowercaseNodiacritics(coerce.fullnameNospaceLowercaseNodiacritics)

            return createPlayerSingleton(artistObject, coerce.wip)
        })
    )
}


// 2. create and flood color bricks into isotope
allPromises.set(
    ISOTOPE,
    new Promise((resolve, reject) => {

        readyToIsotope.then(result => {
            console.log('readyToIsotope promise resolved, about to create isotope ...')
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

