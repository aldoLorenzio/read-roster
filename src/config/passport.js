const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./config');
const { tokenTypes } = require('./tokens');
const prisma = require('../../prisma/client');

// Fungsi untuk mengekstrak token dari cookies
const cookieExtractor = function(req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt']; // Pastikan nama cookie di sini sesuai dengan yang Anda gunakan
  }
  return token;
};

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(), // Ekstrak token dari header Authorization
    cookieExtractor // Ekstrak token dari cookies
  ])
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    const user = await prisma.user.findFirst({ where: { id: payload.sub } });
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
