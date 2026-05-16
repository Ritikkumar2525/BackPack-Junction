import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import Destination from './src/models/Destination.js';
import Trip from './src/models/Trip.js';
// check if PastExpedition or Blog exists
import fs from 'fs';
console.log(fs.readdirSync('./src/models'));
