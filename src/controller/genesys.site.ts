import * as requestAsync from 'request-promise'
import * as Bluebird from 'bluebird'
import * as _ from 'lodash'
import { DataItemModel } from '../models'
import { USER_AGENTS } from './user-agent'
import { DataSite } from './site.base'

export default class Genesys extends DataSite {
    count=2187
    pageSize = 100
    pageNum
    dataItems = []

    source = 'Genesys'
    sourceSite = 'https://beta.genesys-pgr.org'
    updateDetailPageSize = 20
    detailPageIgnoreDomains = []
    timeout = 60000

    constructor() {
        super()
        this.pageNum = Math.ceil(this.count/this.pageSize)
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
            url: 'https://beta.genesys-pgr.org/proxy/api/v1/dataset/list',
            method: 'POST',
            body: {
                d: 'ASC',
                f: '',
                l: this.pageSize,
                p: pageNum,
                s: 'id',
            },
            json: true,
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
                'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJ3cml0ZSIsInJlYWQiXSwiZXhwIjoxNTU3NDA5MzkwLCJhdXRob3JpdGllcyI6WyJST0xFX1RSVVNURURfQ0xJRU5UIiwiUk9MRV9FVkVSWU9ORSIsIlJPTEVfQ0xJRU5UIl0sImp0aSI6IjYwZmE5NzdiLTVkYWYtNDIwYi1iYTY4LWVhYzA4NWI4ZDZjZSIsImNsaWVudF9pZCI6ImFudmFxLnFhYkdpY3lvTmdUNlU0YjhVYWJlQHd3dy5nZW5lc3lzLXBnci5vcmcifQ.2x-yC8wEFvPX0z7ww9vt3LceQHzNInyCDM8NtB7qAvI',
                Cookie: '_ga=GA1.2.1161691095.1557316198; _gid=GA1.2.1654316031.1557316198; G_ENABLED_IDPS=google; access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJ3cml0ZSIsInJlYWQiXSwiZXhwIjoxNTU3NDA5MzkwLCJhdXRob3JpdGllcyI6WyJST0xFX1RSVVNURURfQ0xJRU5UIiwiUk9MRV9FVkVSWU9ORSIsIlJPTEVfQ0xJRU5UIl0sImp0aSI6IjYwZmE5NzdiLTVkYWYtNDIwYi1iYTY4LWVhYzA4NWI4ZDZjZSIsImNsaWVudF9pZCI6ImFudmFxLnFhYkdpY3lvTmdUNlU0YjhVYWJlQHd3dy5nZW5lc3lzLXBnci5vcmcifQ.2x-yC8wEFvPX0z7ww9vt3LceQHzNInyCDM8NtB7qAvI; authorities=%5B%22ROLE_TRUSTED_CLIENT%22%2C%22ROLE_EVERYONE%22%2C%22ROLE_CLIENT%22%5D',
                Connection: 'keep-alive',
                // 'Accept-Encoding': 'gzip, deflate, br',
                Referer: 'https://beta.genesys-pgr.org/datasets?s=id',
                Origin: 'https://beta.genesys-pgr.org',
                'User-Agent': user_agent,
                'x-custom-header': 'Genesys Frontend'
            }
        }).then(res => {
            let docs = _.get(res, 'content')
            if(docs) {
                console.log(`page num: ${pageNum}, response doc size: ${docs.length}`)
                _.chain(docs)
                    .map(item => {
                        let OGMS_category
                        this.dataItems.push({
                            label: _.get(item, 'title'),
                            url: [`https://beta.genesys-pgr.org/datasets/${_.get(item, 'uuid')}`],
                            description: _.get(item, 'description'),
                            original_category: _.get(item, 'sector'),
                            OGMS_category,
                            source: this.source,
                            sourceSite: this.sourceSite,
                            tags: _.get(item, 'crops'),
                            owner: _.get(item, 'owner.name'),
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