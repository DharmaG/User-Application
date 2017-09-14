const mongoose     = require('mongoose');

//load environment variables from ".env" file (put this at the top)
require('dotenv').config();


// 'MONGODB_URI' is defined in the '.env' file
mongoose.connect(process.env.MONGODB_URI);


//Connect to the database with the "MONGODB_URI" environment variable
console.log('Example seed file running 🤑');
