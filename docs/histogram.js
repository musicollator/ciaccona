import { loadArtists } from "/js/artists.js?v=1.0.4-beta.1"
import createTimings from "/js/timings.js?v=1.0.4-beta.1"
import lodashMerge from 'https://cdn.jsdelivr.net/npm/lodash.merge@4.6.2/+esm'

function doHistogram(configParam) {

    const config = { 
        loadArtists: loadArtists, 
        key: "duration", 
        formatKey: k => formatDuration(k), 
        idWrapper: "body", 
        widthWrapper: 900, 
        heightWrapper: 500,
    }

    lodashMerge(config, configParam)

    const duration = moment.duration(0);
    let i = 1;
    const durations = []
    config.loadArtists().then(putainDeArtists => {
        putainDeArtists.artists.forEach(artistObject => {
            createTimings(artistObject).then((artistAndTimings) => {
                // console.log(artistAndTimings.duration)
                duration.add(artistAndTimings.duration)
                durations.push(
                    {
                        artist: artistAndTimings.fullname,
                        duration: artistAndTimings.duration.asMilliseconds(),
                        views: artistAndTimings['▶'].views,
                        viewsPerMonth: artistAndTimings['▶'].viewsPerMonth,
                        pitch: artistAndTimings['▶'].a4
                    }

                )
                const mean = duration.asMilliseconds() / i++
                const meanDuration = moment.duration(mean)
                const lengthAsAString = `${duration.hours()}h${duration.minutes()}m${duration.seconds()}s`
                const meanAsAString = `${meanDuration.hours()}h${meanDuration.minutes()}m${meanDuration.seconds()}s`
                console.log(duration.asSeconds(), lengthAsAString, '| mean:', meanDuration.asMilliseconds(), meanAsAString)

                if (i === 46) {
                    document.getElementById(config.idWrapper).append(dothed3(durations, putainDeArtists.artists))
                }

            })
        })
    })

    function dothed3(data, artists) {
        {
            // Declare the chart dimensions and margins.
            const width = config.widthWrapper;
            const height = config.heightWrapper ?? config.widthWrapper / 1.91;
            const marginTop = 20;
            const marginRight = 20;
            const marginBottom = 30;
            const marginLeft = 40;

            // Bin the data.
            const bins = d3.bin()
                .thresholds(50)
                .value((d) => d[config.key])
                (data);

            // Declare the x (horizontal position) scale.
            const x = d3.scaleLinear()
                .domain([bins[0].x0, bins[bins.length - 1].x1])
                .range([marginLeft, width - marginRight]);

            // Declare the y (vertical position) scale.
            const y = d3.scaleLinear()
                .domain([0, d3.max(bins, (d) => d.length)])
                .range([height - marginBottom, marginTop]);

            // Create the SVG container.
            const svg = d3.create("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", [0, 0, width, height])
                .attr("style", "max-width: 100%; height: auto;");

            // Add a rect for each bin.
            svg.append("g")
                .attr("fill", "steelblue")
                .selectAll()
                .data(bins)
                .join("rect")
                .attr("x", (d) => x(d.x0) + 1)
                .attr("width", (d) => x(d.x1) - x(d.x0) - 1)
                .attr("y", (d) => y(d.length))
                .attr("height", (d) => y(0) - y(d.length));

            const formatDuration = (d) => {
                const dur = moment.duration(d)
                const lengthAsAString = `${dur.minutes()}′${dur.seconds()}″`
                console.log(d, i, lengthAsAString)
                return lengthAsAString
            }
            // Add the x-axis and label.
            svg.append("g")
                .attr("transform", `translate(0,${height - marginBottom})`)
                .call(d3.axisBottom(x).ticks(width / 60).tickSizeOuter(0).tickFormat(
                    (d, i) => formatDuration(d)))
                .call((g) => g.append("text")
                    .attr("x", width)
                    .attr("y", marginBottom - 4)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "end")
                    .text("duration →"));

            // Add the y-axis and label, and remove the domain line.
            svg.append("g")
                .attr("transform", `translate(${marginLeft},0)`)
                .call(d3.axisLeft(y).ticks(height / 80))
                .call((g) => g.select(".domain").remove())
                .call((g) => g.append("text")
                    .attr("x", -marginLeft)
                    .attr("y", 10)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "start")
                    .text("↑ no. of performers"));

            const staticColor = "#437c90"
            const hoverColor = "#eec42d"
            const tooltip = d3
                .select('body')
                .append('div')
                .attr('class', 'd3-tooltip')
                .style('position', 'absolute')
                .style('z-index', '10')
                .style('visibility', 'hidden')
                .style('padding', '10px')
                .style('background', 'rgba(0,0,0,0.6)')
                .style('border-radius', '4px')
                .style('color', '#fff')
                .text('a simple tooltip');

            svg.selectAll('rect')
                .data(bins)
                .on('mouseover', function (event, d) {
                    console.log(event, d)
                    d.sort((x, y) => x[config.key] - y[config.key])
                    tooltip
                        .html(
                            `<div>${d.map(x => `${config.formatKey(x[config.key])} ${x.artist}`).join('<div></div>')}<\div>`
                        )
                        .style('visibility', 'visible');
                    d3.select(this).transition().attr('fill', hoverColor);
                })
                .on('mousemove', function (event, d) {
                    tooltip
                        .style('top', event.pageY - 10 + 'px')
                        .style('left', event.pageX + 10 + 'px');
                })
                .on('mouseout', function () {
                    tooltip.html(``).style('visibility', 'hidden');
                    d3.select(this).transition().attr('fill', staticColor);
                });

            // Return the SVG element.


            return svg.node();
        }
    }
}

export { doHistogram }