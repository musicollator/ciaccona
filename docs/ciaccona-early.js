import codec from "/js/structure.js?v=0.13.3"
import config from "/js/config.js?v=0.13.3"
import { theTrickToViewportUnitsOnMobile } from '/js/utils.js?v=0.13.3'

if (variationParam < 0 || codec.variationsCount <= variationParam) variationParam = undefined
if (variationParam) {
    config.startBarOfLastSelectedVariation = codec.variation2bar(variationParam)
}
if (fullameNoSpaceLowercaseNoDiacritics == null) { // using ==, undefined and null are equal
    // r.à.z.
    config.playing = undefined
}

// brick width
function calcBrickWidth() {
    const gridE = document.querySelector('.ciaccona#grid')
    console.log('.CIACCONA #GRID', gridE)
    if (gridE) {
        const containerWidth = gridE.getBoundingClientRect().width
        const gridBricksPerRow = 1 + Math.floor(containerWidth / 400)
        const gridBrickPercentageWidth = 100 / gridBricksPerRow
        document.documentElement.style.setProperty('--bpr', `${gridBricksPerRow}`)
        document.documentElement.style.setProperty('--bpc', `${Math.ceil(36 / gridBricksPerRow)}`)
        document.documentElement.style.setProperty('--gbw', `${gridBrickPercentageWidth}%`)
    }
    console.log('shout readyToIsotope event...')
    window.dispatchEvent(new Event('readyToIsotope'));
}

window.addEventListener("calcBrickWidth", (event) => {
    console.log('...heard calcBrickWidth event')
    calcBrickWidth()
});

window.addEventListener("DOMContentLoaded", (event) => {
    calcBrickWidth()
}, { once: true });

theTrickToViewportUnitsOnMobile(true, () => calcBrickWidth())
