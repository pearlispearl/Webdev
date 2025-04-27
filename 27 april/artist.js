const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

module.exports = (connection) => {

  // Get all artists
  router.get('/artists', (req, res) => {
    const query = `
    SELECT
      a.*,
      c.C_Name AS ArtistCategory
    FROM
      Artist a
    JOIN
      Category c ON a.ACID = c.CID
    ORDER BY ArtistID
  `;
    // connection.query("SELECT * FROM Artist", (error, results) => {
    connection.query(query, (error, results) => {
      if (error) throw error;
      res.send({ error: false, data: results, message: 'Artist list' });
    });
  });

  // Add artist
  // Modify the add artist route in your artist router
router.post("/add", function (req, res) {
  let Artist = req.body;
  if (!Artist) {
    return res.status(400).send({ error: true, message: 'Please provide Artist Information' });
  }

  // Instead of handling file upload, just use the provided URL
  if (Artist.photoURL) {
    Artist.PhotoPath = Artist.photoURL;
    delete Artist.photoURL; // Remove the temporary field
  }

  connection.query("SELECT ArtistID FROM Artist ORDER BY ArtistID DESC LIMIT 1", function (err, result) {
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
      const newArtistId = Artist.ArtistID;
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

  //   router.get('/artists/:artistId', (req, res) => {
  //     const artistId = req.params.artistId;
  //     connection.query("SELECT * FROM Artist WHERE ArtistID = ?", [artistId], (error, results) => {
  //       if (error) throw error;
  //       if (results.length > 0) {
  //         res.send({ error: false, data: results[0], message: `Artist details for ID: ${artistId}` });
  //       } else {
  //         res.status(404).send({ error: true, message: `Artist with ID ${artistId} not found.` });
  //       }
  //     });
  //   });

  router.get('/artists/:artistId', (req, res) => {
    const artistId = req.params.artistId;
    const query = `
    SELECT
      a.*,
      c.C_Name AS ArtistCategoryName
    FROM
      Artist a
    JOIN
      Category c ON a.ACID = c.CID
    WHERE
      a.ArtistID = ?
  `;
    connection.query(query, [artistId], (error, results) => {
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
    const query = `
    SELECT
      a.*,
      c.C_Name AS ArtistCategory
    FROM
      Artist a
    JOIN
      Category c ON a.ACID = c.CID
    WHERE
      a.ArtistName LIKE ?
  `;
    connection.query(query, [`%${artist_name}%`], function (error, results) {
      if (error) throw error;
      res.send({ error: false, data: results, message: 'Artists found!' });
    });
  });



  //  // Search by status
  //  router.get('/status/:status', (req, res) => {
  //   const artist_status = req.params.status;
  //   if (!artist_status) {
  //     return res.status(400).send({ error: true, message: 'Please provide status' });
  //   }
  //   const query = `
  //   SELECT
  //     a.*,
  //     c.C_Name AS ArtistCategory
  //   FROM
  //     Artist a
  //   JOIN
  //     Category c ON a.ACID = c.CID
  //   WHERE
  //     a.Status = ?
  // `;
  //   connection.query(query, [artist_status], function (error, results) {
  //     if (error) throw error;
  //     res.send({ error: false, data: results, message: `Artists with status "${artist_status}" found!` });
  //   });
  // });
  // Search by status
  router.get('/status/:status', (req, res) => {
    const artist_status = req.params.status;

    if (!artist_status) {
      return res.status(400).send({ error: true, message: 'Please provide status' });
    }

    let query = `
    SELECT
      a.*,
      c.C_Name AS ArtistCategory
    FROM
      Artist a
    JOIN
      Category c ON a.ACID = c.CID
  `;

    let params = [];

    if (artist_status.toLowerCase() !== "all") {
      query += " WHERE a.Status = ?";
      params.push(artist_status);
    }
    // else: if status == all, do not add WHERE condition → show all statuses

    connection.query(query, params, function (error, results) {
      if (error) throw error;
      res.send({ error: false, data: results, message: `Artists with status "${artist_status}" found!` });
    });
  });


  // Search by status + baseprice
  router.get('/statusbaseprice/:status/:baseprice', (req, res) => {
    let artist_status = req.params.status;
    let artist_baseprice = parseFloat(req.params.baseprice);

    // if (!artist_status) {
    //   return res.status(400).send({ error: true, message: 'Please provide status' });
    // }

    if (isNaN(artist_baseprice)) {
      return res.status(400).send({ error: true, message: 'Please provide provide a valid base price' });
    }
    let query = `
  SELECT
      a.*,
      c.C_Name AS ArtistCategory
    FROM
      Artist a
    JOIN
      Category c ON a.ACID = c.CID
    WHERE
      a.BasePrice >= ?`;
    let params = [artist_baseprice];

    if (artist_status.toLowerCase() !== "all") {
      query += " AND a.Status = ?";
      params.push(artist_status);
    }

    query += " ORDER BY a.BasePrice ASC";
    connection.query(query, params, function (error, results) {
      if (error) {
        return res.status(500).send({ error: true, message: 'Database error' });
      }
      res.send({
        error: false,
        data: results,
        message: results.length > 0 ? 'Artists found!' : 'No artists found matching your criteria.'
      });
    });
  });

  // Search by name + status
  router.get('/namestatus/:name/:status', (req, res) => {
    let artist_name = req.params.name;
    let artist_status = req.params.status;

    if (!artist_name) {
      return res.status(400).send({ error: true, message: 'Please provide name' });
    }

    let query = `
    SELECT
      a.*,
      c.C_Name AS ArtistCategory
    FROM
      Artist a
    JOIN
      Category c ON a.ACID = c.CID
    WHERE
      a.ArtistName LIKE ?
  `;

    let params = [`%${artist_name}%`];


    if (artist_status.toLowerCase() !== "all") {
      query += " AND a.Status = ?";
      params.push(artist_status);
    }
    // if status is "all" -> don't filter by status (show all statuses)

    connection.query(query, params, function (error, results) {
      if (error) throw error;
      res.send({ error: false, data: results, message: `Artists found with name "${artist_name}"` });
    });
  });

// Search by status + category
router.get('/statuscategory/:status/:category', (req, res) => {
  let artist_status = req.params.status;
  let artist_category = req.params.category;

  if (!artist_category) {
    return res.status(400).send({ error: true, message: 'Please provide both status and category' });
  }

  let query = `
    SELECT
      a.*,
      c.C_Name AS ArtistCategory
    FROM
      Artist a
    JOIN
      Category c ON a.ACID = c.CID
    WHERE
      a.ACID = ?
  `;

  let params = [artist_category];

  if (artist_status.toLowerCase() !== "all") {
    query += " AND a.Status = ?";
    params.push(artist_status);
  }

  query += " ORDER BY a.ArtistName ASC";

  connection.query(query, params, function (error, results) {
    if (error) {
      return res.status(500).send({ error: true, message: 'Database error' });
    }
    res.send({ 
      error: false, 
      data: results, 
      message: results.length > 0 ? 'Artists found!' : 'No artists found matching your criteria.'
    });
  });
});

// Search by status + category + name
router.get('/statuscategoryname/:status/:category/:name', (req, res) => {
  let artist_status = req.params.status;
  let artist_category = req.params.category;
  let artist_name = req.params.name;

  if (!artist_category || !artist_name) {
    return res.status(400).send({ error: true, message: 'Please provide status, category, and name' });
  }

  let query = `
    SELECT
      a.*,
      c.C_Name AS ArtistCategory
    FROM
      Artist a
    JOIN
      Category c ON a.ACID = c.CID
    WHERE
      a.ACID = ?
      AND a.ArtistName LIKE ?
  `;

  let params = [artist_category, `%${artist_name}%`];

  if (artist_status.toLowerCase() !== "all") {
    query += " AND a.Status = ?";
    params.push(artist_status);
  }

  query += " ORDER BY a.ArtistName ASC";

  connection.query(query, params, function (error, results) {
    if (error) {
      return res.status(500).send({ error: true, message: 'Database error' });
    }
    res.send({ 
      error: false, 
      data: results, 
      message: results.length > 0 ? 'Artists found!' : 'No artists found matching your criteria.'
    });
  });
});

// Search by status + name + baseprice
router.get('/statusnamebaseprice/:status/:name/:baseprice', (req, res) => {
  let artist_status = req.params.status;
  let artist_name = req.params.name;
  let artist_baseprice = parseFloat(req.params.baseprice);

  if (!artist_name || isNaN(artist_baseprice)) {
    return res.status(400).send({ error: true, message: 'Please provide name and a valid base price' });
  }

  let query = `
    SELECT
      a.*,
      c.C_Name AS ArtistCategory
    FROM
      Artist a
    JOIN
      Category c ON a.ACID = c.CID
    WHERE
      a.ArtistName LIKE ?
      AND a.BasePrice >= ?
  `;

  let params = [`%${artist_name}%`, artist_baseprice];

  if (artist_status.toLowerCase() !== "all") {
    query += " AND a.Status = ?";
    params.push(artist_status);
  }

  query += " ORDER BY a.BasePrice ASC";

  connection.query(query, params, function (error, results) {
    if (error) {
      return res.status(500).send({ error: true, message: 'Database error' });
    }
    res.send({ 
      error: false, 
      data: results, 
      message: results.length > 0 ? 'Artists found!' : 'No artists found matching your criteria.'
    });
  });
});

// Search by status + baseprice + category
router.get('/statusbasecategory/:status/:baseprice/:category', (req, res) => {
  let artist_status = req.params.status;
  let artist_baseprice = parseFloat(req.params.baseprice);
  let artist_category = req.params.category;

  if (!artist_category || isNaN(artist_baseprice)) {
    return res.status(400).send({ error: true, message: 'Please provide a valid base price and category' });
  }

  let query = `
    SELECT
      a.*,
      c.C_Name AS ArtistCategory
    FROM
      Artist a
    JOIN
      Category c ON a.ACID = c.CID
    WHERE
      a.BasePrice >= ?
      AND c.C_Name = ?
  `;

  let params = [artist_baseprice, artist_category];

  if (artist_status.toLowerCase() !== "all") {
    query += " AND a.Status = ?";
    params.push(artist_status);
  }

  query += " ORDER BY a.BasePrice ASC";

  connection.query(query, params, function (error, results) {
    if (error) {
      return res.status(500).send({ error: true, message: 'Database error' });
    }
    res.send({ 
      error: false, 
      data: results, 
      message: results.length > 0 ? 'Artists found!' : 'No artists found matching your criteria.'
    });
  });
});

// Search by Status + Base + Category + Name
router.get('/statusbasecategoryname/:status/:baseprice/:category/:name', (req, res) => {
  let artist_status = req.params.status;
  let artist_baseprice = parseFloat(req.params.baseprice);
  let artist_category = req.params.category;
  let artist_name = req.params.name;

  // Validate inputs
  if (isNaN(artist_baseprice)) {
    return res.status(400).send({ error: true, message: 'Please provide a valid base price' });
  }

  if (!artist_category || !artist_name) {
    return res.status(400).send({ error: true, message: 'Please provide both category and name' });
  }

  // Query to get artists based on status, base price, category, and name
  let query = `
    SELECT
      a.*,
      c.C_Name AS ArtistCategory
    FROM
      Artist a
    JOIN
      Category c ON a.ACID = c.CID
    WHERE
      a.BasePrice >= ? AND a.ArtistName LIKE ? AND c.CID = ?
  `;
  
  let params = [artist_baseprice, `%${artist_name}%`, artist_category];

  if (artist_status.toLowerCase() !== "all") {
    query += " AND a.Status = ?";
    params.push(artist_status);
  }

  query += " ORDER BY a.BasePrice ASC";

  connection.query(query, params, function (error, results) {
    if (error) {
      return res.status(500).send({ error: true, message: 'Database error' });
    }
    res.send({ 
      error: false, 
      data: results, 
      message: results.length > 0 ? 'Artists found!' : 'No artists found matching your criteria.'
    });
  });
});




  

  return router;
};
