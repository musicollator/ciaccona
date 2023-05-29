const ver = "1.0.1-alpha.5"

class Coerce {
    #validFullnamesNospaceLowercaseNodiacritics = [
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
        'gustavleonhardt',
        'hilaryhahn',
        'isabellefaust',
        'jeannelamon',
        'jeanrondeau',
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
        'shunsukesato',
        'sigiswaldkuijken',
        'veronikaeberle',
        'veroniquederaedemaeker',
        'virginierobilliard',
        'vonhansen',
        'yunpark',
    ]
    #coerceVariation
    #coerceVariationPrevious
    #coerceArtist
    #shuffle
    #variationListener

    wip
    pane
    debug

    constructor(params) {
        this.variation = params.v ?? undefined

        this.fullnameNospaceLowercaseNodiacritics = params.a ?? undefined

        this.wip = params.wip ?? undefined
        this.pane = params.p ?? undefined
        this.shuffle = params.shuffle ?? undefined
        this.debug = params.d ?? undefined
    }

    //
    validateFullameNospaceLowercaseNodiacritics(fnnslcnd) {
        return this.#validFullnamesNospaceLowercaseNodiacritics.includes(fnnslcnd)
    }
    get fullnameNospaceLowercaseNodiacritics() {
        return this.#coerceArtist
    }
    set fullnameNospaceLowercaseNodiacritics(fullnameNospaceLowercaseNodiacritics) {
        if (typeof fullnameNospaceLowercaseNodiacritics === 'undefined' ||
            fullnameNospaceLowercaseNodiacritics == null ||
            fullnameNospaceLowercaseNodiacritics === 0 ||
            fullnameNospaceLowercaseNodiacritics === '') {
            this.#coerceArtist = undefined
            return
        }

        if (!this.validateFullameNospaceLowercaseNodiacritics(fullnameNospaceLowercaseNodiacritics)) {
            console.log(`invalid fullnameNospaceLowercaseNodiacritics: ${fullnameNospaceLowercaseNodiacritics}`)
            this.#coerceArtist = undefined
        } else if (fullnameNospaceLowercaseNodiacritics === 'christophethiebaud') {
            this.#coerceArtist = 'moi'
        } else {
            this.#coerceArtist = fullnameNospaceLowercaseNodiacritics
        }

    }

    // 
    get variation() {
        return this.#coerceVariation
    }
    set variation(variation) {
        try {
            let candidateVariation
            if (typeof variation === 'undefined' || variation === null) {
                candidateVariation = undefined
            } else if (typeof variation === 'number') {
                candidateVariation = variation
            } else {
                candidateVariation = parseInt(variation)
                if (isNaN(candidateVariation)) {
                    candidateVariation = undefined
                }
            }
            if (this.#variationListener) {
                this.#variationListener(candidateVariation, this.#coerceVariation)
            }
            if (this.#coerceVariation !== candidateVariation) {
                this.#coerceVariationPrevious = this.#coerceVariation
                this.#coerceVariation = candidateVariation
                if (typeof this.#coerceVariation !== 'undefined') {
                    this.#coerceVariationPrevious = undefined
                }
                console.log(`coerceVariation /${this.#coerceVariation}/ (from parameter /${variation}/) coerceVariationPrevious is now /${this.#coerceVariationPrevious}/`)
            }
        } catch (error) {
            console.log(`Trying to set variation to /${variation}/ -> ERROR /${error}/! coerceVariation /${this.#coerceVariation}/ left unchanged`)
        }
    }
    variationUndo = () => {
        this.variation = this.#coerceVariationPrevious
    }
    get variationListener() {
        return this.#variationListener
    }

    set variationListener(variationListener) {
        this.#variationListener = variationListener
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
        console.log("... heard readyToIsotope event, about to resolve readyToIsotope promise ...");
        resolve(event)
    }, { once: true })
})

