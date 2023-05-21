import config from "/js/config.js?v=2.1.2"
import createTimings from "/js/timings.js?v=2.1.2"
import createPlayer from "/js/player.js?v=2.1.2"
import Ω from "/js/dom.js?v=2.1.2"


function togglePlayer() {
    if (!config.plyrPlayer) return
    (playerWrapper => {
        if (!playerWrapper) return
        if (playerWrapper.style.visibility === 'visible') {
            hidePlayer()
        } else {
            showPlayer()
        }
    })(document.getElementById('playerWrapper'))
}

function showPlayer() {
    if (!config.plyrPlayer) return
    document.getElementById('playerWrapper').style.visibility = 'visible'
    {
        [...document.getElementsByTagName('body')].forEach(e => {
            e.classList.add('video-player')
        });
    }
    (theContainer => {
        if (!theContainer) return
        theContainer.classList.remove('container-xxl')
        theContainer.classList.add('container-fluid')

    })(document.getElementById('theContainer'))

    const theContainerCol = document.getElementById('theContainerCol')
    if (theContainerCol) theContainerCol.classList.add('push2right')
}

function hidePlayer() {
    if (!config.plyrPlayer) return
    document.getElementById('playerWrapper').style.visibility = 'hidden'
    {
        [...document.getElementsByTagName('body')].forEach(e => {
            e.classList.remove('video-player')
        });
    }
    (theContainer => {
        if (!theContainer) return
        theContainer.classList.remove('container-fluid')
        theContainer.classList.add('container-xxl')
    })(document.getElementById('theContainer'))

    const theContainerCol = document.getElementById('theContainerCol')
    if (theContainerCol) theContainerCol.classList.remove('push2right')
}

async function createPlayerSingleton(fullameNoSpaceLowercaseNoDiacritics, no_plyr_event) {

    if (config.plyrPlayer) {

        return new Promise((resolve, reject) => {

            // https://github.com/sampotts/plyr#the-source-setter
            createTimings(fullameNoSpaceLowercaseNoDiacritics).then((artistAndTimings) => {
                Ω.showArtist(artistAndTimings)
                // console.log('ABOUT TO CHANGE VIDEO', artist['▶'].youtubeUrl)
                config.plyrPlayer.source = {
                    type: 'video',
                    sources: [
                        {
                            src: artistAndTimings['▶'].youtubeUrl,
                            provider: 'youtube',
                        },
                    ],
                };
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
        if (!fullameNoSpaceLowercaseNoDiacritics) {
            reject(`fullameNoSpaceLowercaseNoDiacritics='${fullameNoSpaceLowercaseNoDiacritics}' not good`)
        }

        createTimings(fullameNoSpaceLowercaseNoDiacritics).then((artistAndTimings) => {

            // we have more info bout the artist
            Ω.showArtist(artistAndTimings)

            // big buffer of everything that needs to be done BEFORE creating the player
            const selectorPlyr = Ω.beforeCreatePlayer(artistAndTimings['▶'].id)

            // go create
            createPlayer(selectorPlyr, no_plyr_event).then(result => {
                result.value = artistAndTimings
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