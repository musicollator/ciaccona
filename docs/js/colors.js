import tinycolor from 'https://cdn.jsdelivr.net/npm/tinycolor2@1.6.0/+esm'
import bezierEasing from 'https://cdn.jsdelivr.net/npm/bezier-easing@2.1.0/+esm'
import config from "/js/config.js?v=2.1.2"
import codec from "/js/structure.js?v=2.1.2"
import { jigsawGenerator } from '/js/jigsawShield.js?v=2.1.2'
import { shuffleArray, normalizeVraiment, logFunc, generateElement } from "/js/utils.js?v=2.1.2"
import MagnificentTitle from "/js/magnificent-title.js?v=2.1.2"

function _T(hex6color, transparency) {
    if (hex6color.length !== 6) return hex6color
    if (!(/[0-9A-Fa-f]{6}/g.test(hex6color))) return hex6color
    if (typeof transparency === 'undefined') transparency = '80'
    return `${hex6color}${transparency}`
}

function getColorArray(transparencyParam) {
    let _first_color_ = [
        { rgb: "f3f3f2", p_rgb: "f2f1f0", sim: 97, pantone: "P 179-1 C", name: "Bleached Silk" }
    ]

    let _other_colors_ = [
        { rgb: "6a8d88", p_rgb: "6c8a82", sim: 98, pantone: "625 U", name: "Aspen Hush" },
        { rgb: "112222", p_rgb: "1b2f34", sim: 95, pantone: "5463 CP", name: "Black Feather" },
        { rgb: "222244", p_rgb: "252849", sim: 98, pantone: "282 CP", name: "Black Market" },
        { rgb: "2242c7", p_rgb: "24509a", sim: 91, pantone: "286 CP", name: "Blue Blue" },
        { rgb: "2a96d5", p_rgb: "1f95cd", sim: 98, pantone: "7508 UP", name: "Boyzone" },
        { rgb: "a3c1ad", p_rgb: "a6c2ad", sim: 99, pantone: "P 134-11 U", name: "Cambridge Blue" },
        { rgb: "f5a2a1", p_rgb: "f6a1a0", sim: 100, pantone: "15-1621 TPX", name: "Candy Heart Pink" },
        { rgb: "697f8e", p_rgb: "6a7f8e", sim: 100, pantone: "692 UP", name: "Cascade Tour" },
        { rgb: "3c1414", p_rgb: "4e2b1f", sim: 92, pantone: "7596 CP", name: "Dark Sienna" },
        { rgb: "355859", p_rgb: "335959", sim: 99, pantone: "19-5413 TCX", name: "Depth Charge" },
        { rgb: "3a445d", p_rgb: "3b4559", sim: 98, pantone: "2379 C", name: "Diplomatic" },
        { rgb: "ffd8bb", p_rgb: "ffd4b2", sim: 98, pantone: "13-1026 TPX", name: "Durazno Palido" },
        { rgb: "0abab5", p_rgb: "00baae", sim: 97, pantone: "3262 U", name: "Jade Gravel" },
        { rgb: "f7a233", p_rgb: "f9a12e", sim: 99, pantone: "15-1058 TPG", name: "Lightning Yellow" },
        { rgb: "b66a3c", p_rgb: "ba6a3b", sim: 99, pantone: "P 31-7 C", name: "Mincemeat" },
        { rgb: "6fea3e", p_rgb: "87e878", sim: 94, pantone: "902 U", name: "Miyazaki Verdant" },
        { rgb: "ec8430", p_rgb: "f38b3c", sim: 98, pantone: "144 U", name: "Navel" },
        { rgb: "a328b3", p_rgb: "9b26b6", sim: 98, pantone: "2592 C", name: "Pink Spyro" },
        { rgb: "fcffff", p_rgb: "c7dbf4", sim: 87, pantone: "2707 U", name: "Polar Bear In A Blizzard" },
        { rgb: "881166", p_rgb: "890c58", sim: 96, pantone: "228 C", name: "Possessed Purple" },
        { rgb: "11875d", p_rgb: "13955e", sim: 95, pantone: "P 145-8 U", name: "Primal Green" },
        { rgb: "8a3319", p_rgb: "8a391b", sim: 98, pantone: "7526 C", name: "Red Rust" },
        { rgb: "0c1793", p_rgb: "10069f", sim: 97, pantone: "Blue 072 C", name: "Royal" },
        { rgb: "e84998", p_rgb: "e44c9a", sim: 99, pantone: "Rhodamine Red U", name: "Schiaparelli Pink" },
        { rgb: "ffe670", p_rgb: "ffe671", sim: 100, pantone: "924 C", name: "Shandy" },
        { rgb: "7777ff", p_rgb: "6490e8", sim: 90, pantone: "2727 U", name: "Stargate Shimmer" },
        { rgb: "0c0c1f", p_rgb: "131e29", sim: 91, pantone: "7547 C", name: "Tristesse" },
        { rgb: "b12d35", p_rgb: "b42937", sim: 99, pantone: "P 58-8 C", name: "Unmatched Beauty" },
        { rgb: "e34244", p_rgb: "e73c3e", sim: 99, pantone: "2034 C", name: "Vermilion Cinnabar" },
        { rgb: "e3ac72", p_rgb: "e2a770", sim: 98, pantone: "721 CP", name: "Viva Gold" },
        { rgb: "4b57db", p_rgb: "275ea3", sim: 89, pantone: "10261 C", name: "Warm Blue" },
        { rgb: "bfd6d9", p_rgb: "bcd5d6", sim: 99, pantone: "5523 U", name: "Wind Speed" },
        { rgb: "889911", p_rgb: "9b9912", sim: 95, pantone: "391 CP", name: "Densetsu Green" },
    ];

    let _last_color_ = [
        { rgb: "d8b998", p_rgb: "d8b998", sim: 92, pantone: "Pantone 13-1014 Tcx", name: "Mellow Buff" }
    ]

    let shuffledC
    if (config.shuffleReplicator) {
        shuffledC = config.shuffleReplicator
    } else {
        shuffledC = shuffleArray(Array.from(_other_colors_, (_, index) => index))
        config.shuffleReplicator = shuffledC
    }
    let shuf = 0
    for (let s of _other_colors_) {
        s.shuf = shuffledC[shuf++]
    }

    _other_colors_.sort((a, b) => a.shuf - b.shuf)

    let _colors_ = _first_color_.concat(_other_colors_)
    _colors_.push(_last_color_[0])

    const transparency = transparencyParam ?? .400
    // https://cubic-bezier.com/
    const easingVanishingContrast = bezierEasing(0, 1, 1, .4)
    const easingTheDarkerTheLighter = bezierEasing(0, 1.5, .166, .5)
    let k = 0
    for (let s of _colors_) {
        const k0_1normalized = normalizeVraiment(k++, 0, _colors_.length, 0, 1)
        const contrastChange = (1 - easingVanishingContrast(k0_1normalized)) * 100
        const luminance = tinycolor(s.p_rgb).getLuminance();
        if (luminance > .333) {
            s.textColor = tinycolor(s.p_rgb).darken(contrastChange).toString("hex6").slice(1)
            s.puzzleColor = tinycolor(s.p_rgb).darken(15).toString("hex6").slice(1)
            const stripe = tinycolor(s.p_rgb).darken(5)
            s.stripeColor = stripe.toString("hex6").slice(1)
            s.stripeColorAlpha = stripe.setAlpha(transparency).toString("hex8").slice(1)
        } else {
            s.textColor = tinycolor(s.p_rgb).lighten(contrastChange).toString("hex6").slice(1)
            s.puzzleColor = tinycolor(s.p_rgb).lighten(12).toString("hex6").slice(1)
            const stripe = tinycolor(s.p_rgb).lighten(5)
            s.stripeColor = stripe.toString("hex6").slice(1)
            s.stripeColorAlpha = stripe.setAlpha(transparency).toString("hex8").slice(1)
        }
        const theDarkerTheLighter = easingTheDarkerTheLighter(luminance) * 100
        s.borderColor = tinycolor(s.p_rgb).lighten(theDarkerTheLighter).toString("hex6").slice(1)
        s.p_rgbAlpha = tinycolor(s.p_rgb).setAlpha(transparency).toString("hex8").slice(1)
    }
    return _colors_
}

const colorArray = getColorArray(.5);

function createColoredBadges(idContainer, fullameNoSpaceLowercaseNoDiacritics) {

    const thisURL = new URL(window.location)

    const _widths_ = [
        { w: 268 }, // 00
        { w: 322 }, // 01
        { w: 330 }, // 02
        { w: 325 }, // 03
        { w: 333 }, // 04
        { w: 360 }, // 05
        { w: 360 }, // 06
        { w: 327 }, // 07
        { w: 315 }, // 08
        { w: 367 }, // 09
        { w: 373 }, // 10
        { w: 447 }, // 11
        { w: 320 }, // 12
        { w: 287 }, // 13
        { w: 293 }, // 14
        { w: 290 }, // 15
        { w: 410 }, // 16
        { w: 365 }, // 17
        { w: 320 }, // 18
        { w: 330 }, // 19
        { w: 362 }, // 20
        { w: 362 }, // 21
        { w: 359 }, // 22
        { w: 360 }, // 23
        { w: 288 }, // 24
        { w: 297 }, // 25
        { w: 304 }, // 26
        { w: 300 }, // 27
        { w: 285 }, // 28
        { w: 364 }, // 29
        { w: 384 }, // 30
        { w: 347 }, // 31
        { w: 396 }, // 32
        { w: 295 }, // 33
        { w: 220 }, // 34
        { w: 0 }    // 35 (should never happen)
    ]

    const _colors_ = colorArray // getColorArray(fullameNoSpaceLowercaseNoDiacritics ? .400 : undefined)

    const temporaryContainer = generateElement("<template>");

    temporaryContainer.appendChild(new MagnificentTitle('grid-brick', fullameNoSpaceLowercaseNoDiacritics ? 3 : 2).templateForTheme);

    const twoZeroPad = (num) => String(num).padStart(2, '0')
    let i = 0;
    let barFrom = 0
    _colors_.forEach(function (c) {

        let c2

        if (fullameNoSpaceLowercaseNoDiacritics) {
            c2 = {
                p_rgb: _T(c.p_rgb),
                p_rgbAlpha: c.p_rgbAlpha,
                textColor: _T(c.textColor),
                puzzleColor: _T(c.puzzleColor),
                stripeColor: _T(c.stripeColor),
                stripeColorAlpha: c.stripeColorAlpha,
                borderColor: _T(c.borderColor),
            }
        } else {
            c2 = {
                p_rgb: c.p_rgb,
                p_rgbAlpha: c.p_rgbAlpha,
                textColor: c.textColor,
                puzzleColor: c.puzzleColor,
                stripeColor: c.stripeColor,
                stripeColorAlpha: c.stripeColorAlpha,
                borderColor: _T(c.borderColor),
            }
        }

        const tonality = codec.isMajor(i) ? "Δ" : "";
        const barsCount = codec.variation2barsCount(i)
        const warning = barsCount != 8 ? `(${barsCount})` : "";
        const barTo = barFrom + barsCount
        const bg = `background-color: #${c2.p_rgb}`
        const bgAlpha = `background-color: #${c2.p_rgbAlpha}`
        const bgstripe = !tonality ? bg : `background-image: linear-gradient(135deg, 
                #${c2.stripeColor} 25%, 
                #${c2.p_rgb} 25%, 
                #${c2.p_rgb} 50%, 
                #${c2.stripeColor} 50%, 
                #${c2.stripeColor} 75%, 
                #${c2.p_rgb} 75%, 
                #${c2.p_rgb} 100%); 
                background-size: 16.97px 16.97px;`
        const bgstripeAlpha = !tonality ? bgAlpha : `background-image: linear-gradient(135deg, 
                #${c2.stripeColorAlpha} 25%, 
                #${c2.p_rgbAlpha} 25%, 
                #${c2.p_rgbAlpha} 50%, 
                #${c2.stripeColorAlpha} 50%, 
                #${c2.stripeColorAlpha} 75%, 
                #${c2.p_rgbAlpha} 75%, 
                #${c2.p_rgbAlpha} 100%); 
                background-size: 16.97px 16.97px;`

        const svgOffsetX = codec.svgOffsetX(i)

        const templatePuzzle = fullameNoSpaceLowercaseNoDiacritics ? `
<svg xmlns="http://www.w3.org/2000/svg" 
        id="gb-puzzle${i}-svg" 
        class="clipboard-puzzle"
        width="80%" height="60%" 
        style="visibility: inherit; overflow: visible; transform: scale(.667);" 
        viewBox="${jigsawGenerator.getJigsawViewBox(i + 1)}">
        <path stroke="#${c2.textColor}" stroke-width="3" fill="#${c2.puzzleColor}" d="${jigsawGenerator.getJigsawPath(i + 1)}"></path>
</svg>` : ''

        const templateVariations =
            `
<div id="gb${i}" data-sort="${twoZeroPad(i)}" data-variation="${i}" class="${tonality ? tonality + ' ' : ''}grid-brick has-score" style="${bgstripeAlpha}; border-color: #${c2.borderColor};">
    <div class="brick has-score font-monospace d-flex align-items-center justify-content-between" style="${bgstripe}; ${i === codec.variationsCount - 1 ? 'border-radius: 0;' : ''} " data-bar="${barFrom}" data-variation="${i}" >
        <div class="score" style="width: ${(_widths_[i].w) - 120}px;" data-width="${(_widths_[i].w) - 120}">
            <!-- bwv-1004_5_for_SVGs- -->
            <object id="o${i}" 
                    data="/scores/bwv-1004_5_viewboxed-${i + 1}.svg" 
                    type="image/svg+xml"
                    style="pointer-events: none;" 
                    data-svg-offset-x = ${svgOffsetX}
                    aria-label="variation ${i}"> 
            </object>

            <span class="Δ" style="${bgstripe}">
                ${tonality}
            </span>
        </div>

        <div class="d-flex flex-grow-1 flex-column justify-content-between" style="height:100%; text-align: right; ${i === codec.variationsCount - 1 ? "display:none;" : ""}font-size:1.1rem; padding: 0 .3rem; border-right: .5px solid #${c2.textColor}; color: #${c2.textColor}">
            <div class="pt-1">${barFrom + 1}</div>
            <div style="${i === codec.variationsCount - 1 ? "display:none;" : ""}font-style: italic; font-size:.8rem; color: #${c2.textColor};">
                ${warning}
            </div>
            <div class="pb-1">${barTo}</div>
        </div>
        <div class="d-flex flex-column justify-content-evenly" style="width: 3rem; overflow: visible;">
            ${templatePuzzle}
            <div id="gb-variation${i}" 
                class="fw-bold" 
                data-a="${fullameNoSpaceLowercaseNoDiacritics}"
                data-v="${i}"
                style="color: #${c2.textColor}; padding: .333rem;">
                ${i === 0 || i === codec.variationsCount - 1 ? "&nbsp;" : i}
            </div>
        </div>
    </div>
</div>
`
        const instanciatedVariation = generateElement(templateVariations)

        temporaryContainer.appendChild(instanciatedVariation);

        // bumpers
        {
            barFrom = barTo
            i++
        }
    });

    const bricks = temporaryContainer.children
    if (bricks?.length) {
        let gridE = document.getElementById(idContainer)
        if (gridE) {
            ;[...gridE.children].forEach(gb => gb.remove())
                ;[...bricks].forEach(gb => gridE.appendChild(gb))
        }
    }

    return {}
}

export { colorArray, getColorArray, createColoredBadges }