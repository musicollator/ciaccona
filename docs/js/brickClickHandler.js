import config from "/js/config.js?v=2.2.2"

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

            // get bar data from timings
            let startBar = config.artistAndTimings.bars[thisBar]
            console.log(`CLICKED on bar ${thisBar} [${config.artistAndTimings.bars[thisBar]["Time Recorded"]}], variation ${config.artistAndTimings.bars[thisBar].variation} === ${thisVariation}, variation starts at bar ${startBar.index}`, event)

            // seek to the duration
            config.plyrPlayer.currentTime = startBar.duration.asMilliseconds() / 1000

            if (!isPlaying) {
                config.plyrPlayer.play()
            }
        }

    }
}

/*

function handleScoreClick(event) {
    event.stopImmediatePropagation()

    setTimeout(() => {
        _plyer.muted = false
    }, 200)

    const isPlaying = _plyer.playing

    // DOM element has bar index in data
    const thisBar = parseInt(this.parentNode.dataset.bar)

    coerce.variation = this.parentNode.dataset.variation
    const selector = `.grid-brick#gb${coerce.variation}`
    const thisOneIsPlaying = document.querySelector(selector)?.classList.contains('gbPlaying')
    const thisOneIsSelected = document.querySelector(selector)?.classList.contains('selected')
    if (isPlaying && thisOneIsPlaying) {
        _plyer.pause()
        document.querySelector(selector)?.classList.remove('gbPlaying')
    } else if (!isPlaying && thisOneIsSelected) {
        _plyer.play()
        document.querySelector(selector)?.classList.add('gbPlaying')
    } else {
        // immediate feedback
        document.querySelector(selector)?.classList.add('selected')
        document.querySelector('.grid-brick.gbPlaying')?.classList.add('goodbye')

        this.parentNode.classList.add('hello')

        // get bar data from timings
        let startBar = config.artistAndTimings.bars[thisBar]
        console.log(`CLICKED on bar ${thisBar} [${config.artistAndTimings.bars[thisBar]["Time Recorded"]}], variation ${config.artistAndTimings.bars[thisBar].variation} === ${coerce.variation}, variation starts at bar ${startBar.index}`, event)

        // seek to the duration
        _plyer.currentTime = startBar.duration.asMilliseconds() / 1000

        if (!isPlaying) {
            _plyer.play()
        }
    }
}
e => {
    e.preventDefault()
    e.stopPropagation()
    let brick = e.currentTarget
    if (brick.classList.contains('score')) {
        brick = e.currentTarget.parentNode
    }
    const hadClass = brick.parentNode.classList.contains('selected')
    const wasVisible = brick.parentNode.style.visibility === "visible"
    document.querySelectorAll('.grid-brick.selected .score').forEach(score => score.scrollLeft = 0)
    document.querySelectorAll('.grid-brick.selected').forEach(selected => selected.classList.remove('selected'))
    document.querySelectorAll('.grid-brick.goodbye').forEach(goodbye => goodbye.classList.remove('goodbye'))
    document.querySelectorAll('.grid-brick.hello').forEach(hello => hello.classList.remove('hello'))
    if (!wasVisible) { 
        brick.parentNode.style.visibility = "visible"
        // brick.parentNode.classList.add('selected')
    }
}

*/