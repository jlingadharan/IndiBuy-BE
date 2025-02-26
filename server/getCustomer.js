const pool = require("./db");

async function getCustomer(req, res) {

  const customer_id = req.params.customer_id; // Get customer_id from URL

  if (!customer_id) {
    return res.status(400).json({ message: "customer_id is required" });
  }

  const query = `
  SELECT 
    c.customer_id,
    c.full_name,
    c.email_id,
    c.phone_number,
    c.created_date AS customer_created_date,
    
    -- Address Details
    a.address_id,
    a.address_line_1,
    a.address_line_2,
    a.city,
    a.state,
    a.pin_code,
    
    -- Cart Details
    ca.cart_id,
    ca.product_id AS cart_product_id,
    ca.quantity AS cart_quantity,
    ca.total_amount AS cart_total_amount,
    ca.is_purchase AS is_cart_purchased,

    -- Purchase Details
    p.purchase_id,
    p.product_id AS purchased_product_id,
    p.quantity AS purchased_quantity,
    p.total_amount AS purchased_total_amount,
    p.purchase_date,
    
    -- Admin Access Details (if the customer is an admin)
    ad.admin_id,
    ad.can_read,
    ad.can_create,
    ad.can_update,
    ad.can_delete
    
FROM indibuy.Customer c

-- Join with Addresses table
LEFT JOIN indibuy.Addresses a 
    ON c.customer_id = a.customer_id

-- Join with Cart table
LEFT JOIN indibuy.Cart ca 
    ON c.customer_id = ca.customer_id

-- Join with Purchases table
LEFT JOIN indibuy.Purchases p 
    ON c.customer_id = p.customer_id

-- Join with Admin_Access table (to check if the customer is an admin)
LEFT JOIN indibuy.Admin_Access ad 
    ON c.customer_id = ad.customer_id
WHERE c.customer_id=${customer_id};
  `;

  const [result] = await pool.query(query);
  return res.status(200).json(result);
}

module.exports = {
  getCustomer
};
