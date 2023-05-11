import animejs from '/lib/anime-3.2.1.es.min.js'
import config from "/js/config.js?v=0.13.3"
import codec from "/js/structure.js?v=0.13.3"
import { shuffleArray, generateElement } from "/js/utils.js?v=0.13.3"

const Ω = {
    animateUnveilScores: () => {
        function hasTouchSupport() {
            return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        }

        if (true /*hasTouchSupport()*/) {
            console.log("Mobile device detected");
            document.querySelectorAll('.score').forEach(id => {
                id.style.width = id.dataset.width
                id.classList.remove('init')
                id.style.visibility = 'inherit'
            })
        } else {
            console.log("Desktop device detected");

            const speed = 50 //  (1700/34)
            // https://css-tricks.com/why-using-reduce-to-sequentially-resolve-promises-works/
            function methodThatReturnsAPromise(id) {
                return new Promise((resolve) => {
                    id.classList.remove('init')
                    // console.log( 'id.dataset.width', id.dataset.width )
                    id.style.visibility = 'inherit'
                    id.style.width = 0
                    animejs({
                        targets: id,
                        width: `${id.dataset.width}px`,
                        duration: speed,
                        easing: 'linear',
                        complete: () => resolve(id)
                    });
                })
            }
            const result = Array.from(document.querySelectorAll('.score')).reduce((accumulatorPromise, nextID) => {
                return accumulatorPromise.then(() => {
                    return methodThatReturnsAPromise(nextID);
                });
            }, Promise.resolve());

            result.then(e => {
                console.log("'unveil scores' animation complete")
            });
        }
    },

    showScoreDisplay: function (iso) {
        const grid = document.getElementById('grid')
        if (!grid) return
        grid.dataset.scoreDisplay = config.scoreDisplay
        const theContainer = document.getElementById('theContainer')
        const theBody = document.getElementsByTagName('body')[0]
        if (config.scoreDisplay === 'firstBar') {
            if (!theBody.classList.contains('video-player')) {
                theContainer.classList.remove('container-fluid')
                theContainer.classList.add('container-xxl')
            }
            document.getElementById('theContainerCol').classList.remove('fullwidth')
            document.querySelectorAll('.grid-brick:not(.hasPerformer), .score').forEach(elem => elem.classList.remove('fullwidth'))
        } else if (config.scoreDisplay === 'fullScore') {
            if (!theBody.classList.contains('video-player')) {
                theContainer.classList.remove('container-xxl')
                theContainer.classList.add('container-fluid')
            }
            document.getElementById('theContainerCol').classList.add('fullwidth')
            document.querySelectorAll('.grid-brick:not(.hasPerformer), .score').forEach(elem => elem.classList.add('fullwidth'))
        }

        if (iso) iso.layout()
    },

    showScoreInBricks: function () {
        const grid = document.getElementById('grid')
        if (!grid) return
        grid.dataset.scoreInBricks = config.scoreInBricks
        if (config.scoreInBricks === 'allBricks') {
            document.getElementById('grid').classList.remove('selectedBrick')
        } else if (config.scoreInBricks === 'selectedBrick') {
            document.getElementById('grid').classList.add('selectedBrick')
        }
    },

    About: function () {
        this.about = false;
        const pos = [
            { left: '-111vw', top: '0' },
            { left: '+111vw', top: '0' },
            { left: '0', top: '+111vh' },
            { left: '0', top: '-111vh' },
        ]
        this.animations = []
        for (let i = 0; i < pos.length; i++) {
            for (let j = 0; j < pos.length; j++) {
                if (i != j) {
                    this.animations.push({ fore: pos[i], back: pos[j] })
                }
            }
        }
        function style(elem, set) {
            for (let key in set) {
                elem.style[key] = set[key]
            }
        }
        this.animations = shuffleArray(this.animations)
        this.a = 0;
        this.handleEsc = (event) => {
            if (event.key === 'Escape') {
                //if esc key was not pressed in combination with ctrl or alt or shift
                const isNotCombinedKey = !(event.ctrlKey || event.altKey || event.shiftKey);
                if (isNotCombinedKey) {
                    this.hideAbout()
                }
            }
        }
        this.currentlyShowing = undefined
        this.showAbout = async () => {
            this.about = true

            document.addEventListener('keydown', this.handleEsc);

            console.log('BEGIN show about')
            document.querySelector('#config-menu a#about > label').innerHTML = "&check; About"

            ;[...document.getElementsByTagName('body')].forEach(e => e.classList.add('about'))

            style(document.querySelector('div#logoLeft'), this.animations[this.a].fore)
            style(document.querySelector('div#logoRight'), this.animations[this.a].back)
            document.querySelector('div#logoLeft').style.display = 'inherit'
            document.querySelector('div#logoRight').style.display = 'inherit'

            window.requestAnimationFrame((chrono) => {
                this.currentlyShowing = animejs({
                    targets: ['div#logoLeft', 'div#logoRight'],
                    left: 0,
                    top: 0,
                    speed: 1800,
                    easing: 'easeInOutQuad',
                    complete: () => {
                        console.log('MIDDLE show about')
                        document.querySelector('header.header').style.display = 'flex'
                        document.querySelector('footer.footer').style.display = 'flex'
                        this.currentlyShowing = animejs({
                            targets: ['#theContainerCol', '#playerWrapper'],
                            opacity: 0,
                            speed: 600,
                            easing: 'linear',
                            complete: () => {
                                document.querySelectorAll('#theContainerCol, #playerWrapper').forEach(e => e.style.visibility = 'hidden')
                                this.a = (this.a + 1) % this.animations.length
                                this.currentlyShowing = undefined
                                console.log('FIN show about')
                            }
                        })
                    }
                })
            });
        }
        this.hideAbout = async () => {
            this.about = false
            if (this.currentlyShowing) this.currentlyShowing.remove('*')

            document.removeEventListener('keydown', this.handleEsc);

            console.log('BEGIN hide about')
            document.querySelector('#config-menu a#about > label').innerHTML = "About"

            document.querySelector('header.header').style.display = 'none'
            document.querySelector('footer.footer').style.display = 'none'

            window.requestAnimationFrame((chrono) => {
                document.querySelectorAll('#theContainerCol, #playerWrapper').forEach(e => e.style.visibility = 'visible')
                document.querySelectorAll('#theContainerCol, #playerWrapper').forEach(e => e.style.opacity = '1')
                animejs({
                    targets: ['#theContainerCol', '#playerWrapper'],
                    opacity: 1,
                    speed: 600,
                    easing: 'linear',
                    complete: e => {
                        console.log('back ok')
                    }
                })
                animejs({
                    targets: ['div#logoLeft'],
                    left: this.animations[this.a].fore.left,
                    top: this.animations[this.a].fore.top,
                    speed: 1800,
                    easing: 'easeInOutQuad',
                    complete: e => {
                        console.log('left ok')
                    }
                })
                animejs({
                    targets: ['div#logoRight'],
                    left: this.animations[this.a].back.left,
                    top: this.animations[this.a].back.top,
                    speed: 1800,
                    easing: 'easeInOutQuad',
                    complete: e => {
                        console.log('right ok')
                        document.querySelector('div#logoLeft').style.display = 'none'
                        document.querySelector('div#logoRight').style.display = 'none'

                        ;[...document.getElementsByTagName('body')].forEach(e => e.classList.remove('about'))

                        console.log('FIN hide about')
                    }
                })
            })
        }
        const _this = this
        document.querySelectorAll('a#about').forEach(e => e.addEventListener('click', e => {
            if (_this.about) {
                _this.hideAbout()
            } else {
                _this.showAbout()
            }
        }))
        document.querySelectorAll('#close-about').forEach(e => e.addEventListener('click', e => {
            _this.hideAbout()
        }))
    },

    setClickHandlers: (iso) => {
        const url = new URL(window.location)

        /*
        document.querySelectorAll('.gb-puzzle').forEach(e => e.addEventListener('click', e => {
            let a = e.currentTarget.dataset.a
            if (a === 'undefined') a = undefined
            const v = e.currentTarget.dataset.v
            if (a && v) {
                window.location = `/puzzle/puzzles.html?a=${a}&v=${v}`
            } else if (a) {
                window.location = `/puzzle/artists.html?a=${a}`
            } else if (v) {
                window.location = `/puzzle/artists.html?v=${v}`
            } else {
                window.location = '/puzzle/artists.html'
            }
        }))
        */
        document.querySelectorAll('a[data-name-no-space-lowercase-no-diacritics]').forEach((elem) => {
            const nameNoSpaceLowercaseNoDiacritics = elem.dataset.nameNoSpaceLowercaseNoDiacritics
            if (nameNoSpaceLowercaseNoDiacritics === '') {
                elem.setAttribute('href', url.pathname)
            } else {
                elem.setAttribute('href', `/video/${nameNoSpaceLowercaseNoDiacritics}.html`)
            }
        })

        document.querySelectorAll('#firstBarChecked, #fullScoreChecked').forEach((elem) => {
            elem.addEventListener('click', (e) => {
                const scoreDisplay = e.currentTarget.dataset.scoreDisplay
                config.scoreDisplay = scoreDisplay
                Ω.showScoreDisplay(iso)
            })
        })

        document.querySelectorAll('#allBricksChecked, #selectedBrickChecked').forEach((elem) => {
            elem.addEventListener('click', (e) => {
                const scoreInBricks = e.currentTarget.dataset.scoreInBricks
                config.scoreInBricks = scoreInBricks
                Ω.showScoreInBricks()
            })
        })

            ; (e => { if (e) e.addEventListener('click', () => config.autoplay = !config.autoplay) })(document?.getElementById('autoplayChecked'));
    },

    showArtist: (artist) => {
        const artistE = document.querySelector('.grid-brick.artist#gb-artist')
        if (!artistE) return

        const fullname = artist.fullname === "Christophe Thiebaud" ? "Moi" : artist.fullname;

        document.querySelector('head title').innerHTML = `Ciaccona - ${artist.fullname}`
        // document.querySelector('#loading #message').innerHTML = fullname
        artistE.style.visibility = 'inherit'
        artistE.querySelector('.fullname').innerHTML = fullname
        artistE.querySelector('a#youtube-url').setAttribute('href', artist['▶'].youtubeTrueUrl ? artist['▶'].youtubeTrueUrl : artist['▶'].youtubeUrl)
        artistE.querySelector('a#youtube-url').setAttribute('target', artist['▶'].id)
        artistE.querySelector('a#social').setAttribute('href', artist.social)
        artistE.querySelectorAll('a#puzzle').forEach(e => e.setAttribute('href', `artists.html?a=${e.dataset.a}`))
    },

    beforeCreatePlayer: (videoId) => {
        const thePlayerWrapper = document.querySelector('#playerWrapper')
        if (!thePlayerWrapper) return null

        const idPlayer = "thePlayer"

        document.querySelector('#loading').style.backgroundColor = '#00000080'

        const thePlayer = generateElement(`<div id="${idPlayer}" data-plyr-provider="youtube" data-plyr-embed-id="${videoId}">`)

        document.querySelector('#playerWrapper').appendChild(thePlayer)

        return '#' + idPlayer
    },

    afterIsotope: (iso) => {

        Ω.setClickHandlers(iso)

        document.querySelectorAll('.brick.hasScore .score').forEach(score => score.addEventListener('click', e => {
            const brick = e.currentTarget.parentNode
            const hadClass = brick.parentNode.classList.contains('selected')
            document.querySelectorAll('.grid-brick.selected .score').forEach(score => score.scrollLeft = 0)
            document.querySelectorAll('.grid-brick.selected').forEach(selected => selected.classList.remove('selected'))
            document.querySelectorAll('.grid-brick.goodbye').forEach(goodbye => goodbye.classList.remove('goodbye'))
            document.querySelectorAll('.grid-brick.hello').forEach(hello => hello.classList.remove('hello'))
            if (!hadClass) {
                brick.parentNode.classList.add('selected')
                const variation = brick.parentNode.dataset.variation
                const startBar = codec.variation2bar(variation)
                config.startBarOfLastSelectedVariation = startBar
            }
        }))

        document.querySelectorAll('.grid-brick .score').forEach(score => score.addEventListener("scroll", (event) => {

            const score = event.currentTarget;
            const obj = event.currentTarget.parentNode;
            if (score.scrollLeft <= 0) {
                score.style['border-radius'] = "0 3rem 3rem 0"
            } else if (obj.clientWidth <= score.scrollLeft + score.clientWidth) {
                score.style['border-radius'] = "3rem 0 0 3rem"
            } else {
                score.style['border-radius'] = "3rem 3rem 3rem 3rem"
            }
        }))
    }
}


export default Ω
