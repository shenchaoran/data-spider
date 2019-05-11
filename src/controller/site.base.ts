import { DataItemModel } from '../models'
import * as Bluebird from 'bluebird'
import * as _ from 'lodash'
import { setting } from '../config/setting'
import * as path from 'path'
import * as puppeteer from 'puppeteer'
import * as devices from 'puppeteer/DeviceDescriptors'

export class DataSite {
    dataItems = []
    source;
    detailTotal;
    updateDetailPageSize;
    detailPageIgnoreDomains = [];
    detailCounter = 1;
    networkidle = 'networkidle2';
    timeout = 60000
    headless = true;

    async getAllPages(): Promise<any> {}
    
    async save2db() {
        return DataItemModel.insertMany(this.dataItems)
    }
    
    async start() {
        if(this.source) {
            await DataItemModel.deleteMany({ source: this.source })
            console.log(`clear DB succeed: ${this.source}`)
        }
        await this.getAllPages()
        await this.save2db()
        console.log('finished!')
    }
    
    async updateAllDetail(): Promise<any> {
        const where = {
            source: this.source,
            _updateFlag: { $eq: null },
        }
        this.detailTotal = await DataItemModel.countDocuments(where)
        if(this.detailTotal !== 0) {
            const pageNum = Math.ceil(this.detailTotal / this.updateDetailPageSize)
            return Bluebird.mapSeries(new Array(pageNum).fill(1).map((v, i) => v + i), async pageIndex => {
                const { docs } = await DataItemModel.findByPages(
                    where,
                    { 
                        pageSize: this.updateDetailPageSize, 
                        pageIndex 
                    }
                )
                return Bluebird.map(docs, doc => {
                    return this.getItemDetail(doc)
                })
            })
        }
        else {
            console.log(`site finished: ${this.source}, class name ${this.constructor.name}`)
            return
        }
    }

    protected async getItemDetail(doc: any): Promise<any> {
        let browser
        try {
            let url = _.get(doc, 'url.0'),
                fname = _.get(doc, '_id').toString();
            // console.log(`fetch img from ${url}`)
            browser = await puppeteer.launch({
                headless: this.headless,
                ignoreHTTPErrors: true,
                // executablePath: setting.chromePath,
                args: [
                    // '--proxy-server=223.2.41.104:1080',
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                ],
            })
            const page = await browser.newPage()
            await page.setRequestInterception(true)
            page.setViewport({
                width: 1376,
                height: 768,
            })
            page.on('request', this.onDetailPageRequest)
            page.on('response', async response => {
                this.onDetailPageResponse(response, doc)
            })
            
            await page.goto(url, {
                waitUntil: this.networkidle,
                timeout: this.timeout,
            })
            
            await this.beforeGetItemDetail(page)

            await page.pdf({
                format: 'A4',
                printBackground: true,
                path: path.join(setting.pdf, `${this.constructor.name}/${fname}.pdf`)
            })
            await page.screenshot({
                fullPage: true,
                path: path.join(setting.img, `${this.constructor.name}/${fname}.jpg`)
            })
            await browser.close();
            console.log(`site ${this.source}, page detail progress: ${this.detailCounter++}/${this.detailTotal}`)

            await this.afterGetItemDetail(doc)
            return Bluebird.resolve(null)
        }
        catch (e) {
            console.error(e)
            try {
                browser.close()
            }
            catch(e) {}
            return Bluebird.resolve(null)
        }
    }

    protected async onDetailPageRequest(request): Promise<any> {
        try {
            const url = request.url()
            let ignore = false
            if(this.detailPageIgnoreDomains && this.detailPageIgnoreDomains.length) {
                _.map(this.detailPageIgnoreDomains, domain => {
                    if(url.indexOf(domain) !== -1) {
                        ignore = true
                    }
                })
            }
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
    }

    protected async onDetailPageResponse(response: any, doc: any) {
        
    }

    protected async beforeGetItemDetail(page: any): Promise<any> {
        return true
    }

    protected async afterGetItemDetail(doc: any): Promise<any> {
        return DataItemModel.updateOne({ _id: doc._id }, {
            $set: {
                _updateFlag: 'after-fetch-img',
            }
        })
    }

}