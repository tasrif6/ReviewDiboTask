"use client";
import { useEffect, useState } from "react";
import { getProducts, createProduct, getCurrentUser, deleteProduct } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [minRating, setMinRating] = useState("all");

  // Admin form state
  const [adminForm, setAdminForm] = useState({ title: "", description: "", image_url: "" });
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState(null);

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUser(getCurrentUser());
    fetchAllProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setAdminLoading(true);
    setAdminError(null);
    try {
      await createProduct(adminForm);
      setAdminForm({ title: "", description: "", image_url: "" });
      // Refresh products list
      await fetchAllProducts();
    } catch (err) {
      setAdminError(err.message);
    } finally {
      setAdminLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product? All reviews for this product will also be deleted.")) {
      return;
    }
    try {
      await deleteProduct(productId);
      // Refresh products list
      await fetchAllProducts();
    } catch (err) {
      alert("Failed to delete product: " + err.message);
    }
  };

  // Filter products locally based on search term and minRating
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));

    let matchesRating = true;
    if (minRating !== "all") {
      const minNum = parseFloat(minRating);
      matchesRating = p.average_rating !== null && p.average_rating >= minNum;
    }

    return matchesSearch && matchesRating;
  });

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* Admin Panel: Add Product Form */}
      {user && user.is_admin && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-8 shadow-sm">
          <h2 className="text-lg font-bold text-red-800 mb-4">Admin Dashboard: Add New Product</h2>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Product Title*</label>
              <input
                type="text"
                required
                placeholder="e.g. Gaming Laptop"
                value={adminForm.title}
                onChange={(e) => setAdminForm({ ...adminForm, title: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Image URL (Optional)</label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={adminForm.image_url}
                onChange={(e) => setAdminForm({ ...adminForm, image_url: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={adminLoading}
                className="w-full bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 text-sm cursor-pointer"
              >
                {adminLoading ? "Adding..." : "Add Product"}
              </button>
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Description (Optional)</label>
              <textarea
                placeholder="Short description of the product..."
                value={adminForm.description}
                onChange={(e) => setAdminForm({ ...adminForm, description: e.target.value })}
                rows={2}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
              />
            </div>
          </form>
          {adminError && <p className="text-red-600 text-xs mt-2">{adminError}</p>}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold">Products list</h1>
        
        {/* Search and Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border bg-white rounded-lg px-3 py-1.5 text-sm w-48 sm:w-64"
          />
          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="border bg-white rounded-lg px-3 py-1.5 text-sm"
          >
            <option value="all">All Ratings</option>
            <option value="4">⭐⭐⭐⭐ & Up (4.0+)</option>
            <option value="3">⭐⭐⭐ & Up (3.0+)</option>
            <option value="2">⭐⭐ & Up (2.0+)</option>
            <option value="1">⭐ & Up (1.0+)</option>
          </select>
        </div>
      </div>

      {loading && <p className="text-gray-500 text-center py-10">Loading products...</p>}
      
      {error && (
        <p className="text-red-500 bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          {error}
        </p>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <p className="text-gray-500 text-center py-10">No products found matching your search criteria.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            isAdmin={user && user.is_admin}
            onDelete={handleDeleteProduct}
          />
        ))}
      </div>
    </main>
  );
}
