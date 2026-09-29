"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/components/ProductCard";
import { createClient } from "@/lib/supabase/client";

type Tab = "products" | "orders" | "settings" | "backup";

const emptyForm = { id: "", name: "", price: "", category: "", sizes: "", description: "", stock: "true", tag: "", image: "" };
const fileInputClass = "block min-h-12 w-full max-w-full py-2 text-sm text-muted file:mr-3 file:min-h-11 file:border file:border-line file:bg-bg2 file:px-3 file:font-semibold file:uppercase file:text-xs file:text-fg disabled:opacity-50";

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [tab, setTab] = useState<Tab>("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [settings, setSettings] = useState<Record<string, any> | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);
  const productFormRef = useRef<HTMLHeadingElement>(null);

  function loadProducts() { fetch("/api/products").then((r) => r.json()).then(setProducts); }
  function loadOrders() { fetch("/api/orders").then((r) => r.json()).then(setOrders); }
  function loadSettings() { fetch("/api/settings").then((r) => r.json()).then(setSettings); }

  useEffect(() => { loadProducts(); loadSettings(); }, []);
  useEffect(() => { if (tab === "orders") loadOrders(); }, [tab]);

  async function updateOrderStatus(id: number, status: string) {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) loadOrders(); else alert("Failed to update order status");
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  // Uploads the file straight to your Supabase Storage "images" bucket and
  // returns its public URL — this is what actually gets saved on the
  // product/setting, not a base64 blob, so the database stays light and
  // images are served from Supabase's CDN.
  async function handleImgFile(e: React.ChangeEvent<HTMLInputElement>, cb: (url: string) => void, target: string) {
    const file = e.target.files?.[0];
    if (!file) return;
    const input = e.currentTarget;
    setUploadingTarget(target);
    const ext = file.name.split(".").pop();
    const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    try {
      const { error } = await supabase.storage.from("images").upload(path, file, { upsert: true });
      if (error) {
        alert("Image upload failed: " + error.message + "\nCheck that the 'images' bucket exists and is public (see README).");
        return;
      }
      const { data } = supabase.storage.from("images").getPublicUrl(path);
      cb(data.publicUrl);
    } catch (error) {
      console.error("Image upload could not be completed.", error);
      alert(error instanceof Error ? `Image upload failed: ${error.message}` : "Image upload failed. Please try again.");
    } finally {
      setUploadingTarget(null);
      input.value = "";
    }
  }

  function editProduct(p: Product) {
    setForm({
      id: String(p.id), name: p.name, price: String(p.price), category: p.category,
      sizes: p.sizes, description: p.description, stock: String(p.stock), tag: p.tag || "", image: p.image,
    });
    productFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function saveProduct() {
    if (!form.name || !form.price || !form.sizes) { alert("Fill in name, price and sizes"); return; }
    const payload = {
      name: form.name, price: form.price, category: form.category || "Uncategorized",
      sizes: form.sizes, description: form.description, stock: form.stock === "true",
      tag: form.tag || null, image: form.image || products[0]?.image || "",
    };
    const url = form.id ? `/api/products/${form.id}` : "/api/products";
    const method = form.id ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (res.ok) { setForm(emptyForm); loadProducts(); } else alert("Save failed");
  }

  async function deleteProduct(id: number) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    loadProducts();
  }

  async function saveSettings() {
    const res = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
    if (res.ok) alert("Site content saved"); else alert("Save failed");
  }

  function exportBackup() {
    const data = JSON.stringify({ products, settings }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "kbrandmusic-backup.json"; a.click();
    URL.revokeObjectURL(url);
  }

  async function importBackup(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      const data = JSON.parse(text);
      for (const p of data.products || []) {
        await fetch(`/api/products`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) });
      }
      if (data.settings) {
        await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data.settings) });
      }
      loadProducts(); loadSettings();
      alert("Backup imported. Note: products were added, not overwritten — delete duplicates manually if needed.");
    } catch {
      alert("Invalid backup file");
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "products", label: "Products" },
    { id: "orders", label: "Orders" },
    { id: "settings", label: "Site Content" },
    { id: "backup", label: "Backup" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <div className="flex justify-between items-center flex-wrap gap-3 mb-8">
        <h1 className="font-display text-3xl">Owner Dashboard</h1>
        <button className="border border-line px-3 py-2 text-xs uppercase font-bold" onClick={logout}>Log Out</button>
      </div>
      <div className="flex gap-2 flex-wrap mb-8">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 text-xs uppercase font-bold border ${tab === t.id ? "bg-fg text-bg border-fg" : "border-line text-muted"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "products" && (
        <div>
          <h3 className="text-xs uppercase font-extrabold mb-3">All Products</h3>
          <div className="mb-10">
            {products.map((p) => (
              <div key={p.id} className="flex gap-3 items-center py-2.5 border-b border-line">
                <img src={p.image} className="w-11 h-14 object-cover" alt={p.name} />
                <div className="min-w-0 flex-1">
                  <div className="break-words font-bold text-sm">{p.name}</div>
                  <div className="text-muted text-xs">{p.category} · ${p.price.toFixed(2)} · {p.stock ? "In stock" : "Out of stock"}{p.tag ? ` · ${p.tag}` : ""}</div>
                </div>
                <button className="border border-line px-2.5 py-2 text-xs font-bold" onClick={() => editProduct(p)}>Edit</button>
                <button className="border border-line px-2.5 py-2 text-xs font-bold" onClick={() => deleteProduct(p.id)}>Delete</button>
              </div>
            ))}
            {products.length === 0 && <p className="text-muted text-sm">No products yet.</p>}
          </div>

          <h3 ref={productFormRef} id="product-form" className="scroll-mt-20 text-xs uppercase font-extrabold mb-3">{form.id ? "Edit Product" : "Add New Product"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5">
            <div><label htmlFor="product-name" className="label">Name</label><input id="product-name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><label htmlFor="product-price" className="label">Price (USD)</label><input id="product-price" type="number" step="0.01" className="input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5">
            <div><label htmlFor="product-category" className="label">Category</label><input id="product-category" className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Hoodies" /></div>
            <div><label htmlFor="product-sizes" className="label">Sizes (comma separated)</label><input id="product-sizes" className="input" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} placeholder="S, M, L, XL" /></div>
          </div>
          <div className="mb-3.5"><label htmlFor="product-description" className="label">Description</label><textarea id="product-description" className="input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="mb-3.5">
            <label htmlFor="product-image" className="label">Product Image</label>
            <input id="product-image" type="file" accept="image/*" disabled={uploadingTarget !== null} className={fileInputClass} onChange={(e) => handleImgFile(e, (url) => setForm((f) => ({ ...f, image: url })), "product")} />
            {uploadingTarget === "product" && <span role="status" className="text-xs text-muted block mt-1">Uploading product image…</span>}
            {form.image && <img src={form.image} className="max-w-[120px] mt-2" alt="preview" />}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
            <div><label htmlFor="product-stock" className="label">Stock</label>
              <select id="product-stock" className="input" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}>
                <option value="true">In Stock</option><option value="false">Out of Stock</option>
              </select>
            </div>
            <div><label htmlFor="product-flag" className="label">Flag</label>
              <select id="product-flag" className="input" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })}>
                <option value="">None</option><option value="new">New Arrival</option><option value="featured">Featured</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2.5">
            <button className="btn btn-solid" disabled={uploadingTarget !== null} onClick={saveProduct}>Save Product</button>
            <button className="btn btn-outline" onClick={() => setForm(emptyForm)}>Clear Form</button>
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div>
          <h3 className="text-xs uppercase font-extrabold mb-3">All Orders</h3>
          {orders.length === 0 && <p className="text-muted text-sm">No orders yet.</p>}
          {orders.map((o) => (
            <div key={o.id} className="border border-line p-4 mb-3">
              <div className="flex justify-between flex-wrap gap-2 mb-2">
                <div className="font-bold text-sm">Order #{o.id} — {o.customerName}</div>
                <select
                  className="min-h-12 min-w-40 max-w-full bg-bg2 border border-line text-sm uppercase font-bold px-3 py-2"
                  value={o.status}
                  onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="text-muted text-xs mb-2">{o.customerEmail} · {o.address}, {o.city}, {o.postalCode}, {o.country}</div>
              <div className="text-xs text-neutral-300">
                {o.items.map((it: any) => (<div key={it.id}>{it.qty}× {it.name} (Size {it.size}) — ${it.price.toFixed(2)}</div>))}
              </div>
              <div className="text-sm font-bold mt-2">Total: ${o.total.toFixed(2)}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "settings" && settings && (
        <div>
          <h3 className="text-xs uppercase font-extrabold mb-3">Logo & Hero</h3>
          <div className="mb-3.5">
            <label htmlFor="settings-logo-image" className="label">Logo Image</label>
            <input id="settings-logo-image" type="file" accept="image/*" disabled={uploadingTarget !== null} className={fileInputClass} onChange={(e) => handleImgFile(e, (url) => setSettings((current) => ({ ...current, logoImg: url })), "logo")} />
            {uploadingTarget === "logo" && <span role="status" className="text-xs text-muted block mt-1">Uploading logo image…</span>}
            {settings.logoImg && <img src={settings.logoImg} className="max-w-[100px] mt-2 invert bg-neutral-800 p-1" alt="logo" />}
          </div>
          <div className="mb-3.5">
            <label htmlFor="settings-hero-image" className="label">Hero Background Image</label>
            <input id="settings-hero-image" type="file" accept="image/*" disabled={uploadingTarget !== null} className={fileInputClass} onChange={(e) => handleImgFile(e, (url) => setSettings((current) => ({ ...current, heroImg: url })), "hero")} />
            {uploadingTarget === "hero" && <span role="status" className="text-xs text-muted block mt-1">Uploading hero image…</span>}
            {settings.heroImg && <img src={settings.heroImg} className="max-w-[160px] mt-2" alt="hero" />}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
            <div><label htmlFor="settings-hero-title" className="label">Hero Title (use \n for line break)</label><input id="settings-hero-title" className="input" value={settings.heroTitle} onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })} /></div>
            <div><label htmlFor="settings-hero-tagline" className="label">Hero Tagline</label><input id="settings-hero-tagline" className="input" value={settings.heroTagline} onChange={(e) => setSettings({ ...settings, heroTagline: e.target.value })} /></div>
          </div>

          <h3 className="text-xs uppercase font-extrabold mb-3 mt-6">Brand Story</h3>
          <div className="mb-3.5">
            <label htmlFor="settings-story-image" className="label">Story Image</label>
            <input id="settings-story-image" type="file" accept="image/*" disabled={uploadingTarget !== null} className={fileInputClass} onChange={(e) => handleImgFile(e, (url) => setSettings((current) => ({ ...current, storyImg: url })), "story")} />
            {uploadingTarget === "story" && <span role="status" className="text-xs text-muted block mt-1">Uploading story image…</span>}
            {settings.storyImg && <img src={settings.storyImg} className="max-w-[160px] mt-2" alt="story" />}
          </div>
          <div className="mb-4"><label htmlFor="settings-story-text" className="label">Story Text</label><textarea id="settings-story-text" className="input" rows={3} value={settings.storyText} onChange={(e) => setSettings({ ...settings, storyText: e.target.value })} /></div>

          <h3 className="text-xs uppercase font-extrabold mb-3">Promo Banner</h3>
          <div className="mb-4">
            <label htmlFor="settings-promo-image" className="label">Promo Image</label>
            <input id="settings-promo-image" type="file" accept="image/*" disabled={uploadingTarget !== null} className={fileInputClass} onChange={(e) => handleImgFile(e, (url) => setSettings((current) => ({ ...current, promoImg: url })), "promo")} />
            {uploadingTarget === "promo" && <span role="status" className="text-xs text-muted block mt-1">Uploading promo image…</span>}
            {settings.promoImg && <img src={settings.promoImg} className="max-w-[160px] mt-2" alt="promo" />}
          </div>

          <h3 className="text-xs uppercase font-extrabold mb-3">About Page</h3>
          <div className="mb-3.5">
            <label htmlFor="settings-about-image" className="label">About Image</label>
            <input id="settings-about-image" type="file" accept="image/*" disabled={uploadingTarget !== null} className={fileInputClass} onChange={(e) => handleImgFile(e, (url) => setSettings((current) => ({ ...current, aboutHeroImg: url })), "about")} />
            {uploadingTarget === "about" && <span role="status" className="text-xs text-muted block mt-1">Uploading about image…</span>}
            {settings.aboutHeroImg && <img src={settings.aboutHeroImg} className="max-w-[160px] mt-2" alt="about" />}
          </div>
          <div className="mb-4"><label htmlFor="settings-about-text" className="label">About Text</label><textarea id="settings-about-text" className="input" rows={3} value={settings.aboutText} onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })} /></div>

          <h3 className="text-xs uppercase font-extrabold mb-3">Contact & Social</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
            <div><label htmlFor="settings-contact-email" className="label">Contact Email</label><input id="settings-contact-email" type="email" className="input" value={settings.contactEmail} onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })} /></div>
            <div><label htmlFor="settings-instagram" className="label">Instagram Handle (no @)</label><input id="settings-instagram" className="input" value={settings.instagram} onChange={(e) => setSettings({ ...settings, instagram: e.target.value })} /></div>
          </div>

          <h3 className="text-xs uppercase font-extrabold mb-3">Shipping & Returns</h3>
          <div className="mb-3.5"><label htmlFor="settings-shipping-text" className="label">Shipping Info Text</label><textarea id="settings-shipping-text" className="input" rows={2} value={settings.shippingText} onChange={(e) => setSettings({ ...settings, shippingText: e.target.value })} /></div>
          <div className="mb-4"><label htmlFor="settings-returns-text" className="label">Returns Policy Text</label><textarea id="settings-returns-text" className="input" rows={2} value={settings.returnsText} onChange={(e) => setSettings({ ...settings, returnsText: e.target.value })} /></div>

          <button className="btn btn-solid" disabled={uploadingTarget !== null} onClick={saveSettings}>Save Site Content</button>
        </div>
      )}

      {tab === "backup" && (
        <div>
          <h3 className="text-xs uppercase font-extrabold mb-3">Export Backup</h3>
          <p className="text-muted text-sm mb-3.5">Download a JSON file with all products and site settings.</p>
          <button className="btn btn-outline" onClick={exportBackup}>Download Backup (.json)</button>
          <h3 className="text-xs uppercase font-extrabold mb-3 mt-8">Import Backup</h3>
          <p className="text-muted text-sm mb-3.5">Restore products and settings from a previously exported file.</p>
          <label htmlFor="settings-backup-file" className="label">Select backup file</label>
          <input id="settings-backup-file" type="file" accept="application/json" className={fileInputClass} onChange={importBackup} />
        </div>
      )}
    </div>
  );
}
