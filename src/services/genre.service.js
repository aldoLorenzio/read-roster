const httpStatus = require('http-status');
const prisma = require('../../prisma/client');
const ApiError = require('../utils/ApiError');

const createGenre = async (genreBody) => {
  return prisma.genre.create({
    data: genreBody,
  });
};

const queryGenres = async (filter, options) => {
  const { genre } = filter;
  const { take, skip } = options;
  const genres = await prisma.genre.findMany({
    where: {
      genreName: {
        contains: genre,
      },
    },
    include: {
      subjects: true,
    },
    take: take && parseInt(take),
    skip: skip && parseInt(skip),
    orderBy: {
      genreName: 'asc',
    },
  });
  return genres;
};

const getGenreById = async (id) => {
  return prisma.genre.findFirst({
    where: {
      id,
    },
    include: {
      subjects: true,
    },
  });
};

const updateGenreById = async (genreId, updateBody) => {
  const genre = await getGenreById(genreId);
  if (!genre) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Genre not found');
  }

  const updateGenre = await prisma.genre.update({
    where: {
      id: genreId,
    },
    data: updateBody,
  });

  return updateGenre;
};

const deleteGenreById = async (genreId) => {
  const genre = await getGenreById(genreId);
  if (!genre) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Genre not found');
  }

  const deleteGenre = await prisma.genre.deleteMany({
    where: {
      id: genreId,
    },
  });

  return deleteGenre;
};

module.exports = {
  createGenre,
  queryGenres,
  getGenreById,
  updateGenreById,
  deleteGenreById,
};
