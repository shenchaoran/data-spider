import * as requestAsync from 'request-promise'
import * as Bluebird from 'bluebird'
import * as _ from 'lodash'
import { DataItemModel } from '../models'
import { USER_AGENTS } from './user-agent'
import { DataSite } from './site.base'
import * as puppeteer from 'puppeteer'
import * as devices from 'puppeteer/DeviceDescriptors'
import { setting } from '../config/setting'
import * as path from 'path'
const EventEmitter = require('events')
let emitter = new EventEmitter()
emitter.setMaxListeners(0);

export default class GeoData extends DataSite {
    count = 23702
    pageSize = 200
    pageNum
    dataItems = []
    counter = 1
    detailCounter = 1
    detailTotal
    original_categories = [{ "id": "118", "name": "遥感数据", "value": 9365, "children": [{ "id": "120", "name": "卫星影像", "value": 6941, "children": [] }, { "id": "124", "name": "遥感解译产品", "value": 1442, "children": [] }, { "id": "123", "name": "反演数据产品", "value": 988, "children": [] }, { "id": "119", "name": "航片", "value": 2, "children": [] }, { "id": "125", "name": "其它", "value": 1, "children": [] }, { "id": "121", "name": "雷达影像", "value": 1, "children": [] }, { "id": "122", "name": "地物波谱", "value": 1, "children": [] }] }, { "id": "16", "name": "陆地表层", "value": 6400, "children": [{ "id": "17", "name": "基础地理", "value": 1760, "children": [] }, { "id": "18", "name": "土地利用/覆盖", "value": 1346, "children": [] }, { "id": "21", "name": "区划", "value": 1116, "children": [] }, { "id": "20", "name": "社会经济", "value": 725, "children": [] }, { "id": "24", "name": "土壤", "value": 595, "children": [] }, { "id": "19", "name": "人口", "value": 548, "children": [] }, { "id": "28", "name": "植被", "value": 393, "children": [] }, { "id": "29", "name": "生态", "value": 348, "children": [] }, { "id": "26", "name": "湖泊/水库", "value": 335, "children": [] }, { "id": "23", "name": "地貌", "value": 157, "children": [] }, { "id": "30", "name": "环境", "value": 143, "children": [] }, { "id": "32", "name": "其它", "value": 137, "children": [] }, { "id": "27", "name": "湿地", "value": 88, "children": [] }, { "id": "22", "name": "地形", "value": 54, "children": [] }, { "id": "31", "name": "灾害", "value": 51, "children": [] }, { "id": "25", "name": "沙漠/荒漠", "value": 49, "children": [] }] }, { "id": "48", "name": "自然资源", "value": 1009, "children": [{ "id": "52", "name": "土地资源", "value": 292, "children": [] }, { "id": "51", "name": "水资源", "value": 261, "children": [] }, { "id": "53", "name": "农业资源", "value": 163, "children": [] }, { "id": "50", "name": "生物资源", "value": 135, "children": [] }, { "id": "49", "name": "气候资源", "value": 111, "children": [] }, { "id": "57", "name": "能源资源", "value": 17, "children": [] }, { "id": "56", "name": "旅游资源", "value": 15, "children": [] }, { "id": "54", "name": "矿产资源", "value": 12, "children": [] }, { "id": "60", "name": "其它", "value": 7, "children": [] }, { "id": "58", "name": "可再生资源", "value": 1, "children": [] }, { "id": "55", "name": "药物资源", "value": 1, "children": [] }] }, { "id": "0", "name": "大气圈", "value": 734, "children": [{ "id": "14", "name": "大气成分", "value": 170, "children": [] }, { "id": "3", "name": "温度", "value": 130, "children": [] }, { "id": "2", "name": "气候", "value": 64, "children": [] }, { "id": "4", "name": "降水", "value": 64, "children": [] }, { "id": "13", "name": "大气质量", "value": 56, "children": [] }, { "id": "7", "name": "风速", "value": 47, "children": [] }, { "id": "1", "name": "综合观测", "value": 47, "children": [] }, { "id": "5", "name": "湿度", "value": 42, "children": [] }, { "id": "11", "name": "温室气体", "value": 39, "children": [] }, { "id": "6", "name": "日照", "value": 38, "children": [] }, { "id": "9", "name": "气压", "value": 37, "children": [] }, { "id": "12", "name": "气溶胶", "value": 19, "children": [] }, { "id": "10", "name": "辐射", "value": 19, "children": [] }, { "id": "8", "name": "蒸发", "value": 11, "children": [] }, { "id": "15", "name": "其它", "value": 1, "children": [] }] }, { "id": "104", "name": "日地空间环境与天文", "value": 557, "children": [{ "id": "107", "name": "银河系", "value": 178, "children": [] }, { "id": "111", "name": "电离层", "value": 113, "children": [] }, { "id": "113", "name": "地球磁场", "value": 93, "children": [] }, { "id": "112", "name": "中高层大气", "value": 59, "children": [] }, { "id": "110", "name": "磁层", "value": 38, "children": [] }, { "id": "105", "name": "太阳", "value": 30, "children": [] }, { "id": "108", "name": "河外与宇宙", "value": 28, "children": [] }, { "id": "117", "name": "其它", "value": 21, "children": [] }, { "id": "109", "name": "行星际空间环境", "value": 9, "children": [] }, { "id": "115", "name": "空间天气灾害事件", "value": 6, "children": [] }, { "id": "114", "name": "地面宇宙线", "value": 5, "children": [] }, { "id": "116", "name": "空间环境效应", "value": 2, "children": [] }, { "id": "106", "name": "太阳系", "value": 1, "children": [] }] }, { "id": "33", "name": "陆地水圈", "value": 465, "children": [{ "id": "35", "name": "地表水", "value": 184, "children": [] }, { "id": "34", "name": "水文", "value": 135, "children": [] }, { "id": "39", "name": "水环境", "value": 116, "children": [] }, { "id": "36", "name": "地下水", "value": 37, "children": [] }, { "id": "40", "name": "水化学", "value": 21, "children": [] }, { "id": "38", "name": "水利工程", "value": 5, "children": [] }, { "id": "37", "name": "水循环", "value": 4, "children": [] }, { "id": "41", "name": "其它", "value": 2, "children": [] }] }, { "id": "61", "name": "海洋", "value": 330, "children": [{ "id": "63", "name": "海洋水文", "value": 130, "children": [] }, { "id": "64", "name": "海洋气象", "value": 51, "children": [] }, { "id": "69", "name": "海洋地质", "value": 43, "children": [] }, { "id": "65", "name": "海洋化学", "value": 42, "children": [] }, { "id": "70", "name": "海洋物理", "value": 37, "children": [] }, { "id": "62", "name": "基础地理", "value": 20, "children": [] }, { "id": "75", "name": "其它", "value": 13, "children": [] }, { "id": "66", "name": "海洋生物", "value": 12, "children": [] }, { "id": "74", "name": "海岸带", "value": 4, "children": [] }, { "id": "67", "name": "海洋生态", "value": 4, "children": [] }, { "id": "73", "name": "海平面", "value": 3, "children": [] }] }, { "id": "98", "name": "古环境", "value": 247, "children": [{ "id": "101", "name": "陆地记录", "value": 155, "children": [] }, { "id": "100", "name": "海洋/湖泊记录", "value": 63, "children": [] }, { "id": "102", "name": "古气候重建", "value": 26, "children": [] }, { "id": "103", "name": "其它", "value": 14, "children": [] }] }, { "id": "76", "name": "极地", "value": 98, "children": [{ "id": "82", "name": "极地地理", "value": 29, "children": [] }, { "id": "77", "name": "极地海洋", "value": 28, "children": [] }, { "id": "78", "name": "极地地球物理", "value": 21, "children": [] }, { "id": "79", "name": "极地大气", "value": 15, "children": [] }, { "id": "83", "name": "极地地质", "value": 3, "children": [] }, { "id": "80", "name": "极地生物", "value": 2, "children": [] }, { "id": "86", "name": "极地天文", "value": 2, "children": [] }, { "id": "81", "name": "极地环境", "value": 1, "children": [] }] }, { "id": "42", "name": "冰冻圈", "value": 29, "children": [{ "id": "44", "name": "冰川", "value": 16, "children": [] }, { "id": "43", "name": "冻土", "value": 7, "children": [] }, { "id": "47", "name": "其它", "value": 5, "children": [] }, { "id": "46", "name": "雪", "value": 2, "children": [] }] }, { "id": "88", "name": "固体地球", "value": 26, "children": [{ "id": "93", "name": "地质", "value": 11, "children": [] }, { "id": "91", "name": "重力", "value": 9, "children": [] }, { "id": "90", "name": "地磁", "value": 5, "children": [] }, { "id": "89", "name": "地震", "value": 1, "children": [] }] }]
    constructor() {
        super()
        this.pageNum = Math.ceil(this.count / this.pageSize)
        console.log(`page count ${this.pageNum}`)
    }

    async getAllPages() {
        return Bluebird.map(new Array(this.pageNum).fill(1).map((v, i) => i + v), i => {
            console.log(`counter: ${this.counter++}, page num: ${i}`)
            return this.getSinglePage(i)
        }, {
                concurrency: 20
            })
    }

    private async getSinglePage(pageNum) {
        const user_agent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]
        const timestamp = new Date().getTime()
        return requestAsync({
            url: `http://www.geodata.cn/service/scidata/entry/search/`,
            method: 'GET',
            qs: {
                pageSize: this.pageSize,
                take: this.pageSize,
                skip: (pageNum - 1) * this.pageSize,
                page: pageNum,
                _: timestamp
            },
            timeout: 20000,
            json: true,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Cookie: 'Hm_lvt_0a0425100c365eab6abe990a53e0f22f=1557309443; JSESSIONID=543EE8B2EABFCEC64F15BAEDC8AA600A; Hm_lpvt_0a0425100c365eab6abe990a53e0f22f=1557411815',
                Connection: 'keep-alive',
                // 'Accept-Encoding': 'gzip, deflate, br',
                Host: 'www.geodata.cn',
                // 'Proxy-Connection': 'keep-alive',
                Referer: 'http://www.geodata.cn/data/',
                Origin: 'https://hub.arcgis.com',
                'X-Requested-With': 'XMLHttpRequest',
                'User-Agent': user_agent,
            }
        }).then(res => {
            let docs = _.get(res, 'op_read.data')
            if (docs) {
                var fn = () => {
                    _.chain(docs)
                        .map(item => {
                            let OGMS_category
                            this.dataItems.push({
                                label: _.get(item, 'title'),
                                // TODO 进一步爬详细信息
                                url: [`http://www.geodata.cn/data/datadetails.html?dataguid=${_.get(item, 'guid')}&docId=${_.get(item, 'docId')}`],
                                description: _.get(item, 'description'),
                                original_category: _.get(item, 'disciplineName'),
                                OGMS_category,
                                source: '国家地球系统科学数据共享服务平台',
                                sourceSite: 'http://www.geodata.cn',
                                tags: _.get(item, 'keywords'),
                                owner: _.get(item, 'ownerOrganization'),
                            })
                        })
                        .value()
                }
                if (this.counter % 20 === 0) {
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

    private async getItemDetail(doc) {
        try {
            let url = _.get(doc, 'url.0'),
                fname = _.get(doc, '_id').toString();
            const browser = await puppeteer.launch({
                headless: true,
                executablePath: setting.chromePath,
            })
            const page = await browser.newPage()
            page.setRequestInterception(true)
            page.setViewport({
                width: 1376,
                height: 768,
            })
            page.on('request', request => {
                try {
                    const url = request.url()
                    const ignoreDomains = [
                        'tianditu.gov',
                        'conac.cn',
                        'baidu.com'
                    ]
                    let ignore = false
                    _.map(ignoreDomains, domain => {
                        if(url.indexOf(domain) !== -1) {
                            ignore = true
                        }
                    })
                    if(ignore) {
                        request.abort('aborted')
                    }
                    else {
                        request.continue()
                    }
                }
                catch(e) {
                    console.error(e)
                }
            })
            page.on('response', async response => {
                const url = response.url()
                if (response.request().resourceType() === 'xhr') {
                    // console.log(url)
                    if (url.match(/\/entry\/\d+/)) {
                        const res = await response.json()
                        let description = [
                            _.get(res, 'op_read.descDataSource'),
                            _.get(res, 'op_read.descQuality'),
                            _.get(res, 'op_read.description'),
                        ]
                        let tags = _.get(res, 'op_read.keywords')
                        return DataItemModel.updateOne({ _id: doc._id }, {
                            $set: {
                                description,
                                tags,
                                _updateFlag: 'after-fetch-pdf',
                            }
                        })
                    }
                    else if (url.match(/\/withpublishers/)) {
                        const res = await response.json()
                        let original_category = res.op_read.map(v => v.categoryNamePath)
                        return DataItemModel.updateOne({ _id: doc._id }, {
                            $set: {
                                original_category,
                                _updateFlag: 'after-fetch-pdf',
                            }
                        })
                    }
                }
            })
            await page.goto(url, {
                waitUntil: 'networkidle2',
            })
            await page.pdf({
                format: 'A4',
                printBackground: true,
                path: path.join(setting.pdf, `${fname}.pdf`)
            })
            await page.screenshot({
                fullPage: true,
                path: path.join(setting.img, `${fname}.jpg`)
            })
            await browser.close();
            console.log(`page detail progress: ${this.detailCounter++}/${this.detailTotal}`)
        }
        catch (e) {
            console.error(e)
        }
    }

    async updateAllDetail() {
        const where = {
            source: '国家地球系统科学数据共享服务平台',
            _updateFlag: { $eq: null },
        }
        this.detailTotal = await DataItemModel.countDocuments(where)
        const pageSize = 5
        const pageNum = Math.ceil(this.detailTotal / pageSize)
        return Bluebird.mapSeries(new Array(pageNum).fill(1).map((v, i) => v + i), async pageIndex => {
            const { docs } = await DataItemModel.findByPages(
                where,
                { pageSize, pageIndex }
            )
            return Bluebird.map(docs, doc => {
                return this.getItemDetail(doc)
            })
        })
    }
}