// Database Seed Script - Comprehensive Test Data
const {
  User,
  Asset,
  Inventory,
  Livestock,
  AuditLog,
  LivestockCareRecord,
  LivestockIncident,
  LivestockDisposal,
  LivestockInspection,
  LivestockMovement,
  LivestockTransfer,
  LivestockLoss,
  LivestockCategoryB,
  AnimalRejection,
  InventoryRejection,
  InventoryDisposal,
} = require("../models");
const logger = require("../config/logger");

async function seed() {
  try {
    logger.info("🌱 Starting database seeding with comprehensive test data...");

    // Create demo users with various roles
    const users = await User.bulkCreate([
      {
        username: "admin",
        email: "admin@gvet.gov.my",
        password: "admin123",
        fullName: "System Administrator",
        role: "admin",
        department: "IT Department",
        position: "System Admin",
        phoneNumber: "012-3456789",
        isActive: true,
      },
      {
        username: "vet_dr_mohd",
        email: "dr.mohd@gvet.gov.my",
        password: "vet123",
        fullName: "Dr. Mohd Ahmad",
        role: "veterinarian",
        department: "Veterinary Services",
        position: "Senior Veterinarian",
        phoneNumber: "012-2223333",
        isActive: true,
      },
      {
        username: "livestock_manager",
        email: "livestock.mgr@gvet.gov.my",
        password: "livestock123",
        fullName: "Siti Livestock Manager",
        role: "livestock_manager",
        department: "Livestock Management",
        position: "Manager",
        phoneNumber: "012-4445555",
        isActive: true,
      },
      {
        username: "inventory_keeper",
        email: "inventory@gvet.gov.my",
        password: "inv123",
        fullName: "Budi Inventory",
        role: "store_keeper",
        department: "Inventory Management",
        position: "Store Keeper",
        phoneNumber: "012-6667777",
        isActive: true,
      },
      {
        username: "field_officer",
        email: "field@gvet.gov.my",
        password: "field123",
        fullName: "Ahmad Field Officer",
        role: "field_officer",
        department: "Field Operations",
        position: "Field Officer",
        phoneNumber: "012-8889999",
        isActive: true,
      },
    ]);
    logger.info(`✅ Created ${users.length} demo users with various roles`);

    // Create demo assets
    const assets = await Asset.bulkCreate([
      {
        assetCode: "A2024-001",
        assetName: "Dell Latitude 5420 Laptop",
        category: "Computer & IT",
        subCategory: "Laptop",
        description: "Dell laptop for office use",
        brand: "Dell",
        model: "Latitude 5420",
        serialNumber: "DL54201234",
        purchaseDate: "2024-01-15",
        purchasePrice: 3500.0,
        supplier: "Dell Malaysia",
        warrantyExpiry: "2027-01-15",
        location: "Office Building - Floor 3",
        department: "IT Department",
        custodian: "Ahmad bin Ali",
        status: "Active",
        condition: "Excellent",
        kewpaForm: "KEW.PA-3",
        userId: users[0].id,
      },
      {
        assetCode: "A2024-002",
        assetName: "Toyota Hilux",
        category: "Vehicle",
        subCategory: "Pickup Truck",
        description: "Official vehicle for field operations",
        brand: "Toyota",
        model: "Hilux 2.4G",
        serialNumber: "TH24G5678",
        purchaseDate: "2023-06-10",
        purchasePrice: 98000.0,
        supplier: "UMW Toyota",
        warrantyExpiry: "2028-06-10",
        location: "Main Office Parking",
        department: "Operations",
        custodian: "Siti Aminah",
        status: "Active",
        condition: "Good",
        kewpaForm: "KEW.PA-3",
        userId: users[0].id,
      },
    ]);
    logger.info(`✅ Created ${assets.length} demo assets`);

    // Create demo inventory
    const inventory = await Inventory.bulkCreate([
      {
        itemCode: "STK-001",
        itemName: "A4 Paper (500 sheets)",
        category: "Office Supplies",
        description: "White A4 paper for printing",
        unit: "ream",
        currentStock: 45,
        minimumStock: 20,
        maximumStock: 100,
        unitPrice: 12.5,
        location: "Store Room A",
        shelf: "A-01",
        supplier: "Office Mart",
        lastRestockDate: "2024-11-15",
        abcClassification: "A",
        status: "Active",
        kewpsForm: "KEW.PS-3",
        userId: users[3].id,
      },
      {
        itemCode: "STK-002",
        itemName: "Veterinary Gloves (Box of 100)",
        category: "Veterinary Supplies",
        description: "Latex gloves for veterinary procedures",
        unit: "box",
        currentStock: 8,
        minimumStock: 15,
        maximumStock: 50,
        unitPrice: 25.0,
        location: "Medical Store",
        shelf: "M-05",
        supplier: "MedSupply Sdn Bhd",
        lastRestockDate: "2024-10-01",
        expiryDate: "2026-10-01",
        abcClassification: "B",
        status: "Low Stock",
        kewpsForm: "KEW.PS-3",
        userId: users[3].id,
      },
      {
        itemCode: "STK-003",
        itemName: "Animal Feed (50kg bag)",
        category: "Livestock Feed",
        description: "High-quality livestock feed",
        unit: "bag",
        currentStock: 120,
        minimumStock: 50,
        maximumStock: 300,
        unitPrice: 85.0,
        location: "Feed Store",
        shelf: "F-12",
        supplier: "Premium Feed Mills",
        lastRestockDate: "2024-11-10",
        abcClassification: "A",
        status: "Active",
        kewpsForm: "KEW.PS-3",
        userId: users[3].id,
      },
    ]);
    logger.info(`✅ Created ${inventory.length} demo inventory items`);

    // Create demo livestock
    const livestock = await Livestock.bulkCreate([
      {
        animalCode: "C2024-045",
        species: "Cattle",
        breed: "Kedah-Kelantan",
        name: "Betsy",
        gender: "Female",
        dateOfBirth: "2022-03-15",
        age: "2 years 9 months",
        color: "Brown and white",
        markings: "White patch on forehead",
        weight: 450.0,
        acquisitionDate: "2024-01-10",
        acquisitionType: "Purchase",
        acquisitionPrice: 5500.0,
        location: "Farm Block A",
        pen: "A-12",
        healthStatus: "Healthy",
        vaccinationStatus: "Up to Date",
        lastVaccinationDate: "2024-10-15",
        nextVaccinationDate: "2025-04-15",
        reproductiveStatus: "Nursing",
        kewahForm: "KEW.AH-2",
        userId: users[2].id,
      },
      {
        animalCode: "G2024-023",
        species: "Goat",
        breed: "Katjang",
        name: "Billy",
        gender: "Male",
        dateOfBirth: "2023-08-20",
        age: "1 year 4 months",
        color: "Black",
        markings: "None",
        weight: 35.0,
        acquisitionDate: "2023-09-01",
        acquisitionType: "Birth",
        location: "Farm Block B",
        pen: "B-08",
        healthStatus: "Healthy",
        vaccinationStatus: "Up to Date",
        lastVaccinationDate: "2024-11-01",
        nextVaccinationDate: "2025-05-01",
        reproductiveStatus: "Breeding",
        kewahForm: "KEW.AH-2",
        userId: users[2].id,
      },
      {
        animalCode: "S2024-012",
        species: "Sheep",
        breed: "Dorper",
        name: "Woolly",
        gender: "Female",
        dateOfBirth: "2023-05-10",
        age: "1 year 8 months",
        color: "White",
        weight: 65.0,
        acquisitionDate: "2023-06-15",
        acquisitionType: "Purchase",
        acquisitionPrice: 3200.0,
        location: "Farm Block C",
        pen: "C-05",
        healthStatus: "Healthy",
        vaccinationStatus: "Up to Date",
        lastVaccinationDate: "2024-10-20",
        nextVaccinationDate: "2025-04-20",
        reproductiveStatus: "Breeding",
        kewahForm: "KEW.AH-2",
        userId: users[2].id,
      },
    ]);
    logger.info(`✅ Created ${livestock.length} demo livestock`);

    // Create demo care records (KEW.AH-4)
    const careRecords = await LivestockCareRecord.bulkCreate([
      {
        livestockId: livestock[0].id,
        dateOfCare: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        careType: "Vaccination",
        description: "Annual vaccination program",
        vaccines: "Anthrax, FMD",
        veterinarian: "Dr. Mohd Ahmad",
        notes: "Animal responded well to vaccination",
        recordedBy: users[1].id,
      },
      {
        livestockId: livestock[1].id,
        dateOfCare: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        careType: "Deworming",
        description: "Quarterly deworming",
        medicines: "Ivermectin 10mg/ml",
        veterinarian: "Dr. Mohd Ahmad",
        notes: "Standard deworming protocol applied",
        recordedBy: users[1].id,
      },
    ]);
    logger.info(`✅ Created ${careRecords.length} demo care records`);

    // Create demo livestock incidents
    const incidents = await LivestockIncident.bulkCreate([
      {
        livestockId: livestock[0].id,
        incidentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        incidentType: "Injury",
        description: "Minor cut on hind leg",
        severity: "Low",
        status: "pending",
        reportedById: users[4].id,
      },
      {
        livestockId: livestock[1].id,
        incidentDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        incidentType: "Illness",
        description: "Respiratory infection symptoms",
        severity: "Medium",
        status: "approved",
        reportedById: users[4].id,
        approvedBy: users[1].id,
        approvalDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      },
    ]);
    logger.info(`✅ Created ${incidents.length} demo incidents`);

    // Create demo livestock inspections
    const inspections = await LivestockInspection.bulkCreate([
      {
        livestockId: livestock[0].id,
        inspectionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        inspectionType: "Health Inspection",
        findings: "Animal in good health condition",
        recommendations: "Continue current feeding regimen",
        status: "completed",
        inspectorId: users[1].id,
      },
      {
        livestockId: livestock[1].id,
        inspectionDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        inspectionType: "Conditions Inspection",
        findings: "Pen conditions satisfactory",
        recommendations: "Clean bedding weekly",
        status: "completed",
        inspectorId: users[1].id,
      },
    ]);
    logger.info(`✅ Created ${inspections.length} demo inspections`);

    // Create demo livestock movement records
    const movements = await LivestockMovement.bulkCreate([
      {
        livestockId: livestock[0].id,
        fromLocation: "Farm Block A, Pen A-12",
        toLocation: "Veterinary Clinic",
        movementDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        reason: "Veterinary consultation",
        status: "completed",
        movedById: users[4].id,
      },
      {
        livestockId: livestock[1].id,
        fromLocation: "Farm Block B, Pen B-08",
        toLocation: "Isolation Pen",
        movementDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
        reason: "Health quarantine",
        status: "completed",
        movedById: users[4].id,
      },
    ]);
    logger.info(`✅ Created ${movements.length} demo movement records`);

    // Create demo livestock transfers
    const transfers = await LivestockTransfer.bulkCreate([
      {
        livestockId: livestock[0].id,
        fromDepartment: "Livestock Management",
        toDepartment: "Breeding Program",
        transferDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        reason: "Breeding stock assignment",
        status: "completed",
        initiatedById: users[2].id,
      },
    ]);
    logger.info(`✅ Created ${transfers.length} demo transfers`);

    // Create demo animal rejections
    const rejections = await AnimalRejection.bulkCreate([
      {
        livestockId: livestock[2].id,
        rejectionDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        rejectionReason: "Does not meet breeding standards",
        severity: "Medium",
        status: "approved",
        reportedById: users[2].id,
        rejectedById: users[1].id,
      },
    ]);
    logger.info(`✅ Created ${rejections.length} demo animal rejections`);

    // Create demo livestock losses
    const losses = await LivestockLoss.bulkCreate([
      {
        incidentId: incidents[0].id,
        livestockId: livestock[0].id,
        lossDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        lossType: "Death",
        cause: "Natural causes",
        estimatedValue: 5500.0,
        status: "reported",
        reportedById: users[4].id,
      },
    ]);
    logger.info(`✅ Created ${losses.length} demo loss records`);

    // Create demo livestock category B records
    const categoryB = await LivestockCategoryB.bulkCreate([
      {
        livestockId: livestock[2].id,
        categoryCode: "CB-2024-001",
        classification: "Breeding Stock",
        subClassification: "Foundation Animals",
        registrationDate: new Date(),
        certificationNo: "CERT-2024-001",
        status: "active",
        userId: users[2].id,
        recordedById: users[2].id,
      },
    ]);
    logger.info(`✅ Created ${categoryB.length} demo category B records`);

    // Create demo inventory rejections
    const invRejections = await InventoryRejection.bulkCreate([
      {
        inventoryId: inventory[0].id,
        itemCode: inventory[0].itemCode,
        rejectionReason: "Damaged packaging",
        quantity: 5,
        rejectionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: "approved",
        reportedById: users[3].id,
      },
    ]);
    logger.info(`✅ Created ${invRejections.length} demo inventory rejections`);

    // Create demo inventory disposals
    const invDisposals = await InventoryDisposal.bulkCreate([
      {
        inventoryId: inventory[1].id,
        disposalDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        disposalReason: "Expired product",
        quantityDisposed: 2,
        disposalMethod: "Incineration",
        status: "completed",
        disposedById: users[3].id,
      },
    ]);
    logger.info(`✅ Created ${invDisposals.length} demo inventory disposals`);

    // Create demo livestock disposals
    const disposals = await LivestockDisposal.bulkCreate([
      {
        livestockId: livestock[2].id,
        disposalDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        reason: "Health risk - culling needed",
        disposalMethod: "Humane euthanasia",
        status: "pending",
        authorizedBy: users[1].id,
      },
    ]);
    logger.info(`✅ Created ${disposals.length} demo disposals`);

    logger.info(
      "✅✅✅ Database seeding completed successfully with all KEW forms!",
    );
    console.log("\n🎉 Sample data created for testing:");
    console.log(`   • ${users.length} users (admin, vet, managers, staff)`);
    console.log(`   • ${assets.length} assets`);
    console.log(`   • ${inventory.length} inventory items`);
    console.log(`   • ${livestock.length} livestock records`);
    console.log(`   • ${careRecords.length} care records (KEW.AH-4)`);
    console.log(`   • ${incidents.length} incidents`);
    console.log(`   • ${inspections.length} inspections`);
    console.log(`   • ${movements.length} movements`);
    console.log(`   • ${transfers.length} transfers`);
    console.log(`   • ${rejections.length} rejections`);
    console.log(`   • ${losses.length} losses`);
    console.log(`   • ${categoryB.length} category B records`);
    console.log(`   • ${invRejections.length} inventory rejections`);
    console.log(`   • ${invDisposals.length} inventory disposals`);
    console.log(`   • ${disposals.length} disposals`);
    console.log("\n👉 Ready to test API endpoints! Run: npm start");
    process.exit(0);
  } catch (error) {
    logger.error("❌ Seeding failed:", error.message);
    console.error("Stack trace:", error.stack);
    process.exit(1);
  }
}

// Run seed
seed().catch((error) => {
  logger.error("Unexpected seeding error:", error);
  process.exit(1);
});
