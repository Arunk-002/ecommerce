import React, { useState } from "react";
import { MdAddShoppingCart } from "react-icons/md";
import "./ProductCard.css";
import ProductPage from "../ProductPage/ProductPage";
import useAddToCart from "../../hooks/addproduct";
function ProductCard({ product }) {
  console.log('adfadfa');
  
  const [ShowProduct, setShowProduct] = useState(false);
  const {addToCart} = useAddToCart( product?._id)
  
  return (
    <>
      <div
        onClick={() => setShowProduct(true)}
        className="relative group card-body-clr h-[300px] shadow-lg rounded-2xl overflow-hidden"
      >
        <img className="w-full h-full object-contain p-5" src={product.image} />
        <div className="card-hover-body w-full h-55 absolute left-0 bottom-0 -mb-44 group-hover:mb-0 rounded-b-2xl transition-all delay-150 duration-300 ease ">
          <div className="p-6 flex flex-col gap-x-4">
            <div className="capitalize flex items-center justify-between gap-4">
              <div>
                <h2 className="card-head-clr text-lg font-bold">{product.name}</h2>
                <p className="card-description-clr">{product.description}</p>
              </div>
            </div>
            <div className="">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-3xl font-bold card-head-clr ">{product.price}$</p>
                </div>
                <button
                  onClick={addToCart}
                  className="card-head-clr text-3xl p-2 rounded-md hover:border hover:border-[#482817]"
                >
                  <MdAddShoppingCart />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {ShowProduct && <ProductPage product={product} cancel={setShowProduct} />}
    </>
  );
}

export default ProductCard;
