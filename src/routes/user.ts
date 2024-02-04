import { Router } from "express";
import passport from "passport";
import { getToken } from "../authenticate";

export const userRouter = Router()

userRouter.post('/signup', (req, res, next) => {
  User.register(new User({ username: req.body.username }),
  // @ts-ignore
    req.body.password, (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: err });
      }
      else {
        if (req.body.firstname)
          user.firstname = req.body.firstname;
        if (req.body.lastname)
          user.lastname = req.body.lastname;
        // @ts-ignore
        user.save((err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({ err: err });
            return;
          }
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, status: 'Registration Successful!' });
          });
        });
      }
    });
});

userRouter.post('/login', passport.authenticate('local'), (req, res) => {
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