import { Prismic } from 'prismic.io';
const { Predicates } = Prismic;

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
    api.query(query, options || {}, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

export const prismicByID = (api, id, options) =>
  prismicQuery(api, Predicates.at('document.id', id), options);

export const prismicByUID = (api, type, uid, options) =>
  prismicQuery(api, Predicates.at('my.'+type+'.uid', uid), options);
