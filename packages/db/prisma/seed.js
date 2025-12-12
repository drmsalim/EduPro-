const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Clear existing data (in reverse order of dependencies)
  await prisma.costRecord.deleteMany({})
  await prisma.bOQItem.deleteMany({})
  await prisma.bOQ.deleteMany({})
  await prisma.designLayer.deleteMany({})
  await prisma.design.deleteMany({})
  await prisma.metric.deleteMany({})
  await prisma.siteTechnique.deleteMany({})
  await prisma.site.deleteMany({})
  await prisma.designTemplate.deleteMany({})
  await prisma.technique.deleteMany({})
  await prisma.material.deleteMany({})
  await prisma.maintenanceTemplate.deleteMany({})

  // Seed Techniques (conservation and management techniques)
  const techniques = await Promise.all([
    prisma.technique.create({
      data: {
        code: 'TECH-001',
        name: 'Half Moon Water Harvesting',
        description: 'Semi-circular pits for water harvesting in arid regions',
        category: 'Water Harvesting',
        technicalSpecs: {
          diameter: 2,
          depth: 0.5,
          spacing: 1,
        },
      },
    }),
    prisma.technique.create({
      data: {
        code: 'TECH-002',
        name: 'Contour Lines',
        description: 'Bunds along contour lines to reduce runoff',
        category: 'Soil Conservation',
        technicalSpecs: {
          height: 0.3,
          spacing: 20,
          width: 0.5,
        },
      },
    }),
    prisma.technique.create({
      data: {
        code: 'TECH-003',
        name: 'Grass Strips',
        description: 'Vegetated strips along contours to reduce erosion',
        category: 'Vegetation Management',
        technicalSpecs: {
          width: 2,
          spacing: 30,
        },
      },
    }),
    prisma.technique.create({
      data: {
        code: 'TECH-004',
        name: 'Pit Cultivation',
        description: 'Planting pits for water conservation',
        category: 'Water Harvesting',
        technicalSpecs: {
          width: 0.6,
          depth: 0.4,
          spacing: 2,
        },
      },
    }),
  ])

  console.log(`Created ${techniques.length} techniques`)

  // Seed Design Templates
  const templates = await Promise.all([
    prisma.designTemplate.create({
      data: {
        code: 'TMPL-001',
        name: 'Half Moon Template',
        description: 'Template for half moon water harvesting designs',
        parameterSchema: {
          type: 'object',
          properties: {
            diameter: { type: 'number', description: 'Diameter in meters', minimum: 1, maximum: 5 },
            depth: { type: 'number', description: 'Depth in meters', minimum: 0.3, maximum: 1 },
            spacing: { type: 'number', description: 'Spacing between pits in meters', minimum: 0.5, maximum: 2 },
            numberOfPits: { type: 'integer', description: 'Total number of pits', minimum: 1 },
          },
          required: ['diameter', 'depth', 'spacing', 'numberOfPits'],
        },
        outputs: {
          volumePerPit: { type: 'number', unit: 'm3' },
          totalVolume: { type: 'number', unit: 'm3' },
          totalArea: { type: 'number', unit: 'm2' },
        },
      },
    }),
    prisma.designTemplate.create({
      data: {
        code: 'TMPL-002',
        name: 'Contour Bund Template',
        description: 'Template for contour bund designs',
        parameterSchema: {
          type: 'object',
          properties: {
            siteArea: { type: 'number', description: 'Site area in hectares' },
            slope: { type: 'number', description: 'Average slope in percent' },
            boundHeight: { type: 'number', description: 'Bund height in meters' },
          },
          required: ['siteArea', 'slope', 'boundHeight'],
        },
        outputs: {
          numberOfBunds: { type: 'integer' },
          totalBundLength: { type: 'number', unit: 'm' },
          soilVolumeNeeded: { type: 'number', unit: 'm3' },
        },
      },
    }),
  ])

  console.log(`Created ${templates.length} design templates`)

  // Seed Maintenance Templates
  const maintenanceTemplates = await Promise.all([
    prisma.maintenanceTemplate.create({
      data: {
        code: 'MAINT-001',
        name: 'Half Moon Maintenance',
        description: 'Regular maintenance schedule for half moon pits',
        workflowSteps: [
          {
            step: 1,
            task: 'Inspection',
            frequency: 'monthly',
            description: 'Check pit integrity and sediment level',
          },
          {
            step: 2,
            task: 'Sediment Removal',
            frequency: 'quarterly',
            description: 'Remove accumulated sediment',
          },
          {
            step: 3,
            task: 'Vegetation Management',
            frequency: 'bi-annual',
            description: 'Manage vegetation around pits',
          },
        ],
        technicalSpecs: {
          toolsNeeded: ['shovel', 'hoe', 'measuring tape'],
        },
      },
    }),
  ])

  console.log(`Created ${maintenanceTemplates.length} maintenance templates`)

  // Seed Materials Library
  const materials = await Promise.all([
    prisma.material.create({
      data: {
        code: 'MAT-001',
        name: 'Soil Fill',
        description: 'General soil fill material',
        unit: 'm3',
        unitCost: 50,
        suppliers: [
          { name: 'Local Supplier A', contact: 'supplier-a@example.com' },
          { name: 'Local Supplier B', contact: 'supplier-b@example.com' },
        ],
      },
    }),
    prisma.material.create({
      data: {
        code: 'MAT-002',
        name: 'Rocks/Stones',
        description: 'Large stones for lining and stabilization',
        unit: 't',
        unitCost: 75,
        suppliers: [{ name: 'Stone Quarry', contact: 'quarry@example.com' }],
      },
    }),
    prisma.material.create({
      data: {
        code: 'MAT-003',
        name: 'Grass Seeds',
        description: 'Native grass seeds for vegetation',
        unit: 'kg',
        unitCost: 100,
        suppliers: [{ name: 'Seed Supplier', contact: 'seeds@example.com' }],
      },
    }),
    prisma.material.create({
      data: {
        code: 'MAT-004',
        name: 'Mulch',
        description: 'Organic mulch for moisture retention',
        unit: 't',
        unitCost: 40,
        suppliers: [{ name: 'Mulch Producer', contact: 'mulch@example.com' }],
      },
    }),
  ])

  console.log(`Created ${materials.length} materials`)

  // Seed Sites with all classification enums
  const sites = await Promise.all([
    prisma.site.create({
      data: {
        name: 'Arid Region Test Site',
        description: 'Test site in arid region with steep slopes',
        location: 'Region A, District 1',
        latitude: 12.5,
        longitude: 45.3,
        slopeClass: 'STEEP',
        soilTexture: 'SANDY',
        landUse: 'PASTURE',
        drainage: 'WELL',
        rainfallBand: 'ARID',
        gullyState: 'MODERATE',
        technicalSpecs: {
          elevation: 1200,
          soilDepth: 0.8,
          vegetationCover: 25,
        },
        safetyNotes: {
          hazards: ['flash floods', 'rock falls'],
          mitigations: ['early warning system', 'stabilization works'],
        },
      },
    }),
    prisma.site.create({
      data: {
        name: 'Sub-Humid Region Site',
        description: 'Site in sub-humid region with moderate slopes',
        location: 'Region B, District 2',
        latitude: 15.2,
        longitude: 48.5,
        slopeClass: 'MODERATE',
        soilTexture: 'CLAY_LOAM',
        landUse: 'ARABLE',
        drainage: 'MODERATE',
        rainfallBand: 'SUB_HUMID',
        gullyState: 'MINOR',
        technicalSpecs: {
          elevation: 900,
          soilDepth: 1.2,
          vegetationCover: 60,
        },
      },
    }),
  ])

  console.log(`Created ${sites.length} sites`)

  // Create SiteTechniques (junction table)
  const siteTechniques = await Promise.all([
    prisma.siteTechnique.create({
      data: {
        siteId: sites[0].id,
        techniqueId: techniques[0].id,
        status: 'PLANNED',
        plannedDate: new Date('2024-02-15'),
        maintenanceSchedule: {
          frequency: 'monthly',
          nextDue: '2024-03-15',
        },
        workflowSteps: [
          { step: 1, description: 'Site preparation', status: 'pending' },
          { step: 2, description: 'Pit excavation', status: 'pending' },
          { step: 3, description: 'Lining and stabilization', status: 'pending' },
        ],
      },
    }),
    prisma.siteTechnique.create({
      data: {
        siteId: sites[1].id,
        techniqueId: techniques[1].id,
        status: 'ACTIVE',
        implementationDate: new Date('2023-12-01'),
        maintenanceSchedule: {
          frequency: 'quarterly',
          nextDue: '2024-03-01',
        },
      },
    }),
  ])

  console.log(`Created ${siteTechniques.length} site techniques`)

  // Create Designs
  const designs = await Promise.all([
    prisma.design.create({
      data: {
        siteId: sites[0].id,
        code: 'DES-001',
        name: 'Half Moon Design for Arid Site',
        description: 'Half moon water harvesting design for arid region',
        status: 'APPROVED',
        technicalSpecs: {
          totalArea: 5.5,
          designPeriod: 25,
          numberOfElements: 42,
        },
        safetyNotes: {
          concerns: ['worker safety during excavation'],
          mitigations: ['supervision', 'safety equipment'],
        },
      },
    }),
    prisma.design.create({
      data: {
        siteId: sites[1].id,
        code: 'DES-002',
        name: 'Contour Bund Design',
        description: 'Contour bund design for sub-humid site',
        status: 'DRAFT',
        technicalSpecs: {
          totalArea: 8.2,
          designPeriod: 20,
        },
      },
    }),
  ])

  console.log(`Created ${designs.length} designs`)

  // Create Design Layers
  const designLayers = await Promise.all([
    prisma.designLayer.create({
      data: {
        designId: designs[0].id,
        templateId: templates[0].id,
        techniqueId: techniques[0].id,
        layerNumber: 1,
        name: 'Main Half Moon Array',
        description: 'Primary water harvesting pits',
        parameters: {
          diameter: 2.5,
          depth: 0.6,
          spacing: 1.5,
          numberOfPits: 42,
        },
        technicalSpecs: {
          volumePerPit: 2.5,
          totalVolume: 105,
          totalArea: 5.5,
        },
        workflowSteps: [
          { step: 1, description: 'Site marking', duration: 2 },
          { step: 2, description: 'Excavation', duration: 8 },
          { step: 3, description: 'Compaction', duration: 2 },
        ],
      },
    }),
    prisma.designLayer.create({
      data: {
        designId: designs[1].id,
        templateId: templates[1].id,
        techniqueId: techniques[1].id,
        layerNumber: 1,
        name: 'Contour Bunds',
        description: 'Main contour bund system',
        parameters: {
          siteArea: 8.2,
          slope: 12,
          boundHeight: 0.4,
        },
        technicalSpecs: {
          numberOfBunds: 6,
          totalBundLength: 520,
          soilVolumeNeeded: 832,
        },
      },
    }),
  ])

  console.log(`Created ${designLayers.length} design layers`)

  // Create BOQ (Bill of Quantities)
  const boqs = await Promise.all([
    prisma.bOQ.create({
      data: {
        designId: designs[0].id,
        totalCost: 5250,
        currency: 'USD',
        notes: 'Half moon implementation BOQ',
      },
    }),
    prisma.bOQ.create({
      data: {
        designId: designs[1].id,
        totalCost: 8320,
        currency: 'USD',
        notes: 'Contour bund implementation BOQ',
      },
    }),
  ])

  console.log(`Created ${boqs.length} BOQs`)

  // Create BOQ Items
  const boqItems = await Promise.all([
    prisma.bOQItem.create({
      data: {
        boqId: boqs[0].id,
        designLayerId: designLayers[0].id,
        materialId: materials[0].id,
        techniqueId: techniques[0].id,
        description: 'Soil fill for half moon pits',
        quantity: 105,
        unitCost: 50,
        totalCost: 5250,
      },
    }),
    prisma.bOQItem.create({
      data: {
        boqId: boqs[1].id,
        designLayerId: designLayers[1].id,
        materialId: materials[0].id,
        techniqueId: techniques[1].id,
        description: 'Soil fill for contour bunds',
        quantity: 832,
        unitCost: 10,
        totalCost: 8320,
      },
    }),
  ])

  console.log(`Created ${boqItems.length} BOQ items`)

  // Create Metrics
  const metrics = await Promise.all([
    prisma.metric.create({
      data: {
        siteId: sites[0].id,
        name: 'Soil Moisture Content',
        description: 'Soil moisture measured at 30cm depth',
        unit: '%',
        value: 35.5,
        measuredDate: new Date('2024-01-15'),
        technicalSpecs: {
          method: 'TDR probe',
          depth: 30,
        },
      },
    }),
    prisma.metric.create({
      data: {
        siteId: sites[0].id,
        name: 'Runoff Amount',
        description: 'Amount of water runoff during rainfall event',
        unit: 'mm',
        value: 12.3,
        measuredDate: new Date('2024-01-20'),
        technicalSpecs: {
          method: 'rain gauge',
          location: 'Site center',
        },
      },
    }),
  ])

  console.log(`Created ${metrics.length} metrics`)

  // Create Cost Records
  const costRecords = await Promise.all([
    prisma.costRecord.create({
      data: {
        boqId: boqs[0].id,
        amount: 3000,
        description: 'Labor costs for excavation',
        date: new Date('2024-01-10'),
        category: 'labor',
      },
    }),
    prisma.costRecord.create({
      data: {
        boqId: boqs[0].id,
        amount: 2250,
        description: 'Material costs',
        date: new Date('2024-01-15'),
        category: 'materials',
      },
    }),
  ])

  console.log(`Created ${costRecords.length} cost records`)

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
