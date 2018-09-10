export default (req, res, next) => {
  function get(apiParams, callback) {
    const {
      application,
      action,
      query,
      appParams = {},
      all,
      order,
      orderBy,
      searchBy,
      searchTerm,
      fields
    } = apiParams;

    if (action === 'get') {
      res.dashboardModel.cms(application).count(query, total => {
        res.dashboardModel
          .cms(application)
          .get({
            params: {
              all,
              order,
              orderBy,
              total,
              page: appParams.page || 0,
              fields
            },
            query
          }, result => callback(result, total));
      });
    } else if (action === 'search') {
      res.dashboardModel.cms(application).count(query, total => {
        res.dashboardModel
          .cms(application)
          .search({
            searchBy,
            searchTerm,
            params: {
              all,
              order,
              orderBy,
              total,
              page: appParams.page || 0,
              fields
            }
          }, results => callback(results));
      });
    }
  }

  // Methods
  res.dashboardAPI = {
    get
  };

  return next();
};
