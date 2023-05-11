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
const ver = "v0.13.3"
const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop)
})
let fullameNoSpaceLowercaseNoDiacritics = params.a ?? undefined
let variationParam = params.v ? parseInt(params.v) : undefined
let no_plyr_event = params.no_plyr_event ?? undefined
let test = params.test ?? undefined
let coerceArtist = params.a ?? undefined
let coerceVariation = params.v ?? undefined
let shuffle = params.shuffle ?? undefined
if (typeof shuffle !== 'undefined' && (shuffle === 'false' || shuffle === '0' || !shuffle)) {
    shuffle = false
} else {
    shuffle = true
}

if (!validFullamesNoSpaceLowercaseNoDiacritics.includes(fullameNoSpaceLowercaseNoDiacritics)) {
    console.log(`invalid name: ${fullameNoSpaceLowercaseNoDiacritics}`)
    fullameNoSpaceLowercaseNoDiacritics = undefined
} else if (fullameNoSpaceLowercaseNoDiacritics === 'christophethiebaud') {
    fullameNoSpaceLowercaseNoDiacritics = 'moi'
}

// transform packery event into promise
const readyToIsotope = new Promise((resolve) => {
    window.addEventListener('readyToIsotope', (event) => {
        console.log("... heard readyToIsotope event");
        resolve(event)
    }, { once: true })
})

// transform packery event into promise
const readyToPack = new Promise((resolve) => {
    window.addEventListener('readyToPack', (event) => {
        console.log("... heard readyToPack event");
        resolve(event)
    }, { once: true })
})        
