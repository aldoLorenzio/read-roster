const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { genreService } = require('../services');

const createGenre = catchAsync(async (req, res) => {
  const genre = await genreService.createGenre(req.body);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: 'Create Genre Success',
    data: genre,
  });
});

const getGenres = catchAsync(async (req, res) => {
  const filter = { genre: req.query.genre };
  const options = {
    take: req.query.take,
    skip: req.query.skip,
  };

  const result = await genreService.queryGenres(filter, options);

  // res.status(httpStatus.OK).send({
  //   status: httpStatus.OK,
  //   message: 'Get Genres Success',
  //   data: result,
  // });
  

  res.render('genre/getGenre.ejs', {
    genres: result
  })
});

const getGenre = catchAsync(async (req, res) => {
  const genre = await genreService.getGenreById(req.params.genreId);
  if (!genre) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Genre not found');
  }

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Genre Success',
    data: genre,
  });
});

const updateGenre = catchAsync(async (req, res) => {
  const genre = await genreService.updateGenreById(req.params.genreId, req.body);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Update Genre Success',
    data: genre,
  });
});

const deleteGenre = catchAsync(async (req, res) => {
  await genreService.deleteGenreById(req.params.genreId);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Delete Genre Success',
    data: null,
  });
});

module.exports = {
  createGenre,
  getGenres,
  getGenre,
  updateGenre,
  deleteGenre,
};
