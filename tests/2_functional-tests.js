const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    suite("5 functional get request tests", function() {
        test("Viewing one stock", function(done) {
            chai.request(server)
                .get('/api/stock-prices')
                .set("content-type", "application/json")
                .query({ stock: 'GOOG' })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.stockData.stock, 'GOOG');
                    assert.exists(res.body.stockData.price, "GOOG has a price");
                    done();
                });
        });

        test("Viewing one stock and liking it", function(done) {
            chai.request(server)
                .get('/api/stock-prices')
                .set("content-type", "application/json")
                .query({ stock: 'GOLD', like: true })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.stockData.stock, 'GOLD');
                    assert.equal(res.body.stockData.likes, 1);
                    assert.exists(res.body.stockData.price, "GOLD has a price");
                    done();
                });
        });

        test("Viewing the same stock and liking it again", function(done) {
            chai.request(server)
                .get('/api/stock-prices')
                .set("content-type", "application/json")
                .query({ stock: 'GOLD', like: true })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.stockData.stock, 'GOLD');
                    assert.equal(res.body.stockData.likes, 1);
                    assert.exists(res.body.stockData.price, "GOLD has a price");
                    done();
                });
        });

        test("Viewing two stocks", function(done) {
            chai.request(server)
                .get('/api/stock-prices')
                .set("content-type", "application/json")
                .query({ stock: ["GOLD", "V"] }) // Fixed typo here
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.stockData[0].stock, 'GOLD');
                    assert.equal(res.body.stockData[1].stock, 'V');
                    assert.exists(res.body.stockData[0].price, "GOLD has a price");
                    assert.exists(res.body.stockData[1].price, "V has a price");
                    done();
                });
        });

        test("Viewing two stocks and liking them", function(done) {
            chai.request(server)
                .get('/api/stock-prices')
                .set("content-type", "application/json")
                .query({ stock: ["GOLD", "V"], like: true }) // Fixed typo here
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.stockData[0].stock, 'GOLD');
                    assert.equal(res.body.stockData[1].stock, 'V');
                    assert.exists(res.body.stockData[0].price, "GOLD has a price");
                    assert.exists(res.body.stockData[1].price, "V has a price");
                    assert.equal(res.body.stockData[0].rel_likes, 0);
                    assert.equal(res.body.stockData[1].rel_likes, 0);
                    done();
                });
        });
    });
});
