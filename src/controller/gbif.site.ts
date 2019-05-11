import * as requestAsync from 'request-promise'
import * as Bluebird from 'bluebird'
import * as _ from 'lodash'
import { DataItemModel } from '../models'
import { USER_AGENTS } from './user-agent'
import { DataSite } from './site.base'

export default class GBIF extends DataSite {
    count=44572
    pageSize = 1000
    pageNum
    dataItems = []

    source = 'GBIF'
    sourceSite = 'https://www.gbif.org'
    updateDetailPageSize = 100
    detailPageIgnoreDomains = []
    timeout = 120000
    networkidle = 'networkidle2';
    // headless=false
    
    constructor() {
        super()
        this.pageNum = Math.ceil(this.count/this.pageSize)
    }

    async getAllPages() {
        return Bluebird.map(new Array(this.pageNum).fill(0).map((v,i) => i+v), i => {
            return this.getSinglePage(i)
        }, {
            concurrency: 5
        })
    }

    private async getSinglePage(pageNum) {
        const user_agent = USER_AGENTS[Math.floor(Math.random()*USER_AGENTS.length)]
        return requestAsync({
            url: 'https://www.gbif.org/api/dataset/search',
            method: 'GET',
            qs: {
                locale: 'en',
                offset: pageNum*this.pageSize,
                limit: this.pageSize,
            },
            json: true,
            headers: {
                Cookie: '_ga=GA1.2.256866041.1557316444; _gid=GA1.2.1340841743.1557316444; userAcceptance=dec2018',
                Connection: 'keep-alive',
                'User-Agent': user_agent,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(res => {
            let docs = _.get(res, 'results')
            if(docs) {
                console.log(`page num: ${pageNum}, response doc size: ${docs.length}`)
                _.chain(docs)
                    .map(doc => {
                        let OGMS_category
                        this.dataItems.push({
                            label: _.get(doc, 'title'),
                            url: [`https://www.gbif.org/dataset/${_.get(doc, 'key')}`],
                            description: _.get(doc, 'description'),
                            original_category: _.get(doc, 'type'),
                            OGMS_category,
                            source: this.source,
                            sourceSite: this.sourceSite,
                            tags: _.get(doc, 'keywords'),
                            owner: _.get(doc, 'publishingOrganizationTitle'),
                        })
                    })
                    .value()
            }
        })
        .catch(e => {
            console.log(`page num failed: ${pageNum}`)
        })
    }

    protected async beforeGetItemDetail(page: any): Promise<any> {
        await page.waitForSelector('.horizontal-stripe.article-header h1', {
            timeout: this.timeout,
        })
        return 
    }
}