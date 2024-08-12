const Product = require("../../models/products.model");

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

// [GET] /products/detail/:slug
module.exports.detail = async (req, res) => {
  const slug = req.params.slug;

  const product = await Product.findOne({
    slug: slug,
    deleted: false,
    status: "active",
  });

  if (product) {
    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } else {
    res.redirect("/");
  }
};
