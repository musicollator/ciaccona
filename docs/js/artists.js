import jsYaml from 'https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/+esm'
import lodashMerge from 'https://cdn.jsdelivr.net/npm/lodash.merge@4.6.2/+esm'
import moment from 'https://cdn.jsdelivr.net/npm/moment@2.29.4/+esm'
        
const theDayWhenIReadTheVideoMeters = moment('2023-04-23T00:00:00Z')
class Artist {
    constructor(a) {
        lodashMerge(this, a)

        // https://stackoverflow.com/a/32906951/1070215
        this.fullname = [a.firstname, a.lastname].filter(Boolean).join(' ');
        this.fullnameNoSpace = this.fullname.replace(/\s/gi, '')
        // https://stackoverflow.com/a/37511463/1070215
        this.fullnameNoSpaceLowercaseNoDiacritics = this.fullnameNoSpace.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, '') 

        this.thisUrl = `/video/${this.fullnameNoSpaceLowercaseNoDiacritics}.html`
        this.social = `https://www.facebook.com/sharer/sharer.php?u=https://ciaccona.cthiebaud.com${this.thisUrl}`

        const vid = this['▶']
        vid.youtubeUrl = `https://youtu.be/${vid.id}`
        if (vid.trueId) vid.youtubeTrueUrl = `https://youtu.be/${vid.trueId}`
        vid.timingsUrl = `timings/${this.fullnameNoSpace}-${vid.id}.js`

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
        // plus simple que this['▶'] ...
        this.v = vid
    }
}

class Artists {
    artists = []
    #mapNameNoSpaceLowercaseNoDiacritics2Artist = new Map()
    dump = () => {
        this.artists.forEach((a) => {
            console.log(a)
        })
    }
    addArtist = (a) => {
        this.#mapNameNoSpaceLowercaseNoDiacritics2Artist.set(a.fullnameNoSpaceLowercaseNoDiacritics, a)
        this.artists.push(a)
    }
    getArtistFromNameNoSpaceLowercaseNoDiacritics = (nameNoSpaceLowercaseNoDiacritics) => {
        return this.#mapNameNoSpaceLowercaseNoDiacritics2Artist.get(nameNoSpaceLowercaseNoDiacritics)
    }
    size = () => this.artists.length
    sort = (f) => this.artists.sort(f)
}

function loadArtists() {
    return new Promise((resolve, reject) => {
        const urlArtistsYAML = "/_artists.yaml"
        const artistsRequest = new Request(urlArtistsYAML);
        const artists = new Artists()

        fetch(artistsRequest, {cache: "no-store"}).then((response) => {
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

            resolve(artists)
        }).catch((error) => {
            console.log("script loading error", urlArtistsYAML, error);
            reject(error)
        })
    })
}

export { loadArtists, theDayWhenIReadTheVideoMeters}
