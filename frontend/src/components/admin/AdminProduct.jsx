import { useEffect, useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import AddProduct from "./AddProduct";
import axiosInstance from "../../axios/axios";
import EditProduct from "./EditProducts";
import CustomModal from "../modal/CustomModal";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const { user } = useContext(UserContext);
  const [form, setForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [editProduct, setEditProduct] = useState({});
  const [modal, setModal] = useState(false);
  const [pId, setpId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "admin" && user?._id) {
      getProducts(user._id);
    }
  }, [user, navigate]);

  const getProducts = async (userId) => {
    if (!userId) return;
    const response = await axiosInstance.get(`/admin/${userId}`);
    setProducts(response.data.products.reverse());
  };

  const handleEdit = (id) => {
    const product = products.find((elem) => elem._id === id);
    setEditProduct(product);
    setEditForm(true);
  };

  const handleDelete = (id) => {
    setpId(id);
    setModal(true);
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="bg-[#F5EBDA] h-[99vh] p-3">
      {form && <AddProduct cancel={() => setForm(false)} updateProducts={setProducts} />}
      {modal && <CustomModal id={pId} cancel={() => setModal(false)} updateProducts={setProducts} />}
      {editForm && <EditProduct cancel={() => setEditForm(false)} curProduct={editProduct} updateProducts={setProducts} />}

      <h1 className="text-2xl font-bold">Products</h1>
      <button onClick={() => setForm(true)} className="mt-4 p-2 bg-blue-500 text-white rounded">
        Add Product
      </button>
      <table className="w-full text-sm text-left bg-white mt-4">
        <thead className="bg-gray-500 text-white">
          <tr>
            <th className="px-6 py-3">Product Name</th>
            <th className="px-6 py-3">Category</th>
            <th className="px-6 py-3">Price</th>
            <th className="px-6 py-3">Stock</th>
            <th className="px-6 py-3">Image</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="border-b">
              <td className="px-6 py-4">{product.name}</td>
              <td className="px-6 py-4">{product.category}</td>
              <td className="px-6 py-4">{product.price}</td>
              <td className="px-6 py-4">{product.stock}</td>
              <td className="px-6 py-4">
                <img className="w-10 h-10 rounded-full object-contain" src={product.image} alt="" />
              </td>
              <td className="px-6 py-4 flex gap-2">
                <button onClick={() => handleEdit(product._id)} className="px-3 py-1 bg-blue-600 text-white rounded">
                  Edit
                </button>
                <button onClick={() => handleDelete(product._id)} className="px-3 py-1 bg-red-600 text-white rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
