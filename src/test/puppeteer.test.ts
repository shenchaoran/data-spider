import * as puppeteer from 'puppeteer'
import * as devices from 'puppeteer/DeviceDescriptors'
const iPhone6 = devices['iPhone 6'];
import { setting } from '../config/setting'
import * as path from 'path'
import * as _ from 'lodash'

const getGeoDataDetail = async (url, fname) => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            executablePath: setting.chromePath,
            args: [
                // '--proxy-server=127.0.0.1:25604',
                "--no-sandbox",
                "--disable-setuid-sandbox",
            ],
        })
        const page = await browser.newPage()
        // page.setRequestInterception(true)
        page.setViewport({
            width: 1376,
            height: 768,
        })
        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 120000
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
        console.error(e)
    }
}

(async () => {
    await getGeoDataDetail('https://www.eea.europa.eu/data-and-maps/data/global-land-cover-250m', 'test')
    console.log('finished!')
    process.exit(0)
})()