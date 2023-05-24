import { theTrickToViewportUnitsOnMobile } from "/js/utils.js?v=1.0.1-alpha.2"

// brick width
function calcBrickWidth() {
    const gridE = document.querySelector('.ciaccona#grid')
    if (!gridE) {
        console.log(`no '.ciaccona#grid' (${gridE}), no calcBrickWidth`)
        return 
    }
    const containerWidth = gridE.getBoundingClientRect().width
    const gridBricksPerRow = 1 + Math.floor(containerWidth / 400)
    const gridBrickPercentageWidth = 100 / gridBricksPerRow
    document.documentElement.style.setProperty('--bpr', `${gridBricksPerRow}`)
    document.documentElement.style.setProperty('--bpc', `${Math.ceil(36 / gridBricksPerRow)}`)
    document.documentElement.style.setProperty('--gbw', `${gridBrickPercentageWidth}%`)

    console.log('calcBrickWidth done, about to shout readyToIsotope event...')
    window.dispatchEvent(new Event('readyToIsotope'));
}

window.addEventListener("calcBrickWidth", (event) => {
    console.log('...heard calcBrickWidth event, let us calculate the width of bricks...')
    calcBrickWidth()
});

window.addEventListener("DOMContentLoaded", (event) => {
    console.log('...heard DOMContentLoaded event, let us calcBrickWidth...')
    calcBrickWidth()
}, { once: true });

// set up on window resize listener
theTrickToViewportUnitsOnMobile(false /* no console.log */, () => calcBrickWidth())
