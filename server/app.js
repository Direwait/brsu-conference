const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const userRouter = require('./router/userRouter');
const requestRouter = require('./router/requestRouter');
const reportRouter = require('./router/reportRouter');
const errorHadler = require('./middleware/errorHandler');
const fileUpload = require('express-fileupload');
dotenv.config();

app.use(cookieParser());
app.use(cors({ origin: process.env.ORIGIN, credentials: true }));
app.use(cookieParser());
// app.use(express.static('files'));
app.use(fileUpload({}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/requests', requestRouter);
// app.use('/reports', reportRouter);
app.use('/users', userRouter);
app.use(errorHadler);

app.listen(process.env.PORT, () => console.log(`server started on port ${process.env.PORT}`));