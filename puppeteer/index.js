var fs = require("fs");
const puppeteer = require('puppeteer');

(async () => {
    // Create a browser instance
    const browser = await puppeteer.launch();

    // Create a new page
    const page = await browser.newPage();

    // Set viewport width and height
    await page.setViewport({ width: 1200, height: 628 });

    const novid = [
        'adolfbusch',
        'amandinebeyer',
        'christiantetzlaff',
        'hilaryhahn',
        'isabellefaust',
        'rachelpodger',
    ]
    const performers = [
        // 'adelaideferriere',
        // 'adolfbusch',
        // 'alexandrarichardson',
        // 'amandinebeyer',
        // 'andreadevitis',
        // 'anneleenlenaerts',
        // 'arkadyleytush',
        // 'augustamckay',
        // 'aviavital',
        // 'ayahamada',
        // 'bellahristova',
        // 'borisbegelman',
        // 'charlottespruit',
        // 'chiaramassini',
        // 'christiantetzlaff',
        // 'christopherahn',
        // 'clara-jumikang',
        // 'claudioconstantini',
        // '自分',
        // 'dominikwagner',
        // 'fernandocordella',
        // 'florentinginot',
        // 'genzohtakehisa',
        // 'gustavleonhardt',
        // 'hilaryhahn',
        // 'isabellefaust',
        // 'jeannelamon',
        // 'jeanrondeau',
        // 'ksenijakomljenovic',
        // 'laurinephelut',
        // 'lisajacobs',
        // 'lizaferschtman',
        // 'marieleonhardt',
        // 'martafemenia',
        // 'martinbaker',
           'mayakimura',
        // 'michaelleontchik',
        // 'midorigoto',
        // 'miguelrincon',
        // 'mikastoltzman',
        // 'moranwasser',
        // 'nemanjaradulovic',
        // 'paolatalamini',
        // 'petrapolackova',
        // 'patriciakopatchinskaja',
        // 'polinaosetinskaya',
        // 'rachellellenwong',
        // 'rachelpodger',
        // 'raphaellasmits',
        // 'shunsukesato',
        // 'sigiswaldkuijken',
        // 'theoould',
        // 'veronikaeberle',
        // 'veroniquederaedemaeker',
        // 'virginierobilliard',
        // 'vonhansen',
        // 'yunpark',
    ]

    const cookies = [{
        name: 'scoreDisplay',
        value: 'firstBar', // 'fullScore', // 
        domain: 'localhost'
    }, {
        name: 'scoreInBricks',
        value: 'selectedBrick', // 'allBricks', // 
        domain: 'localhost'
    }, {
        name: 'autoplay',
        value: 'false', // 'true', // 
        domain: 'localhost'
    }]

    /**
     * Wait for the browser to fire an event (including custom events)
     * @param {string} eventName - Event name
     * @param {integer} seconds - number of seconds to wait.
     * @returns {Promise} resolves when event fires or timeout is reached
     */
    async function waitForEvent(eventName, seconds) {

        seconds = seconds || 30;

        // use race to implement a timeout
        return Promise.race([

            // add event listener and wait for event to fire before returning
            page.evaluate(function (eventName) {
                return new Promise(function (resolve, reject) {
                    document.addEventListener(eventName, function (e) {
                        resolve(); // resolves when the event fires
                    });
                });
            }, eventName),

            // if the event does not fire within n seconds, exit
            // page.waitForTimeout(seconds * 1000)
            new Promise(r => setTimeout(r, seconds * 1000))
        ]);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    await page.setCookie(...cookies);

    console.log('cookies done!')

    const promisePerformers = new Promise(async resolvePerformers => {

        for (let p = 0; p < performers.length; p++) {
            const performer = performers[p]

            console.log(performer)

            fs.rmSync(`./artists/${performer}`, { force: true, recursive: true });
            fs.mkdirSync(`artists/${performer}`);

            const website_url = `http://localhost:1010/video/${performer}.html`;
            // const website_url = `https://api.countapi.xyz/create?namespace=ciaccona.cthiebaud.com&enable_reset=1&key=${performer}`
            // const website_url = `http://localhost:1010/artists.html`

            console.log(website_url)

            // Open URL in current page  
            await page.goto(website_url, { waitUntil: 'networkidle0' });

            for (let v = 0; v < 35; v++) {
                const variation = v.toString()

                // https://stackoverflow.com/a/50869650/1070215
                console.log('set visible')
                await page.evaluate((sel) => {
                    console.log(`await page.evaluate((${sel}) to set visible`)
                    document.querySelectorAll(sel).forEach(
                        e => e.style.visibility = 'visible'
                    )
                }, '.my-nav, #videos-menu, #badge-variation, #badge-artist, #config-menu, #theContainerCol, div.plyr__controls')

                // Query for an element handle.
                console.log(`await page.waitForSelector('#gb${variation} .score')`)
                const element = await page.waitForSelector(`#gb${variation} .score`);

                console.log(`seeking to variation ${variation}`)

                let max = 35;
                // Do something with element...
                /* if (!novid.includes(performer)) { */
                console.log('click')
                await element.click();
                /* } else {
                    max = 1
                } */
                /*
                */
                console.log('hide')
                await page.evaluate((sel) => {
                    console.log(`await page.evaluate((${sel}) to hide`)
                    document.querySelectorAll(sel).forEach(
                        e => e.style.visibility = 'hidden'
                    )
                }, '.my-nav, #videos-menu, #badge-variation, #badge-artist, #config-menu') // , #theContainerCol, div.plyr__controls

                const playerControls = await page.$$('#playerWrapper > div > div.plyr__controls');
                for (let playerControl of playerControls) {
                    // hover on each element handle
                    await playerControl.hover(); 

                    console.log('waiting for çaJoue event')
                    await waitForEvent('çaJoue', 10)

                    // Capture screenshot
                    const path = `artists/${performer}/${performer}-${variation}.png`
                    console.log(`saving screenshot to ${path}`)
                    await page.screenshot({
                        path: path
                    });
                }
                // Dispose of handle
                await element.dispose();
            }
            console.log('now we should go to next performer, or no ?', p)
        }
        console.log('finito with performers. resolving promisePerformers')
        resolvePerformers()
    })

    await promisePerformers.then(async (result) => {
        console.log('promisePerformers then')
        await browser.close()
        return result
    }).catch(error => {
        console.log(error)
        throw error
    })

})();