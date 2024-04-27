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

  const user = await prisma.user.findUnique({
    where: {
      id: peminjamanBody.userId,
    },
  });

  if (!buku) throw new ApiError(httpStatus.NOT_FOUND, 'Buku ID not found');
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User ID not found');

  if (buku.stock < 1) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Stock Buku Habis');
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
    data: peminjamanBody,
  });
};

const queryPeminjamans = async (filter, options) => {
  const { date_borrow, date_due } = filter;
  const { take, skip } = options;
  const peminjamans = await prisma.peminjaman.findMany({
    include: {
      Buku: true,
      User: true, // Asumsi bahwa ada relasi bernama 'buku' di model 'peminjaman'
    },
    where: {
      date_borrow: {
        contains: date_borrow,
        mode: 'insensitive',
      },
      date_due: {
        contains: date_due,
        mode: 'insensitive',
      },
    },
    take: take && parseInt(take),
    skip: skip && parseInt(skip),
  });
  return peminjamans;
};

const getPeminjamanById = async (id) => {
  return prisma.peminjaman.findFirst({
    where: {
      id,
    },
    include:{
      User:true,
      Buku:true,
    },
  });
};

const updatePeminjamanById = async (peminjamanId, updateBody) => {
  const peminjaman = await getPeminjamanById(peminjamanId);
  if (!peminjaman) throw new ApiError(httpStatus.NOT_FOUND, 'Peminjaman tidak ditemukan');

  const updatePeminjaman = await prisma.peminjaman.update({
    where: {
      id: peminjamanId,
    },
    data: updateBody,
  });

  const buku = await getBukuById(updatePeminjaman.bukuId);

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

  console.log(`Date_returned ${updateBody.date_returned}`);
  console.log(`BukuId: ${updatePeminjaman.bukuId}`);
  console.log(`BukuStock: ${buku.stock}`);
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
