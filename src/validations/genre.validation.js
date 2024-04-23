const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createGenre = {
  body: Joi.object().keys({
    genre: Joi.string().required(),
  }),
};

const getGenres = {
  query: Joi.object().keys({
    genre: Joi.string(),
    sortBy: Joi.string(),
    take: Joi.number().integer(),
    skip: Joi.number().integer(),
  }),
};

const getGenre = {
  params: Joi.object().keys({
    genreId: Joi.string().custom(objectId),
  }),
};

const updateGenre = {
  params: Joi.object().keys({
    genreId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      genre: Joi.string().required(),
    })
    .min(1),
};

const deleteGenre = {
  params: Joi.object().keys({
    genreId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createGenre,
  getGenres,
  getGenre,
  updateGenre,
  deleteGenre,
};
