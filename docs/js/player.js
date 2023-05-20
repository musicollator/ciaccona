import plyr from 'https://cdn.jsdelivr.net/npm/plyr@3.7.8/+esm'
import config from "/js/config.js?v=2.0.3"
import codec from "/js/structure.js?v=2.0.3"
import { normalizeVraiment } from "/js/utils.js?v=2.0.3"

console.log('started player.js, set initialized to FALSE and begin to TRUE')
let initialized = false
let begin = true
let sourceYT

function horzScrollScore(variation, currentTime) {
    if (variation === codec.variationsCount - 1) return -1
    const selector = `#gb${variation} .score`
    const sco = document.querySelector(selector)
    if (sco == null) return -1
    const obj = sco.firstElementChild
    if (obj == null) return -1

    const scoWidth = sco.getBoundingClientRect().width
    const objWidth = obj.getBoundingClientRect().width
    if (objWidth <= scoWidth)
        return -1

    const curr = codec.variation2bar(variation)
    const next = codec.variation2bar(variation + 1)
    const thisStartBar = config.artistAndTimings.bars[curr]
    const nextStartBar = config.artistAndTimings.bars[next]
    const thisStartTime = thisStartBar.duration.asMilliseconds() / 1000
    const nextStartTime = nextStartBar.duration.asMilliseconds() / 1000

    let scrollLeft = normalizeVraiment(currentTime, thisStartTime, nextStartTime, 0, objWidth)
    // wait for a portion of score window width to start scrolling
    scrollLeft -= scoWidth * (2 / 5)

    if (scrollLeft <= 0 || objWidth - scoWidth < scrollLeft) {
        return -1
    }

    sco.scrollLeft = scrollLeft

    return scrollLeft
}

function selectAndScrollToVariation(source, variation, options) {
    const selector = `.grid-brick#gb${variation}`
    let scrollToSelector = selector
    if (variation === 0) {
        scrollToSelector = '.grid-brick#magnificent-title-ciaccona'
    }

    document.querySelectorAll('.grid-brick.has-score').forEach(el => {
        el.classList.remove('selected');
        el.classList.remove('goodbye');
        el.classList.remove('hello');
        el.querySelector('.score').pageXOffset = 0
        el.querySelector('.score').scrollLeft = 0
    })
    document.querySelector(selector)?.classList.add('selected')

    const scrollToElement = document.querySelector(scrollToSelector)
    console.log(source, selector, 'to scroll into view', options)
    scrollToElement?.scrollIntoView(options)
}

function unplay_and_unselect(keepSelect) {
    document.querySelectorAll('.grid-brick.gbPlaying').forEach(el => el.classList.remove('gbPlaying'))
    document.querySelectorAll('.grid-brick.goodbye').forEach(el => el.classList.remove('goodbye'))
    document.querySelectorAll('.grid-brick.hello').forEach(el => el.classList.remove('hello'))
    if (!keepSelect) {
        document.querySelectorAll('.grid-brick.selected.has-score').forEach(el => {
            el.classList.remove('selected');
            el.querySelector('.score').pageXOffset = 0
            el.querySelector('.score').scrollLeft = 0
        })
    }
}

function showPlay(currentTime) {
    const barIndex = config.artistAndTimings.time2bar(currentTime)
    if (barIndex == null || barIndex === -1) {
        console.log('no variation here', currentTime)
        unplay_and_unselect()
        return
    }
    const variation = config.artistAndTimings.bars[barIndex].variation
    console.log('showing play of variation', variation)
    unplay_and_unselect()
    document.querySelector(`.grid-brick#gb${variation}`).classList.add('gbPlaying', 'selected');
}

function hidePlay(cause) {
    console.log('hidding play')
    unplay_and_unselect(cause === 'pause')
}

const feedbackOnCurrentTime = (source, currentTime, noSave, isPlaying, scrollToVariation, scrollOptions) => {

    const doSave = noSave == null || noSave === false

    const barIndex = config.artistAndTimings.time2bar(currentTime)
    if (barIndex == null || barIndex === -1) {
        console.log('no variation here', currentTime)
        unplay_and_unselect()
        if (doSave) {
            config.startBarOfLastSelectedVariation = undefined
        }
        return
    }
    const variation = config.artistAndTimings.bars[barIndex].variation
    const startBarOfThisVariation = config.artistAndTimings.bars[barIndex].variationStartBarIndex

    // changement de variation 
    if (config.startBarOfLastSelectedVariation != startBarOfThisVariation) {
        config.startBarOfLastSelectedVariation = startBarOfThisVariation
    }

    if (isPlaying) {
        horzScrollScore(variation, currentTime)
    }

    if (true) {

        const shallWeSwap = (alt, neu) => {
            if (neu == null) return false
            if (alt == neu) return false
            return true
        }
        const oldBrickplaying = document.querySelector(".grid-brick.gbPlaying")
        const newBrick = document.querySelector(`.grid-brick#gb${variation}`)
        const altID = oldBrickplaying?.id
        const neuID = newBrick?.id
        const doSwap = shallWeSwap(altID, neuID)
        if (altID == null && neuID === 'gb0') {
            console.log("quel est le con qui m'envoie ça ?", altID, neuID)
        }
        // console.log(source, 'SWAP from', altID, 'to', neuID, '?', doSwap ? "yes!" : "no!")
        if (doSwap) {
            // swap
            unplay_and_unselect()
            if (isPlaying) {
                newBrick.classList.add('gbPlaying', 'selected')
            } else {
                newBrick.classList.add('selected')
            }
            if (scrollToVariation) {
                selectAndScrollToVariation(source, variation, scrollOptions)
            }
        }
    }
}

const setBrickClickEvent = (_plyer) => {

    function handleBrickClick(event) {
        event.stopImmediatePropagation()

        setTimeout(() => {
            _plyer.muted = false
        }, 200)

        const isPlaying = _plyer.playing

        // DOM element has bar index in data
        const thisBar = parseInt(this.parentNode.dataset.bar)

        const thisVariation = this.parentNode.dataset.variation
        const selector = `.grid-brick#gb${thisVariation}`
        if (config.startBarOfLastSelectedVariation === thisBar) {
            // just toggle play state
            if (isPlaying) {
                _plyer.pause()
            } else {
                _plyer.play()
            }
            // deselect
            document.querySelector(selector)?.classList.remove('selected')
        } else {
            // immediate feedback
            document.querySelector(selector)?.classList.add('selected')
            document.querySelector('.grid-brick.gbPlaying')?.classList.add('goodbye')

            this.parentNode.classList.add('hello')

            // get bar data from timings
            let startBar = config.artistAndTimings.bars[thisBar]
            console.log(`CLICKED on bar ${thisBar} [${config.artistAndTimings.bars[thisBar]["Time Recorded"]}], variation ${config.artistAndTimings.bars[thisBar].variation}, variation starts at bar ${startBar.index}`, event)

            // seek to the duration
            _plyer.currentTime = startBar.duration.asMilliseconds() / 1000

            if (!isPlaying) {
                _plyer.play()
            }
        }

    }

    document.querySelectorAll(".brick.has-score .score").forEach((b) => {
        b.addEventListener('click', handleBrickClick, true)

        b.addEventListener("scrollend", (event) => {
            // console.log(b.scrollLeft)
            if (b.scrollLeft === 0 && !_plyer.playing) {
                const bar = parseInt(b.parentNode.dataset.bar)
                const theBar = config.artistAndTimings.bars[bar]
                console.log("scrollend: Dear plyr, I'd like you to seek at bar <", bar, ">, thanks.")
                _plyer.currentTime = theBar.duration.asMilliseconds() / 1000
            }

        }, true);
    })
}

export default function createPlayer(selector, ignore_all_events) {
    initialized = false
    return new Promise((resolve, reject) => {
        let _plyer = new plyr(selector, {
            origin: window.location.origin
        })
        config.plyrPlayer = _plyer

        const onReady = () => {
            let theStartingBar = config.artistAndTimings.bars[0]
            if (config.autoplay || typeof coerceVariation !== 'undefined') {
                const theLastStartingBarIndex = config.startBarOfLastSelectedVariation
                if (theLastStartingBarIndex != null) {
                    theStartingBar = config.artistAndTimings.bars[theLastStartingBarIndex]
                }
            }
            console.log("onReady: Dear plyr, I'd like you to seek at bar <", theStartingBar.index, "> (", theStartingBar["Time Recorded"], "), thanks.")
            _plyer.currentTime = theStartingBar.duration.asMilliseconds() / 1000
        }


        function INIT_EVENT_HANDLERS() {
            /*
            _plyer.on('volumechange', (event) => {
                console.log("Plyr volumechange event", event.detail.plyr.media.volume)
            })
            */
            _plyer.on('canplay', (event) => {
                console.log("Plyr canplay event", event.detail)
            })
            _plyer.on('canplaythrough', (event) => {
                console.log("Plyr canplaythrough event", event.detail)
            })
            // https://developers.google.com/youtube/iframe_api_reference#onStateChange
            _plyer.on('statechange', (event) => {
                console.log("Plyr statechange event", event.detail.code, event.detail.plyr.embed.playerInfo)

                if (event.detail.code === -1) {
                    const url = new URL(event.detail.plyr.embed.playerInfo.videoUrl)
                    const newSourceYT = url.searchParams.get('v')
                    if (sourceYT != newSourceYT) {
                        console.log('new sourceYT', sourceYT, '=>', newSourceYT)
                        sourceYT = newSourceYT
                        begin = true
                    }
                }
                if (event.detail.code === 3) {
                    console.log('buffering...')
                }
            })
            /*
            _plyer.on('waiting', (event) => {
                console.log("Plyr waiting event", event.detail)
            })
            _plyer.on('progress', (event) => {
                console.log("Plyr progress event", event.detail.plyr.buffered)
            })
            */

            _plyer.on('pause', (event) => {
                console.log("Plyr pause event")
                config.playing = false
                hidePlay('pause')
            })
            _plyer.on('ended', (event) => {
                console.log("Plyr ended event", event.detail.plyr.embed.playerInfo)
                config.playing = undefined
                config.startBarOfLastSelectedVariation = undefined
                hidePlay()
            })
            _plyer.on('playing', (event) => {
                console.log("Plyr playing event")
                config.playing = true
                showPlay(event.detail.plyr.currentTime)
                feedbackOnCurrentTime('playing', event.detail.plyr.currentTime, undefined /* save variation */, _plyer.playing, true, { behavior: "smooth", block: "nearest" })
            })
            _plyer.on('timeupdate', (event) => {
                // console.log("Plyr timeupdate event", event.detail.plyr.currentTime)
                if (!_plyer.playing) {
                    // console.log("Plyr timeupdate event: do nothing when not playing")
                } else {
                    // console.log("Plyr timeupdate event while plying")
                    feedbackOnCurrentTime('timeupdate', event.detail.plyr.currentTime, undefined /* save variation */, _plyer.playing, true, { behavior: "smooth", block: "nearest" })
                    const çaJoue = new Event('çaJoue');
                    document.dispatchEvent(çaJoue)
                }
            })
            _plyer.on('seeking', (event) => {
                console.log("Plyr seeking event")

                if (event.detail.plyr.elements.inputs.seek.value == 0) {
                    console.log("never do nothing when not seeking something else than 0 - comprenne qui pourra")
                    return
                }

                const seekTime = event.detail.plyr.media.duration * (event.detail.plyr.elements.inputs.seek.value / 100)
                feedbackOnCurrentTime('seeking', seekTime, true /* do not save variation */, _plyer.playing, true, { behavior: "instant", block: "center" })
            })
            _plyer.on('seeked', (event) => {
                console.log("Plyr seeked event", 'begin', begin, 'config.playing', config.playing, '_plyer.playing', _plyer.playing)
                if (begin) {
                    console.log('set begin to FALSE')
                    begin = false
                    if (config.autoplay) {
                        if (config.playing && !event.detail.plyr.playing) {
                            setTimeout(() => {
                                event.detail.plyr.pause()
                                event.detail.plyr.play()
                            }, 500)
                        }
                    }
                }
                feedbackOnCurrentTime('seeked', event.detail.plyr.currentTime, undefined /* save variation */, _plyer.playing, true, { behavior: "smooth", block: "center" })
            })
        }

        _plyer.on('ready', (event) => {
            console.log("Plyr ready event, initialized=", initialized)

            if (initialized) {
                console.log("Plyr ready event LIMITED to onReady, as initialized is true")
                onReady()
            } else {
                setBrickClickEvent(_plyer)

                if (!ignore_all_events) {
                    INIT_EVENT_HANDLERS()

                    onReady()
                } else {
                    _plyer.on('timeupdate', (event) => {
                        console.log("Plyr timeupdate event", event.detail.plyr.currentTime)
                    })
                }

                initialized = true

                resolve({
                    key: "PLAYER",
                    value: {
                    }
                })
            }
        })
    })
}