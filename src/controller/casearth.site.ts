import * as requestAsync from 'request-promise'
import * as Bluebird from 'bluebird'
import * as _ from 'lodash'
import { DataItemModel } from '../models'
import { USER_AGENTS } from './user-agent'
import { DataSite } from './site.base'

export default class CASEARTH extends DataSite {
    count=446
    pageSize = 500
    pageNum
    dataItems = []
    counter = 1

    source = '数据共享服务系统'
    sourceSite = 'http://data.casearth.cn/'
    updateDetailPageSize = 100
    detailPageIgnoreDomains = []
    timeout = 60000

    constructor() {
        super()
        this.pageNum = Math.ceil(this.count/this.pageSize)
        // console.log(`page count ${this.pageNum}`)
    }

    async getAllPages() {
        return Bluebird.map(new Array(this.pageNum).fill(1).map((v,i) => i+v), i => {
            console.log(`counter: ${this.counter++}, page num: ${i}`)
            return this.getSinglePage(i)
        }, {
            concurrency: 20
        })
    }

    private async getSinglePage(pageNum) {
        const user_agent = USER_AGENTS[Math.floor(Math.random()*USER_AGENTS.length)]
        return requestAsync({
            url: `http://data.casearth.cn/sdo/getData`,
            method: 'GET',
            qs: {
                pageSize: this.pageSize,
                pageNo: pageNum,
                sortName: 'score',
                timerange: '0,2051',
                prodId: '',
                searchKey: '',
                tags: '',
                dataFormat: '',
                publisher: '',
                userType: '',
            },
            timeout: 20000,
            json: true,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Cookie: 'JSESSIONID=99F7184AF92A1F8CF20F50EE7A904780.tomcat1',
                Connection: 'keep-alive',
                // 'Accept-Encoding': 'gzip, deflate, br',
                Host: 'data.casearth.cn',
                // 'Proxy-Connection': 'keep-alive',
                // Referer: 'http://www.geodata.cn/data/',
                // Origin: 'https://hub.arcgis.com',
                // 'X-Requested-With': 'XMLHttpRequest',
                'User-Agent': user_agent,
            }
        }).then(res => {
            let docs = _.get(res, 'list')
            if(docs) {
                var fn = () => {
                    _.chain(docs)
                        .map(item => {
                            let OGMS_category
                            // TODO 根据 tag 重分类
                            this.dataItems.push({
                                label: _.get(item, 'title'),
                                url: [`http://data.casearth.cn/sdo/detail/${_.get(item, 'sdoid')}`],
                                description: _.get(item, 'desc'),
                                original_category: _.get(item, 'disciplineName'),
                                OGMS_category,
                                source: this.source,
                                sourceSite: this.sourceSite,
                                tags: _.get(item, 'tags'),
                                owner: _.get(item, 'publishDepartment'),
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

    protected async onDetailPageResponse(response: any, doc: any) {
        const url = response.url()
        if (url.match(/data\.casearth\.cn\/sdo\/visitSdo\?id\=/)) {
            const res = await response.json()
            return DataItemModel.updateOne({ _id: doc._id }, {
                $set: {
                    _updateFlag: 'after-fetch-pdf',
                }
            })
        }
    }
}