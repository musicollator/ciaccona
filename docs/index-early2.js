import { theTrickToViewportUnitsOnMobile } from "/js/utils.js?v=1.0.4-beta.2"

// list item width
function calcItemWidth() {
    const listE = document.querySelector('.artists#list')
    if (!listE) {
        console.log(`no '.artists#list' (${listE}), no calcItemWidth`)
        return 
    }

    const containerWidth = listE.getBoundingClientRect().width
    const gutter_sizer = 0 // 0.0125;
    const gutter_size = containerWidth * gutter_sizer
    const listItemsPerRow = 1 + Math.floor(containerWidth / 240)
    const listItemsWidth = (containerWidth - (listItemsPerRow - 1) * gutter_size) / listItemsPerRow
    const listItemsDoubleWidth = 2 * listItemsWidth + gutter_size - .2
    const listItemPercentageWidth = 100 * listItemsWidth / containerWidth
    const listItemDoublPercentageWidth = 100 * listItemsDoubleWidth / containerWidth
    const listItemsHeight = listItemsWidth // / 1.91;
    const listItemsDoubleHeight = listItemsHeight * 2 + gutter_size - .2

    document.documentElement.style.setProperty('--gs', `${gutter_sizer * 100}%`)
    document.documentElement.style.setProperty('--lipr', `${listItemsPerRow}`)
    document.documentElement.style.setProperty('--lipc', `${Math.ceil(55 / listItemsPerRow)}`)
    document.documentElement.style.setProperty('--liw', `${listItemPercentageWidth}%`)
    document.documentElement.style.setProperty('--lih', `${listItemsHeight}px`)
    document.documentElement.style.setProperty('--2liw', `${listItemDoublPercentageWidth}%`)
    document.documentElement.style.setProperty('--2lih', `${listItemsDoubleHeight}px`)

    console.log('calcItemWidth done!')
}

window.addEventListener("calcItemWidth", (event) => {
    console.log('...heard calcItemWidth event, let us calculate the width of items...')
    calcItemWidth()
});

window.addEventListener("DOMContentLoaded", (event) => {
    console.log('...heard DOMContentLoaded event, let us calcItemWidth...')
    calcItemWidth()
}, { once: true });

theTrickToViewportUnitsOnMobile(false /* no console.log */, () => calcItemWidth())
