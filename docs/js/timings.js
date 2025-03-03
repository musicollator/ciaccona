import lodashMerge from 'https://cdn.jsdelivr.net/npm/lodash.merge@4.6.2/+esm'
import moment from 'https://cdn.jsdelivr.net/npm/moment@2.29.4/+esm'
import config from "/js/config.js?v=1.0.4-beta.2"
import codec from "/js/structure.js?v=1.0.4-beta.2"
import { binaryRangeSearch } from "/js/utils.js?v=1.0.4-beta.2"
import fileSaver from 'https://cdn.jsdelivr.net/npm/file-saver@2.0.5/+esm'

class Timings {

    #initializeBarObject = (bar, barIndex) => {
        if (bar == null || barIndex == null) {
            throw new Error(bar, typeof bar, barIndex, typeof barIndex)
        }
        if (typeof bar.t !== 'undefined') {
            bar.duration = moment.duration(bar.t*1000)
            bar.m = moment(0).add(bar.duration)
        } else if (typeof bar["Time Recorded"] !== 'undefined') {
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
            // Add the 't' attribute
            bar.t = bar.duration.asSeconds();            
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

    get hasBars() {
        return this.bars.length !== 0
    }
    get noBars() {
        return this.bars.length === 0
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

        if (true) { // calc length ?
            if (256 <= this.bars.length) {
                // get duration of first variation 
                // console.log('var 0', this.bars[0].m.format())
                const lastvarbar = codec.variation2bar(codec.variationsCount - 1)
                // console.log('var 0', this.bars[0].m.format(), 'last var bar', lastvarbar, this.bars[lastvarbar].m.format())
                // from 0 to 256 bar :
                const from0to256 = this.bars[lastvarbar].m.diff(this.bars[0].m)
                const lastD = Math.floor(2 * (from0to256 / 256))
                this.duration = moment.duration(from0to256 + lastD)
                this.lengthAsAString = `${this.duration.minutes()}′${this.duration.seconds()}″`
                // console.log('duration is roughly', this.lengthAsAString)
            }
        }

        this.variance = this.calculateVariance(); 
    }

    removeOutliersUsingStdDev(intervals, threshold = 4) {
        const mean = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
        const variance = intervals.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / intervals.length;
        const stdDev = Math.sqrt(variance);
    
        const lowerBound = mean - threshold * stdDev;
        const upperBound = mean + threshold * stdDev;
    
        return intervals.filter(value => value >= lowerBound && value <= upperBound);
    }    

    calculateVariance() {
        if (this.bars.length < 2) return null;

        // Calculate intervals between bars
        const intervals = this.bars
            .slice(1)
            .map((bar, index) => this.bar2time(bar) - this.bar2time(this.bars[index]));

        const filteredIntervals = this.removeOutliersUsingStdDev(intervals);            

        // Compute mean of intervals
        const mean = filteredIntervals.reduce((sum, val) => sum + val, 0) / filteredIntervals.length;

        // Compute variance
        const variance = filteredIntervals.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / filteredIntervals.length;

        return variance;
    }    
}

function saveTimingsToFile(artistObject) {
    const filename = `${artistObject.fullnameNospaceLowercaseNodiacritics}-timings.json`;

    // Recalculate `i` to be sequential and filter after recalculating
    const recalculatedBars = artistObject.timings.bars.map((bar, index) => ({
        i: index, // Recalculate `i` to be truly incremental
        t: bar.t
    })).filter(bar => bar.i <= 257); // Filter out bars where recalculated `i > 257`

    // Create the data to save
    const filteredData = { bars: recalculatedBars };
    const timingsData = JSON.stringify(filteredData, null, 2); // Pretty-print JSON

    // Save as a JSON file
    const blob = new Blob([timingsData], { type: "application/json" });
    fileSaver.saveAs(blob, filename);
}


function createTimings(artistObject) {
    return new Promise((resolve, reject) => {

        if (!artistObject) {
            reject(`invalid parameter artistObject: < ${artistObject} >`)
            return
        }

        const timingsURL = artistObject['▶'].timingsUrl
        const javascriptizedId = artistObject['▶'].javascriptizedId
        // console.log('script loading', timingsURL)

        fetch(timingsURL, { cache: "no-store" }).then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error fetching ${timingsURL}! Status: ${response.status}`);
            }
            return response.text()
        }).then((timingsAstext) => {
            eval?.(timingsAstext)
            const data = eval(javascriptizedId)
            artistObject.timings = new Timings(artistObject, data)
            config.artistAndTimings = artistObject.timings

            // Save the timings to a file
            // saveTimingsToFile(artistObject);

            resolve(artistObject.timings)
        }).catch((error) => {
            console.log("script loading error", timingsURL, error);
            reject(error)
        })
    })
}

export default createTimings

