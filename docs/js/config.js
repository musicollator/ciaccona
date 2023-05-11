import { getCookie, setCookie, removeCookie } from "/js/utils.js?v=1.0.0"
import codec from "/js/structure.js?v=1.0.0"

class Config {
    #scoreDisplay = 'firstBar'
    #scoreInBricks = 'allBricks'
    #playing = false
    #startBarOfLastSelectedVariation = 0
    #autoplay = false
    #pane = 'left'

    #inConstructor = true

    constructor() {
        // 
        this.scoreDisplay = getCookie('scoreDisplay')

        // 
        this.scoreInBricks = getCookie('scoreInBricks')

        // 
        this.playing = getCookie('playing')

        // 
        this.startBarOfLastSelectedVariation = getCookie('startBarOfLastSelectedVariation')

        // 
        this.autoplay = getCookie('autoplay')

        // 
        this.pane = getCookie('pane')


        this.#inConstructor = false
    }

    // 
    get scoreDisplay() {
        return this.#scoreDisplay
    }
    set scoreDisplay(scoreDisplay) {
        if (typeof scoreDisplay === 'undefined') {
            scoreDisplay = 'firstBar'
        } else if (scoreDisplay !== 'firstBar' && scoreDisplay !== 'fullScore') {
            return
        }
        if (scoreDisplay !== this.#scoreDisplay) {
            this.#scoreDisplay = scoreDisplay
            if (!this.#inConstructor) {
                if (!this.#scoreDisplay || this.#scoreDisplay === 'firstBar') {
                    removeCookie('scoreDisplay')
                } else {
                    setCookie('scoreDisplay', this.#scoreDisplay)
                }
            }
        }
    }

    // 
    get scoreInBricks() {
        return this.#scoreInBricks
    }
    set scoreInBricks(scoreInBricks) {
        if (typeof scoreInBricks === 'undefined') {
            scoreInBricks = 'allBricks'
        } else if (scoreInBricks !== 'allBricks' && scoreInBricks !== 'selectedBrick') {
            return
        }
        if (scoreInBricks !== this.#scoreInBricks) {
            this.#scoreInBricks = scoreInBricks
            if (!this.#inConstructor) {
                if (!this.#scoreInBricks || this.#scoreInBricks === 'allBricks') {
                    removeCookie('scoreInBricks')
                } else {
                    setCookie('scoreInBricks', this.#scoreInBricks)
                }
            }
        }
    }

    // 
    get playing() {
        return this.#playing
    }
    set playing(playing) {
        if (playing && (playing === 'true' || playing === true)) {
            playing = true
        } else {
            playing = false
        }

        if (playing !== this.#playing) {
            this.#playing = playing
            if (!this.#inConstructor) {
                if (this.#playing === false) {
                    removeCookie('playing')
                } else {
                    setCookie('playing', 'true')
                }
            }
        }
    }

    // 
    get startBarOfLastSelectedVariation() {
        return this.#startBarOfLastSelectedVariation
    }
    set startBarOfLastSelectedVariation(startBarOfLastSelectedVariation) {
        let temp
        if (!startBarOfLastSelectedVariation) {
            temp = 0
        } else {
            temp = parseInt(startBarOfLastSelectedVariation)
            if (isNaN(temp)) temp = 0
        }
        if (codec.bar2variation(temp) === -1) {
            temp = 0
        }

        if (temp !== this.#startBarOfLastSelectedVariation) {
            this.#startBarOfLastSelectedVariation = temp

            if (!this.#inConstructor) {
                if (this.#startBarOfLastSelectedVariation === 0) {
                    removeCookie('startBarOfLastSelectedVariation')
                } else {
                    // https://github.com/js-cookie/js-cookie/wiki/Frequently-Asked-Questions#expire-cookies-in-less-than-a-day
                    var in30Minutes = 1 / 48;
                    setCookie('startBarOfLastSelectedVariation', this.#startBarOfLastSelectedVariation, in30Minutes)
                }
            }
        }
    }

    // 
    get autoplay() {
        return this.#autoplay
    }
    set autoplay(autoplay) {
        if (autoplay && (autoplay === 'true' || autoplay === true)) {
            autoplay = true
        } else {
            autoplay = false
        }

        if (autoplay !== this.#autoplay) {
            this.#autoplay = autoplay
            if (!this.#inConstructor) {
                if (this.#autoplay === false) {
                    removeCookie('autoplay')
                } else {
                    setCookie('autoplay', 'true')
                }
            }
        }
    }

    // 
    get pane() {
        return this.#pane
    }
    set pane(pane) {
        if (typeof pane === 'undefined') {
            pane = 'left'
        } else {
            if (!(pane === 'left' || pane === 'right')) return
        }
        if (pane !== this.#pane) {
            this.#pane = pane
            if (!this.#inConstructor) {
                if (!this.#pane || this.#pane === 'left') {
                    removeCookie('pane')
                } else {
                    setCookie('pane', this.#pane)
                }
            }
        }
    }
}

const config = new Config()
function getMethods(o) {
    return Object.getOwnPropertyNames(Object.getPrototypeOf(o))
        .filter(m => 'function' !== typeof o[m])
}
console.log('+ - - - - - - = config = - - - - - - -')
getMethods(config).map(x => console.log('|', x, '=', config[x]))
console.log('+ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~')

export default config