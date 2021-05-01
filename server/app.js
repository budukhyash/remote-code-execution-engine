import express from 'express';
import cors from 'cors'
import { coreRoutes } from './routes/core.js'
import parser from 'body-parser'

const app=express();

app.use(cors())
app.use(parser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
app.use(parser.json({limit: "50mb"}))
app.use(coreRoutes);

const port = process.env.PORT || 7000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
