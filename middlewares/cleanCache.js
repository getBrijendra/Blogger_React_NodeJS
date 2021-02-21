const {clearHash} = require('../services/cache')

//middleware to clear cache, but it is called after the handler is called then this is called.
module.exports = async (req, res, next) => {
    await next() //trick to invoke routehandler first then called this middleware.
    clearHash(req.user.id)
}
