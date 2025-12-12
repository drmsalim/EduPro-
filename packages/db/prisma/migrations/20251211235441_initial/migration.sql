-- CreateEnum
CREATE TYPE "SlopeClass" AS ENUM ('FLAT', 'GENTLE', 'MODERATE', 'STEEP', 'VERY_STEEP');

-- CreateEnum
CREATE TYPE "SoilTexture" AS ENUM ('SANDY', 'LOAMY_SAND', 'SANDY_LOAM', 'LOAM', 'SILT_LOAM', 'SILT', 'CLAY_LOAM', 'SILTY_CLAY_LOAM', 'SANDY_CLAY_LOAM', 'CLAY', 'SILTY_CLAY', 'SANDY_CLAY');

-- CreateEnum
CREATE TYPE "LandUse" AS ENUM ('ARABLE', 'PASTURE', 'WOODLAND', 'WETLAND', 'URBAN', 'BARE_SOIL', 'SHRUBLAND', 'OTHER');

-- CreateEnum
CREATE TYPE "Drainage" AS ENUM ('VERY_POOR', 'POOR', 'MODERATE', 'WELL', 'VERY_WELL');

-- CreateEnum
CREATE TYPE "RainfallBand" AS ENUM ('ARID', 'SEMI_ARID', 'SUB_HUMID', 'HUMID', 'VERY_HUMID');

-- CreateEnum
CREATE TYPE "GullySeverity" AS ENUM ('NONE', 'MINOR', 'MODERATE', 'SEVERE', 'VERY_SEVERE');

-- CreateEnum
CREATE TYPE "DesignStatus" AS ENUM ('DRAFT', 'REVIEW', 'APPROVED', 'IMPLEMENTED', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SiteTechniqueStatus" AS ENUM ('PLANNED', 'IMPLEMENTED', 'ACTIVE', 'MAINTENANCE', 'ABANDONED');

-- CreateTable
CREATE TABLE "Site" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "slopeClass" "SlopeClass" NOT NULL,
    "soilTexture" "SoilTexture" NOT NULL,
    "landUse" "LandUse" NOT NULL,
    "drainage" "Drainage" NOT NULL,
    "rainfallBand" "RainfallBand" NOT NULL,
    "gullyState" "GullySeverity" NOT NULL,
    "technicalSpecs" JSONB,
    "safetyNotes" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Technique" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "technicalSpecs" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Technique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteTechnique" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "techniqueId" TEXT NOT NULL,
    "status" "SiteTechniqueStatus" NOT NULL,
    "plannedDate" TIMESTAMP(3),
    "implementationDate" TIMESTAMP(3),
    "maintenanceSchedule" JSONB,
    "workflowSteps" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteTechnique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesignTemplate" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "parameterSchema" JSONB NOT NULL,
    "outputs" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DesignTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Design" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "DesignStatus" NOT NULL DEFAULT 'DRAFT',
    "technicalSpecs" JSONB,
    "safetyNotes" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Design_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesignLayer" (
    "id" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "templateId" TEXT,
    "techniqueId" TEXT,
    "layerNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "parameters" JSONB,
    "technicalSpecs" JSONB,
    "safetyNotes" JSONB,
    "workflowSteps" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DesignLayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceTemplate" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "workflowSteps" JSONB,
    "technicalSpecs" JSONB,
    "safetyNotes" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaintenanceTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "unit" TEXT NOT NULL,
    "unitCost" DOUBLE PRECISION NOT NULL,
    "suppliers" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BOQ" (
    "id" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "totalCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BOQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BOQItem" (
    "id" TEXT NOT NULL,
    "boqId" TEXT NOT NULL,
    "designLayerId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "techniqueId" TEXT,
    "description" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unitCost" DOUBLE PRECISION NOT NULL,
    "totalCost" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BOQItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Metric" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "unit" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "measuredDate" TIMESTAMP(3) NOT NULL,
    "technicalSpecs" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Metric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CostRecord" (
    "id" TEXT NOT NULL,
    "boqId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CostRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Site_name_key" ON "Site"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Technique_code_key" ON "Technique"("code");

-- CreateIndex
CREATE UNIQUE INDEX "SiteTechnique_siteId_techniqueId_key" ON "SiteTechnique"("siteId", "techniqueId");

-- CreateIndex
CREATE UNIQUE INDEX "DesignTemplate_code_key" ON "DesignTemplate"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Design_siteId_code_key" ON "Design"("siteId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "MaintenanceTemplate_code_key" ON "MaintenanceTemplate"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Material_code_key" ON "Material"("code");

-- CreateIndex
CREATE UNIQUE INDEX "BOQ_designId_key" ON "BOQ"("designId");

-- AddForeignKey
ALTER TABLE "SiteTechnique" ADD CONSTRAINT "SiteTechnique_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteTechnique" ADD CONSTRAINT "SiteTechnique_techniqueId_fkey" FOREIGN KEY ("techniqueId") REFERENCES "Technique"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Design" ADD CONSTRAINT "Design_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignLayer" ADD CONSTRAINT "DesignLayer_designId_fkey" FOREIGN KEY ("designId") REFERENCES "Design"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignLayer" ADD CONSTRAINT "DesignLayer_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "DesignTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignLayer" ADD CONSTRAINT "DesignLayer_techniqueId_fkey" FOREIGN KEY ("techniqueId") REFERENCES "Technique"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BOQ" ADD CONSTRAINT "BOQ_designId_fkey" FOREIGN KEY ("designId") REFERENCES "Design"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BOQItem" ADD CONSTRAINT "BOQItem_boqId_fkey" FOREIGN KEY ("boqId") REFERENCES "BOQ"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BOQItem" ADD CONSTRAINT "BOQItem_designLayerId_fkey" FOREIGN KEY ("designLayerId") REFERENCES "DesignLayer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BOQItem" ADD CONSTRAINT "BOQItem_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BOQItem" ADD CONSTRAINT "BOQItem_techniqueId_fkey" FOREIGN KEY ("techniqueId") REFERENCES "Technique"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Metric" ADD CONSTRAINT "Metric_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostRecord" ADD CONSTRAINT "CostRecord_boqId_fkey" FOREIGN KEY ("boqId") REFERENCES "BOQ"("id") ON DELETE SET NULL ON UPDATE CASCADE;
