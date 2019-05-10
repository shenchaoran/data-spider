import { sites } from '../data/fluxnet.data'
import { DataItemModel } from '../models'
import { DataSite } from './site.base'

export default class Fluxnet extends DataSite {
    dataItems = []
    constructor() {
        super()
    }

    async getAllPages() {
        this.dataItems = sites.map(site => ({
            label: `fluxsite: ${site.name}`,
            url: site.url,
            OGMS_category: [],
            source: 'Fluxnet',
            sourceSite: 'https://fluxnet.fluxdata.org/',
        }))
        return
    }
}