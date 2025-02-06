import React from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import useAddToCart from "../../hooks/addproduct";

function ProductPage({ product, cancel }) {
    const {addToCart} = useAddToCart( product?._id)
  return (
    <div className="bg-black/[.5] fixed inset-0 py-5 z-50 flex justify-center items-center w-full">
      <div className="bg-[#F5EBDA]  rounded-lg overflow-hidden shadow-lg max-w-sm p-4 w-[100%]">
        <div className="p-3">
          <div className="flex justify-end">
            <button onClick={()=>cancel()} className="text-xl self-end">
              <IoMdCloseCircleOutline />
            </button>
          </div>
          <div className="flex gap-x-6">
            <div className="w-[100px] h-full">
              <img
                className="object-contain"
                src={product.image}
                alt={`${product.name} Image`}
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="p-4">
                <h3 className="text-xl mb-2 text-[#482817] font-bold">{product.name}</h3>
                <p className="text-[#482817] text-xl font-semibold mb-4">
                  {product.description}
                </p>
                <p className="text-lg mb-2 text-[#9E845C]">
                  <strong>Category:</strong> {product.category}
                </p>
                <p className="text-lg mb-2 text-[#9E845C]">
                  <strong>Stock:</strong> {product.stock}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg text-[#482817]">${product.price}</span>
                  <button onClick={addToCart} className="bg-[#AF6900] text-[#482817] hover:text-white font-bold py-2 px-4 rounded">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
