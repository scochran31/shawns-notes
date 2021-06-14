const fs = require('fs');
const path = require('path');
const express = require('express');
const { db } = require('db');

const PORT = process.env.PORT || 3001;

const app = express();