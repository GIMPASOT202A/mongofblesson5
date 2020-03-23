const MongoClient = require('mongodb').MongoClient;
const assert = require('assert'); // this require helps us to setup a test mechanism on our codes
//Include this reference to the repos/circulation.js file
//Create a folder in the project called repos within it a file called circulationRepos.js
const circulationRepo = require('./repos/circulationRepos');
//Require this JSON file which is already included in the project
const data = require('./circulation.json');
const dbName = 'circulation';
const url = 'mongodb://localhost:27017';

async function main(){
 const client = new MongoClient(url);
 await client.connect(); ///stop processing until job gets done
 //the try catch method is a way that is used to enable catching of any potential error during execution
 try{
    const results = await circulationRepo.loadData(data);
    assert.equal(data.length, results.insertedCount); // this code ensure we have inserted exactly the same number of records into the database

    const getData = await circulationRepo.get(); // call the method get in the circulartionRepo file
    assert.equal(data.length, getData.length);

    const filterData = await circulationRepo.get({Newspaper: getData[4].Newspaper}); // call the method filterData in the circulartionRepo file
    assert.deepEqual(filterData[0], getData[4]);
    console.log(filterData[0]) //this display just one record per the filter criteria we used

    const limitData = await circulationRepo.get({}, 3); // get only first 3 items
    assert.equal(limitData.length, 3); //testing to confirm actually 3 items were returned
 }catch(error){
    console.log(error) // this section will trap any error that might come up in the try section
 }finally {
     //finally section is always executed
    const admin = client.db(dbName).admin();

    await client.db(dbName).dropDatabase();
    console.log(await admin.listDatabases());
    client.close();
 }
}
//Running this successfully you should see the ciruclation database created in the database server
main();