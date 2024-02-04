import { sign } from 'jsonwebtoken'
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';
import { config } from '../../config';
import { ObjectId } from 'mongoose';
const User = require('../models/user')

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ username });
        if (!user) { return done(null, false); }
        return done(null, user);
    } catch(error) {
        if (error) { return done(error); }
    }
}));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

export const getToken = function(user: {_id: ObjectId}) {
    return sign(user, config.secretKey,
        {expiresIn: 3600});
};

const jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
const secretOrKey = config.secretKey;

export const jwtPassport = passport.use(new JWTStrategy({
    jwtFromRequest,
    secretOrKey
},
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        // @ts-ignore
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));

export const localAuth = passport.authenticate('local', { session: false });

export const verifyUser = passport.authenticate('jwt', {session: false});