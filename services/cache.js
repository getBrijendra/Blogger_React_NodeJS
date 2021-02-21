const mongoose = require('mongoose')
const redis = require('redis')
const util = require('util')

const redisUrl = 'redis://127.0.0.1:6379'
const client = redis.createClient(redisUrl)
//promisify return a function which takes last param as callback and return promise based function. this is to avoid callback.
client.hget = util.promisify(client.hget)

const exec = mongoose.Query.prototype.exec

mongoose.Query.prototype.cache = function(options = {}) {
    this.useCache = true
    this.hashKey = JSON.stringify(options.key || 'default') 
    return this
}

//monkey patching the library function.
mongoose.Query.prototype.exec = async function() {
    if(this.useCache === false) {
        return await exec.apply(this, arguments)
    }

    const key = JSON.stringify(Object.assign({}, this.getFilter(), { collection: this.mongooseCollection.name }))

    //check value of key in cache, if found then return else exec query and save in redis cache
    if(!this.hashKey)
        this.hashKey = 'default'
    const cacheValue = await client.hget(this.hashKey, key)
    if(cacheValue) {
        const doc = JSON.parse(cacheValue)
        return Array.isArray(doc) 
            ? doc.map(d => {return new this.model(d)})
            : new this.model(doc)
    }
    const result = await exec.apply(this, arguments)
    client.hset(this.hashKey, key, JSON.stringify(result))//, 'EX', 10)
    return result
}

module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey))
    }
}