const Product = require("../../models/products.model");

// [GET] /admin/dashboard
module.exports.index = (req, res) => {
  res.render("admin/pages/dashboard/index", {
    pageTitle: "Trang tong quat",
  });
};
