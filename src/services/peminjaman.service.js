const httpStatus = require('http-status');
const prisma = require('../../prisma/client');
const ApiError = require('../utils/ApiError');
const { bukuService, userService } = require('./index');
const { getBukuById } = require('./buku.service');

const createPeminjaman = async (peminjamanBody) => {
  const buku = await prisma.buku.findUnique({
    where: {
      id: peminjamanBody.bukuId,
    },
  });

  if (!buku || buku.stock < 1) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No available stock for the book or book not found');
  }

  await prisma.buku.update({
    where: {
      id: peminjamanBody.bukuId,
    },
    data: {
      stock: buku.stock - 1,
    },
  });

  return prisma.peminjaman.create({
    data: {
      ...peminjamanBody,
      bukuId: peminjamanBody.bukuId, // Use bukuId directly without a connect clause
    },
  });
};

const queryPeminjamans = async (filter = {}, options = {}) => {
  const { date_borrow, date_due } = filter;
  const { take = 10, skip = 0 } = options;

  return await prisma.peminjaman.findMany({
    include: {
      Buku: true,
      User: true, // Memastikan data user di-include
    },
    where: {
      ...(date_borrow && { date_borrow: { contains: date_borrow, mode: 'insensitive' } }),
      ...(date_due && { date_due: { contains: date_due, mode: 'insensitive' } }),
    },
    take: parseInt(take),
    skip: parseInt(skip),
  });
};

const getPeminjamanById = async (id) => {
  return prisma.peminjaman.findFirst({
    where: {
      id,
    },
    include: {
      User: true,
      Buku: true,
    },
  });
};

const updatePeminjamanById = async (peminjamanId, updateBody) => {
  const peminjaman = await getPeminjamanById(peminjamanId);
  // console.log('updatePeminjamanById', updatePeminjamanById);
  if (!peminjaman) throw new ApiError(httpStatus.NOT_FOUND, 'Peminjaman tidak ditemukan');

  const updatePeminjaman = await prisma.peminjaman.update({
    where: {
      id: peminjamanId,
    },
    data: updateBody,
  });
  // console.log('updatePeminjaman', updatePeminjaman);

  const buku = await getBukuById(updatePeminjaman.bukuId);
  // console.log('bukuuuu', buku);
  if (updateBody.date_returned) {
    await prisma.buku.update({
      where: {
        id: updatePeminjaman.bukuId,
      },
      data: {
        stock: buku.stock + 1,
      },
    });
  }

  // console.log(`Date_returned ${updateBody.date_returned}`);
  // console.log(`BukuId: ${updatePeminjaman.bukuId}`);
  // console.log(`BukuStock: ${buku.stock}`);
  return updatePeminjaman;
};

const deletePeminjamanById = async (peminjamanId) => {
  const peminjaman = await getPeminjamanById(peminjamanId);
  if (!peminjaman) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peminjaman not found');
  }

  const deletePeminjaman = await prisma.peminjaman.deleteMany({
    where: {
      id: peminjamanId,
    },
  });

  return deletePeminjaman;
};

const queryPeminjamansForUser = async (userId) => {
  return prisma.peminjaman.findMany({
    where: {
      userId, // Misalkan ada field userId pada tabel peminjaman
    },
    include: {
      Buku: true, // Misalkan setiap peminjaman mencakup data buku
    },
    // ... Anda bisa menambahkan opsi lain seperti sorting atau pagination
  });
};
module.exports = {
  createPeminjaman,
  queryPeminjamans,
  getPeminjamanById,
  updatePeminjamanById,
  deletePeminjamanById,
  queryPeminjamansForUser,
};
