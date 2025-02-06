const User = require("../models/user");
const Product = require("../models/product");
const Cart = require("../models/cart");

async function getUser(req, res) {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ msg: "user" + userId + "not found" });
    }
    return res.status(201).json({ user });
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

async function editUser(req, res) {
  const userId = req.params.id;
  const { name, password } = req.body;
  console.log(userId,name,password);
  
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (name) user.name = name;
    if (password) user.password = password; 

    await user.save();
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
}


async function addToCart(req, res) {
  try {
    const userId = req.params.id;
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const productIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex > -1) {
      cart.items[productIndex].quantity += 1;
    } else {
      cart.items.push({
        productId,
        quantity: 1,
        price: product.price,
      });
    }
    cart.updatedAt = new Date();
    await cart.save();
    res.status(200).json({ msg: "Cart updated successfully", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
}

async function getCart(req, res) {
  try {
    const userId = req.params.id;
    const address = await getAddress(userId);
    console.log(address);

    const cart = await Cart.findOne({ userId })
      .populate("items.productId")
      .exec();

    if (!cart) {
      throw new Error("Cart not found");
    }
    return res.status(200).json({ cart, address });
  } catch (error) {
    console.error(error);
    return res.status(400).json("no items in cart");
  }
}

async function removeFromCart(req, res) {
  try {
    const userId = req.params.id;
    const productIndex = req.params.index;
    const cart = await Cart.findOne({ userId })
      .populate("items.productId")
      .exec();
    const filteredItems = cart.items.filter((elem) => elem._id != productIndex);
    console.log(filteredItems);
    cart.items = filteredItems;
    await cart.save();
    return res.status(200).json({ msg: "item removed", cart: cart });
  } catch (error) {
    console.error(error.message);
    return res.status(400).json("Error Occured");
  }
}

async function quantity(req, res) {
  try {
    const cartId = req.params.id;
    const { action, productId } = req.body;

    const cart = await Cart.findById(cartId);
    cart.items.forEach((element) => {
      if (element._id.toString() === productId) {
        if (action === "add") {
          element.quantity += 1;
        } else {
          element.quantity -= 1;
        }
      }
    });
    await cart.save();
    return res.status(200).json(true);
  } catch (error) {
    console.log(error.message);
    return res.status(200).json(false);
  }
}

async function addAddress(req, res) {
  try {
    const userId = req.params.id;
    const address = req.body;
    const newUser = await User.findById(userId)
    newUser.address.push(address)
    await newUser.save()
    if (!newUser) {
      return res.status(404).json({ msg: "User not found" });
    }
    return res.status(200).json(newUser.address);
  } catch (error) {
    console.error("Error updating address:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getAddress(id) {
  try {
    const userId = id;
    const user = await User.findById(userId);
    console.log(user.address);
    
    if (user.address.length>0) {
      return user.address;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  getUser,
  addToCart,
  getCart,
  removeFromCart,
  quantity,
  addAddress,
  editUser
};
