const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createPeminjaman = {
  body: Joi.object().keys({
    bukuId: Joi.string().custom(objectId).required(),
    userId: Joi.string().custom(objectId).required(),
    date_borrow: Joi.string().required(),
    date_due: Joi.string().required(),
    date_returned: Joi.string(),
  }),
};

const getPeminjamans = {
  query: Joi.object().keys({
    title: Joi.string(),
    sortBy: Joi.string(),
    take: Joi.number().integer(),
    skip: Joi.number().integer(),
  }),
};

const getPeminjaman = {
  params: Joi.object().keys({
    peminjamanId: Joi.string().custom(objectId),
  }),
};

const updatePeminjaman = {
  params: Joi.object().keys({
    peminjamanId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
        bukuId: Joi.string().custom(objectId),
        userId: Joi.string().custom(objectId),
        date_borrow: Joi.string(),
        date_due: Joi.string(),
        date_returned: Joi.string(),
    })
    .min(1),
};

const deletePeminjaman = {
  params: Joi.object().keys({
    peminjamanId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createPeminjaman,
  getPeminjamans,
  getPeminjaman,
  updatePeminjaman,
  deletePeminjaman,
};
