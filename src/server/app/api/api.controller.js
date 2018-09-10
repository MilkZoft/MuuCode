// Dependencies
import express from 'express';

// Configuration
import { $app } from '@configuration';

// Utils
import { isFunction } from '@utils/is';
import { camelCase, sanitize } from '@utils/string';

// Express Router
const Router = express.Router();

// Allowed Apps
const allowedApps = $app().allowed;

Router.get('/:application', (req, res) => {
  const { application } = req.params;
  const {
    action = 'get',
    appParams,
    query,
    all = false,
    order,
    orderBy,
    searchBy,
    searchTerm,
    fields
  } = sanitize(req.query);

  const apiParams = {
    application,
    action,
    appParams,
    query,
    all,
    order,
    orderBy,
    searchBy,
    searchTerm,
    fields
  };

  if (allowedApps[application] && !allowedApps[application].private) {
    res.dashboardAPI.get(apiParams, (response, rows) => {
      if (response) {
        res.json({
          information: {
            total: response.length,
            rows,
            apiParams
          },
          response
        });
      } else {
        res.json({
          error: true
        });
      }
    });
  } else {
    res.json({
      error: true,
      message: 'Unauthorized'
    });
  }
});

Router.get('/users/:endpoint*?', (req, res) => {
  const endpointMethod = camelCase(req.params.endpoint);

  if (isFunction(res.usersAPI[endpointMethod])) {
    return res.usersAPI[endpointMethod](response => {
      if (response) {
        res.json({
          response
        });
      } else {
        res.json({
          error: true
        });
      }
    });
  } else {
    res.json({
      error: true
    });
  }
});

// POST Method
Router.post('/users/:endpoint*?', (req, res) => {
  const endpointMethod = camelCase(req.params.endpoint);

  if (isFunction(res.usersAPI[endpointMethod])) {
    return res.usersAPI[endpointMethod](response => {
      if (response) {
        res.json({
          response
        });
      } else {
        res.json({
          error: res.content('Api.errors.noData')
        });
      }
    });
  } else {
    return res.json({
      error: res.content('Api.errors.noData')
    });
  }
});

export default Router;
