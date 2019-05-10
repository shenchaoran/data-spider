import * as requestAsync from 'request-promise'
import * as Bluebird from 'bluebird'
import * as _ from 'lodash'
import { DataItemModel } from '../models'
import { USER_AGENTS } from './user-agent'
import { DataSite } from './site.base'
import * as cheerio from 'cheerio'

export default class SEDAC extends DataSite {
    pageNum
    dataItems = []
    original_categories = ["agriculture", "climate", "conservation", "governance", "hazards", "health", "infrastructure", "land-use", "marine-and-coastal", "population", "poverty", "remote-sensing", "sustainability", "urban", "water"]
    
    source = 'SEDAC'
    sourceSite = 'https://sedac.ciesin.columbia.edu/'
    updateDetailPageSize = 10
    detailPageIgnoreDomains = []
    timeout = 60000
    
    constructor() {
        super();
    }

    async getAllPages() {
        return Bluebird.map(this.original_categories, category => {
            return this.getCategoryPage(category)
        }, {
            concurrency: 4
        })
    }

    private async getCategoryPage(category) {
        return requestAsync({
            url: `https://sedac.ciesin.columbia.edu/data/sets/browse`,
            method: 'GET',
            qs: {
                facets: `theme:${category}`
            },
        }).then(res => {
            const $ = cheerio.load(res)
            let g = $('.pagination-container').text().match(/of\s*(\d+)/)
            if(g && g.length) {
                const pageNum = g[1]
                return Bluebird.map(new Array(pageNum).fill(1).map((v, i) => i+v), i => {
                    return this.getSinglePage(i, category)
                }, {
                    concurrency: 4
                })
            }
        })
        .catch(e => {
            console.log(`category failed: ${category}`)
        })
    }

    private getSinglePage(pageNum, category) {
        return requestAsync({
            url: `https://sedac.ciesin.columbia.edu/data/sets/browse/${pageNum}`,
            method: 'GET',
            qs: {
                facets: `theme:${category}`
            },
        }).then(res => {
            const $ = cheerio.load(res)
            const list = $('.html5-section.set-result')
            _.map(list, item => {
                const label = $(item).find('h1').text()
                const url = 'https://sedac.ciesin.columbia.edu' + $(item).find('h1 a').attr('href')
                const description = $(item).find('.dataset-img-purpose p').text()
                const original_category = category
                const source = this.source
                const sourceSite = this.sourceSite
                this.dataItems.push({
                    label, url, description, original_category, source, sourceSite
                })
            })
        })
    }

    protected async onDetailPageResponse(response: any, doc: any) {
        const url = response.url()
        // if(url.match(/sedac\.ciesin\.columbia\.edu\/data\/set/)) {
        //     const res = await response.json()
        //     const $ = cheerio.load(res)

            
        // }
        return DataItemModel.updateOne({ _id: doc._id }, {
            $set: {
                _updateFlag: 'after-fetch-img',
            }
        })
    }
}