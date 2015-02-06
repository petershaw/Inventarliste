"use strict";
var mongoose		= require('mongoose')
	, _				= require('underscore')
	;

/**
 * Set mongo schema options
 */
var schemaOptions = {
	toJSON: {
		virtuals: true	
	},
	toObject: {
		virtuals: true
	}
};

/**
 * Definition of who a item is owned
 * 
 */
var ItemDefinition = {
	name: { type: String, required: true }
};

/**
 * Definition of how a single item is represented in the model
 */
var ItemDefinition = {
	  indexNumber:	{ type: Number, required: true }
	, name:			{ type: String }
	, owner:		{ type: ItemDefinition, required: false }
	, description:	{ type: String, required: false }
	, createdAt: 	{type: Date, required: true, default: Date}
};


/**
 * Definition of the whole feedback schema
 * @see FeedbackDefinition
 */
var ItemSchema = new mongoose.Schema(
	ItemDefinition
	, schemaOptions 
);

ItemSchema.path('indexNumber').index({ unique: true });

// index the feedback
ItemSchema.index({ 
	indexNumber:	1
	, name:			1
	, owner:		1
});

/**
 * @public Feedback Schema API
 */
module.exports = mongoose.model('Item', ItemSchema);
