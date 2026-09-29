-- STEP 1: In Supabase, go to "SQL Editor" -> "New query", paste this
-- entire file, and click "Run". This creates all your store's tables.
-- (Safe to run once — if you ever need to reset, delete the tables first.)

CREATE TABLE "Product" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "description" TEXT NOT NULL,
  "image" TEXT NOT NULL,
  "sizes" TEXT NOT NULL,
  "stock" BOOLEAN NOT NULL DEFAULT true,
  "tag" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Order" (
  "id" SERIAL PRIMARY KEY,
  "stripeSessionId" TEXT UNIQUE,
  "customerName" TEXT NOT NULL,
  "customerEmail" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "postalCode" TEXT NOT NULL,
  "country" TEXT NOT NULL,
  "subtotal" DOUBLE PRECISION NOT NULL,
  "shipping" DOUBLE PRECISION NOT NULL,
  "total" DOUBLE PRECISION NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "OrderItem" (
  "id" SERIAL PRIMARY KEY,
  "orderId" INTEGER NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE,
  "productId" INTEGER REFERENCES "Product"("id") ON DELETE SET NULL,
  "name" TEXT NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "size" TEXT NOT NULL,
  "qty" INTEGER NOT NULL
);

CREATE TABLE "Settings" (
  "id" INTEGER PRIMARY KEY DEFAULT 1,
  "logoImg" TEXT NOT NULL,
  "heroImg" TEXT NOT NULL,
  "heroTitle" TEXT NOT NULL,
  "heroTagline" TEXT NOT NULL,
  "storyImg" TEXT NOT NULL,
  "storyText" TEXT NOT NULL,
  "promoImg" TEXT NOT NULL,
  "aboutHeroImg" TEXT NOT NULL,
  "aboutText" TEXT NOT NULL,
  "contactEmail" TEXT NOT NULL,
  "instagram" TEXT NOT NULL,
  "shippingText" TEXT NOT NULL,
  "returnsText" TEXT NOT NULL
);
