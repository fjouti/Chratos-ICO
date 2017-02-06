const request = require('request');

module.exports = function (config) {
    var self = this;
    return function (req, res, next) {
        var self = this;
        self.getBalance = function (address, allDone) {
            request(config.walletURL + '/' + address + '/balance/', function (err, response, body) {
                allDone(err, body)
            })
        };

        self.createWallet = function (allDone) {
            request.post(config.walletURL + "/create/chratos", {}, function (err, response, body) {
                allDone(err, body);
            });
        };
        req.bitcoin = self;
        next();
    }
};