const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService, bukuService, peminjamanService } = require('../services');
const ApiError = require('../utils/ApiError');

const register = catchAsync(async (req, res) => {
  const existingUser = await userService.getUserByEmail(req.body.email);
  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  const userCreated = await userService.createUser(req.body);
  // console.log('userCreated', userCreated);
  const tokens = await tokenService.generateAuthTokens(userCreated);
  // res.status(httpStatus.CREATED).send({ userCreated, tokens });
  res.redirect('/v1/auth/login');
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  // const user = await authService.loginUserWithEmailAndPassword(email, password);
  // const tokens = await tokenService.generateAuthTokens(user);
  // res.send({ user, tokens });
  // const { email, password } = req.body;
  // const user = await authService.loginUserWithEmailAndPassword(email, password);

  // if (user) {
  //   // const tokens = awit tokenService.generateAuthTokens(user);
  //   res.cookie('jwt', tokens.access.token, { httpOnly: true, secure: true });
  //   res.render('user/userDashboard', { user });
  // } else {
  //   res.status(httpStatus.UNAUTHORIZED).send({
  //     message: 'Invalid email or password',
  //   });
  // }
  // console.log('useeeeer',user);
  // console.log(`email: ${email}, password: ${email}`);
  try {
    const { user, tokens } = await authService.loginUserWithEmailAndPassword(email, password);
    res.cookie('jwt', tokens.access.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + 24 * 3600 * 1000), // Cookie expires in 1 day
    });

    if (user.role === 'admin') {
      const users = await userService.queryUsers({}, {});
      const bukus = await bukuService.queryBukus({}, {});
      const peminjamans = await peminjamanService.queryPeminjamans({}, {})
      // console.log('peminjamans admin', peminjamans);
      return res.render('user/adminDashboard', { user, users, bukus, peminjamans });
    }
    const peminjamans = await peminjamanService.queryPeminjamansForUser(user.id);
    const availableBooks = await bukuService.getAvailableBooksByName();
    return res.render('user/userDashboard', { user, peminjamans, availableBooks });
  } catch (error) {
    // Handle errors from the authService, e.g., user not found, password incorrect
    res.status(httpStatus.UNAUTHORIZED).send({
      message: error.message || 'Invalid email or password',
    });
  }
});

const loginPostman = catchAsync(async (req,res) =>{
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
})

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  loginPostman,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
