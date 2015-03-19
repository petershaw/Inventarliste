/**
 * Adds support for for OPTIONS method request to allow CORS with restify
 * http://stackoverflow.com/questions/14338683/how-can-i-support-cors-when-using-restify#answer-15981116
 */
var restify				= require('restify')
	;

module.exports = function(req, res) {
	if (req.method.toLowerCase() === 'options') {
		var allowHeaders = [
			'Accept',
			'Accept-Version',
			'Api-Version',
			'Authorization',
			'Content-Type',
			'Origin',
			'X-Requested-With',
			'X-PINGOTHER',
			'X-HTTP-Method-Override',
			'opentabs-api-version',
			'opentabs-api-profile',
			'opentabs-api-key'
		];

		if (res.methods.indexOf('OPTIONS') === -1) res.methods.push('OPTIONS');

		res.header('Access-Control-Allow-Credentials', true);
		res.header('Access-Control-Allow-Headers', allowHeaders.join(', '));
		res.header('Access-Control-Allow-Methods', res.methods.join(', '));
		res.header('Access-Control-Allow-Origin', req.headers.origin);

		return res.send(204);
	}
	else {
		return res.send(new restify.MethodNotAllowedError("Method is not Allowed"));
	}
};