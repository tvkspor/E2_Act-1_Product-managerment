const Product = require("../../models/products.model");

// [GET] /client/home
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });

  const newProducts = products.map((item) => {
    item.priceNew = parseFloat(
      ((item.price * (100 - item.discountPercentage)) / 100).toFixed(0)
    );
    return item;
  });

  // [GET] /client/products
  res.render("client/pages/products/index", {
    pageTitle: "Danh sach san pham",
    products: newProducts,
  });
};
