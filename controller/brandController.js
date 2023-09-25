const Brand = require("../models/Brand");

const addBrand = async (req, res) => {
  try {
    const newBrand = new Brand(req.body);
    await newBrand.save();
    res.status(200).send({
      message: "Brand Added Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// all multiple Brand
const addAllBrands = async (req, res) => {
  // console.log("Brand", req.body);
  try {
    await Brand.deleteMany();

    await Brand.insertMany(req.body);

    res.status(200).send({
      message: "Brand Added Successfully!",
    });
  } catch (err) {
    console.log(err.message);

    res.status(500).send({
      message: err.message,
    });
  }
};

// get status show Brand
const getShowingBrands = async (req, res) => {
  try {
    const brands = await Brand.find({ status: "show" }).sort({
      _id: -1,
    });

    const brandList = readyToParentAndChildrenBrand(brands);
    // console.log("Brand list", brandList.length);
    res.send(brandList);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// get all Brand parent and child
// const getAllBrands = async (req, res) => {
//   try {
//     const brands = await Brand.find({}).sort({ _id: -1 });

//     const brandList = readyToParentAndChildrenBrand(brands);
//     //  console.log('brandList',brandList)
//     res.send(brandList);
//   } catch (err) {
//     res.status(500).send({
//       message: err.message,
//     });
//   }
// };

const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find({}).sort({ _id: -1 });

    res.send(brands);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    res.send(brand);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Brand update
const updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (brand) {
      brand.name = { ...brand.name, ...req.body.name };
      brand.description = {
        ...brand.description,
        ...req.body.description,
      };
      brand.icon = req.body.icon;
      brand.status = req.body.status;
      brand.parentId = req.body.parentId
        ? req.body.parentId
        : brand.parentId;
      brand.parentName = req.body.parentName;

      await brand.save();
      res.send({ message: "Brand Updated Successfully!" });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// udpate many Brand
const updateManyBrands = async (req, res) => {
  try {
    const updatedData = {};
    for (const key of Object.keys(req.body)) {
      if (
        req.body[key] !== "[]" &&
        Object.entries(req.body[key]).length > 0 &&
        req.body[key] !== req.body.ids
      ) {
        updatedData[key] = req.body[key];
      }
    }

    await Brand.updateMany(
      { _id: { $in: req.body.ids } },
      {
        $set: updatedData,
      },
      {
        multi: true,
      }
    );

    res.send({
      message: "Brands update successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Brand update status
const updateStatus = async (req, res) => {
  // console.log('update status')
  try {
    const newStatus = req.body.status;

    await Brand.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: newStatus,
        },
      }
    );
    res.status(200).send({
      message: `Brand ${
        newStatus === "show" ? "Published" : "Un-Published"
      } Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
//single Brand delete
const deleteBrand = async (req, res) => {
  try {
    console.log("id cat >>", req.params.id);
    await Brand.deleteOne({ _id: req.params.id });
    await Brand.deleteMany({ parentId: req.params.id });
    res.status(200).send({
      message: "Brand Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }

  //This is for delete children Brand
  // Brand.updateOne(
  //   { _id: req.params.id },
  //   {
  //     $pull: { children: req.body.title },
  //   },
  //   (err) => {
  //     if (err) {
  //       res.status(500).send({ message: err.message });
  //     } else {
  //       res.status(200).send({
  //         message: 'Brand Deleted Successfully!',
  //       });
  //     }
  //   }
  // );
};

// all multiple Brand delete
const deleteManyBrands = async (req, res) => {
  try {
    const brands = await Brand.find({}).sort({ _id: -1 });

    // await Brand.deleteMany({ parentId: req.body.ids });
    await Brand.deleteMany({ _id: req.body.ids });

    res.status(200).send({
      message: "brands Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
const readyToParentAndChildrenBrand = (brands, parentId = null) => {
  const BrandList = [];
  let filteredBrands;
  if (parentId == null) {
    filteredBrands = brands.filter((cat) => cat.parentId == undefined);
  } else {
    filteredBrands = brands.filter((cat) => cat.parentId == parentId);
  }

  for (let cate of filteredBrands) {
    BrandList.push({
      _id: cate._id,
      name: cate.name,
      parentId: cate.parentId,
      parentName: cate.parentName,
      description: cate.description,
      icon: cate.icon,
      status: cate.status,
      children: readyToParentAndChildrenBrand(brands, cate._id),
    });
  }

  return BrandList;
};

module.exports = {
  addBrand,
  addAllBrands,
  getAllBrands,
  getShowingBrands,
  getBrandById,
  updateBrand,
  updateStatus,
  deleteBrand,
  deleteManyBrands,
  updateManyBrands,
};
