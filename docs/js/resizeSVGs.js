export default function resizeSVGs(selection, withOffsetX, elementCallback) {
    let maxWidth = 0
    let maxHeight = 0

    function setViewBoxes(results) {
        results.forEach((result) => {
            if (result.status === "fulfilled") {
                const svg = result.value.svg
                const box = svg.getBBox()
                maxWidth = Math.max(maxWidth, box.width)
                maxHeight = Math.max(maxHeight, box.height)
            }
        })

        for (const result of results) {
            if (result.status === "fulfilled") {
                // https://lists.gnu.org/archive/html/bug-lilypond/2017-07/msg00010.html
                const svg = result.value.svg

                const box = svg.getBBox()
                // où est le centre ?
                const centerX = box.x + box.width / 2
                const x = centerX - maxWidth / 2
                const centerY = box.y + box.height / 2
                const y = centerY - maxHeight / 2
                const translate = withOffsetX && result.value.offset ? result.value.offset : 0
                const viewBox = [
                    box.x + translate, 
                    y, 
                    box.width - translate, 
                    maxHeight].join(" ")
                svg.setAttribute("viewBox", viewBox)
                svg.setAttribute("preserveAspectRatio", "xMinYMid meet")
                svg.removeAttribute("height")
                svg.removeAttribute("width")
                if (elementCallback) elementCallback(result.value.obj)
            }
        }
        return this
    }

    return new Promise((resolve, reject) => {
        const lesPromessesDeLeSVG = []

        // https://stackoverflow.com/questions/66373768/why-for-of-waits-for-promise-to-resolve-and-foreach-doesnt
        for (const obj of selection) {
            lesPromessesDeLeSVG.push(new Promise((resolve, reject) => {
                let timeout
                let interval = setInterval(() => {
                    let SVG = obj.contentDocument;
                    if (!SVG || !SVG.children || SVG.children.length == 0) {
                        return
                    }

                    clearInterval(interval);
                    clearTimeout(timeout)

                    const svg = SVG.children[0]

                    resolve({
                        obj: obj,
                        svg: svg,
                        offset: obj.dataset.svgOffsetX ? parseInt(obj.dataset.svgOffsetX) : 0
                    })
                }, 100)
                timeout = setTimeout(() => {
                    clearInterval(interval);
                    reject({
                        obj: obj,
                        svg: undefined,
                        offset: 0
                    })
                }, 10000) // kill it after 10 seconds
            }))
        }

        Promise.allSettled(lesPromessesDeLeSVG)
            .then(setViewBoxes)
            .then(() => resolve({ key: "RESIZE", value: {} }))
            .catch((error) => reject(error))
    })
}
