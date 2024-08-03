require('dotenv').config();
require('express-async-errors');
const express = require('express');

//security
const cors = require('cors');
const helmet = require('helmet');
const yamljs = require('yamljs');
const xss = require('express-rate-limit');
const swagger = require('swagger-ui-express');

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss({
  windowMs: 15 * 60 * 1000,    // 15 min
  max : 100     // limit of request per windowms per ip
}));

const swaggerDoc = yamljs.load('./swagger.yaml');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//connect to DB
const connectDB = require('./db/connect')

//authenticate middleware

const authorize = require('./middleware/authentication');

// routes

const jobRouter = require('./routes/jobs');
const authRouter = require('./routes/auth');

app.get('/api-use',swagger.serve, swagger.setup(swaggerDoc));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authorize, jobRouter);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
