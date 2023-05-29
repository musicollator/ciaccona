import jsYaml from 'https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/+esm'
import lodashMerge from 'https://cdn.jsdelivr.net/npm/lodash.merge@4.6.2/+esm'
import moment from 'https://cdn.jsdelivr.net/npm/moment@2.29.4/+esm'

const theDayWhenIReadTheVideoMeters = moment('2023-05-15T00:00:00Z')
class Artist {
    constructor(a) {
        lodashMerge(this, a)

        // https://stackoverflow.com/a/32906951/1070215
        this.fullname = [a.firstname, a.lastname].filter(Boolean).join(' ');
        this.fullnameNospace = this.fullname.replace(/\s/gi, '')
        // https://stackoverflow.com/a/37511463/1070215
        this.fullnameNospaceLowercaseNodiacritics = this.fullnameNospace.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, '')

        this.thisUrl = `/video/${this.fullnameNospaceLowercaseNodiacritics}.html`
        this.social = `https://www.facebook.com/sharer/sharer.php?u=https://ciaccona.cthiebaud.com${this.thisUrl}`
        if (this.facebookPost && this.facebookPost.url) {
            this.social = this.facebookPost.url
        }
        if (!this.instrument) this.instrument = 'unkown'

        const vid = this['▶']
        vid.youtubeUrl = `https://youtu.be/${vid.id}`
        if (vid.trueId) vid.youtubeTrueUrl = `https://youtu.be/${vid.trueId}`
        vid.timingsUrl = `/timings/${this.fullnameNospace}-${vid.id}.js`

        const videoIdNoHyphen = vid.id.replace(/-/gi, '_')
        const videoIdNoHyphenNoStartingNumber = videoIdNoHyphen.replace(/^(\d.*)/i, '_$1')
        vid.javascriptizedId = videoIdNoHyphenNoStartingNumber

        if (true) { // calc viewsPerMonth ?
            vid.publishedMoment = moment(vid.published)
            let collected = theDayWhenIReadTheVideoMeters
            if (vid.collected) {
                collected = moment(vid.collected)
            }
            vid.duration = collected.diff(vid.publishedMoment)
            vid.durationMoment = moment.duration(vid.duration)
            vid.viewsPerMonth = Math.floor(vid.views / vid.durationMoment.asMonths())
        }
    }
}

class Artists {
    artists = []
    #mapFullnameNospaceLowercaseNodiacritics2Artist = new Map()
    dump = () => {
        this.artists.forEach((a) => {
            console.log(a)
        })
    }
    addArtist = (a) => {
        this.#mapFullnameNospaceLowercaseNodiacritics2Artist.set(a.fullnameNospaceLowercaseNodiacritics, a)
        this.artists.push(a)
    }
    getArtistFromFullnameNospaceLowercaseNodiacritics = (fnnslcnd) => {
        return this.#mapFullnameNospaceLowercaseNodiacritics2Artist.get(fnnslcnd)
    }
    size = () => this.artists.length
    sort = (f) => this.artists.sort(f)
}

let ARTISTS = undefined

function loadArtists() {
    console.log('loading artists ...')
    return new Promise((resolve, reject) => {
        if (typeof ARTISTS !== 'undefined') {
            console.log('loaded artists from cache', ARTISTS)
            resolve(ARTISTS)
        }

        console.log(`no artists in cache (${ARTISTS}), fetching ...`)
        const urlArtistsYAML = "/_artists.yaml"
        const artistsRequest = new Request(urlArtistsYAML);
        const artists = new Artists()

        fetch(artistsRequest, { cache: "no-store" }).then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error fetching ${urlArtistsYAML}! Status: ${response.status}`);
            }
            return response.text()
        }).then((artistsAsYAMLText) => {

            const artistsAsJSONObject = jsYaml.load(artistsAsYAMLText)
            artistsAsJSONObject.forEach((a) => {
                artists.addArtist(new Artist(a))
            })

            console.log('# artists', artists.size())

            ARTISTS = artists
            resolve(artists)
        }).catch((error) => {
            console.log("script loading error", urlArtistsYAML, error);
            reject(error)
        })
    })
}

let theArtist

export { loadArtists, theArtist, theDayWhenIReadTheVideoMeters }
