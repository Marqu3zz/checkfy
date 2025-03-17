import {NextFunction, Request, Response, Router} from 'express';
import {authMiddleware} from '../auth/auth.middleware';
import {CustomerController} from '../controllers/customer.controller';

const router = Router();

router.get('/', authMiddleware, async function (req: Request, res: Response, next: NextFunction) {
  try {
    const customers = await CustomerController.getAll();

    res.status(200).json(customers);
  } catch (err) {
    next(err);
  }
});

export default router;
