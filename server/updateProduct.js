const pool = require("./db");

async function updateProduct(req, res) {
  console.log("body: ", req.body);
  const {
    product_id,
    product_name,
    product_description,
    price,
    quantity,
    category_id,
    modified_by,
    modified_date
  } = req.body;

  // Validate mandatory fields
  if (!product_id || !product_name || !price || !quantity || !category_id || !modified_by || !modified_date) {
    return res.status(400).json({ message: "Please provide valid product details" });
  }

  const [updateResult] = await pool.query(
    `UPDATE indibuy.products 
    SET product_name = "${product_name}", product_description = "${product_description || null}",
    price = ${price}, quantity = ${quantity}, category_id = ${category_id}, modified_by = ${modified_by},
    modified_date = "${modified_date}" 
    WHERE product_id = ${product_id}`
  );

  console.log("updateResult: ", updateResult);

  return res.status(200).json({
    message: "Product updated successfully",
    productId: product_id
  });

  // try {

  //   // Update product details
  
  // } catch (error) {
  //   console.error("Error updating product:", error);
  //   return res.status(500).json({ message: "Internal Server Error", error: error.message });
  // }
}

module.exports = {
  updateProduct
};
