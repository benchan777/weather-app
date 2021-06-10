const mongoose = require('mongoose');
assert = require('assert');

// connect to mongo db
const mongoUri = process.env.MONGODB_URI || 'weather-app'
mongoose.set('useUnifiedTopology', true)
mongoose.set('useFindAndModify', false)
mongoose.connect(mongoUri, { useNewUrlParser: true },
    function(err, db) {
        assert.equal(null, err);
        console.log(`Connected to database ${mongoUri} successfully.`)
    })

mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`)
})

module.exports = mongoose.connection