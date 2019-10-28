#!/usr/bin/env node
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const { save } = require('../build/save');
const { logger } = require('../build/helpers/logger');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/archiver';
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async (connection) => {
    logger.info('> Database connected successfully');
    logger.info('> Starting Backup process');
    try {
      await save();
      logger.info('> Backup process done');
    } catch (err) {
      logger.error('> Backup process failed', err);
    }
    connection.disconnect();
  });
