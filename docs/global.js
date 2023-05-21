const ver = "v2.1.8"

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
            if (typeof variation !== 'undefined' && variation !== null) {
                this.#coerceVariation = parseInt(variation)
                if (isNaN(this.#coerceVariation)) {
                    this.#coerceVariation = undefined
                }
            } else {
                this.#coerceVariation = undefined
            }
            console.log(`global variable coerceVariation=${this.#coerceVariation}`)
        } catch (error) {
            console.log(`query string parameter v is not a number: v=${params.v}`)
            this.#coerceVariation = undefined
        }
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

// transform packery event into promise
const readyToPack = new Promise((resolve) => {
    window.addEventListener('readyToPack', (event) => {
        console.log("... heard readyToPack event");
        resolve(event)
    })
})        
