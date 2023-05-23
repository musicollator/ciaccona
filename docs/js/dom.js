import animejs from '/lib/anime-3.2.1.es.min.js'
import config from "/js/config.js?v=2.2.22"
import { shuffleArray, generateElement } from "/js/utils.js?v=2.2.22"
import brickClickHandler from "/js/brickClickHandler.js?v=2.2.22"

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
        this.visibilities = {}
        this.showAbout = async () => {
            this.about = true

            document.addEventListener('keydown', this.handleEsc);

            console.log('BEGIN show about')
            document.querySelector('#config-menu a#about > label').innerHTML = "&check; About"

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
                            targets: ['#theContainerCol', '#playerWrapper', '#theOffcanvas'],
                            opacity: 0,
                            speed: 600,
                            easing: 'linear',
                            complete: () => {
                                document.querySelectorAll('#theContainerCol, #playerWrapper', '#theOffcanvas').forEach(e => {
                                    this.visibilities[e.id] = e.style.visibility
                                    e.style.visibility = 'hidden'
                                })
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
                document.querySelectorAll('#theContainerCol, #playerWrapper', '#theOffcanvas').forEach(e => {
                    e.style.visibility = this.visibilities[e.id]
                })
                animejs({
                    targets: ['#theContainerCol', '#playerWrapper', '#theOffcanvas'],
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

                        // ;[...document.getElementsByTagName('body')].forEach(e => e.classList.remove('about'))

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

        document.querySelectorAll('a[data-name-no-space-lowercase-no-diacritics]').forEach((elem) => {
            const nameNoSpaceLowercaseNoDiacritics = elem.dataset.nameNoSpaceLowercaseNoDiacritics
            if (nameNoSpaceLowercaseNoDiacritics === '') {
                elem.setAttribute('href', url.pathname)
            } else {
                elem.setAttribute('href', `/video/${nameNoSpaceLowercaseNoDiacritics}.html`)
            }
        })

        document.querySelectorAll('#firstBarRadioButton, #fullScoreRadioButton').forEach((elem) => {
            elem.addEventListener('click', (e) => {
                const scoreDisplay = e.currentTarget.dataset.scoreDisplay
                config.scoreDisplay = scoreDisplay
                Ω.showScoreDisplay(iso)
            })
        })

        document.querySelectorAll('#allBricksRadioButton, #selectedBrickRadioButton').forEach((elem) => {
            elem.addEventListener('click', (e) => {
                const scoreInBricks = e.currentTarget.dataset.scoreInBricks
                config.scoreInBricks = scoreInBricks
                Ω.showScoreInBricks()
            })
        })

            ; (e => { if (e) e.addEventListener('click', () => config.autoplay = !config.autoplay) })(document?.getElementById('autoplayChecked'));
    },

    showArtist: (artist) => {
        const badgeArtist = document.querySelector('.artist#badge-artist')
        if (!badgeArtist) return

        badgeArtist.style.visibility = "visible"

        const fullname = artist.fullname === "Christophe Thiebaud" ? "Moi" : artist.fullname;

        document.querySelector('head title').innerHTML = `Ciaccona - ${artist.fullname}`

        badgeArtist.style.visibility = 'inherit'
        badgeArtist.querySelector('.fullname').innerHTML = fullname
        badgeArtist.querySelector('a#youtube-url').setAttribute('href', artist['▶'].youtubeTrueUrl ? artist['▶'].youtubeTrueUrl : artist['▶'].youtubeUrl)
        badgeArtist.querySelector('a#youtube-url').setAttribute('target', artist['▶'].id)
        badgeArtist.querySelector('a#social').setAttribute('href', artist.social)

    },

    beforeCreatePlayer: (videoId) => {
        const thePlayerWrapper = document.querySelector('#playerWrapper')
        if (!thePlayerWrapper) throw new Error('no element at selector [ #playerWrapper ]')

        const idPlayer = "thePlayer"

        document.querySelector('#loading').style.backgroundColor = '#00000080'

        const thePlayer = generateElement(`<div id="${idPlayer}" data-plyr-provider="youtube" data-plyr-embed-id="${videoId}">`)

        thePlayerWrapper.appendChild(thePlayer)

        return '#' + idPlayer
    },

    afterIsotope: (iso) => {

        Ω.setClickHandlers(iso)

        document.querySelectorAll('.brick.has-score').forEach(brick => brick.addEventListener('click', brickClickHandler, true))

        /*
        document.querySelectorAll('.grid-brick .brick .score').forEach(score => score.addEventListener("scroll", (event) => {

            const score = event.currentTarget;
            const obj = event.currentTarget.parentNode;
            if (score.scrollLeft <= 0) {
                score.style['border-radius'] = "0 3rem 3rem 0"
            }  else {
                score.style['border-radius'] = "3rem 3rem 3rem 3rem"
            }
        }))
        */

        // https://developer.mozilla.org/en-US/docs/Web/API/Resize_Observer_API
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                iso.layout()
            }
        });
        resizeObserver.observe(document.querySelector('#grid'));

    },
    setPuzzleClickHandlers: () => {
        /*
        const offcanvasElementList = document.querySelectorAll('.offcanvas')
        const offcanvasList = [...offcanvasElementList].map(offcanvasEl => new bootstrap.Offcanvas(offcanvasEl))
        */
        if (typeof config.offcanvasElementBootstrapped === 'undefined') config.offcanvasElementBootstrapped = new bootstrap.Offcanvas(document.getElementById('theOffcanvas')) 

        document.querySelectorAll('.brick.has-score .select-variation').forEach(element => element.addEventListener('click', (event) => {
            event.preventDefault()
            event.stopPropagation()
            coerce.color = {
                candidate: element.dataset.variation,
                clazz: element.dataset.clazz,
                tonality: element.dataset.tonality,
            }
            config.offcanvasElementBootstrapped.show()
        }))

    }
}


export default Ω
