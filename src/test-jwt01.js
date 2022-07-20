require('dotenv').config();

const jwt = require('jsonwebtoken');

const token = jwt.sign({id:12, account:'shin'}, process.env.JWT_SECRET);

console.log(token);

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImFjY291bnQiOiJzaGluIiwiaWF0IjoxNjU4MzAxNzQ3fQ.Jm_-c9TsCUkVhnZ5ZxlCcT5JHGAywTXPp-6iXESP2R0

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImFjY291bnQiOiJzaGluIiwiaWF0IjoxNjU4MzAxNzY3fQ.OCr2ZZO2DZrgizO2mCOq9ZuHkdSkZxwC_C5DZf4MRAc