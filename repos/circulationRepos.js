const { MongoClient } = require('mongodb');

function circulationRepo(){
    const url = 'mongodb://localhost:27017';
    const dbName = 'circulation';

  function loadData(data){
      return new Promise(async (resolve, reject) => {
        const client = new MongoClient(url);
        try {
            await client.connect();
            const db = client.db(dbName);

            results = await db.collection('newspapers').insertMany(data);
            resolve(results);
            client.close();
        } catch(error) {
            reject(error)
         }
      })
  }

  function get(query,limit){
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url); // geting an instance of the mongoClient and passing in the URL
      try{
        await client.connect();
        const db = client.db(dbName);

        let items = db.collection('newspapers').find(query); // the find method does not actuallu hit the database yet, the next piece of code does the actual find
        if(limit > 0){
          items = items.limit(limit);
        }
        resolve(await items.toArray());
        client.close();
      }catch(error){
        reject(error);
      }
    });
  }
  return { loadData, get } // list of functions we are returning
}

module.exports = circulationRepo();