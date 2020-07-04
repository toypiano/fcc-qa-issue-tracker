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

const uri = process.env.MONGO_URI;

module.exports = function (app) {
  app
    .route('/api/issues/:project')

    .get(function (req, res) {
      var project = req.params.project;
      // get query object to filter request
      var query = req.query;

      // convert query._id to ObjectId
      if (query._id) {
        query._id = new ObjectId(query._id);
      }
      // convert query.open to boolean
      if (typeof query.open === 'string') {
        query.open = query.open === 'true';
      }
      // connect with MongoClient and get collection from db

      // Use node version 2.2.12 or later in Atlas connect settings and wrap your uri with quotations
      // https://forum.freecodecamp.org/t/mongoerror-cannot-do-raw-queries-on-admin-in-atlas-for-advanced-node-and-express-challenge/268294
      MongoClient.connect(uri, (err, db) => {
        var collection = db.collection(project);
        // find documents with query
        // .find returns cursor. Convert it to an array and send in response
        collection.find(query).toArray((err, docs) => {
          if (err) {
            console.log('Error connecting to MongoDB', err);
          }
          return res.json(docs);
        });
      });
    })

    .post(function (req, res) {
      var project = req.params.project;
      // Validate the input
      // - title, text, created_by are required
      if (
        !req.body.issue_title ||
        !req.body.issue_text ||
        !req.body.created_by
      ) {
        return res.status(422).send('Required input values are missing');
      }

      // Create a document from the req.body
      var issue = {
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || '',
        status_text: req.body.status_text || '',
        created_on: new Date(),
        updated_on: new Date(),
        open: true,
      };

      // Connect with MongoClient and get collection from passed db
      MongoClient.connect(uri, (err, db) => {
        var collection = db.collection(project);
        // Insert document into collection
        collection.insertOne(issue, (err, doc) => {
          // Add _id field to the document from the insert result
          issue._id = doc.insertedId;
          // Send response with document
          return res.json(issue);
        });
      });
    })

    .put(function (req, res) {
      var project = req.params.project;
      // Get document _id from req.body
      var _id = req.body._id;
      // If no fields are sent return 'no updated field sent'
      delete req.body._id;
      if (typeof req.body.open === 'boolean') {
        // Stringify boolean value so that it won't be deleted for false value;
        req.body.open = String(req.body.open);
      }

      for (var field in req.body) {
        // delete all fields with null/undefined values
        if (!req.body[field]) {
          delete req.body[field];
        }
      }
      if (Object.keys(req.body).length === 0) {
        // If no fields left after deleting empty fields
        return res.status(422).send('no updated field sent');
      }
      // Convert open's
      if (req.body.open) {
        req.body.open = req.body.open === 'true';
      }
      // Find the document from DB and update (should always update 'updated_on')
      MongoClient.connect(uri, (err, db) => {
        var collection = db.collection(project);
        collection.findOneAndUpdate(
          // You MUST convert _id from body(string) to ObjectId instance when making query
          { _id: new ObjectId(_id) },
          { $set: req.body },
          (err, doc) => {
            // Return 'successfully updated' ot 'could not update ' + _id
            if (err) {
              console.log(doc);
              return res.send('could not update ' + _id);
            } else {
              return res.send('successfully updated');
            }
          }
        );
      });
    })

    .delete(function (req, res) {
      var project = req.params.project;
      // Get _id from req.body (return '_id error' if no _id is sent)
      var _id = req.body._id;
      if (!_id) {
        return res.status(422).send('_id error');
      }
      // Delete the matching document
      MongoClient.connect(uri, (err, db) => {
        var collection = db.collection(project);
        collection.findOneAndDelete(
          { _id: new ObjectId(_id) },
          (err, result) => {
            // Failed: 'could not delete ' + _id
            if (err) {
              return res.send('could not delete ' + _id);
            } else {
              // Success: 'deleted ' + _id
              return res.send('deleted ' + _id);
            }
          }
        );
      });
    });
};
