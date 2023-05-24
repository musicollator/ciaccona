import config from "/js/config.js?v=1.0.1-alpha.1"
import createTimings from "/js/timings.js?v=1.0.1-alpha.1"
import createPlayer from "/js/player.js?v=1.0.1-alpha.1"
import Ω from "/js/dom.js?v=1.0.1-alpha.1"

function regardeDeTousTesYeux() {
    (badgeArtistEyeElement => {
        if (!badgeArtistEyeElement) return;

        badgeArtistEyeElement.addEventListener('click', (event) => {
            event.stopPropagation()
            event.preventDefault()
            const isPlayerVisible = togglePlayer()            
        })
    })(document.querySelector('.artist#badge-artist #eye'))
}

function togglePlayer() {
    if (!config.plyrPlayer) return
    return (playerWrapper => {
        if (!playerWrapper) return undefined;
        if (playerWrapper.style.visibility === 'visible') {
            hidePlayer()
            return false
        } else {
            showPlayer()
            return true
        }
    })(document.getElementById('playerWrapper'))
}

function showPlayer() {
    if (!config.plyrPlayer) return
    [...document.getElementsByTagName('body')].forEach(e => {
        e.classList.add('video-player')
    });
    (playerWrapper => {
        if (!playerWrapper) return undefined;
        playerWrapper.style.visibility = 'visible'
    })(document.getElementById('playerWrapper'));
    (theContainer => {
        if (!theContainer) return
        theContainer.classList.remove('container-xxl')
        theContainer.classList.add('container-fluid')
    })(document.getElementById('theContainer'));
    (badgeArtistEyeElement => {
        if (!badgeArtistEyeElement) return;
        badgeArtistEyeElement.classList.remove('icon-eye_open')
        badgeArtistEyeElement.classList.add('icon-eye_close')
    })(document.querySelector('.artist#badge-artist #eye'));
    (theContainerCol => {
        if (!theContainerCol) return;
        theContainerCol.classList.add('push2right')
    })(document.getElementById('theContainerCol'));
}

function hidePlayer() {
    if (!config.plyrPlayer) return
    [...document.getElementsByTagName('body')].forEach(e => {
        e.classList.remove('video-player')
    });
    (playerWrapper => {
        if (!playerWrapper) return undefined;
        playerWrapper.style.visibility = 'hidden'
    })(document.getElementById('playerWrapper'));
    (theContainer => {
        if (!theContainer) return
        theContainer.classList.remove('container-fluid')
        theContainer.classList.add('container-xxl')
    })(document.getElementById('theContainer'));
    (badgeArtistEyeElement => {
        if (!badgeArtistEyeElement) return;
        badgeArtistEyeElement.classList.remove('icon-eye_close')
        badgeArtistEyeElement.classList.add('icon-eye_open')
    })(document.querySelector('.artist#badge-artist #eye'));
    (theContainerCol => {
        if (!theContainerCol) return;
        theContainerCol.classList.remove('push2right')
    })(document.getElementById('theContainerCol'));
}

async function createPlayerSingleton(artistObject, no_plyr_event) {

    if (config.plyrPlayer) {

        return new Promise((resolve, reject) => {

            // https://github.com/sampotts/plyr#the-source-setter
            createTimings(artistObject).then((artistAndTimings) => {
                Ω.showArtist(artistAndTimings)
                // console.log('ABOUT TO CHANGE VIDEO', artist['▶'].youtubeUrl)
                if (typeof config?.plyrPlayer?.source !== 'undefined' &&
                    !config.plyrPlayer.source.includes(artistAndTimings['▶'].id)) {
                    config.plyrPlayer.source = {
                        type: 'video',
                        sources: [
                            {
                                src: artistAndTimings['▶'].youtubeUrl,
                                provider: 'youtube',
                            },
                        ],
                    };
                }
                resolve({
                    key: "PLAYER",
                    value: artistAndTimings,
                })

            }).catch((error) => {
                console.error(error);
                document.getElementById('theContainerCol').classList.remove('push2right')
                reject(error)
            })
        })

    }

    return new Promise((resolve, reject) => {

        createTimings(artistObject).then((artistAndTimings) => {

            // we have more info bout the artist
            Ω.showArtist(artistAndTimings)

            // big buffer of everything that needs to be done BEFORE creating the player
            const selectorPlyr = Ω.beforeCreatePlayer(artistAndTimings['▶'].id)

            // go create
            createPlayer(selectorPlyr, no_plyr_event).then(result => {
                result.value = artistAndTimings
                regardeDeTousTesYeux()
                resolve(result)
            }).catch((error) => {
                console.error(error);
                throw error
            })

        }).catch((error) => {
            console.error(error);
            document.getElementById('theContainerCol').classList.remove('push2right')
            reject(error)
        })
    })
}

export { createPlayerSingleton, showPlayer, hidePlayer, togglePlayer }