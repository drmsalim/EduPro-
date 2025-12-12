# SWC Platform Prisma Schema

## Overview
This document describes the comprehensive Prisma database schema for the Soil and Water Conservation (SWC) Platform. The schema covers techniques, design templates, site management, cost tracking, and monitoring/evaluation.

## Enums

### Classification Enums
- **SlopeClass**: FLAT, GENTLE, MODERATE, STEEP, VERY_STEEP
- **SoilTexture**: SANDY, LOAMY_SAND, SANDY_LOAM, LOAM, SILT_LOAM, SILT, CLAY_LOAM, SILTY_CLAY_LOAM, SANDY_CLAY_LOAM, CLAY, SILTY_CLAY, SANDY_CLAY
- **LandUse**: ARABLE, PASTURE, WOODLAND, WETLAND, URBAN, BARE_SOIL, SHRUBLAND, OTHER
- **Drainage**: VERY_POOR, POOR, MODERATE, WELL, VERY_WELL
- **RainfallBand**: ARID, SEMI_ARID, SUB_HUMID, HUMID, VERY_HUMID
- **GullySeverity**: NONE, MINOR, MODERATE, SEVERE, VERY_SEVERE

### Status Enums
- **DesignStatus**: DRAFT, REVIEW, APPROVED, IMPLEMENTED, COMPLETED, ARCHIVED
- **SiteTechniqueStatus**: PLANNED, IMPLEMENTED, ACTIVE, MAINTENANCE, ABANDONED

## Core Models

### Site
Represents a physical location/site for conservation work.
- **Fields**: id, name, description, location, latitude, longitude
- **Classifications**: slopeClass, soilTexture, landUse, drainage, rainfallBand, gullyState
- **JSON Columns**: technicalSpecs, safetyNotes
- **Relationships**: designs, siteTechniques, metrics

### Technique
Reusable conservation and management techniques.
- **Fields**: id, code, name, description, category
- **JSON Columns**: technicalSpecs
- **Relationships**: siteTechniques, designLayers, boqItems

### SiteTechnique (Junction Table)
Many-to-many relationship between Sites and Techniques with implementation tracking.
- **Fields**: id, siteId, techniqueId, status, plannedDate, implementationDate
- **JSON Columns**: maintenanceSchedule, workflowSteps
- **Constraints**: Unique constraint on (siteId, techniqueId)

### Design
Site-specific design projects.
- **Fields**: id, siteId, code, name, description, status
- **JSON Columns**: technicalSpecs, safetyNotes
- **Relationships**: site, designLayers, boq
- **Constraints**: Unique constraint on (siteId, code)

### DesignTemplate
Reusable design patterns with parameter schemas.
- **Fields**: id, code, name, description
- **JSON Columns**: parameterSchema (JSON Schema), outputs
- **Relationships**: designLayers

### DesignLayer
Individual elements/layers within a design.
- **Fields**: id, designId, templateId, techniqueId, layerNumber, name, description
- **JSON Columns**: parameters, technicalSpecs, safetyNotes, workflowSteps
- **Relationships**: design, template, technique, boqItems

### MaintenanceTemplate
Scheduling and maintenance procedures.
- **Fields**: id, code, name, description
- **JSON Columns**: workflowSteps, technicalSpecs, safetyNotes

### Material
Construction and maintenance materials library.
- **Fields**: id, code, name, description, unit, unitCost
- **JSON Columns**: suppliers (references)
- **Relationships**: boqItems

### BOQ (Bill of Quantities)
Project cost estimation and tracking.
- **Fields**: id, designId, totalCost, currency, notes
- **Relationships**: design, items, costRecords
- **Constraints**: Unique constraint on designId (one BOQ per design)

### BOQItem
Individual line items in a BOQ.
- **Fields**: id, boqId, designLayerId, materialId, techniqueId, description, quantity, unitCost, totalCost
- **Relationships**: boq, designLayer, material, technique

### Metric (M&E Metrics)
Monitoring and Evaluation metrics for sites.
- **Fields**: id, siteId, name, description, unit, value, measuredDate
- **JSON Columns**: technicalSpecs
- **Relationships**: site

### CostRecord
Cost tracking and management.
- **Fields**: id, boqId, amount, description, date, category
- **Relationships**: boq

## JSON Columns Usage

### Technical Specifications
Used in: Site, Technique, Design, DesignLayer, MaintenanceTemplate, Metric
Example content:
```json
{
  "elevation": 1200,
  "soilDepth": 0.8,
  "dimensions": {"width": 1.5, "depth": 0.8}
}
```

### Safety Notes
Used in: Site, Design, DesignLayer, MaintenanceTemplate
Example content:
```json
{
  "hazards": ["flash floods", "rock falls"],
  "mitigations": ["early warning system", "stabilization works"]
}
```

### Workflow Steps
Used in: SiteTechnique, DesignLayer, MaintenanceTemplate
Example content:
```json
[
  {"step": 1, "description": "Site preparation", "status": "pending", "duration": 2},
  {"step": 2, "description": "Excavation", "status": "pending", "duration": 8}
]
```

### Parameter Schema
Used in: DesignTemplate (JSON Schema format)
Example content:
```json
{
  "type": "object",
  "properties": {
    "diameter": {"type": "number", "minimum": 1, "maximum": 5},
    "depth": {"type": "number", "minimum": 0.3, "maximum": 1}
  },
  "required": ["diameter", "depth"]
}
```

## Relationships & Referential Integrity

### Cascading Deletes
- Site → Designs, SiteTechniques, Metrics
- Design → DesignLayers, BOQ
- DesignLayer → BOQItems
- BOQ → BOQItems, CostRecords
- Technique → SiteTechniques, DesignLayers, BOQItems

### Restricted Deletes
- Material → BOQItems (prevents deletion if used)

### Set Null on Delete
- DesignTemplate → DesignLayers (templateId becomes null)
- Technique → BOQItems (techniqueId becomes null)
- BOQ → CostRecords (boqId becomes null)

## Indexes

- Site.name (UNIQUE)
- Technique.code (UNIQUE)
- SiteTechnique (siteId, techniqueId) UNIQUE
- DesignTemplate.code (UNIQUE)
- Design (siteId, code) UNIQUE
- MaintenanceTemplate.code (UNIQUE)
- Material.code (UNIQUE)
- BOQ.designId (UNIQUE)

## Database Features

- **JSONB Columns**: All JSON columns use PostgreSQL's JSONB type for efficient querying and indexing
- **Timestamps**: All models include createdAt and updatedAt with automatic management
- **IDs**: All models use cuid() for primary key generation

## Migration

Initial migration: `20251211235441_initial`

To create new migrations:
```bash
cd packages/db
pnpm prisma migrate dev --name "your_migration_name"
```

## Seeding

Example reference data is provided in `prisma/seed.js`:
- Techniques (4 examples)
- Design Templates (2 examples)
- Maintenance Templates (1 example)
- Materials (4 examples)
- Sites (2 examples with different classifications)
- SiteTechniques (2 examples)
- Designs (2 examples)
- DesignLayers (2 examples)
- BOQs (2 examples)
- BOQItems (2 examples)
- Metrics (2 examples)
- CostRecords (2 examples)

To seed:
```bash
cd packages/db
pnpm db:seed
```

## Usage

The Prisma Client is exported from `@swc/db`:

```typescript
import { prisma } from '@swc/db'

const site = await prisma.site.findUnique({
  where: { id: siteId },
  include: {
    designs: true,
    siteTechniques: {
      include: { technique: true }
    },
    metrics: true
  }
})
```

## Validation

All schema validation passes:
- ✅ Migration creates all tables and enums
- ✅ Referential integrity constraints applied
- ✅ All relationships properly defined
- ✅ JSON columns properly typed as JSONB
- ✅ Unique constraints enforced
- ✅ Seed data successfully populates database
