const Router = require('koa-router');
const router = new Router();
const handlers = require('./handlers');

// router.get('/url',handlers.testGet)
router.post('/submit',handlers.createNewShortUrl)// создание сокращенной ссылки в бд

router.get('/:url',handlers.getFullUrlFromShort)
module.exports=router;