const validFullamesNoSpaceLowercaseNoDiacritics = [
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
const ver = "v2.1.0"
const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop)
})
let fullameNoSpaceLowercaseNoDiacritics = params.a ?? undefined
let variationParam = params.v ? parseInt(params.v) : undefined
let no_plyr_event = params.no_plyr_event ?? undefined
let test = params.test ?? undefined
let coerceArtist = params.a ?? undefined
let coerceVariation = undefined
try {
    if (typeof params.v !== 'undefined' && params.v !== null) {
        coerceVariation = parseInt(params.v)
        if (isNaN(coerceVariation)) {
            coerceVariation = undefined
        }
        console.log(`query string parameter v='${params.v}' converted to global variable coerceVariation=${coerceVariation}`)
    }
} catch (error) {
    console.log(`query string parameter v is not a number: v=${params.v}`)
    coerceVariation = undefined
}
let pane = params.p ?? undefined
let shuffle = params.shuffle ?? undefined
if (typeof shuffle !== 'undefined' && (shuffle === 'false' || shuffle === '0' || !shuffle)) {
    shuffle = false
} else {
    shuffle = true
}

if (typeof fullameNoSpaceLowercaseNoDiacritics !== 'undefined') {
    if (!validFullamesNoSpaceLowercaseNoDiacritics.includes(fullameNoSpaceLowercaseNoDiacritics)) {
        console.log(`invalid fullameNoSpaceLowercaseNoDiacritics: ${fullameNoSpaceLowercaseNoDiacritics}`)
        fullameNoSpaceLowercaseNoDiacritics = undefined
    } else if (fullameNoSpaceLowercaseNoDiacritics === 'christophethiebaud') {
        fullameNoSpaceLowercaseNoDiacritics = 'moi'
    }
}

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
