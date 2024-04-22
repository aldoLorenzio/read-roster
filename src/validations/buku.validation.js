const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createBuku = {
  body: Joi.object().keys({
    genreId: Joi.string().custom(objectId).required(),
    title: Joi.string().required(),
    author: Joi.string().required(),
    year_published: Joi.number().required(),
    stock: Joi.number().required(),
  }),
};

const getBukus = {
  query: Joi.object().keys({
    title: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getBuku = {
  params: Joi.object().keys({
    bukuId: Joi.string().custom(objectId),
  }),
};

const updateBuku = {
  params: Joi.object().keys({
    bukuId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      genreId: Joi.custom(objectId),
      title: Joi.string(),
      author: Joi.string(),
      year_published: Joi.number(),
      stock: Joi.number(),
    })
    .min(1),
};

const deleteBuku = {
  params: Joi.object().keys({
    bukuId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createBuku,
  getBukus,
  getBuku,
  updateBuku,
  deleteBuku,
};
