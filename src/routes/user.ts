import { Router } from "express";
import passport from "passport";
import { getToken, localAuth, verifyUser } from "../authenticate";
const User = require('../models/user');

export const userRouter = Router()

userRouter.post('/signup', async (req, res, next) => {
  User.register(new User({ username: req.body.username }),
  // @ts-ignore
    req.body.password, async (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: err });
        return next()
      }
      else {
        if (req.body.firstname)
          user.firstname = req.body.firstname;
        if (req.body.lastname)
          user.lastname = req.body.lastname;
        try {
          await user.save();
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, status: 'Registration Successful!' });
          });
          return next()
        } catch(error) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({ err: error });
          return next()
        }

      }
    });
});

userRouter.post('/login', localAuth , (req, res) => {
  // @ts-ignore
  const token = getToken({_id: req?.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

// userRouter.get('/logout', (req, res, next) => {

//   else {
//     const err = new Error('You are not logged in!');
//     // @ts-ignore
//     err.status = 403;
//     next(err);
//   }
// });