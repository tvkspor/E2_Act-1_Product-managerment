module.exports = (query) => {
  let filterStatus = [
    {
      label: "Tất cả",
      status: "",
      class: "",
    },
    {
      label: "Hoạt động",
      status: "active",
      class: "",
    },
    {
      label: "Dừng hoạt động",
      status: "inactive",
      class: "",
    },
  ];

  if (query.status) {
    const index = filterStatus.findIndex((item) => item.status == query.status);
    filterStatus[index].class = "active";
  } else {
    const index = filterStatus.findIndex((item) => item.status == "");
    filterStatus[index].class = "active";
  }

  return filterStatus;
};
