const express = require('express');
const router = express.Router();
const {
  addShop,
  addAllShops,
  getAllShops,
  getShowingShops,
  getShopById,
  updateShop,
  updateStatus,
  deleteShop,
  deleteManyShops,
  updateManyShops

} = require('../controller/shopController');

//add a Shop
router.post('/add', addShop);

//add all Shop
router.post('/add/all', addAllShops);

//get only showing Shop
router.get('/show', getShowingShops);

//get all Shop
router.get('/', getAllShops);
//get all Shop
router.get('/all', getAllShops);

//get a Shop
router.get('/:id', getShopById);

//update a Shop
router.put('/:id', updateShop);

//show/hide a Shop
router.put('/status/:id', updateStatus);

//delete a Shop
router.delete('/:id', deleteShop);

// delete many Shop
router.patch('/delete/many', deleteManyShops);

// update many Shop
router.patch('/update/many', updateManyShops);

module.exports = router;
