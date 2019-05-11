import * as puppeteer from 'puppeteer'
import { setting } from '../config/setting'
import * as path from 'path'
import * as _ from 'lodash'

const getGeoDataDetail = async (url, fname) => {
    try {
        console.log('build in chromium path: ' + puppeteer.executablePath())
        const browser = await puppeteer.launch({
            headless: false,
            ignoreHTTPSErrors: true,
            executablePath: setting.chromePath,
            args: [
                // '--proxy-server=172.21.212.110:1080',
                // '--ignore-certificate-errors',
                // '--ignore-certificate-errors-spki-list',
                // '--enable-features=NetworkService',
                // '--proxy-server=223.2.41.104:1080',
                "--no-sandbox",
                "--disable-setuid-sandbox",
            ],
        })
        const page = await browser.newPage()
        await page.setRequestInterception(true)
        page.on('request', request => {
            // if (request.isNavigationRequest()) {
            // // ... save request for later, use request.response() to get response ...
            //     console.log(request.url())
            // }
            request.continue()
        });
        page.setViewport({
            width: 1376,
            height: 768,
        })
        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 60000
        })
        // await page.pdf({
        //     format: 'A4',
        //     path: path.join(setting.pdf, `${fname}.pdf`)
        // })
        await page.screenshot({
            fullPage: true,
            path: path.join(setting.img, `${fname}.jpg`)
        })
        await browser.close();
    }
    catch(e) {
        if(e instanceof puppeteer.errors.TimeoutError) {
            console.log('catch timeout error')
        }
        console.error(e)
    }
}

(async () => {
    await getGeoDataDetail('https://www.gbif.org/dataset/68efc55e-f762-11e1-a439-00145eb45e9a', 'test')
    console.log('finished!')
    process.exit(0)
})()