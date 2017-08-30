const db = require('sqlite');
const randomstring = require("randomstring");
const config = require('config')

const lo = require('_libs/lo')(module);

lo(config)
/**
 * Валидации строки на соответсвие url
 * @param {string} url - строка для проверки
 * @returns {boolean} - результат проверки
 */
function checkUrl(url) {
    let re = /^((http|ftp|https):\/\/)([-a-zA-Z0-9@:%._\+~#=]{2,256}[a-z]{2,6}\b)([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    let state = re.test(url);
    return state;
}



/**
 * Создание алиаса url
 * 
 * @author teknik2008
 * @returns {string} - алиас url
 */
function createShortUrl(userShort) {
    let code = userShort || randomstring.generate(8);
    let shortUrl = '/' + code;
    return shortUrl;
}

/**
 * Запись алиаса ссылки в бд. 
 * 
 * @author teknik2008
 * @param {string} urlStr - основная ссылка для записи в бд 
 * @param {string} userShort - сокращенная ссылка для записи в бд 
 * @returns {boolean} - результат записи 
 */
async function saveToDb(urlStr, shortUrl, limit = -1) {
    let createdAt = Math.ceil(Date.now() / 1000)
    let sqlTpl = 'INSERT INTO urls (url,short_url,created_at,`limit`) values ($url,$shortUrl,$createdAt,$limit)';
    let insertData = {
        $url: urlStr,
        $shortUrl: shortUrl,
        $createdAt: createdAt,
        $limit: limit
    };
    try {
        await db.run(sqlTpl, insertData);
        return true;
    } catch (e) {
        lo(e);
        return false;
    }
}

async function updateLimitToDb(id,limit){
    let sqlTpl='UPDATE urls set `limit`=$limit where id=$id';
    let updateData={
        $limit:limit,$id:id
    }
    try{
        await db.run(sqlTpl,updateData);
        return true;
    }catch(e){
        lo(e)
        return false;
    }
}

/**
 * Удаление ссылки по id
 * 
 * @author teknik2008
 * @param {any} id 
 * @returns 
 */
async function removeFromDb(id) {
    let sqlTpl = 'DELETE FROM urls where id=?';
    let removeData = [id];
    try {
        db.run(sqlTpl, removeData);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

/**
 * Проверяет нужно ли удалять запись из бд
 * 
 * @author teknik2008
 * @param {any} {created_at,id} 
 * @returns 
 */
async function isRemoveRow({ created_at, id }) {
    let rangeTime = (new Date() / 1000) - created_at;
    let limit = config.app.timeSaveLincs;
    let state = limit < rangeTime;
    if (state) {
        await removeFromDb(id);
    }
    return state;
}

async function isLimited({ limit, id }) {
    let state=false;
    if (limit == -1) {
        return true;
    }
    if(limit>1){
        state=await updateLimitToDb(id,limit-1)
    }else{
        state=await removeFromDb(id)
    }
    return state
}

/**
 * Выбирает из базы запись по сокращенной ссылке и проверяет время жизни ссылки
 * 
 * @author teknik2008
 * @param {string} shortUrl - сокращенная ссылка 
 * @returns {boolean} - результат проверки 
 */
async function getShortUrl(shortUrl) {
    let sqlTpl = 'SELECT id,url,short_url,created_at,`limit` from urls where short_url=? limit 1';
    let selectData = [shortUrl];
    let selected = await db.get(sqlTpl, selectData);
    if (!selected) {
        return selected;
    }
    let isRemoved = await isRemoveRow(selected);
    let isLimitEnd = await isLimited(selected);
    if (isRemoved) {
        return false;
    }
    return selected;
}

exports.createNewShortUrl = async (ctx) => {
    let query = await db.all('select * from urls')
    let reqBody = ctx.request.body
    if (!('form' in reqBody) || (!reqBody.form.url)) {
        ctx.body = {
            success: false, error: {
                msg: 'Невалидный запрос'
            }
        }
        ctx.status = 400
        return
    };
    let { url: urlStr, short, limit } = reqBody.form;
    limit = limit && !isNaN(+limit) ? +limit : -1;
    let checkUrlStr = checkUrl(urlStr);
    if (!checkUrlStr) {
        ctx.body = {
            success: false, error: {
                msg: 'Невалидный url'
            }
        }
        ctx.status = 400
        return
    };
    let shortUrl = createShortUrl(short);
    let getShort = await getShortUrl(shortUrl);
    if (getShort) {
        ctx.body = {
            success: false, error: {
                msg: 'Данный url уже занят'
            }
        }
        ctx.status = 200
        return
    };
    let saveStatus = await saveToDb(urlStr, shortUrl, limit);
    if (!saveStatus) {
        ctx.body = {
            success: false, error: {
                msg: 'Сервис занят попробуйте позднее'
            }
        }
        ctx.status = 400
        return
    };
    ctx.body = {
        success: true,
        response: {
            url: shortUrl
        }
    };
}

exports.getFullUrlFromShort = async (ctx, next) => {
    let reqUrl = ctx.request.url;
    let getShort = await getShortUrl(reqUrl);
    if (!getShort) {
        await next()
        return;
    }
    let { url } = getShort
    ctx.redirect(url)
}