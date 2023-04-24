var express = require('express');
var router = express.Router();

const dbInstance = require('../database/connect');

/* GET products listing. */
router.get('/products', async function(req, res, next) {
  res.send('respond with a resource');

  const db = dbInstance.getDatabase();
  const productsCollection = db.collection('products');
  const products = await productsCollection.find().toArray();
  res.render('products', { title: 'Products', products });
});

router.post('/products/post/', async function (req, res, next) {
    console.log('Post new product');
    const newProduct = {
      nom: req.body.nom,
      prix: req.body.prix,
    };
    const db = dbInstance.getDatabase();
    const productsCollection = db.collection('products');
    try {
      await productsCollection.insertOne(newProduct);
      res.redirect('/products');
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur lors de l\'ajout du produit' });
    }
});

router.post('/products/post/:id', async function (req, res, next) {
    const productId = req.params.id;
      const updatedProduct = {
      $set: {
        nom: req.body.nom,
        prix: req.body.prix,
      }
    };
    const db = dbInstance.getDatabase();
    const productsCollection = db.collection('users');
      try {
      const result = await productsCollection.updateOne({ _id: new ObjectId(productId) }, updatedProduct);
      if (result.matchedCount === 0) {
        res.status(404).json({ message: 'Produit non trouvé' });
      } else {
        res.redirect('/products');
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur lors de la mise à jour du produit' });
    }
});

router.delete('/products/del/:id', async function (req, res, next) {
    const productId = req.params.id;
    const db = dbInstance.getDatabase();
    const productsCollection = db.collection('products');
    try {
        const result = await productsCollection.deleteOne({ _id: new ObjectId(productId) });
        if (result.deletedCount === 0) {
            res.status(404).json({ message: 'Produit non trouvé' });
        } else {
            res.redirect('/products');
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur lors de la suppression du produit' });
    }
});

module.exports = router;

