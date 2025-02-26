const express = require("express");
const { getProducts } = require("./server/getProducts");
const { getCustomer } = require("./server/getCustomer");
const { createCustomer } = require("./server/createCustomer");
const { createProduct } = require("./server/createProduct");
const { updateProduct } = require("./server/updateProduct");
const { buyProduct } = require("./server/buyProduct");

const app = express();

const PORT = 3000;

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get("/getProducts", async (req, res) => {
  const result = await getProducts(req, res);
  res.status(500).json({message: "Something went wrong!"});
});

app.get("/getCustomer/:customer_id", async (req, res) => {
  const result = await getCustomer(req, res);
  res.status(500).json({message: "Something went wrong!"});
});

app.post("/createCustomer", async (req, res) => {
  await createCustomer(req, res);
  return res.status(500).json({ message: "Something went wrong!" });
});

app.post("/createProduct", async (req, res) => {
  await createProduct(req, res);
  return res.status(500).json({ message: "Something went wrong!" });
});

app.post("/buyProduct", async (req, res) => {
  await buyProduct(req, res);
  return res.status(500).json({ message: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log("Running");
});
