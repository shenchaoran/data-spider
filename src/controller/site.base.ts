import { DataItemModel } from '../models'
import * as Bluebird from 'bluebird'

export class DataSite {
    dataItems = []

    async getAllPages(): Promise<any> {}
    async save2db() {
        return DataItemModel.insertMany(this.dataItems)
    }
    async start() {
        await this.getAllPages()
        await this.save2db()
        console.log('finished!')
    }
}