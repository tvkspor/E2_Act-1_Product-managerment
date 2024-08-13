const Product = require("../../models/products.model");
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

// [GET] /admin/product
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);
  let find = {
    deleted: false,
  };
  if (req.query.status) {
    find.status = req.query.status;
  }

  const objectSearch = searchHelper(req.query);

  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  // Pagination
  const coutProducts = await Product.countDocuments(find);

  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    coutProducts
  );
  // End pagination

  //Sort
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  //End sort

  const products = await Product.find(find)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip)
    .sort(sort);

  res.render("admin/pages/products/index", {
    pageTitle: "Danh sach san pham",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [PATCH] /admin/products/change-status/:statusChange/:id
module.exports.changeStatus = async (req, res) => {
  const { id, status } = req.params;
  await Product.updateOne(
    {
      _id: id,
    },
    {
      status: status,
    }
  );
  req.flash("success", "Cập nhật thành công");

  res.redirect("back");
};

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  let ids = req.body.ids;
  if (ids) {
    ids = ids.split(",");

    switch (type) {
      case "active":
      case "inactive":
        await Product.updateMany(
          {
            _id: { $in: ids },
          },
          {
            status: type,
          }
        );
        req.flash("success", `Cập nhật thành công ${ids.length} sản phẩm`);
        break;
      case "delete-all":
        await Product.updateMany(
          {
            _id: { $in: ids },
          },
          {
            deleted: true,
            deletedAt: new Date(),
          }
        );
        req.flash("success", `Cập nhật thành công ${ids.length} sản phẩm`);
        break;
      case "change-position":
        for (const item of ids) {
          let [id, position] = item.split("-");
          position = parseInt(position);
          await Product.updateOne(
            {
              _id: id,
            },
            {
              position: position,
            }
          );
        }
        break;
      default:
        break;
    }

    res.redirect(`back`);
  }
};

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  await Product.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedAt: new Date(),
    }
  );

  res.redirect("back");
};

// [GET] /admin/product/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/products/create", {
    pageTitle: "Tạo mới sản phẩm",
  });
};

// [POST] /admin/product
module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  if (req.body.position) {
    req.body.position = parseInt(req.body.position);
  } else {
    const countProduct = await Product.countDocuments();
    req.body.position = countProduct + 1;
  }

  const record = new Product(req.body);
  await record.save();

  req.flash("success", "Thêm mới sản phẩm thành công!");
  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  const id = req.params.id;

  const product = await Product.findOne({
    _id: id,
    deleted: false,
  });

  res.render("admin/pages/products/edit", {
    pageTitle: "Chỉnh sửa sản phẩm",
    product: product,
  });
};

// [PATCH] /admin/products/edit/:id
// module.exports.editPatch = async (req, res) => {
//   const id = req.params.id;

//   req.body.price = parseInt(req.body.price);
//   req.body.discountPercentage = parseInt(req.body.discountPercentage);
//   req.body.stock = parseInt(req.body.stock);
//   req.body.position = parseInt(req.body.position);

//   await Product.updateOne(
//     {
//       _id: id,
//       deleted: false,
//     },
//     req.body
//   );

//   req.flash("success", "Cập nhật sản phẩm thành công!");
//   res.redirect(`back`);
// };

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);

  await Product.updateOne(
    {
      _id: id,
      deleted: false,
    },
    req.body
  );

  req.flash("success", "Cập nhật sản phẩm thành công!");
  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  const id = req.params.id;

  const product = await Product.findOne({
    _id: id,
    deleted: false,
  });

  res.render("admin/pages/products/detail", {
    pageTitle: `Sản phẩm: ${product.title}`,
    product: product,
  });
};
