import * as requestAsync from 'request-promise'
import * as Bluebird from 'bluebird'
import * as _ from 'lodash'
import { DataItemModel, SummaryLogModel, } from '../models'
import { DataSite } from './site.base'
import { USER_AGENTS } from './user-agent'

export default class ESGF extends DataSite {
    restart = false
    count = 110528
    pageSize = 1000
    pageNum
    dataItems = []
    counter = 1
    
    source = 'ESGF'
    sourceSite = 'https://esgf-node.llnl.gov'
    updateDetailPageSize = 10
    timeout = 240000
    // headless=false
    detailPageIgnoreDomains = []
    networkidle = 'networkidle2';
    original_categories = ["Agriculture", "Biomes", "Coastal Infrastructure", "Ecosystems", "Health", "Lakes Global", "Marine Ecosystems and Fisheries Global", "Marine Ecosystems and Fisheries Regional", "Permafrost", "Terrestrial Biodiversity", "Water", "Water Global", "Water Regional"]

    constructor() {
        super()
        this.pageNum = Math.ceil(this.count / this.pageSize)
    }

    async getAllPages() {
        return Bluebird.map(new Array(this.pageNum).fill(0).map((v, i) => i), async i => {
            await this.getSinglePage(i)
            return Bluebird.resolve()
        }, { concurrency: 2 })
    }

    private async getSinglePage(pageNum) {
        try {
            const logDoc = {
                pageSize: this.pageSize,
                pageNumber: pageNum,
                source : this.source,
            }
            const log = await SummaryLogModel.findOne(logDoc)
            if(log) {
                return true
            }
            const user_agent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]
            const offset = pageNum * this.pageSize
            const limit = this.pageSize
            // console.log(`pageNum: ${pageNum} offset: ${offset}`)
            const res = await requestAsync({
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
                    sector: this.original_categories.join(',')
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
            })
            console.log(`counter: ${this.counter++}, page num: ${pageNum}`)
            let docs = _.get(res, 'response.docs')
            if (docs) {
                // console.log(`page num: ${pageNum}, response doc size: ${docs.length}`)
                let fetchedDocs = []
                _.chain(docs)
                    .map(item => {
                        let OGMS_category
                        fetchedDocs.push({
                            label: item.title,
                            url: item.url.map(v => {
                                v = v.replace(/\.xml/g, '.html')
                                return v
                            }),
                            description: item.description,
                            original_category: item.sector,
                            OGMS_category,
                            source: this.source,
                            _pageSize: this.pageSize,
                            _pageNum: pageNum,
                            _sourceData: item,
                        })
                    })
                    .value()
                await DataItemModel.insertMany(fetchedDocs)
                await SummaryLogModel.insert(logDoc)
                return true
            }
            if(this.counter%20 === 0) {
                return new Bluebird((resolve, reject) => {
                    setTimeout(() => {
                        resolve(true)
                    }, 20000);
                })
            }
        }
        catch(e) {
            console.log(`page num failed: ${pageNum}`)
            return true
        }
    }

    protected async beforeGetItemDetail(page: any): Promise<any> {
        await page.waitForSelector('table', {
            timeout: this.timeout,
        })
        return 
    }
}