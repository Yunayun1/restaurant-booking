"use client";

import React, { useEffect, useState } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import styles from "./digitalMenu.module.css";
import { Trash2, Edit, Plus, Search, X, Utensils, Beer } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  category: "Food" | "Drink";
  price: number;
  status: "Available" | "Out of Stock";
  image: string;
  description: string;
  tag?: "New" | "Recommended" | "Famous"; // ✅ NEW
}

export default function DigitalMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [formData, setFormData] = useState({
    name: "",
    category: "Food",
    price: "",
    status: "Available",
    image: "",
    description: "",
    tag: "", // ✅ NEW
  });

  const fetchItems = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "menuItems"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as MenuItem));
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        category: item.category,
        price: item.price.toString(),
        status: item.status,
        image: item.image,
        description: item.description,
        tag: item.tag || "", // ✅ NEW
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: "",
        category: "Food",
        price: "",
        status: "Available",
        image: "",
        description: "",
        tag: "", // ✅ NEW
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = (file: File) => {
    if (!file.type.includes("png") && !file.type.includes("jpg") && !file.type.includes("jpeg")) {
      alert("Only PNG or JPG allowed");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const itemData = {
      ...formData,
      price: parseFloat(formData.price),
      tag: formData.tag || null, // ✅ CLEAN DATA
    };

    try {
      if (editingItem) {
        await updateDoc(doc(db, "menuItems", editingItem.id), itemData);
      } else {
        await addDoc(collection(db, "menuItems"), itemData);
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (err) {
      alert("Error saving item");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await deleteDoc(doc(db, "menuItems", id));
    fetchItems();
  };

  const toggleStatus = async (item: MenuItem) => {
    const newStatus = item.status === "Available" ? "Out of Stock" : "Available";
    await updateDoc(doc(db, "menuItems", item.id), { status: newStatus });
    fetchItems();
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Digital Menu</h1>
          <p className={styles.subtitle}>Manage your restaurant offerings.</p>
        </div>
        <button className={styles.addButton} onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add New Item
        </button>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <Search size={18} />
          <input
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Food">Food</option>
          <option value="Drink">Drink</option>
        </select>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name & Description</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Tag</th> {/* ✅ NEW COLUMN */}
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>Loading items...</td></tr>
            ) : filteredItems.map(item => (
              <tr key={item.id}>
                <td>
                  <img src={item.image || "/placeholder.png"} className={styles.itemThumb} width={50} height={50} alt={item.name} />
                </td>
                <td>
                  <div className={styles.itemName}>{item.name}</div>
                  <small>{item.description}</small>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {item.category === "Food" ? <Utensils size={14}/> : <Beer size={14}/>} {item.category}
                  </div>
                </td>
                <td><strong>${item.price.toFixed(2)}</strong></td>
                <td>
                  <button 
                    onClick={() => toggleStatus(item)}
                    className={item.status === "Available" ? styles.statusAvailable : styles.statusOutOfStock}
                  >
                    {item.status}
                  </button>
                </td>

                {/* ✅ SHOW TAG */}
                <td>
                  {item.tag ? <span>{item.tag}</span> : "-"}
                </td>

                <td>
                  <div className={styles.actions}>
                    <button onClick={() => handleOpenModal(item)} title="Edit">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{editingItem ? "Edit Menu Item" : "Add New Item"}</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>Item Name</label>
                <input
                  required
                  placeholder="e.g. Cheese Burger"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                  >
                    <option value="Food">Food</option>
                    <option value="Drink">Drink</option>
                    <option value="Dessert">Dessert</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
              </div>

              {/* ✅ TAG DROPDOWN */}
              <div className={styles.formGroup}>
                <label>Tag</label>
                <select
                  value={formData.tag}
                  onChange={(e) => setFormData({...formData, tag: e.target.value})}
                >
                  <option value="">None</option>
                  <option value="New">New</option>
                  <option value="Recommended">Recommended</option>
                  <option value="Famous">Famous</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Image</label>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  className={styles.fileInput}
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
                  }}
                />
                {formData.image && (
                  <div className={styles.imagePreviewWrapper}>
                    <img src={formData.image} className={styles.imagePreview} alt="Preview" />
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  placeholder="Enter item details..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.saveBtn}>
                  {editingItem ? "Update Item" : "Save Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}