import { RequestHandler } from 'express';

const homeRouter: RequestHandler = (req, res, next) => {
    res.end('Welcome To Node Course')
    next();
}

export default homeRouter;