#!/usr/bin/env node
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { save } = require('../build/save');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/archiver';
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async (connection) => {
    console.log('> Database connected successfully');
    console.log('> Starting Backup process');
    await save();
    console.log('> Backup process done');
    connection.disconnect();
  });
