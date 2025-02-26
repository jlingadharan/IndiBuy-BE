const pool = require("./db");

async function buyProduct(req, res) {
  console.log("body: ", req.body);
  let {
    customer_id,
    product_id,
    cart_id,
    quantity,
    total_amount,
    action,
    created_date,
  } = req.body;

  if (
    !customer_id ||
    !product_id ||
    !quantity ||
    !total_amount ||
    !action ||
    !created_date
  ) {
    return res
      .status(400)
      .json({ message: "Please provide valid Cart|Purchase details" });
  }

  const [product] = await pool.query(
    `SELECT quantity, price FROM indibuy.products WHERE product_id = ${product_id} AND is_active = TRUE;`
  );
  if (product.length === 0) {
    return res.status(404).json({ message: "Product not found or inactive" });
  }
  const availableQuantity = product[0].quantity;
  const productPrice = product[0].price;

  if (quantity > availableQuantity) {
    return res.status(400).json({ message: "Insufficient stock" });
  }

  if (cart_id == null) {
    const [cartResult] = await pool.query(
      `INSERT INTO indibuy.Cart (customer_id, product_id, quantity, total_amount, created_date, is_active) 
      VALUES (${customer_id}, ${product_id}, ${quantity}, ${total_amount}, "${created_date}", TRUE);`
    );
    cart_id = cartResult.insertId;
    if (action == "addCart") {
      return res.status(200).json({
        message: "Cart successful",
        cart_id: cart_id,
      });
    }
  }

  if (action == "purchase") {
    const [purchaseResult] = await pool.query(
      `INSERT INTO indibuy.Purchases (customer_id, product_id, cart_id, quantity, total_amount, purchase_date) VALUES (${customer_id}, ${product_id}, ${cart_id}, ${quantity}, ${total_amount}, "${created_date}");`
    );

    await pool.query(
      `UPDATE indibuy.cart SET is_purchase = true where cart_id = ${cart_id};`
    );

    await pool.query(
      `UPDATE indibuy.products SET quantity = quantity - ${quantity} WHERE product_id = ${product_id};`
    );

    return res.status(200).json({
      message: "Purchase successful",
      purchaseId: purchaseResult.insertId,
      cartId: cart_id,
    });
  }

  if (action === "remove_cart") {
    // Soft delete from Cart
    await pool.query(
      `UPDATE indibuy.Cart SET is_active = FALSE WHERE customer_id = ${customer_id}
      AND product_id = ${product_id} AND cart_id= ${cart_id} And is_purchase=false;`
    );

    return res.status(200).json({
      message: "Item removed from cart successfully",
      cartId: cart_id
    });
  }
}

module.exports = {
  buyProduct,
};
