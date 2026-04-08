const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const userRouter = require('./router/userRouter');
const requestRouter = require('./router/requestRouter');
const errorHadler = require('./middleware/errorHandler');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const https = require('https');
dotenv.config();

app.use(cors({ origin: [process.env.ORIGIN, "https://direwait.github.io"], credentials: true }));
app.use(cookieParser());
app.use(express.static('files'));
app.use(fileUpload({}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/requests', requestRouter);
app.use('/users', userRouter);
app.use(errorHadler);

app.listen(process.env.PORT, () => console.log(`server started on port ${process.env.PORT}`));
