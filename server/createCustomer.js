const pool = require("./db");

async function createCustomer(req, res) {
  console.log("body: ", req.body);
  const {
    full_name,
    email_id,
    customer_password,
    phone_number,
    address_line_1,
    address_line_2,
    city,
    state,
    pin_code
  } = req.body;
  if (
    !full_name ||
    !email_id ||
    !customer_password ||
    !address_line_1 ||
    !address_line_2 ||
    !city ||
    !state ||
    !pin_code
  ) {
    return res
      .status(400)
      .json({ message: "Please provide valide customer details" });
  }
  const [customerResult] = await pool.query(
    `INSERT INTO indibuy.Customer (full_name, email_id, customer_password, phone_number) 
    VALUES ("${full_name}", "${email_id}", "${customer_password}","${
      phone_number || null
    }");`
  );
  console.log("customerResult: ", customerResult);
  const customer_id = customerResult.insertId;
  console.log("customerid: ", customer_id);

  const [addressResult] = await pool.query(
    `INSERT INTO indibuy.Addresses (customer_id, address_line_1, address_line_2, city, state, pin_code, created_by) 
    VALUES (${customer_id}, "${address_line_1}", "${address_line_2}", "${city}", "${state}",
    "${pin_code}", ${customer_id})`
  );
  console.log("addressResult: ", addressResult);

  const address_id = addressResult.insertId;

  console.log("addressid: ", address_id);
  return res.status(200).json({
    message: "Customer created successfully",
    customerId: customer_id,
    addressId: address_id
  });
}

module.exports = {
  createCustomer
};
