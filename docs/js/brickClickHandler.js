import config from "/js/config.js?v=1.0.4-beta.2"

export default function brickClickHandler(event) {
    const selectingVariation = event.target.closest('.select-variation')
    if (selectingVariation) {
        return
    }

    const thisBrick = event.target.closest('.brick')
    const thisBar = parseInt(thisBrick.dataset.bar)
    const thisVariation = parseInt(thisBrick.dataset.variation)
    const thisGridBrick = thisBrick.parentNode
    const thisGridBrickWasPlaying = thisGridBrick.classList.contains('gbPlaying')
    const thisGridBrickWasSelected = thisGridBrick.classList.contains('selected')

    // console.log('id', thisBrick.id, 'bar', thisBar, 'variation', thisVariation, 'player', config.plyrPlayer)

    document.querySelectorAll('.grid-brick.selected .score').forEach(score => score.scrollLeft = 0)
    document.querySelectorAll('.grid-brick.selected').forEach(selected => selected.classList.remove('selected'))
    document.querySelectorAll('.grid-brick.goodbye').forEach(goodbye => goodbye.classList.remove('goodbye'))
    document.querySelectorAll('.grid-brick.hello').forEach(hello => hello.classList.remove('hello'))

    if (!thisGridBrickWasSelected) {
        thisGridBrick.classList.add('selected')
    }

    if (typeof config.plyrPlayer !== 'undefined') {

        const isPlaying = config.plyrPlayer.playing

        setTimeout(() => {
            config.plyrPlayer.muted = false
        }, 200)

        if (isPlaying && thisGridBrickWasPlaying) { 
            config.plyrPlayer.pause()
            thisGridBrick.classList.remove('gbPlaying')
        } else if (!isPlaying && thisGridBrickWasSelected) {
            config.plyrPlayer.play()
            thisGridBrick.classList.add('gbPlaying')
        } else {
            // immediate feedback
            thisGridBrick.classList.add('selected')
            thisGridBrick.classList.add('hello')
            document.querySelector('.grid-brick.gbPlaying')?.classList.add('goodbye')

            if (config.artistAndTimings.hasBars) {
                // get bar data from timings
                let startBar = config.artistAndTimings.bars[thisBar]
                console.log(`CLICKED on bar ${thisBar} [${config.artistAndTimings.bars[thisBar].duration.asMilliseconds() / 1000}], variation ${config.artistAndTimings.bars[thisBar].variation} === ${thisVariation}, variation starts at bar ${startBar.index}`, event)

                // seek to the duration
                config.plyrPlayer.currentTime = startBar.duration.asMilliseconds() / 1000

                if (!isPlaying) {
                    setTimeout(() => {
                        config.plyrPlayer.pause()
                        config.plyrPlayer.play()
                    }, 500)
                }
            }
        }

    }
}
