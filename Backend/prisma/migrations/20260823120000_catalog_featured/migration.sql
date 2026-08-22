-- Expand Product with explicit, administrable catalog highlighting.
ALTER TABLE "Product" ADD COLUMN "isFeatured" BOOLEAN NOT NULL DEFAULT false;
