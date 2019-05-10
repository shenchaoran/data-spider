import * as requestAsync from 'request-promise'
import * as Bluebird from 'bluebird'
import * as _ from 'lodash'
import { DataItemModel } from '../models'
import { USER_AGENTS } from './user-agent'
import { DataSite } from './site.base'

export default class ArcGISHub extends DataSite {
    count=225455
    pageSize = 99
    pageNum
    dataItems = []
    constructor() {
        super();
        // this.pageNum = Math.ceil(this.count/this.pageSize)
        this.pageNum = 102
    }

    async getAllPages() {
        return Bluebird.map(new Array(this.pageNum).fill(1).map((v,i) => i+v), i => {
            return this.getSinglePage(i)
        }, {
            concurrency: 100
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
            let docs = _.get(res, 'data')
            if(docs) {
                console.log(`page num: ${pageNum}, response doc size: ${docs.length}`)
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
                            source: '地理国情监测云平台',
                            sourceSite: 'http://www.dsac.cn/DataProduct',
                            tags: _.get(doc, 'tags'),
                            owner: _.get(doc, 'owner'),
                        })
                    })
                    .value()
            }
        })
        .catch(e => {
            console.log(`page num failed: ${pageNum}`)
        })
    }
}