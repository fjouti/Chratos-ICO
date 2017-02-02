var md5         = require('md5');

var generateRefHash = function() {
    return md5( new Date().getTime() );
};

module.exports.generateRefHash = generateRefHash;