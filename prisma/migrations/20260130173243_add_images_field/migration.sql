-- CreateEnum
CREATE TYPE "Category" AS ENUM ('HOUSE', 'OFFICE', 'EVENT');

-- CreateEnum
CREATE TYPE "Privacy" AS ENUM ('ENTIRE', 'PRIVATE', 'SHARED');

-- CreateTable
CREATE TABLE "utilisateurs" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "utilisateurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "biens" (
    "id" SERIAL NOT NULL,
    "images" TEXT[],
    "category" "Category" NOT NULL,
    "subType" TEXT NOT NULL,
    "privacy" "Privacy",
    "country" TEXT NOT NULL DEFAULT 'Bénin',
    "city" TEXT NOT NULL,
    "neighborhood" TEXT,
    "address" TEXT NOT NULL,
    "postalCode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "size" INTEGER,
    "floors" INTEGER,
    "maxGuests" INTEGER,
    "bedrooms" INTEGER,
    "beds" INTEGER,
    "bathrooms" INTEGER,
    "privateEntrance" BOOLEAN DEFAULT false,
    "employees" INTEGER,
    "offices" INTEGER,
    "meetingRooms" INTEGER,
    "workstations" INTEGER,
    "eventCapacity" INTEGER,
    "parkingSpots" INTEGER,
    "wheelchairAccessible" BOOLEAN DEFAULT false,
    "hasStage" BOOLEAN DEFAULT false,
    "hasSoundSystem" BOOLEAN DEFAULT false,
    "hasProjector" BOOLEAN DEFAULT false,
    "minBookingHours" INTEGER,
    "title" TEXT,
    "basePrice" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'FCFA',
    "weeklyDiscount" DOUBLE PRECISION DEFAULT 0,
    "monthlyDiscount" DOUBLE PRECISION DEFAULT 0,
    "cleaningFee" DOUBLE PRECISION DEFAULT 0,
    "extraGuestFee" DOUBLE PRECISION DEFAULT 0,
    "securityDeposit" DOUBLE PRECISION DEFAULT 0,
    "checkInTime" TEXT,
    "checkOutTime" TEXT,
    "childrenAllowed" BOOLEAN DEFAULT true,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "proprietaireId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "biens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "descriptions" (
    "id" SERIAL NOT NULL,
    "summary" TEXT NOT NULL,
    "spaceDescription" TEXT NOT NULL,
    "guestAccess" TEXT NOT NULL,
    "neighborhoodInfo" TEXT NOT NULL,
    "bienId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "descriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipements" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "categorie" TEXT NOT NULL,
    "pourMaison" BOOLEAN NOT NULL DEFAULT false,
    "pourBureau" BOOLEAN NOT NULL DEFAULT false,
    "pourEvenement" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "equipements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipement_biens" (
    "id" SERIAL NOT NULL,
    "bienId" INTEGER NOT NULL,
    "equipementId" INTEGER NOT NULL,

    CONSTRAINT "equipement_biens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_email_key" ON "utilisateurs"("email");

-- CreateIndex
CREATE UNIQUE INDEX "descriptions_bienId_key" ON "descriptions"("bienId");

-- CreateIndex
CREATE UNIQUE INDEX "equipements_code_key" ON "equipements"("code");

-- CreateIndex
CREATE UNIQUE INDEX "equipement_biens_bienId_equipementId_key" ON "equipement_biens"("bienId", "equipementId");

-- AddForeignKey
ALTER TABLE "biens" ADD CONSTRAINT "biens_proprietaireId_fkey" FOREIGN KEY ("proprietaireId") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "descriptions" ADD CONSTRAINT "descriptions_bienId_fkey" FOREIGN KEY ("bienId") REFERENCES "biens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipement_biens" ADD CONSTRAINT "equipement_biens_bienId_fkey" FOREIGN KEY ("bienId") REFERENCES "biens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipement_biens" ADD CONSTRAINT "equipement_biens_equipementId_fkey" FOREIGN KEY ("equipementId") REFERENCES "equipements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
