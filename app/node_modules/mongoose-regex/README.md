mongoose-regex
==============

A Simple plugin for mongoose regex search


## Sample Program:

```js
var Mongoose = require('mongoose');
var regexSearch = require('mongoose-regex');

// Mongo DB config
var mongoDbUrl = 'mongodb://localhost:27017/local';
var db = Mongoose.connect(mongoDbUrl);

// Define mongoose schema details
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


// Create sample table 'employee' with some documents
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


// set the options for mongoose-regex
var searchOptions = {
    fieldToSearch: 'name', // which field you want to search
    caseSensitive: false // apply case sensitivity to your search
}

// regex now
employeeModel.regexSearch('JA',searchOptions,function(err, result){

   console.log(result);

});
```

## Notes:

execute 'make test' to run test program 'test/index.js' .