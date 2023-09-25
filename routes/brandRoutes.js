const express = require('express');
const router = express.Router();
const {
  addBrand,
  addAllBrands,
  getAllBrands,
  getShowingBrands,
  getBrandById,
  updateBrand,
  updateStatus,
  deleteBrand,
  deleteManyBrands,
  updateManyBrands

} = require('../controller/brandController');

//add a Brand
router.post('/add', addBrand);

//add all Brand
router.post('/add/all', addAllBrands);

//get only showing Brand
router.get('/show', getShowingBrands);

//get all Brand
router.get('/', getAllBrands);
//get all Brand
router.get('/all', getAllBrands);

//get a Brand
router.get('/:id', getBrandById);

//update a Brand
router.put('/:id', updateBrand);

//show/hide a Brand
router.put('/status/:id', updateStatus);

//delete a Brand
router.delete('/:id', deleteBrand);

// delete many Brand
router.patch('/delete/many', deleteManyBrands);

// update many Brand
router.patch('/update/many', updateManyBrands);

module.exports = router;
