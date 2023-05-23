import { normalizeVraiment } from "/js/utils.js?v=2.2.25"
import Jigsaw from "/js/jigsaw.js?v=2.2.25"

class JigsawShield {

    // copied from index.svg#puzzle_filled
    #jigsawPathDefault = "m329.278 242.223-18.053.024a11.795 11.795 0 0 0-8.459 3.592c-5.436 5.634-12.708 8.742-20.479 8.757-15.736.015-28.568-12.774-28.592-28.519 0-15.754 12.78-28.559 28.489-28.586 7.781-.02 15.066 3.064 20.518 8.666a11.791 11.791 0 0 0 8.454 3.562l18.048-.021a11.77 11.77 0 0 0 8.323-3.462 11.794 11.794 0 0 0 3.442-8.321v-.017l-.146-94.278a11.784 11.784 0 0 0-11.798-11.765l-103.405.162h-21.74l-.021-11.117v-.035c0-4.48 1.823-8.771 5.042-11.9 7.844-7.602 12.162-17.768 12.162-28.617v-.227c-.031-22.074-17.948-40.02-40-40.121-22.052.102-39.969 18.047-40 40.121v.227c0 10.85 4.318 21.016 12.162 28.617a16.603 16.603 0 0 1 5.042 11.9v.035l-.021 11.117h-21.74L33.1 91.855a11.784 11.784 0 0 0-11.798 11.765l-.144 94.278v.017c0 3.119 1.24 6.11 3.442 8.321a11.77 11.77 0 0 0 8.323 3.462l18.048.021a11.746 11.746 0 0 0 8.454-3.562c5.45-5.602 12.736-8.686 20.518-8.666 15.709.028 28.489 12.832 28.489 28.586-.021 15.741-12.854 28.53-28.592 28.519-7.77-.015-15.045-3.123-20.478-8.757a11.795 11.795 0 0 0-8.459-3.592l-18.053-.024c-6.502-.007-11.781 5.252-11.789 11.757l.122 96.268v.018c0 6.496 5.258 11.769 11.756 11.777l120.108.084a11.778 11.778 0 0 0 11.801-11.756l.019-9.994v-.022c0-3.185-1.296-6.232-3.583-8.455-5.572-5.398-8.64-12.623-8.64-20.33v-.159c.022-15.686 12.752-28.434 28.417-28.505 15.665.071 28.395 12.819 28.417 28.505v.159c0 7.707-3.067 14.932-8.64 20.33a11.797 11.797 0 0 0-3.584 8.455v.022l.02 9.994a11.766 11.766 0 0 0 3.463 8.32 11.786 11.786 0 0 0 8.338 3.436l120.108-.084c6.498-.01 11.756-5.281 11.756-11.777v-.018l.126-96.268c-.006-6.505-5.285-11.764-11.787-11.757z"
    #jigsawViewBox = '-50 -50 462.125 462.125'

    getJigsawPath = () => this.#jigsawPathDefault
    getJigsawViewBox = () => this.#jigsawViewBox
    getJigsawItem = (i) => {
        return {
            viewBox: this.getJigsawViewBox(i),
            path: this.getJigsawPath(i),
        }
    }

    constructor(config) {
        try {
            const randomSeed = normalizeVraiment(Math.random(), 0, 1, 0, 10000)
            const randomTabsize = normalizeVraiment(Math.random(), 0, 1, .07, .15)
            const randomJitter = normalizeVraiment(Math.random(), 0, 1, .03, .15)

            let brickPerRowFromDocument = parseInt(document.documentElement.style.getPropertyValue('--bpr'))
            if (isNaN(brickPerRowFromDocument)) {
                brickPerRowFromDocument = parseInt(document.documentElement.style.getPropertyValue('--lipr'))
                if (isNaN(brickPerRowFromDocument)) {
                    brickPerRowFromDocument = undefined
                }
            }
 
            let brickPerColFromDocument = parseInt(document.documentElement.style.getPropertyValue('--bpc'))
            if (isNaN(brickPerColFromDocument)) {
                brickPerColFromDocument = parseInt(document.documentElement.style.getPropertyValue('--lipc'))
                if (isNaN(brickPerColFromDocument)) {
                    brickPerColFromDocument = undefined
                }
            }

            let xn = parseInt(config?.xn ?? brickPerRowFromDocument ?? 4)
            if (isNaN(xn) || xn < 0) xn = 4
            let yn = parseInt(config?.yn ?? brickPerColFromDocument ?? 9)
            if (isNaN(yn) || yn < 0) yn = 9

            console.log('[jigsaw] seed', randomSeed, 'tabsize', randomTabsize, 'jitter', randomJitter)

            const jig = new Jigsaw({
                seed: randomSeed,
                tabsize: config?.tabsize ?? randomTabsize,
                jitter: config?.jitter ?? randomJitter,
                width: config?.width ? config.width : xn * 120,
                height: config?.height ? config.height : yn * 120,
                radius: 0,
                xn: xn,
                yn: yn,
            })

            this.getJigsawPath = (i) => {
                try {
                    return jig.getJigsawPiecePath(i)
                } catch (e) {
                    console.error(e);
                    return this.#jigsawPathDefault
                }
            }
            this.getJigsawViewBox = (i) => {
                try {
                    return jig.getJigsawPieceViewBox(i)
                } catch (e) {
                    console.error(e);
                    return this.#jigsawViewBox
                }
            }
        } catch (e) {
            console.error(e);
        }
    }
}

const jigsawGenerator = new JigsawShield()

export { jigsawGenerator, JigsawShield }