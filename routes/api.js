/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {
  app
    .route('/api/issues/:project')

    .get(function (req, res) {
      var project = req.params.project;
      // get query object to filter request

      // convert query._id to ObjectId

      // convert query.open to boolean

      // connect with MongoClient and get collection from db

      // find documents with query

      // .find returns cursor. Convert it to an array and send in response
    })

    .post(function (req, res) {
      var project = req.params.project;
      // Create a document from the req.body

      // Validate the input

      // Connect with MongoClient and get collection from passed db

      // Insert document into collection

      // Add _id field to the document from the insert result

      // Send response with document
    })

    .put(function (req, res) {
      var project = req.params.project;
      // Get document _id from req.body

      // If no fields are sent return 'no updated field sent'

      // Find the document from DB and update (should always update 'updated_on')

      // Return 'successfully updated' ot 'could no update ' + _id
    })

    .delete(function (req, res) {
      var project = req.params.project;
      // Get _id from req.body (return '_id error' if no _id is sent)

      // Delete the matching document

      // Success: 'deleted ' + _id

      // Failed: 'could not delete ' + _id
    });
};
