import { sites } from '../data/fluxnet.data'
import { DataItemModel } from '../models'
import { DataSite } from './site.base'

export default class Fluxnet extends DataSite {
    dataItems = []

    source = 'Fluxnet'
    sourceSite = 'https://fluxnet.fluxdata.org/'
    updateDetailPageSize = 10
    detailPageIgnoreDomains = []
    timeout = 60000

    constructor() {
        super()
    }

    async getAllPages() {
        this.dataItems = sites.map(site => ({
            label: `fluxsite: ${site.name}`,
            url: site.url,
            OGMS_category: [],
            source: this.source,
            sourceSite: this.sourceSite,
        }))
        return
    }
}