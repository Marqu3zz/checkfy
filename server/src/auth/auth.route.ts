import {Router, Request, Response, NextFunction} from "express";
import {AuthController} from "./auth.controller";

const router = Router();

router.post('/', async function (req: Request, res: Response, next: NextFunction) {
    try {
        const {user, token} = await AuthController.authenticate(req.body);
        res.status(200).cookie("user", token, {
            httpOnly: true,
            secure: true,
            maxAge: (30 * 24 * 60 * 60 * 1000)
        }).json({ user, token });
    }catch (err) {
        next(err)
    }
});

router.get('/', async function (req: Request, res: Response, next: NextFunction) {
  if (!req.cookies?.user) {
    res.status(401).send("Faça login para continuar.");
    return;
  }

  try {
    const user = await AuthController.validateAccessToken(req.cookies.user);
    res.status(200).json(user);
  } catch (err: any) {
    res.status(401).send(err.message);
  }
});

router.get("/logout", async function (req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).clearCookie("user", {httpOnly: true, secure: true}).send();
  } catch (err) {
    next(err);
  }
});

export default router;
