
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const routes = require('./routes')
const helmet = require('helmet')

const prisma = new PrismaClient();
const app = express();
const port = 3102;

app.use(cors());
app.use(bodyParser.json());
//console.log(prisma.campaign)

const user_validation_middleware = (req,res,next)=>{
  console.log("in middleware - for user access token verification.")
  next()
}

app.use('/',user_validation_middleware,routes)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
