import {  OgmsSchemaStatics, IOgmsModel } from './mongoose.base';
import { Document, Schema, Model, model } from 'mongoose';

const collectionName = 'DataItem';
const schema = new Schema({
    label: String,
    url: [String],
    html: String,
    thumbnail: String,
    description: [String],
    OGMS_category: [String],
    original_category: [String],
    source: String,
    sourceSite: String,
    tags: [String],
    owner: String,
    schemaType: String,
    _updateFlag: String,
    _pageNum: String,
    _pageSize: String,
    _sourceData: Schema.Types.Mixed,
}, { collection: collectionName });
Object.assign(schema.statics, OgmsSchemaStatics)
interface IDataItemModel extends Model<IDataItemDocument>, IOgmsModel {}
export const DataItemModel: IDataItemModel = model<IDataItemDocument, IDataItemModel>(collectionName, schema);

export interface IDataItemDocument extends Document {
    label: String,
    url: [String],
    html: String,
    thumbnail: String,
    description: [String],
    OGMS_category: [String],
    original_category: [String],
    source: String,
    sourceSite: String,
    tags: [String],
    owner: String,
    schemaType: String,
    _updateFlag: String,
    _pageNum: String,
    _pageSize: String,
    _sourceData: any,
}