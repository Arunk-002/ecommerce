const User = require("../models/user");
const Product = require("../models/product");

async function addProducts(req, res) {
  try {
    const product = req.body;
    product.image = req.file.location;
    console.log(product.size);

    const newProuct = await Product.create(product);
    if (!newProuct) {
      const msg = {
        message: "product not created",
      };
      return res.status(401).json(msg);
    }
    const msg = {
      message: "product created succesfully",
      product: newProuct,
    };
    return res.status(201).json(msg);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Unable to create a Product" });
  }
}

async function adminHome(req, res) {
  try {
    const id = req.params.id;
    const admin = await User.findById(id);
    if (!admin) return res.status(401).json({ msg: "user Not found" });
    if (!admin.role === "admin")
      return res.status(401).json({ msg: "Un authorized accees" });
    const products = await Product.find();
    const msg = {
      user: admin,
      products: products,
    };
    return res.status(201).json(msg);
  } catch (error) {
    console.log(error);
    return res.status(401).json({ msg: "user Not found" });
  }
}

async function editProduct(req, res) {
  try {
    const id = req.params.productId;
    const editedProduct = req.body;
    const curProduct = await Product.findById(id);
    let image = curProduct.image;
    if (req.file) {
      image = req.file.location;
    }
    editedProduct.image = image;
    const newProduct = await Product.findByIdAndUpdate(id, editedProduct, {
      new: true,
    });
    if (newProduct._id) {
      return res.status(201).json(newProduct);
    }
    const msg = {
      msg: "product not updated",
    };
    return res.status(401).json(msg);
  } catch (error) {
    console.log(error);
  }
}

async function deleteProduct(req, res) {
  try {
    const id = req.params.productId;
    const result = await Product.findByIdAndDelete(id);
    if (result) {
      return res.status(201).json({
        msg: "deleted",
        id: id,
      });
    }
    throw new Error("cannot delete the document");
  } catch (error) {
    res.status(401).json(error.message);
  }
}

async function getProducts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;
    const category = req.query.category;

    // Build query object
    const query = {};
    if (category && category !== 'all') {
      query.category = category;
    }

    const products = await Product.find(query).skip(skip).limit(limit);
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    return res.status(200).json({
      products,
      currentPage: page,
      totalPages,
      totalProducts
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Cannot get products" });
  }
}
async function fetchProduct(req,res) {
  const productId = req.params.id
  try{
    if (!productId) {
      throw new Error("id not Found");
    }
    const product = await Product.findById(productId)
    return res.status(200).json(product)
  }catch(error){
    return res.status(400).json(error.message)
  }
}
module.exports = {
  addProducts,
  adminHome,
  editProduct,
  deleteProduct,
  getProducts,
  fetchProduct
};
