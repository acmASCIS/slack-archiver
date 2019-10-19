import dotenv from 'dotenv';
import cron from 'node-cron';
import mongoose from 'mongoose';
import express from 'express';

dotenv.config();

import { archive } from './archive';

const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server is running');
});
