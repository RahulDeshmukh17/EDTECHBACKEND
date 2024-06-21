const express = require("express");
const userRoutes = require("./routes/User");
const courseRoutes = require("./routes/Course");
const paymentRoutes = require("./routes/Payment");
const profileRoutes = require("./routes/Profile");
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/clouudinary");
const fileUpload = require("express-fileupload");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;
database.dbconnect();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http:localhost:3000",
    credential: true,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/temp",
  })
);
cloudinaryConnect();

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running",
  });
});

app.listen(PORT, () => {
  console.log(`Server started successfully at ${PORT}`);
});
