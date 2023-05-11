import lodashMerge from 'https://cdn.jsdelivr.net/npm/lodash.merge@4.6.2/+esm'
import moment from 'https://cdn.jsdelivr.net/npm/moment@2.29.4/+esm'
import codec from "/js/structure.js?v=0.13.3"
import { binaryRangeSearch } from "/js/utils.js?v=0.13.3"
import { loadArtists } from "/js/artists.js?v=0.13.3"

class Timings {

    #initializeBarObject = (bar, barIndex) => {
        if (bar == null || barIndex == null) {
            throw new Error(bar, typeof bar, barIndex, typeof barIndex)
        }
        if (bar.m == null) {
            bar.m = moment(bar["Time Recorded"])
        }
        bar.duration = moment.duration(bar.m.diff(this.start))
        if (this.offset) {
            bar.duration.add(this.offset)
        }
        if (this.adjust) {
            bar.duration.subtract(this.adjust)
        }
        bar.index = barIndex
        bar.variation = codec.bar2variation(bar.index)
        bar.variationStartBarIndex = codec.variation2bar(bar.variation)
        if (this.freezedBecauseOFPub &&
            this.freezedBecauseOFPub.fromVariation &&
            this.freezedBecauseOFPub.from &&
            this.freezedBecauseOFPub.to) {
            if (this.freezedBecauseOFPub.fromVariation <= bar.variation) {
                const freezeDuration = moment(this.freezedBecauseOFPub.to).diff(this.freezedBecauseOFPub.from)
                bar.duration.subtract(freezeDuration)
            }
        }
        return bar
    }

    #isDefinedNotNullAndNotAMoment = (o) => {
        if (o == null) return false
        return !(o instanceof moment)
    }

    #isDefinedNotNullAndNotADuration = (o) => {
        if (o == null) return false
        if (!(o instanceof moment)) return false
        return o.isDuration()
    }

    constructor(interestingData, data) {
        lodashMerge(this, interestingData, data)

        if (this.#isDefinedNotNullAndNotADuration(this.offset)) {
            this.offset = moment.duration(this.offset)
        }
        if (this.#isDefinedNotNullAndNotADuration(this.adjust)) {
            this.adjust = moment.duration(this.adjust)
        }
        if (this.#isDefinedNotNullAndNotAMoment(this.start)) {
            this.start = moment(this.start)
        }

        this.bar2time = function (bar) {
            return bar.duration.asMilliseconds() / 1000
        }

        this.time2bar = function (time) {
            return binaryRangeSearch(time, this.bars, (barIndex, bars) => {
                return this.bar2time(bars[barIndex])
            })
        }

        this.bars.forEach((bar, index) => this.#initializeBarObject(bar, index))

        if (false) { // calc length ?
            if (256 <= this.bars.length) {
                // get duration of first variation 
                console.log('var 0', this.bars[0].m.format())
                const lastvarbar = codec.variation2bar(codec.variationsCount - 1)
                console.log('var 0', this.bars[0].m.format(), 'last var bar', lastvarbar, this.bars[lastvarbar].m.format())
                // from 0 to 256 bar :
                const from0to256 = this.bars[lastvarbar].m.diff(this.bars[0].m)
                const lastD = 3 * (from0to256 / 256)
                const duration = moment.duration(from0to256 + lastD)
                this.lengthAsAString = `${duration.minutes()}′${duration.seconds()}″`
                console.log('duration is roughly', this.lengthAsAString)
            }
        }
    }
}

function createTimings(fullameNoSpaceLowercaseNoDiacritics) {
    return new Promise((resolve, reject) => {
        loadArtists().then((artists) => {

            let artistObject = artists.getArtistFromNameNoSpaceLowercaseNoDiacritics(fullameNoSpaceLowercaseNoDiacritics)
            if (!artistObject) {
                reject(`no artist associated with : < ${fullameNoSpaceLowercaseNoDiacritics} >`)
                return
            }

            const timingsURL = artistObject['▶'].timingsUrl
            const javascriptizedId = artistObject['▶'].javascriptizedId
            console.log('script loading', timingsURL)

            fetch(timingsURL, {cache: "no-store"}).then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error fetching ${timingsURL}! Status: ${response.status}`);
                }
                return response.text()
            }).then((timingsAstext) => {
                eval?.(timingsAstext)
                const data = eval(javascriptizedId)
                const timings = new Timings(artistObject, data)
                resolve(timings)
            }).catch((error) => {
                console.log("script loading error", timingsURL, error);
                reject(error)
            })
    
        }).catch((error) => {
            console.log('loadArtists error', error)
            reject(error)
        })
    })
}

export default createTimings

