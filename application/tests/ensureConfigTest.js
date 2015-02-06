
var   assert 		= require("assert")
	, chai 			= require("chai")
	, config 	= require("../config.js");
	;
	
describe('Configurtation', function(){
 	it('should have minimal parameters set.', function(){
    	chai.expect(config).to.have.property(
    		'log'
    	);
    	chai.expect(config.log).to.have.property(
    		'file'
    	);
    	chai.expect(config.server).to.have.property(
    		'version'
    	);
 	});
 });
 