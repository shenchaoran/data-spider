import * as requestAsync from 'request-promise'
import * as Bluebird from 'bluebird'
import * as _ from 'lodash'
import { DataItemModel } from './models'
import { setting } from './config/setting'
import * as path from 'path'
const fs = Bluebird.promisifyAll(require('fs'));

(async () => {
    const docs = await DataItemModel.find({source: 'EEA'})
    await Bluebird.map(docs, async doc => {
        const fname = doc._id.toString()
        const src = path.join(setting.img, 'GeoData', `${fname}.jpg`)
        const dist = path.join(setting.img, 'EEA', `${fname}.jpg`)
        try {
            await fs.renameAsync(src, dist)
        }
        catch(e) {

        }
    }, {
        concurrency: 50
    })
    process.exit()
})()