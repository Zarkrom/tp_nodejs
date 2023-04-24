var express = require('express');
var router = express.Router();

const dbInstance = require('../database/connect');

/* GET users listing. */
router.get('/users', async function(req, res, next) {
  res.send('respond with a resource');

  const db = dbInstance.getDatabase();
  const usersCollection = db.collection('users');
  const users = await usersCollection.find().toArray();
  res.render('users', { title: 'Users', users });
});

router.get('users/get/:id', async function(req, res, next) {
  const userId = req.params.id;
  const db = dbInstance.getDatabase();
  const usersCollection = db.collection('users');
  try {
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      res.status(404).send('Utilisateur non trouvé');
      return;
    }
    res.render('edit_client', { title: 'Modifier un utilisateur', user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la récupération de l\'utilisateur');
  }
});

router.post('/users/post/', async function (req, res, next) {
    console.log('Post new user');
    const newUser = {
      nom: req.body.nom,
      prenom: req.body.prenom,
    };
    const db = dbInstance.getDatabase();
    const usersCollection = db.collection('users');
    try {
      await usersCollection.insertOne(newUser);
      res.redirect('/users');
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'utilisateur' });
    }
});

router.post('/users/post/:id', async function (req, res, next) {
  const userId = req.params.id;
    const updatedUser = {
    $set: {
      nom: req.body.nom,
      prenom: req.body.prenom,
    }
  };
  const db = dbInstance.getDatabase();
  const usersCollection = db.collection('users');
    try {
    const result = await usersCollection.updateOne({ _id: new ObjectId(userId) }, updatedUser);
    if (result.matchedCount === 0) {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    } else {
      res.redirect('/users');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
  }
});

router.delete('/users/del/:id', async function (req, res, next) {
  const userId = req.params.id;
  const db = dbInstance.getDatabase();
  const usersCollection = db.collection('users');
  try {
    const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    } else {
      res.redirect('/users');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
  }
});

module.exports = router;

