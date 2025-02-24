const ver = "1.0.4-beta.2"

class Coerce {
    #validFullnamesNospaceLowercaseNodiacritics = [
        '自分',

        'adelaideferriere',
        'adolfbusch',
        'amandinebeyer',
        'andreadevitis',
        'anneleenlenaerts',
        'arkadyleytush',
        'augustamckay',
        'aviavital',
        'ayahamada',
        'bellahristova',
        'borisbegelman',
        'charlottespruit',
        'chiaramassini',
        'christiantetzlaff',
        'christopherahn',
        'christophethiebaud',
        'clara-jumikang',
        'claudioconstantini',
        'dominikwagner',
        'fernandocordella',
        'florentinginot',
        'genzohtakehisa',
        'gustavleonhardt',
        'hilaryhahn',
        'isabellefaust',
        'jeannelamon',
        'jeanrondeau',
        'ksenijakomljenovic',
        'laurinephelut',
        'lisajacobs',
        'lizaferschtman',
        'marieleonhardt',
        'martafemenia',
        'martinbaker',
        'mayakimura',
        'michaelleontchik',
        'midorigoto',
        'miguelrincon',
        'mikastoltzman',
        'moranwasser',
        'nemanjaradulovic',
        'paolatalamini',
        'patriciakopatchinskaja',
        'petrapolackova',
        'polinaosetinskaya',
        'rachellellenwong',
        'rachelpodger',
        'raphaellasmits',
        'shunsukesato',
        /* 'sigiswaldkuijken', */ // youtube account terminated
        'theoould',
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
            this.#coerceArtist = '自分'
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

document.onvisibilitychange = function () {
    if (document.visibilityState === 'hidden') {
        document.getElementsByTagName('body')[0].style.opacity = "1"
    }
};