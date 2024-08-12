module.exports = (objectPagination, query, coutProducts) => {
  if (query.page) {
    objectPagination.currentPage = parseInt(query.page);
  }
  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limitItems;

  objectPagination.totalPage = Math.ceil(
    coutProducts / objectPagination.limitItems
  );

  return objectPagination;
};
