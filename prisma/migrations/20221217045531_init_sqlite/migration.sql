-- CreateTable
CREATE TABLE "Product" (
    "type" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "shipsTo" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "isManufacturer" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductToStore" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ProductToStore_A_fkey" FOREIGN KEY ("A") REFERENCES "Product" ("type") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ProductToStore_B_fkey" FOREIGN KEY ("B") REFERENCES "Store" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Store_url_key" ON "Store"("url");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToStore_AB_unique" ON "_ProductToStore"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToStore_B_index" ON "_ProductToStore"("B");
