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
    
    source = 'EEA'
    sourceSite = 'http://www.geodata.cn'
    updateDetailPageSize = 10
    detailPageIgnoreDomains = [

    ]

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
                this.dataItems.push({
                    label, url, description, original_category, 
                    source: this.source, 
                    sourceSite: this.sourceSite,
                })
            })
        })
        .catch(e => {
            console.log(`category failed: ${category}`)
        })
    }

    protected async onDetailPageResponse(response: any, doc: any) {
        const url = response.url()
        if (response.request().resourceType() === 'document') {
            // console.log(url)
            const res = await response.text()
            const $ = cheerio.load(res)
            _.map($('.documentByLine.category .link-category'), tagDom => {
                if(!doc.tags) {
                    doc.tags = []
                }
                doc.tags.push($(tagDom).text())
            })
            _.map($('#themes-tags .link-category'), dom => {
                if(!doc.original_category) {
                    doc.original_category = []
                }
                doc.original_category.push($(dom).text())
            })
            return DataItemModel.updateOne({ _id: doc._id }, {
                $set: {
                    tags: doc.tags,
                    original_category: doc.original_category,
                    _updateFlag: 'after-fetch-pdf',
                }
            })
        }
    }
}