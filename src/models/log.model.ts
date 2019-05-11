import {  OgmsSchemaStatics, IOgmsModel } from './mongoose.base';
import { Document, Schema, Model, model } from 'mongoose';

const collectionName = 'SummaryLog';
const schema = new Schema({
    pageSize: Number,
    pageNumber: Number,
    source: String,
}, { collection: collectionName });
Object.assign(schema.statics, OgmsSchemaStatics)
interface ISummaryLogModel extends Model<ISummaryLogDocument>, IOgmsModel {}
export const SummaryLogModel: ISummaryLogModel = model<ISummaryLogDocument, ISummaryLogModel>(collectionName, schema);

export interface ISummaryLogDocument extends Document {
    pageSize: Number,
    pageNumber: Number,
    source: String,
}