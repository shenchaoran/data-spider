import * as requestAsync from 'request-promise'
import * as Bluebird from 'bluebird'
import * as _ from 'lodash'
import * as cheerio from 'cheerio'
import { DataItemModel } from '../models'
import { USER_AGENTS } from './user-agent'
import { DataSite } from './site.base'

export default class ArcGISHub extends DataSite {
    count=1946102
    pageSize = 99
    pageNum
    dataItems = []
    counter = 1

    source = 'ArcGIS Hub'
    sourceSite = 'https://hub.arcgis.com/search'
    updateDetailPageSize = 60
    detailPageIgnoreDomains = [
        // 'arcgis.gis.lacounty.gov'
    ]
    networkidle = 'networkidle2'
    timeout = 240000
    // headless=false

    constructor() {
        super()
        // this.pageNum = Math.ceil(this.count/this.pageSize)
        this.pageNum = 102
    }

    async getAllPages() {
        return Bluebird.map(new Array(this.pageNum).fill(1).map((v,i) => i+v), i => {
            return this.getSinglePage(i)
        }, {
            concurrency: 20
        })
    }

    private async getSinglePage(pageNum) {
        const user_agent = USER_AGENTS[Math.floor(Math.random()*USER_AGENTS.length)]
        return requestAsync({
            url: 'https://opendata.arcgis.com/api/v3/datasets',
            method: 'GET',
            qs: {
                fields: {
                    datasets: 'sector,name,modified,modifiedProvenance,searchDescription,recordCount,source,extent,owner,thumbnailUrl,type,url,xFrameOptions,contentSecurityPolicy,siteUrl,tags,collection,size,initiativeCategories,slug,startDate,venue,initiativeId,initiativeTitle,organizers,isAllDay,onlineLocation,timeZone',
                },
                agg: {
                    fields: 'downloadable,hasApi,sector,region,source,tags,type',
                },
                filter: {
                    openData: true,
                },
                page: {
                    size: this.pageSize,
                    number: pageNum,
                }
            },
            json: true,
            headers: {
                // Cookie: 'AMCVS_ED8D65E655FAC7797F000101%40AdobeOrg=1; s_cc=true; AAMC_esri_0=REGION%7C11; tp=8505; s_dslv=1557190117845; _ga=GA1.2.985840464.1557289695; _gid=GA1.2.1005936660.1557289695; AMCV_ED8D65E655FAC7797F000101%40AdobeOrg=-715282455%7CMCIDTS%7C18026%7CMCMID%7C12645752214422942191933122050515699895%7CMCAAMLH-1557997430%7C11%7CMCAAMB-1557997430%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1557399830s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C4.2.0; gpv_pn=developers.arcgis.com; gpv_v9=developers.arcgis.com; adcloud={%22_les_v%22:%22y%2Carcgis.com%2C1557394433%22}; s_tp=5232; s_ptc=0.03%5E%5E0.00%5E%5E0.00%5E%5E0.91%5E%5E0.58%5E%5E0.08%5E%5E5.89%5E%5E0.03%5E%5E7.47; s_ppv=developers.arcgis.com%2C96%2C18%2C5037',
                Connection: 'keep-alive',
                // 'Accept-Encoding': 'gzip, deflate, br',
                Host: 'opendata.arcgis.com',
                Referer: 'https://hub.arcgis.com/search',
                Origin: 'https://hub.arcgis.com',
                'User-Agent': user_agent,
            }
        }).then(res => {
            console.log(`counter: ${this.counter++}, page num: ${pageNum}`)
            let docs = _.get(res, 'data')
            if(docs) {
                let fn = () => {
                    // console.log(`page num: ${pageNum}, response doc size: ${docs.length}`)
                    _.chain(docs)
                        .map(item => {
                            let OGMS_category
                            let doc = item.attributes
                            this.dataItems.push({
                                label: _.get(doc, 'name'),
                                url: [`https://hub.arcgis.com/datasets/${_.get(doc, 'slug')}`],
                                description: _.get(doc, 'searchDescription'),
                                original_category: _.get(doc, 'sector'),
                                OGMS_category,
                                source: this.source,
                                sourceSite: this.sourceSite,
                                tags: _.get(doc, 'tags'),
                                owner: _.get(doc, 'owner'),
                            })
                        })
                        .value()
                }
                if(this.counter%20 === 0) {
                    return new Bluebird((resolve, reject) => {
                        setTimeout(() => {
                            fn()
                            resolve()
                        }, 20000);
                    })
                }
                else {
                    fn()
                }
            }
        })
        .catch(e => {
            console.log(`page num failed: ${pageNum}`)
        })
    }

    protected async beforeVisitSite(doc: any): Promise<any> {
        const url = _.get(doc, 'url.0')
        if(url && url.indexOf('undefined') !== -1) {
            return false
        }
        else {
            return true
        }
    }

    protected async beforeGetItemDetail(page: any): Promise<any> {
        await page.waitForSelector('.container.skip-to h2', {
            timeout: this.timeout,
        })
        return 
    }

    // protected async onDetailPageResponse(response: any, doc: any) {

        // const url = response.url()
        // if (response.request().resourceType() === 'document') {
        //     // console.log(url)
        //     const res = await response.text()
        //     const $ = cheerio.load(res)
        //     _.map($('.documentByLine.category .link-category'), tagDom => {
        //         if(!doc.tags) {
        //             doc.tags = []
        //         }
        //         doc.tags.push($(tagDom).text())
        //     })
        //     _.map($('#themes-tags .link-category'), dom => {
        //         if(!doc.original_category) {
        //             doc.original_category = []
        //         }
        //         doc.original_category.push($(dom).text())
        //     })
        //     return DataItemModel.updateOne({ _id: doc._id }, {
        //         $set: {
        //             tags: doc.tags,
        //             original_category: doc.original_category,
        //             _updateFlag: 'after-fetch-pdf',
        //         }
        //     })
        // }
    // }
}