const mongoose = require('mongoose');
const { MONGODB_URI } = require('../public/js/config');

const mongoConnect = async () => {
    try {
        await mongoose.connect(MONGODB_URI)
        console.log('DB IS CONNECTED')
} catch(error) {
    console.log(`ERROR: ${error}`);
}
}

module.exports = mongoConnect