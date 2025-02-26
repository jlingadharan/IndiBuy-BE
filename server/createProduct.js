const pool = require("./db");

async function createProduct(req, res) {
  console.log("body: ", req.body);
  const {
    product_name,
    product_description,
    price,
    quantity,
    category_id,
    created_by,
  } = req.body;

  // Validate mandatory fields
  if (!product_name || !price || !quantity || !created_by || !category_id) {
    return res
      .status(400)
      .json({ message: "Please provide valid product details" });
  }

  const [productResult] = await pool.query(
    `INSERT INTO indibuy.products (product_name, product_description, price, quantity, category_id, created_by) 
    VALUES ("${product_name}", "${product_description || null}", ${price},
    ${quantity}, ${category_id}, ${created_by});`
  );

  console.log("productResult: ", productResult);
  const product_id = productResult.insertId;

  return res.status(200).json({
    message: "Product created successfully",
    productId: product_id,
    categoryId: category_id,
  });

  // try {
  // } catch (error) {
  //   console.error("Error creating product:", error);
  //   return res
  //     .status(500)
  //     .json({ message: "Internal Server Error", error: error.message });
  // }
}

module.exports = {
  createProduct,
};
