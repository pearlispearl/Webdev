const express = require('express');
const router = express.Router();

module.exports = (connection) => {

  // Get all artists
  router.get('/artists', (req, res) => {
    connection.query("SELECT * FROM Artist", (error, results) => {
      if (error) throw error;
      res.send({ error: false, data: results, message: 'Artist list' });
    });
  });

  // Add artist
  router.post("/add", function (req, res) {
    let Artist = req.body;
    if (!Artist) {
      return res.status(400).send({ error: true, message: 'Please provide Artist Information' });
    }
    connection.query("SELECT ArtistID FROM Artist ORDER BY ArtistID DESC LIMIT 1", function(err, result) {
        if (err) throw err;
        
        let nextNumericPart = 1;
        if (result.length > 0) {
          // Extract the numeric part and increment
          const currentId = result[0].ArtistID;
          const numericPart = parseInt(currentId.replace('ART', ''));
          nextNumericPart = numericPart + 1;
        }
        
        // Format with leading zeros
        const paddedNumber = String(nextNumericPart).padStart(9, '0');
        Artist.ArtistID = 'ART' + paddedNumber;

        connection.query("INSERT INTO Artist SET ?", [Artist], function (error, results) {
            if (error) throw error;
            const newArtistId = Artist.ArtistID; // The Artist object now has the generated ID
            res.send({ error: false, data: { ArtistID: newArtistId }, message: 'New Artist has been created!' });
          });
  });
});
  // Update artist
  router.put("/update", function (req, res) {
    let ArtistID = req.body.ArtistID;
    let Artist = req.body;
    if (!Artist || !ArtistID) {
      return res.status(400).send({ error: true, message: 'Please provide Artist Information' });
    }
    connection.query("UPDATE Artist SET ? WHERE ArtistID = ?", [Artist, ArtistID], function (error, results) {
      if (error) throw error;
      res.send({ error: false, data: results.affectedRows, message: 'Artist has been updated!' });
    });
  });

  // Delete artist
  router.delete("/delete", function (req, res) {
    let ArtistID = req.body.ArtistID;
    if (!ArtistID) {
      return res.status(400).send({ error: true, message: 'Please provide Artist ID' });
    }
    connection.query("DELETE FROM Artist WHERE ArtistID = ?", [ArtistID], function (error, results) {
      if (error) throw error;
      res.send({ error: false, data: results.affectedRows, message: 'Artist has been deleted!' });
    });
  });

  router.get('/artists/:artistId', (req, res) => {
    const artistId = req.params.artistId;
    connection.query("SELECT * FROM Artist WHERE ArtistID = ?", [artistId], (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        res.send({ error: false, data: results[0], message: `Artist details for ID: ${artistId}` });
      } else {
        res.status(404).send({ error: true, message: `Artist with ID ${artistId} not found.` });
      }
    });
  });





  // Search by name
  router.get('/name/:name', (req, res) => {
    let artist_name = req.params.name;
    if (!artist_name) {
      return res.status(400).send({ error: true, message: 'Please provide artist name' });
    }
    connection.query(`SELECT * FROM Artist WHERE ArtistName LIKE ?`, [`%${artist_name}%`], function (error, results) {
      if (error) throw error;
      res.send({ error: false, data: results, message: 'Artists found!' });
    });
  });

  // Search by category
  router.get('/category/:categoryName', (req, res) => {
    let artist_category = req.params.categoryName;
    if (!artist_category) {
      return res.status(400).send({ error: true, message: 'Please provide category name' });
    }

    if (artist_category === 'All') {
      connection.query("SELECT a.ArtistID, a.ArtistName, a.ArtistLanguage, a.ArtistCountry, c.C_Name AS ArtistCategory, a.BasePrice, a.Status FROM Artist a JOIN Category c ON a.ACID = c.CID", function (error, results) {
        if (error) throw error;
        res.send({ error: false, data: results, message: 'All Artists' });
      });
    } else {
      connection.query(`SELECT a.ArtistID, a.ArtistName, a.ArtistLanguage, a.ArtistCountry, c.C_Name AS ArtistCategory, a.BasePrice, a.Status
        FROM Artist a JOIN Category c ON a.ACID = c.CID WHERE c.C_Name = ?`, [artist_category], function (error, results) {
        if (error) throw error;
        res.send({ error: false, data: results, message: `Artists in category "${artist_category}"` });
      });
    }
  });

  // Search by status
  router.get('/status/:status', (req, res) => {
    const artist_status = req.params.status;
    if (!artist_status) {
      return res.status(400).send({ error: true, message: 'Please provide status' });
    }
    connection.query(`SELECT * FROM Artist WHERE Status = ?`, [artist_status], function (error, results) {
      if (error) throw error;
      res.send({ error: false, data: results, message: `Artists with status "${artist_status}" found!` });
    });
  });

  // Search by name + status
  router.get('/namestatus/:name/:status', (req, res) => {
    let artist_name = req.params.name;
    let artist_status = req.params.status;
    if (!artist_name || !artist_status) {
      return res.status(400).send({ error: true, message: 'Please provide both name and status' });
    }
    connection.query(`SELECT * FROM Artist WHERE ArtistName LIKE ? AND Status = ?`, [`%${artist_name}%`, artist_status], function (error, results) {
      if (error) throw error;
      res.send({ error: false, data: results, message: `Artists found with name "${artist_name}" and status "${artist_status}"` });
    });
  });

  return router;
};
