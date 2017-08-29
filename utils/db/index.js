const db = require('sqlite')
const config = require('config')


module.exports = async () => {
  await db.open(config.datebase.name, { cached: true });
  let migrate = await db.migrate();
  return true;
}  