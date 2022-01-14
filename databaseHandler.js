const async = require('hbs/lib/async');
const {MongoClient,ObjectId} = require('mongodb');

const URL = 'mongodb+srv://sonhan14:trinhquocanh011@cluster0.dhmh6.mongodb.net/test';
const DATABASE_NAME = "FPTBook-ApplicationDev-Group2"

async function getdbo() {
    const client = await MongoClient.connect(URL);
    const dbo = client.db(DATABASE_NAME);
    return dbo;
}

async function insertObject(collectionName,objectToInsert){
    const dbo = await getdbo();
    const newObject = await dbo.collection(collectionName).insertOne(objectToInsert);
    console.log("Gia tri id moi duoc insert la: ", newObject.insertedId.toHexString());
}

async function searchObjectbyName(collectionName,name) {
    const dbo = await getdbo();
    const result = await dbo.collection(collectionName).find({name: name}).toArray()
    return result
}

async function searchObjectbyPrice(collectionName,price) {
    const dbo = await getdbo();
    const result = await dbo.collection(collectionName).find({price: price}).toArray()
    return result
}

async function getAll(collectionName){
    const dbo = await getdbo();
    const result = await dbo.collection(collectionName).find({}).toArray()
    return result
}

async function deleteDocumentById(collectionName, id) {
    const dbo = await getdbo();
    await dbo.collection(collectionName).deleteOne({ _id: ObjectId(id) })
}

async function getDocumentById(id,collectionName){
    const dbo = await getdbo();
    const result = await dbo.collection(collectionName).findOne({_id:ObjectId(id)})
    return result;
}

async function updateDocument(id,updateValues,collectionName){
    const dbo = await getdbo();
    await dbo.collection(collectionName).updateOne({_id:ObjectId(id)},updateValues)
}

module.exports = {searchObjectbyPrice, searchObjectbyName, insertObject, getAll, deleteDocumentById, getDocumentById, updateDocument}