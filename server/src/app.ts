import express from 'express';
import usersRoute from './routes/user.route';
import authRoute from "./auth/auth.route";
import customerRoute from './routes/customer.route';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/customers', customerRoute);

app.use("/", express.static("front"));
app.use("/", ((...args) => (req, res, next) => {
  if ((req.method === "GET" || req.method === "HEAD") && req.accepts("html")) {
    (res.sendFile || res.sendfile).call(res, ...args, err => err && next())
  } else {
    next()
  }
})("index.html", {
  root: "front"
}));

export default app;

