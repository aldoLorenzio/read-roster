const httpStatus = require('http-status');
const prisma = require('../../prisma/client');
const ApiError = require('../utils/ApiError');

const createBuku = async (bukuBody) => {
  return prisma.buku.create({
    data: bukuBody,
  });
};

const queryBukus = async (filter, options) => {
  const { buku } = filter;
  const { take, skip } = options;
  const bukus = await prisma.buku.findMany({
    where: {
      title: {
        contains: buku,
        mode: 'insensitive',
      },
    },
    include: {
      Peminjaman: true,
    },
    take: take && parseInt(take),
    skip: skip && parseInt(skip),
    orderBy: {
      title: 'asc',
    },
  });
  return bukus;
};

const getBukuById = async (id) => {
  return prisma.buku.findFirst({
    where: {
      id,
    },
    include: {
      Peminjaman: true,
    },
  });
};

const updateBukuById = async (bukuId, updateBody) => {
  const buku = await getBukuById(bukuId);
  if (!buku) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Buku not found');
  }

  const updateBuku = await prisma.buku.update({
    where: {
      id: bukuId,
    },
    data: updateBody,
  });

  return updateBuku;
};

const deleteBukuById = async (bukuId) => {
  const buku = await getBukuById(bukuId);
  if (!buku) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Buku not found');
  }

  const deleteBuku = await prisma.buku.deleteMany({
    where: {
      id: bukuId,
    },
  });

  return deleteBuku;
};

const getAvailableBooksByName = async () => {
  return prisma.buku.findMany({
    where: {
      stock: {
        gt: 0, // Hanya ambil buku dengan stock lebih dari 0
      },
    },
    select: {
      id: true, // Pastikan untuk memilih ID juga untuk keperluan form submission
      title: true, // Ini asumsi 'title' adalah nama buku di database
    },
  });
};

module.exports = {
  createBuku,
  queryBukus,
  getBukuById,
  updateBukuById,
  deleteBukuById,
  getAvailableBooksByName,
};
