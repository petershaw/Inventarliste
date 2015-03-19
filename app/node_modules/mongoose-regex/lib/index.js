
module.exports = exports = function regexSearch (schema, options) {
  schema.statics.regexSearch = function (keyword, options, callback) {

      var model = this;
      var fieldName = options.fieldToSearch;
      var isCaseSensitive = options.caseSensitive;

      var findOptions = {};

      if(isCaseSensitive){
          findOptions = JSON.parse('{ "'+fieldName+'": { "$regex": \"'+keyword+'\"} }');
      } else {
          findOptions = JSON.parse('{ "'+fieldName+'": { "$regex": \"'+keyword+'\",  "$options": "i"} }');
      }

      model.find(findOptions, function(err, docs){

          callback(err, docs);
      });
  }
}

exports.version = require('../package').version;
