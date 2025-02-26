const pool = require("./db");

async function getProducts(req, res) {
  const [result] = await pool.query(
    "Select * from indibuy.products;");
    return res.status(200).json(result);
}

module.exports = {
  getProducts
};
