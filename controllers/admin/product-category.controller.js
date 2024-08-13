const ProductCategory = require("../../models/product-category.model");

const systemConfig = require("../../config/system");

// [GET] /admin/products-category/
module.exports.index = async (req, res) => {
  const records = await ProductCategory.find({
    deleted: false,
  });

  res.render("admin/pages/products-category/index", {
    pageTitle: "Danh mục sản phẩm",
    records: records,
  });
};

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/products-category/create", {
    pageTitle: "Thêm mới danh mục sản phẩm",
  });
};

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  if (req.body.position) {
    req.body.position = parseInt(req.body.position);
  } else {
    const count = await ProductCategory.countDocuments();
    req.body.position = count + 1;
  }

  const record = new ProductCategory(req.body);
  await record.save();

  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};
