import { useEffect, useState } from "react";
import axiosInstance from "../axios/axios";
import ProductCard from "./productCard/ProductCard";
import { selectProducts, setProducts } from "../redux/slice/productSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Shop() {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Wines' },
    { id: 'redwine', name: 'Red Wine' },
    { id: 'whitewine', name: 'White Wine' },
    { id: 'rosewine', name: 'Rosé Wine' },
    { id: 'sparklingwine', name: 'Sparkling Wine' },
    { id: 'other', name: 'Other' }
  ];

  useEffect(() => {
    fetchProducts();
  }, [currentPage, selectedCategory]); // Dependencies for the main fetch effect

  // Separate effect to reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/", {
        params: {
          page: currentPage,
          limit: 3,
          category: selectedCategory
        }
      });
      if (response.data) {
        dispatch(setProducts(response.data.products));
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory);
    // Page reset is handled by the useEffect above
  };

  return (
    <div className="shop-bg h-screen">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Products
          </h2>
          
          {/* Category Filter */}
          <div className="mb-4">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#AF6900]"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-y-scroll no-scrollbar h-[70vh]">
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products?.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No products found in this category.
              </p>
            )}
          </div>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center items-center gap-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-[#AF6900] text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-[#AF6900] text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}