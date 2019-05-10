import * as requestAsync from 'request-promise'
import * as Bluebird from 'bluebird'
import * as _ from 'lodash'
import { DataItemModel } from '../models'
import { USER_AGENTS } from './user-agent'
import { DataSite } from './site.base'
import * as cheerio from 'cheerio'

export default class EEA extends DataSite {
    pageNum
    dataItems = []
    original_categories = ["soil", "energy", "human", "transport", "agriculture", "policy", "waste", "climate-change-adaptation", "water", "chemicals", "sustainability-transitions", "climate", "biodiversity", "industry", "air", "regions", "coast_sea", "landuse"]
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
            url: `https://www.eea.europa.eu/data-and-maps/data/@@faceted_query`,
            method: 'GET',
            qs: {
                b_start:0,
                'c0[]': 50,
                'c11[]': category,
            },
        }).then(res => {
            const $ = cheerio.load(res)
            const list = $('.tileItem.visualIEFloatFix')
            _.map(list, item => {
                const label = $(item).find('.tileHeadline a').text()
                const url = $(item).find('.tileHeadline a').attr('href')
                const description = $(item).find('.tileBody').text()
                const original_category = category
                const source = 'EEA'
                const sourceSite = 'https://www.eea.europa.eu'
                this.dataItems.push({
                    label, url, description, original_category, source, sourceSite
                })
            })
        })
        .catch(e => {
            console.log(`category failed: ${category}`)
        })
    }
}