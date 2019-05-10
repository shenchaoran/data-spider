import * as puppeteer from 'puppeteer'
import * as devices from 'puppeteer/DeviceDescriptors'
const iPhone6 = devices['iPhone 6'];
import { setting } from '../config/setting'
import * as path from 'path'
import * as _ from 'lodash'

const getGeoDataDetail = async (url, fname) => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: 'C:/Users/SCR/AppData/Local/Google/Chrome SxS/Application/chrome.exe',
        })
        const page = await browser.newPage()
        page.setRequestInterception(true)
        page.setViewport({
            width: 1376,
            height: 768,
        })
        page.on('request', request => {
            try {
                const url = request.url()
                // if(request.resourceType() === 'xhr') {
                //     // console.log(url)
                // }
                const ignoreDomains = [
                    'tianditu.gov',
                    'conac.cn',
                    'baidu.com'
                ]
                let ignore = false
                _.map(ignoreDomains, domain => {
                    if(url.indexOf(domain) !== -1) {
                        ignore = true
                    }
                })
                if(ignore) {
                    request.abort('aborted')
                }
                else {
                    request.continue()
                }
            }
            catch(e) {
                console.error(e)
            }
        })
        page.on('response', response => {
            const url = response.url()
            if(response.request().resourceType() === 'xhr') {
                console.log(url)
                if(url.match(/\/entry\/\d+/)) {
                    response.json()
                        .then(res => {
                            res.op_read
                            // doc.description = res.op_read
                        })
                }
                else if(url.match(/\/withpublishers/)) {
                    response.json()
                        .then(res => {
                            res
                        })
                }
            }
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
    await getGeoDataDetail('http://www.geodata.cn/data/datadetails.html?dataguid=2191439&docId=4352', 'test')
    console.log('finished!')
})()