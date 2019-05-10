import ESGF from './controller/esgf.site'
import ArcGISHub from './controller/arcgis.site'
import Fluxnet from './controller/fluxnet.site'
import Genesys from './controller/genesys.site'
import GBIF from './controller/gbif.site'
import SEDAC from './controller/sedac.site'
import GeoData from './controller/geodata.site'
import CASEARTH from './controller/casearth.site'
import EEA from './controller/eea.site'
import * as _ from 'lodash'
import * as Bluebird from 'bluebird'
import * as fs from 'fs'
import * as path from 'path'
import * as cheerio from 'cheerio'
const mkdirp = require('mkdirp');
const EventEmitter = require('events')
let emitter = new EventEmitter()
emitter.setMaxListeners(0);

(async () => {
    const esgf = new ESGF()
    const arcgisHub = new ArcGISHub()
    const fluxnet = new Fluxnet()
    const genesys = new Genesys()
    const gbif = new GBIF()
    const sedac = new SEDAC()
    const geoData = new GeoData()
    const casearth = new CASEARTH()
    const eea = new EEA()
    
    const sites = [
        geoData, 
        eea, 
        // arcgisHub,
        casearth,
        // gbif,
        sedac,
        genesys,
    ]

    await Bluebird.map(sites, site => {
        return Bluebird.all([
            new Bluebird((resolve, reject) => {
                mkdirp(path.join(__dirname, 'data/img', site.constructor.name), err => {
                    if(err)
                        reject(err)
                    else
                        resolve()
                })
            }),
            new Bluebird((resolve, reject) => {
                mkdirp(path.join(__dirname, 'data/pdf', site.constructor.name), err => {
                    if(err)
                        reject(err)
                    else
                        resolve()
                })
            })
        ])
    })
    
    return Bluebird.map(sites, site => site.updateAllDetail())
    
    console.log('finished!')
    process.exit(0)
})()