const Shop = require("../models/Shop");

const addShop = async (req, res) => {
  try {
    const newShop = new Shop(req.body);
    await newShop.save();
    res.status(200).send({
      message: "Shop Added Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// all multiple Shop
const addAllShops = async (req, res) => {
  // console.log("Shop", req.body);
  try {
    await Shop.deleteMany();

    await Shop.insertMany(req.body);

    res.status(200).send({
      message: "Shop Added Successfully!",
    });
  } catch (err) {
    console.log(err.message);

    res.status(500).send({
      message: err.message,
    });
  }
};

// get status show Shop
const getShowingShops = async (req, res) => {
  try {
    const shops = await Shop.find({ status: "show" }).sort({
      _id: -1,
    });

    const shopList = readyToParentAndChildrenShop(shops);
    // console.log("Shop list", shopList.length);
    res.send(shopList);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// get all Shop parent and child
// const getAllShops = async (req, res) => {
//   try {
//     const shops = await Shop.find({}).sort({ _id: -1 });

//     const shopList = readyToParentAndChildrenShop(shops);
//     //  console.log('shopList',shopList)
//     res.send(shopList);
//   } catch (err) {
//     res.status(500).send({
//       message: err.message,
//     });
//   }
// };

const getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find({}).sort({ _id: -1 });

    res.send(shops);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    res.send(shop);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Shop update
const updateShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (shop) {
      shop.name = { ...shop.name, ...req.body.name };
      shop.description = {
        ...shop.description,
        ...req.body.description,
      };
      shop.icon = req.body.icon;
      shop.status = req.body.status;
      shop.parentId = req.body.parentId
        ? req.body.parentId
        : shop.parentId;
      shop.parentName = req.body.parentName;

      await shop.save();



      if(!!req.body.isDefault){
        setDefaultShop(req.params.id)
      }

      res.send({ message: "Shop Updated Successfully!" });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// udpate many Shop
const updateManyShops = async (req, res) => {
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

    await Shop.updateMany(
      { _id: { $in: req.body.ids } },
      {
        $set: updatedData,
      },
      {
        multi: true,
      }
    );

    res.send({
      message: "Shops update successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Shop update status
const updateStatus = async (req, res) => {
  // console.log('update status')
  try {
    const newStatus = req.body.status;

    await Shop.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: newStatus,
        },
      }
    );
    res.status(200).send({
      message: `Shop ${
        newStatus === "show" ? "Published" : "Un-Published"
      } Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
//single Shop delete
const deleteShop = async (req, res) => {
  try {
    console.log("id cat >>", req.params.id);
    await Shop.deleteOne({ _id: req.params.id });
    await Shop.deleteMany({ parentId: req.params.id });
    res.status(200).send({
      message: "Shop Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }

  //This is for delete children Shop
  // Shop.updateOne(
  //   { _id: req.params.id },
  //   {
  //     $pull: { children: req.body.title },
  //   },
  //   (err) => {
  //     if (err) {
  //       res.status(500).send({ message: err.message });
  //     } else {
  //       res.status(200).send({
  //         message: 'Shop Deleted Successfully!',
  //       });
  //     }
  //   }
  // );
};

// all multiple Shop delete
const deleteManyShops = async (req, res) => {
  try {
    const shops = await Shop.find({}).sort({ _id: -1 });

    await Shop.deleteMany({ parentId: req.body.ids });
    await Shop.deleteMany({ _id: req.body.ids });

    res.status(200).send({
      message: "shops Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
const readyToParentAndChildrenShop = (shops, parentId = null) => {
  const shopList = [];
  let filteredShops;
  if (parentId == null) {
    filteredShops = shops.filter((cat) => cat.parentId == undefined);
  } else {
    filteredShops = shops.filter((cat) => cat.parentId == parentId);
  }

  for (let cate of filteredShops) {
    shopList.push({
      _id: cate._id,
      name: cate.name,
      parentId: cate.parentId,
      parentName: cate.parentName,
      description: cate.description,
      icon: cate.icon,
      status: cate.status,
      children: readyToParentAndChildrenShop(shops, cate._id),
    });
  }

  return shopList;
};


// Define a function to set a store as the default
const setDefaultShop = async (shopId) => {
  // Set all stores to "isDefault: false"
  await Shop.updateMany({}, { isDefault: false });

  // Set the specified Shop to "isDefault: true"
  await Shop.updateOne({ _id: shopId }, { isDefault: true });
};


module.exports = {
  addShop,
  addAllShops,
  getAllShops,
  getShowingShops,
  getShopById,
  updateShop,
  updateStatus,
  deleteShop,
  deleteManyShops,
  updateManyShops,
};
