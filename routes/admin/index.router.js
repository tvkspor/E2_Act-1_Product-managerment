const dashboardRoutes = require("./dashboard.router");
const productRoutes = require("./product.router");
const productCategoryRoutes = require("./product-category.router");

const systemConfig = require("../../config/system");

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;
  app.use(PATH_ADMIN + "/dashboard", dashboardRoutes);
  app.use(PATH_ADMIN + "/products", productRoutes);
  app.use(PATH_ADMIN + "/products-category", productCategoryRoutes);
};
