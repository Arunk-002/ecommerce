import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const navigate = useNavigate();


  useEffect(() => {
    navigate("/admin/products"); // Redirect to Products by default
  }, [navigate]);

  return null;
}
