import ESGF from './controller/esgf.site'
import ArcGISHub from './controller/arcgis.site'
import Fluxnet from './controller/fluxnet.site'
import Genesys from './controller/genesys.site'
import GBIF from './controller/gbif.site'
import SEDAC from './controller/sedac.site'
import GeoData from './controller/geodata.site'
import CASEARTH from './controller/casearth.site'
import EEA from './controller/eea.site'
import * as puppeteer from 'puppeteer'
import * as _ from 'lodash'
import * as Bluebird from 'bluebird'
import * as fs from 'fs'
import * as path from 'path'
import * as cheerio from 'cheerio'
import { DataItemModel } from './models'
const mkdirp = require('mkdirp');
const EventEmitter = require('events')
let emitter = new EventEmitter()
emitter.setMaxListeners(0);

(async () => {
    console.log('build in chromium path: ' + puppeteer.executablePath())
    // const geoData = new GeoData()
    // const sedac = new SEDAC()
    // const fluxnet = new Fluxnet()
    // const casearth = new CASEARTH()
    // const eea = new EEA()
    const arcgisHub = new ArcGISHub()
    const genesys = new Genesys()
    const gbif = new GBIF()
    // const esgf = new ESGF()
    
    const sites = [
        // geoData, 
        // sedac,
        // fluxnet,
        // casearth,
        // eea, 
        arcgisHub,
        gbif,
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
    
    await Bluebird.map(sites, site => site.updateAllDetail())
    
    console.log('finished!')
    process.exit(0)
})()