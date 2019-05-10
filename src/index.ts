import ESGF from './controller/esgf.site'
import ArcGISHub from './controller/arcgis.site'
import Fluxnet from './controller/fluxnet.site'
import Genesys from './controller/genesys.site'
import GBIF from './controller/gbif.site'
import SEDAC from './controller/sedac.site'
import GeoData from './controller/geodata.site'
import CASEARTH from './controller/casearth.site'
import EEA from './controller/eea.site'

(async () => {
    const esgf = new ESGF()
    const arcgisHub = new ArcGISHub()
    const fluxnet = new Fluxnet()
    const genesys = new Genesys()
    const bgif = new GBIF()
    const sedac = new SEDAC()
    const geoData = new GeoData()
    const casearth = new CASEARTH()
    const eea = new EEA()

    // await esgf.start()
    // await arcgisHub.start()
    // await fluxnet.start()
    // await genesys.start()
    // await bgif.start()
    // await sedac.start()
    // await geoData.start()
    // await casearth.start()
    // await eea.start()
    
    await geoData.updateAllDetail()
})()