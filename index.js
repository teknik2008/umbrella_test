
const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const config = require('config');
const router=require('./router')
const db =require('./utils/db')
let lo = require('_libs/lo')(module);

const app = new Koa();



let middlewares = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();
middlewares.forEach(function (middleware) {
    if (middleware.indexOf('_not') > -1) return;
    app.use(require('./middlewares/' + middleware));
});
app.use(router.routes());


db().then(state=>{
    app.listen(config.site.port); 
    lo('Процесc запущен '+config.site.domain)
}).catch(err=>{
    lo(err)
})


