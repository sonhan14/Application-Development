const { MongoClient, ObjectId } = require("mongodb");

const URL = "mongodb://localhost:27017";
const DATABASE_NAME = "GCH0901-ApplicationDev";

async function getDB() {
  const client = await MongoClient.connect(URL);
  const dbo = client.db(DATABASE_NAME);
  return dbo;
}

async function insertObject(collectionName, objectToInsert) {
  const dbo = await getDB();
  const newObject = await dbo.collection(collectionName).insertOne(objectToInsert);
  console.log("Gia tri id moi duoc insert la: ", newObject.insertedId.toHexString());
}

async function find(collectionName, findObject) {
  const dbo = await getDB();
  // .sort({_id : -1}) mean is sort newest to oldest
  // .sort({_id : 1}) is the opposite
  const result = await dbo.collection(collectionName).find(findObject).sort({ time: -1 }).toArray();
  return result;
}

async function findOne(collectionName, findObject) {
  const dbo = await getDB();
  const result = await dbo.collection(collectionName).findOne(findObject);
  return result;
}

async function deleteOne(collectionName, deleteObject) {
  const dbo = await getDB();
  const result = await dbo.collection(collectionName).deleteOne(deleteObject);
  if (result.deletedCount > 0) {
    return true;
  } else {
    return false;
  }
}

async function checkUser(nameIn,passwordIn){
  const dbo = await getDB();
  const results = await dbo.collection("users").
      findOne({$and:[{username:nameIn},{password:passwordIn}]});
  if(results !=null)
      return true;
  else
      return false;
}

module.exports = { insertObject, find, findOne, deleteOne, checkUser };
