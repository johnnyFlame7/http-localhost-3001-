"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { Product } from "@/components/ProductCard";
import { STARTER_PRODUCTS } from "@/lib/catalog";

const MAX_QUANTITY = 99;

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const { add } = useCart();
  const router = useRouter();

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/api/products/${params.id}`)
      .then(async (response) => {
        if (response.status === 404) {
          setError("This product could not be found. Please return to the shop.");
          setProduct(null);
          return null;
        }
        if (!response.ok) throw new Error("Product details are unavailable.");
        return response.json() as Promise<Product>;
      })
      .then((result) => {
        if (!active || !result) return;
        setProduct(result);
        setSelectedImage(result.image);
        if (Number(params.id) === STARTER_PRODUCTS[0].id && !result.images?.length) {
          setProduct({
            ...result,
            images: [result.image, "/images/model_b.jpg", "/images/model_c.jpg"],
          });
        }
        setSize("");
        setError("");
      })
      .catch((fetchError) => {
        console.error("Unable to load product details.", fetchError);
        if (!active) return;
        const starter = STARTER_PRODUCTS.find((item) => item.id === Number(params.id));
        setProduct(starter || null);
        setSelectedImage(starter?.image || "");
        setSize("");
        setError(starter ? "" : "This product could not be found. Please return to the shop.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [params.id]);

  if (loading) return <div className="max-w-6xl mx-auto px-5 py-16 text-muted">Loading product…</div>;
  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-5 py-16">
        <p className="text-muted mb-5">{error}</p>
        <Link href="/shop" className="btn btn-solid">Back to Shop</Link>
      </div>
    );
  }

  const currentProduct = product;
  const sizes = currentProduct.sizes.split(",").map((value) => value.trim()).filter(Boolean);
  const images = currentProduct.images?.length ? currentProduct.images : [currentProduct.image];

  function handleAdd(continueToCheckout: boolean) {
    if (!size) {
      setError("Choose a size before adding this item to your cart.");
      return;
    }
    if (!currentProduct.stock) {
      setError("This product is currently sold out.");
      return;
    }
    try {
      add({
        productId: currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.price,
        image: currentProduct.image,
        size,
        qty,
      });
      setError("");
      setAdded(true);
      if (continueToCheckout) router.push("/checkout");
    } catch (addError) {
      setError(addError instanceof Error ? addError.message : "Unable to add this item to your cart.");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-8 md:py-10">
      <div className="text-sm text-muted mb-6">
        <Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / <span>{currentProduct.name}</span>
      </div>
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <div>
          <div className="aspect-[4/5] overflow-hidden bg-black border border-line">
            <img src={selectedImage} alt={currentProduct.name} className="w-full h-full object-cover object-top" />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-3 gap-3 mt-3">
              {images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  aria-label={`View product image ${index + 1}`}
                  aria-pressed={selectedImage === image}
                  className={`aspect-square overflow-hidden border ${selectedImage === image ? "border-fg" : "border-line"}`}
                >
                  <img src={image} alt={`${currentProduct.name}, view ${index + 1}`} className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-muted font-bold">{currentProduct.category}</div>
          <h1 className="font-display my-2" style={{ fontSize: "clamp(30px,5vw,48px)" }}>{currentProduct.name}</h1>
          <div className="text-2xl font-extrabold mb-4">${currentProduct.price.toFixed(2)}</div>
          <p className="text-neutral-300 leading-relaxed mb-7">{currentProduct.description}</p>

          <fieldset className="mb-6" disabled={!currentProduct.stock}>
            <legend className="label">Select a size</legend>
            <div className="flex gap-2 flex-wrap mt-2">
              {sizes.map((itemSize) => (
                <button
                  key={itemSize}
                  type="button"
                  onClick={() => { setSize(itemSize); setError(""); setAdded(false); }}
                  aria-pressed={itemSize === size}
                  className={`min-w-12 h-11 px-3 border text-sm font-semibold ${itemSize === size ? "bg-fg text-bg border-fg" : "border-line hover:border-fg"}`}
                >
                  {itemSize}
                </button>
              ))}
            </div>
          </fieldset>

          <label htmlFor="product-quantity" className="label">Quantity</label>
          <div className="flex items-center border border-line w-fit mb-6">
            <button type="button" aria-label="Decrease quantity" className="w-11 h-11 text-lg" onClick={() => setQty((value) => Math.max(1, value - 1))}>−</button>
            <input
              id="product-quantity"
              aria-label="Quantity"
              type="number"
              min={1}
              max={MAX_QUANTITY}
              value={qty}
              onChange={(event) => setQty(Math.min(MAX_QUANTITY, Math.max(1, Number(event.target.value) || 1)))}
              className="w-12 bg-transparent text-center text-base font-bold focus:outline-none"
            />
            <button type="button" aria-label="Increase quantity" className="w-11 h-11 text-lg" onClick={() => setQty((value) => Math.min(MAX_QUANTITY, value + 1))}>+</button>
          </div>

          {!currentProduct.stock && <p className="text-sm text-red-300 mb-4">Sold out</p>}
          {error && <p role="alert" className="text-sm text-red-300 mb-4">{error}</p>}
          {added && (
            <p role="status" className="text-sm text-green-300 mb-4">
              Added to cart. <Link href="/cart" className="underline">View cart</Link>
            </p>
          )}
          <div className="flex gap-2.5 flex-wrap mb-8">
            <button type="button" className="btn btn-outline flex-1 min-w-[160px]" disabled={!currentProduct.stock} onClick={() => handleAdd(false)}>Add to Cart</button>
            <button type="button" className="btn btn-solid flex-1 min-w-[160px]" disabled={!currentProduct.stock} onClick={() => handleAdd(true)}>Buy Now</button>
          </div>

          <div className="border-t border-line">
            <details className="border-b border-line py-4" open>
              <summary className="font-bold text-xs uppercase tracking-wide cursor-pointer">Product Details</summary>
              <p className="text-muted text-sm mt-3 leading-relaxed">{currentProduct.description}</p>
            </details>
            <details className="border-b border-line py-4">
              <summary className="font-bold text-xs uppercase tracking-wide cursor-pointer">Shipping</summary>
              <p className="text-muted text-sm mt-3 leading-relaxed">Standard shipping is $8. Orders of $100 or more ship free.</p>
            </details>
            <details className="border-b border-line py-4">
              <summary className="font-bold text-xs uppercase tracking-wide cursor-pointer">Returns</summary>
              <p className="text-muted text-sm mt-3 leading-relaxed">Contact our team through the Contact page to arrange a return.</p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
