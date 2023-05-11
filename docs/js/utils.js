// https://github.com/js-cookie/js-cookie
import jsCookie from 'https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/+esm'

function getCookie(cookieName) {
    const value = jsCookie.get(cookieName)
    console.log("cookie", cookieName, "is", value)
    return value
}

function setCookie(cookieName, cookieValue, expires) {
    jsCookie.set(cookieName, cookieValue, { expires: expires ? expires : 2 })
    console.log("cookie", cookieName, "set to", cookieValue)
}

function removeCookie(cookieName) {
    jsCookie.remove(cookieName)
    console.log("cookie", cookieName, "removed")
}

// http://stackoverflow.com/questions/20789373/shuffle-array-in-ng-repeat-angular
// -> Fisher–Yates shuffle algorithm
function shuffleArray(array) {
    let m = array.length,
        t, i;
    // While there remain elements to shuffle
    while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);
        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

// https://code.tutsplus.com/the-binary-search-algorithm-in-javascript--cms-30003t
function binaryRangeSearch(value, array, getValue) {
    if (value == null) return undefined
    if (array == null || !array.length) return undefined
    if (getValue == null) getValue = (ind, arr) => arr[ind]

    if (value < getValue(0, array)) {
        return -1
    }

    let low = 0;
    let high = array.length - 1;
    let mid
    let minValue, maxValue

    while (low <= high) {
        mid = Math.floor((low + high) / 2);
        minValue = getValue(mid, array)
        maxValue = mid < array.length - 1 ? getValue(mid + 1, array) : Number.MAX_VALUE

        if (value < minValue) {
            high = mid - 1;
        } else if (maxValue <= value) {
            low = mid + 1;
        } else {
            return mid;
        }
    }
    return undefined
}

function normalizeVraiment(x, srcmin, srcmax, dstmin, dstmax) {
    if (srcmax === srcmin) return 0
    const y = dstmin + (dstmax - dstmin) * (x - srcmin) / (srcmax - srcmin)
    return y
}

// https://stackoverflow.com/a/66935761/1070215
const nameOf = (f) => (f).toString().replace(/[ |\(\)=>]/g, '');

function logFunc(f, xMin, xMax, yTicks) {
    if (!xMin) xMin = 0
    if (!xMax) xMax = 1
    const xTicks = 100
    if (!yTicks) yTicks = 20
    yTicks--;
    // console.log('𝅅·°○●ₒ∘°')
    const a = new Array(xTicks + 1)
    a[0] = '+'
    a.fill('+', 1, a.length)
    const title = nameOf(f)
    if (title) {
        const l = a.join('')
        const seg = l.substring(0, (l.length - title.length) / 2)
        console.log('   ' + seg + ' ' + title + ' ' + seg)
    }
    ///////////////////////////////////
    // find yMin and yMax
    let yMin = Number.MAX_VALUE
    let yMax = Number.MIN_VALUE

    for (let t0 = 0; t0 <= yTicks; t0++) {
        let x0 = normalizeVraiment(t0, 0, yTicks, xMin, xMax)
        const y0 = f()(x0)
        yMin = Math.min(yMin, y0)
        yMax = Math.max(yMax, y0)
    }
    let zeroIndex
    if (xMin <= 0 && 0 <= xMax) {
        const yZero = f()(0)
        zeroIndex = normalizeVraiment(-yZero, -yMax, -yMin, 0, xTicks)
    }

    for (let t = 0; t <= yTicks; t++) {
        let x
        if (t === 0) {
            x = xMin
        } else if (t === yTicks) {
            x = xMax
        } else {
            x = normalizeVraiment(t, 0, yTicks, xMin, xMax)
        }
        const y = f()(x)
        const index = normalizeVraiment(-y, -yMax, -yMin, 0, xTicks)

        a[0] = '+'
        a.fill('-', 1, a.length)
        a[Math.round(zeroIndex)] = '+'
        a[Math.round(index)] = '●'
        console.log(
            (x).toFixed(2).padStart(5, '0'),
            a.join(''),
            y.toFixed(2).padStart(5, ' '),
            index)
    }
}

function theTrickToViewportUnitsOnMobile(log, onResizeCallback) {
    // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
    function theTrickToViewportUnitsOnMobile(log) {
        if (log) console.log('window.innerWidth', window.innerWidth, 'window.innerHeight', window.innerHeight)

        const vh = window.innerHeight * 0.01
        const vw = window.innerWidth * 0.01

        // set the value in custom properties to the root of the document
        document.documentElement.style.setProperty('--vh', `${vh}px`)
        document.documentElement.style.setProperty('--vw', `${vw}px`)
    }

    theTrickToViewportUnitsOnMobile(log)

    window.addEventListener('resize', /*lodash.debounce(*/() => { // debounce conflicts with isotope own debounce
        theTrickToViewportUnitsOnMobile()
        if (onResizeCallback) onResizeCallback()
    }/* , 750) */)

}

// https://youmightnotneedjquery.com/
function generateElement(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    if (template.content.children.length != 1) {
        throw Error('more or less than 1 element !!!!')
    }
    return template.content.children[0];
  }

export { getCookie, setCookie, removeCookie, shuffleArray, binaryRangeSearch, normalizeVraiment, logFunc, theTrickToViewportUnitsOnMobile, generateElement};
