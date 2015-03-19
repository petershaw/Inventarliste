var Mongoose = require('mongoose');
var regexSearch = require('../')
var Lab = require('lab');
var expect = Lab.expect;
var before = Lab.before;
var describe = Lab.experiment;
var it = Lab.test;
var mongoDbUrl = 'mongodb://localhost:27017/local';
var db = Mongoose.connect(mongoDbUrl);

var Schema = Mongoose.Schema;

var employeeSchema = new Schema({
        name: String,
        address: String
    }
);


employeeSchema.plugin(regexSearch);
employeeSchema.index({ name: 'text' });
employeeSchema.index({ address: 'text' });

var employeeModel = Mongoose.model('employee', employeeSchema);


before(function (done) {

            employeeModel.create([
                {
                    name: 'Jack',
                    address: '189 W Ave, San Bruno, CA 94066'
                },
                {
                    name: 'William',
                    address: '500 W Ave, Atlanta, CA 30080'
                }
            ], function (err, data) {
                if (err) {
                    return done(err);
                }
                done();
            })
});


describe('mongo ', function () {

    it('regex test', function (done) {

        var searchOptions = {
            fieldToSearch: 'name',
            caseSensitive: false
        }
        employeeModel.regexSearch('JA',searchOptions,function(err, result){

            expect(result.length).greaterThan(0);
            done();
        });
    });
});


