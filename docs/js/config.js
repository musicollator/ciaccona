import { getCookie, setCookie, removeCookie } from "/js/utils.js?v=2.2.10"
import codec from "/js/structure.js?v=2.2.10"

class Config {
    #scoreDisplay = 'firstBar'
    #scoreInBricks = 'allBricks'
    #playing = false
    #autoplay = false
    #pane = 'left'
    #shuffleReplicator = undefined

    #plyrPlayer
    #artistAndTimings

    #inConstructor = true

    constructor(coerce) {
        // 
        this.scoreDisplay = getCookie('scoreDisplay')

        // 
        this.scoreInBricks = getCookie('scoreInBricks')

        // 
        this.playing = getCookie('playing')

        // 
        this.autoplay = getCookie('autoplay')

        // 
        this.pane = getCookie('pane')

        // 
        this.shuffleReplicator = getCookie('shuffleReplicator')


        this.#inConstructor = false

    }

    reset() {
        this.scoreDisplay = undefined
        this.scoreInBricks = undefined
        this.playing = undefined
        this.autoplay = undefined
        this.pane = undefined
        this.shuffleReplicator = undefined
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
                    const in10Minutes = 1 / 144;
                    setCookie('autoplay', 'true', in10Minutes)
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

    // 
    get shuffleReplicator() {
        return this.#shuffleReplicator
    }
    set shuffleReplicator(shuffleReplicator) {
        let stringedshuffleReplicator = shuffleReplicator
        let arrayshuffleReplicator = shuffleReplicator
        if (shuffleReplicator) {
            if (Array.isArray(shuffleReplicator)) {
                stringedshuffleReplicator = shuffleReplicator.toString()
            } else if (typeof shuffleReplicator === 'string' || shuffleReplicator instanceof String) {
                arrayshuffleReplicator = shuffleReplicator.split(',').map(i => parseInt(i));
            }
        }
        // https://www.30secondsofcode.org/js/s/array-comparison/
        const equals = (a, b) => {
            if (a === b) {
                return true
            }
            if (!a || !b) {
                return false
            }

            return a.length === b.length && a.every((v, i) => v === b[i])
        }

        if (!equals(arrayshuffleReplicator, this.#shuffleReplicator)) {
            this.#shuffleReplicator = arrayshuffleReplicator
            if (!this.#inConstructor) {
                if (typeof this.#shuffleReplicator === 'undefined') {
                    removeCookie('shuffleReplicator')
                } else {
                    // https://github.com/js-cookie/js-cookie/wiki/Frequently-Asked-Questions#expire-cookies-in-less-than-a-day
                    const in10Minutes = 1 / 144;
                    setCookie('shuffleReplicator', stringedshuffleReplicator, in10Minutes)
                }
            }
        }
    }

    // 
    get plyrPlayer() {
        return this.#plyrPlayer
    }
    set plyrPlayer(plyrPlayer) {
        this.#plyrPlayer = plyrPlayer
    }

    // 
    get artistAndTimings() {
        return this.#artistAndTimings
    }
    set artistAndTimings(artistAndTimings) {
        this.#artistAndTimings = artistAndTimings
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