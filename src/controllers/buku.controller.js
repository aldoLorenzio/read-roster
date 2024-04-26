const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { bukuService } = require('../services');

const createBuku = catchAsync(async (req, res) => {
  const buku = await bukuService.createBuku(req.body);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: 'Create Buku Success',
    data: buku,
  });
});

const getBukus = catchAsync(async (req, res) => {
  const filter = { buku: req.query.title };
  const options = {
    take: req.query.take,
    skip: req.query.skip,
  };

  const result = await bukuService.queryBukus(filter, options);

  // res.status(httpStatus.OK).send({
  //   status: httpStatus.OK,
  //   message: 'Get Bukus Success',
  //   data: result,
  // });

  res.render('buku/getBuku.ejs', {
    bukus: result
  })
});

const getBuku = catchAsync(async (req, res) => {
  const buku = await bukuService.getBukuById(req.params.bukuId);
  if (!buku) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Buku not found');
  }

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Buku Success',
    data: buku,
  });
});

const updateBuku = catchAsync(async (req, res) => {
  const buku = await bukuService.updateBukuById(req.params.bukuId, req.body);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Update Buku Success',
    data: buku,
  });
});

const deleteBuku = catchAsync(async (req, res) => {
  await bukuService.deleteBukuById(req.params.bukuId);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Delete Buku Success',
    data: null,
  });
});

module.exports = {
  createBuku,
  getBukus,
  getBuku,
  updateBuku,
  deleteBuku,
};
