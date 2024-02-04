import { sign } from 'jsonwebtoken'
import { ExtractJwt, Strategy } from 'passport-jwt';
import passport from 'passport';

import { config } from '../../config';

export const getToken = function(user) {
    return sign(user, config.secretKey,
        {expiresIn: 3600});
};

const jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
const secretOrKey = config.secretKey;

export const jwtPassport = passport.use(new Strategy({
    jwtFromRequest,
    secretOrKey
},
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
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

export const verifyUser = passport.authenticate('jwt', {session: false});