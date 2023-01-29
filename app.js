require("dotenv").config();
require("express-async-errors");

const express = require("express");
const cors = require("cors");
const connectDB = require("./db/connect");
const fileUpload = require("express-fileupload");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
const xss = require("xss-clean");
const helmet = require("helmet");

const authMiddleWare = require("./middleware/auth-middleware");
const errorMiddleware = require("./middleware/error-middleware");
const notFoundMiddleware = require("./middleware/not-found-middleware");

const authRouter = require("./routers/auth-route");
const adminRouter = require("./routers/admin-route");
const deliveryRouter = require("./routers/deliveries-route");
const incomeRouter = require("./routers/income-route");
const messageRouter = require("./routers/messages-route");
const ordersRouter = require("./routers/orders-route");
const usersRouter = require("./routers/users-route");

app.use(fileUpload({ useTempFiles: true }));
app.use(express.json());
app.use(xss());
app.use(helmet());
app.use(cors());

app.use("/auth", authRouter);
app.use("/admin", authMiddleWare, adminRouter);
app.use("/delivery", authMiddleWare, deliveryRouter);
app.use("/income", authMiddleWare, incomeRouter);
app.use("/message", authMiddleWare, messageRouter);
app.use("/orders", authMiddleWare, ordersRouter);
app.use("/users", authMiddleWare, usersRouter);

app.use(errorMiddleware);
app.use(notFoundMiddleware);

io.on("connection", (socket) => {
  console.log(socket.id);
});

const port = process.env.PORT || 9000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    server.listen(port, () => console.log(`listening to port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
