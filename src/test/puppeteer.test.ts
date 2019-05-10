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
            // executablePath: setting.chromePath,
            args: [
                // '--proxy-server=223.2.41.104:1080',
                "--no-sandbox",
                "--disable-setuid-sandbox",
            ],
        })
        const page = await browser.newPage()
        page.setRequestInterception(true)
        page.setViewport({
            width: 1376,
            height: 768,
        })
        page.on('request', request => {
            // try {
            //     const url = request.url()
            //     console.log(url)
            //     // if(request.resourceType() === 'xhr') {
            //     //     // console.log(url)
            //     // }
            //     const ignoreDomains = [
            //         'tianditu.gov',
            //         'conac.cn',
            //         'baidu.com'
            //     ]
            //     let ignore = false
            //     _.map(ignoreDomains, domain => {
            //         if(url.indexOf(domain) !== -1) {
            //             ignore = true
            //         }
            //     })
            //     if(ignore) {
            //         request.abort('aborted')
            //     }
            //     else {
            //         request.continue()
            //     }
            // }
            // catch(e) {
            //     console.error(e)
            // }
        })
        page.on('response', response => {
            // const url = response.url()
            // if(response.request().resourceType() === 'xhr') {
            //     console.log(url)
            //     if(url.match(/\/entry\/\d+/)) {
            //         response.json()
            //             .then(res => {
            //                 res.op_read
            //                 // doc.description = res.op_read
            //             })
            //     }
            //     else if(url.match(/\/withpublishers/)) {
            //         response.json()
            //             .then(res => {
            //                 res
            //             })
            //     }
            // }
            // console.log(url)
        })
        await page.goto(url, {
            waitUntil: 'networkidle2',
        })
        await page.pdf({
            format: 'A4',
            path: path.join(setting.pdf, `${fname}.pdf`)
        })
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
    await getGeoDataDetail('https://www.gbif.org/dataset/4bf1cca8-832c-4891-9e17-7e7a65b7cc81', 'test')
    console.log('finished!')
    process.exit(0)
})()