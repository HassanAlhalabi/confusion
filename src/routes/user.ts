import { Router } from "express";
import passport from "passport";

export const userRouter = Router()

userRouter.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}), 
    // @ts-ignore
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registration Successful!'});
      });
    }
  });
});

userRouter.post('/login', passport.authenticate('local'), (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, status: 'You are successfully logged in!'});
});

userRouter.get('/logout', (req, res, next) => {
  if (req?.session) {
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    const err = new Error('You are not logged in!');
    // @ts-ignore
    err.status = 403;
    next(err);
  }
});