'use strict';

import { Prismic } from 'prismic.io';

// Wrap Prismic calls in promises

export const prismicApi = (endpoint, accessToken) => {
  return new Promise((resolve, reject) => {
    Prismic.Api(endpoint, (err, api) => {
      if (err) {
        reject(err);
      } else {
        resolve(api);
      }
    }, accessToken);
  });
};

export const prismicQuery = (api, query, options) => {
  return new Promise((resolve, reject) => {
    let form = api.form("everything");
    let opts = options || {};
    for (let key of Object.keys(opts)) {
      form.set(key, options[key]);
    }
    if (!opts.ref) {
      form.ref(api.master());
    }
    form.query(query).submit((err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

