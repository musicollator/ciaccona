const ver = "v2.2.20"

class Coerce {
    #validFullamesNoSpaceLowercaseNoDiacritics = [
        'moi',

        'adolfbusch',
        'amandinebeyer',
        'andreadevitis',
        'anneleenlenaerts',
        'bellahristova',
        'chiaramassini',
        'christiantetzlaff',
        'christophethiebaud',
        'clara-jumikang',
        'florentinginot',
        'genzohtakehisa',
        'hilaryhahn',
        'isabellefaust',
        'jeannelamon',
        'juliafischer',
        'ksenijakomljenovic',
        'lisajacobs',
        'lizaferschtman',
        'martafemenia',
        'martinbaker',
        'michaelleontchik',
        'midorigoto',
        'miguelrincon',
        'mikastoltzman',
        'moranwasser',
        'petrapolackova',
        'polinaosetinskaya',
        'rachellellenwong',
        'rachelpodger',
        'raphaellasmits',
        'sigiswaldkuijken',
        'veronikaeberle',
        'veroniquederaedemaeker',
        'virginierobilliard',
        'vonhansen',
        'yunpark',
    ]
    #coerceVariation
    #startBarOfLastSelectedVariation
    #coerceArtist
    #shuffle

    no_plyr_event
    pane
    debug

    constructor(params) {
        this.variation = params.v ?? undefined
        this.fullameNoSpaceLowercaseNoDiacritics = params.a ?? undefined

        this.no_plyr_event = params.no_plyr_event ?? undefined
        this.pane = params.p ?? undefined
        this.shuffle = params.shuffle ?? undefined
        this.debug = params.d ?? undefined
    }

    //
    get fullameNoSpaceLowercaseNoDiacritics() {
        return this.#coerceArtist
    }
    set fullameNoSpaceLowercaseNoDiacritics(fullameNoSpaceLowercaseNoDiacritics) {
        if (typeof fullameNoSpaceLowercaseNoDiacritics !== 'undefined') {
            if (!this.#validFullamesNoSpaceLowercaseNoDiacritics.includes(fullameNoSpaceLowercaseNoDiacritics)) {
                console.log(`invalid fullameNoSpaceLowercaseNoDiacritics: ${fullameNoSpaceLowercaseNoDiacritics}`)
                this.#coerceArtist = undefined
            } else if (fullameNoSpaceLowercaseNoDiacritics === 'christophethiebaud') {
                this.#coerceArtist = 'moi'
            } else {
                this.#coerceArtist = fullameNoSpaceLowercaseNoDiacritics
            }
        }
    }

    // 
    get variation() {
        return this.#coerceVariation
    }
    set variation(variation) {
        try {
            if (typeof variation === 'undefined' || variation === null) {
                this.#coerceVariation = undefined
            } else if (typeof variation === 'number') {
                this.#coerceVariation = variation
            } else {
                const qwe = parseInt(variation)
                if (isNaN(qwe)) {
                    this.#coerceVariation = undefined
                } else {
                    this.#coerceVariation = qwe
                }
            }
            console.log(`coerceVariation=${this.#coerceVariation} (from variation=${variation})`)
        } catch (error) {
            this.#coerceVariation = undefined
            console.log(` ... ERROR from variation=${variation} to coerceVariation=${this.#coerceVariation}`)
        }
        ; (badgeVariation => {
            if (!badgeVariation) return
            if (typeof this.#coerceVariation === 'undefined') {
                badgeVariation.innerHTML = ''
                badgeVariation.style.visibility = 'hidden'
            } else {
                badgeVariation.innerHTML = this.#coerceVariation
                badgeVariation.style.visibility = 'visible'
            }
        })(document.getElementById('badge-variation'));
    }

    //
    get shuffle() {
        return this.#shuffle
    }
    set shuffle(shuffle) {
        if (typeof shuffle !== 'undefined' && (shuffle === 'false' || shuffle === '0' || !shuffle)) {
            this.#shuffle = false
        } else {
            this.#shuffle = true
        }
    }
}

const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop)
})
const coerce = new Coerce(params)

// transform packery event into promise
const readyToIsotope = new Promise((resolve) => {
    window.addEventListener('readyToIsotope', (event) => {
        console.log("... heard readyToIsotope event");
        resolve(event)
    })
})

