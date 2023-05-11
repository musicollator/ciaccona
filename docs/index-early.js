import { theTrickToViewportUnitsOnMobile } from '/js/utils.js?v=0.13.3'

// list item width
function calcItemWidth() {
    const listE = document.querySelector('.artists#list')
    console.log('.ARTISTS #LIST', listE)
    if (listE) {
        const containerWidth = listE.getBoundingClientRect().width
        const gutter_sizer = 0.0125;
        const gutter_size = containerWidth * gutter_sizer
        const listItemsPerRow = 1 + Math.floor(containerWidth / 400)
        const listItemsWidth = (containerWidth - (listItemsPerRow - 1) * gutter_size) / listItemsPerRow
        const listItemsDoubleWidth = 2 * listItemsWidth + gutter_size - .2
        const listItemPercentageWidth = 100 * listItemsWidth / containerWidth
        const listItemDoublPercentageWidth = 100 * listItemsDoubleWidth / containerWidth
        const listItemsHeight = listItemsWidth / 1.91;
        const listItemsDoubleHeight = listItemsHeight * 2 + gutter_size - .2

        document.documentElement.style.setProperty('--gs', `${gutter_sizer * 100}%`)
        document.documentElement.style.setProperty('--lipr', `${listItemsPerRow}`)
        document.documentElement.style.setProperty('--lipc', `${Math.ceil(36 / listItemsPerRow)}`)
        document.documentElement.style.setProperty('--liw', `${listItemPercentageWidth}%`)
        document.documentElement.style.setProperty('--lih', `${listItemsHeight}px`)
        document.documentElement.style.setProperty('--2liw', `${listItemDoublPercentageWidth}%`)
        document.documentElement.style.setProperty('--2lih', `${listItemsDoubleHeight}px`)
    }
    console.log('shout readyToPack event...')
    window.dispatchEvent(new Event('readyToPack'));
}

window.addEventListener("calcItemWidth", (event) => {
    console.log('...heard calcItemWidth event')
    calcItemWidth()
});

window.addEventListener("DOMContentLoaded", (event) => {
    calcItemWidth()
}, { once: true });

theTrickToViewportUnitsOnMobile(true, () => calcItemWidth())
