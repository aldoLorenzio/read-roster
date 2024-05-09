const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { peminjamanService } = require('../services');

const createPeminjaman = catchAsync(async (req, res) => {
  const userId = req.user.id;
  console.log('Request User ID:', userId);

  const peminjamanBody = {
    bukuId: req.body.bukuId,
    date_borrow: req.body.date_borrow,
    date_due: req.body.date_due,
    userId, // Mengambil ID dari pengguna yang terotentikasi
  };

  const peminjaman = await peminjamanService.createPeminjaman(peminjamanBody);
  console.log('peminjamannn', peminjaman);
  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: 'Create Peminjaman Success',
    data: peminjaman,
  });
});

const getPeminjamans = catchAsync(async (req, res) => {
  const filter = { peminjaman: req.query.peminjaman };
  const options = {
    take: req.query.take,
    skip: req.query.skip,
  };

  const result = await peminjamanService.queryPeminjamans(filter, options);

  // res.status(httpStatus.OK).send({
  //   status: httpStatus.OK,
  //   message: 'Get Peminjamans Success',
  //   data: result,
  // });

  res.render('peminjaman/getPeminjaman.ejs', {
    peminjamans: result,
  });
});

const getPeminjaman = catchAsync(async (req, res) => {
  const peminjaman = await peminjamanService.getPeminjamanById(req.params.peminjamanId);
  if (!peminjaman) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peminjaman not found');
  }

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Peminjaman Success',
    data: peminjaman,
  });
});

const updatePeminjaman = catchAsync(async (req, res) => {
  const peminjaman = await peminjamanService.updatePeminjamanById(req.params.peminjamanId, req.body);
  // console.log('updatePeminjaman peminjaman', peminjaman);
  // res.redirect('/v1/auth/login');
  // res.status(httpStatus.OK).send({
  //   status: httpStatus.OK,
  //   message: 'Update Peminjaman Success',
  //   data: peminjaman,
  // });

  res.render('successView.ejs', {
    message: 'Update peminjaman Success',
    redirect: '/v1/peminjaman',
  });
});

const editView = catchAsync(async (req, res) => {
  const peminjaman = await peminjamanService.getPeminjamanById(req.params.peminjamanId);

  res.render('peminjaman/editPeminjaman.ejs', {
    peminjamans: peminjaman,
  });
});

const deletePeminjaman = catchAsync(async (req, res) => {
  await peminjamanService.deletePeminjamanById(req.params.peminjamanId);

  // res.status(httpStatus.OK).send({
  //   status: httpStatus.OK,
  //   message: 'Delete Peminjaman Success',
  //   data: null,
  // });

  res.render('successView.ejs', {
    message: 'Delete Peminjaman Success',
    redirect: '/v1/peminjaman',
  });
});

module.exports = {
  createPeminjaman,
  getPeminjamans,
  getPeminjaman,
  updatePeminjaman,
  deletePeminjaman,
  editView,
};
