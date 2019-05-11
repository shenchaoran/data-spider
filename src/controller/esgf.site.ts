import * as requestAsync from 'request-promise'
import * as Bluebird from 'bluebird'
import * as _ from 'lodash'
import { DataItemModel } from '../models'
import { DataSite } from './site.base'
import { USER_AGENTS } from './user-agent'

export default class ESGF extends DataSite {
    count = 842785
    pageSize = 1000
    pageNum
    dataItems = []
    counter = 1
    constructor() {
        super()
        this.pageNum = Math.ceil(this.count / this.pageSize)
    }

    async getAllPages() {
        return Bluebird.map(new Array(this.pageNum).fill(0).map((v, i) => i), i => {
            console.log(`counter: ${this.counter++}, page num: ${i}`)
            return this.getSinglePage(i)
        }, {
                concurrency: 20
            })
    }

    private async getSinglePage(pageNum) {
        const user_agent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]
        const offset = pageNum * this.pageSize
        const limit = this.pageSize
        // console.log(`pageNum: ${pageNum} offset: ${offset}`)
        return requestAsync({
            uri: 'https://esgf-node.llnl.gov/esg-search/search/',
            method: 'GET',
            json: true,
            qs: {
                offset,
                limit,
                type: 'Dataset',
                replica: false,
                latest: true,
                format: 'application/solr+json',
                'project!': 'CMIP6',
                facets: 'project,product,institute,model,experiment,experiment_family,time_frequency,realm,cmor_table,ensemble,variable,variable_long_name,cf_standard_name,driving_model,data_node,source_id,impact_model,sector,social_forcing,co2_forcing,irrigation_forcing,crop,pft,vegetation,domain,rcm_name,rcm_version,start_date',

            },
            timeout: 60000,
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                // 'Content-Type': 'application/json',
                // 'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'zh-CN,zh;q=0.9',
                'Connection': 'keep-alive',
                'Cookie': 'JSESSIONID=37C4420CDAD409B3ECF5078FC0BF59BB; csrftoken=QvmAP6ttxLm7zDi9xTVatAe9LU2bIQEsisCbTkAVVsww2ls4UfwQ7s4NwBZ8Phav; sessionid=zkayl49n8gxrkt2nmv8q1xkqai5cfpua',
                'Host': 'esgf-node.llnl.gov',
                // 'Referer': 'https://esgf-node.llnl.gov/search/esgf-llnl/',
                'Upgrade-Insecure-Requests': 1,
                'User-Agent': user_agent,
            }
        }).then(res => {
            let fn = () => {
                let docs = _.get(res, 'response.docs')
                if (docs) {
                    // console.log(`page num: ${pageNum}, response doc size: ${docs.length}`)
                    _.chain(docs)
                        .map(item => {
                            let OGMS_category
                            this.dataItems.push({
                                label: item.title,
                                url: item.url.map(v => {
                                    v = v.replace(/\.xml/g, '.html')
                                    return v
                                }),
                                description: item.description,
                                original_category: item.sector,
                                OGMS_category,
                                source: 'ESGF'
                            })
                        })
                        .value()
                }
            }
            if(this.counter++%20 === 0) {
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
        })
            .catch(e => {
                console.log(`page num failed: ${pageNum}`)
            })
    }
}