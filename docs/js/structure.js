class Codec {
    #variations = []
    #bars = []
    #barsCount
    #variationsCount = 1 /* theme */ + 32 /* variations */ + 1 /* final chord */
    #variationIndex2BarCount = (i) =>
        (i == 10 || i == 15 || i == 19 || i == 29) ? 4 :
            ((i == 8 || i == 30) ? 12 :
                (i == 33) ? 1 : 8)
    #svgOffsetX = (i) => (i == 0 || i == 17 || i == 27 || i == 33 ? "0" : "6.5")
    #isMajor = (i) => (17 <= i && i < 27)
    #variationsCount2 = 1 /* theme */ + 34 /* variations */ + 1 /* final chord */
    #variationIndex2BarCount2 = (i) =>
        (i == 9 || i == 10 || i == 11 || i == 12 || i == 17 || i == 21 || i == 31) ? 4 :
            ((i == 32) ? 12 :
                (i == 35) ? 1 : 8)
    #svgOffsetX2 = (i) => (i == 0 || i == 19 || i == 29 || i == 35 ? "0" : "6.5")
    #isMajor2 = (i) => (19 <= i && i < 29)
    #variationsCount3 = 1 /* theme */ + 33 /* variations */ + 1 /* final chord */
    #variationIndex2BarCount3 = (i) =>
        (i == 9 || i == 10 || i == 11 || i == 16 || i == 20 || i == 30) ? 4 :
            ((i == 8 || i == 31) ? 12 :
                (i == 34) ? 1 : 8)
    #svgOffsetX3 = (i) => (i == 0 || i == 18 || i == 28 || i == 34 ? "0" : "6.5")
    #isMajor3 = (i) => (18 <= i && i < 28)
    constructor() {
        let bar = 0
        for (let v = 0; v < this.#variationsCount3; v++) {
            const variation = {
                startBarIndex: bar,
                barsCount: this.#variationIndex2BarCount3(v)
            }
            this.#variations.push(variation)
            for (let d = 0; d < variation.barsCount; d++) {
                this.#bars.push({
                    variationIndex: v
                })
                bar++
            }
        }
        this.#barsCount = bar
        console.log('we have', this.#barsCount, 'bars')
    }
    variation2bar = (v) => {
        if (v < 0 || this.#variations.length <= v) {
            return -1
        }
        return this.#variations[v].startBarIndex
    }
    variation2barsCount(v) {
        if (v < 0 || this.#variations.length <= v) {
            return 0
        }
        return this.#variations[v].barsCount
    }
    bar2variation = (b) => {
        if (b < 0 || this.#bars.length <= b) {
            return -1
        }
        return this.#bars[b].variationIndex
    }
    svgOffsetX = this.#svgOffsetX3
    isMajor = this.#isMajor3
    variationsCount = this.#variationsCount3

}

const codec = new Codec()

export default codec
