import * as path from 'path'

export const setting = {
    mongodb: {
        name: 'DataSpider',
        host: '223.2.41.104',
        port: '27017'
    },
    img: path.join(__dirname, '../data/img'),
    pdf: path.join(__dirname, '../data/pdf'),
    chromePath: 'C:/Users/SCR/AppData/Local/Google/Chrome SxS/Application/chrome.exe',
}