# KEW Forms to G-Vet Data Models Mapping

**Date**: February 6, 2026
**Status**: Analysis Complete

---

## Executive Summary

The KEW (Keluarga Harta Kerajaan) Malaysian government asset management circulars define comprehensive procedures for managing:

1. **Store/Stock Management** (AM 6) - Physical goods procurement, storage, disposal
2. **Livestock Asset Management** (AM 4) - Life animals (cattle, birds, reptiles, etc.)

The G-Vet system currently handles basic livestock and inventory. This document maps KEW forms to existing models and identifies required schema expansions and new features.

---

## 1. LIVESTOCK MANAGEMENT (AM 4) - DETAILED MAPPING

### 1.1 Reception & Verification

| KEW Form     | Purpose                         | Current Model Support      | Required Changes                                                                                                  |
| ------------ | ------------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **KEW.AH-1** | Animal Reception & Verification | **Livestock.js** (partial) | Add `receivedVia` (purchase/gift/transfer/seizure), `receivingOfficer`, `technicalApproval`, `conditionOnReceipt` |
| **KEW.AH-2** | Animal Rejection                | **No model**               | New **AnimalRejection** model needed                                                                              |

**Data Model Additions Needed:**

```javascript
// Livestock.js Extensions
- receivedVia: enum['purchase', 'gift', 'transfer', 'seizure']
- receivingOfficer: String
- technicalOfficer: String (if applicable)
- conditionOnReceipt: String
- receivedDate: Date
- warrantyDetails: String (from supplier)
- rejectionReason: String (if rejected)
```

### 1.2 Registration & Category Management

| KEW Form     | Purpose                                                    | Current Model Support           | Required Changes                             |
| ------------ | ---------------------------------------------------------- | ------------------------------- | -------------------------------------------- |
| **KEW.AH-3** | Category A Register (Large animals 12+ months)             | **Livestock.js** (insufficient) | Major expansion needed (see below)           |
| **KEW.AH-4** | Category B Register (Small animals, birds <12 mo, insects) | **No model**                    | New **LivestockCategoryB** model             |
| **KEW.AH-5** | Animal Register Summary List                               | **Report** (backend computed)   | Implement list generation from KEW.AH-3 data |
| **KEW.AH-6** | Animal Status Annual Report                                | **Report** (backend computed)   | Implement annual aggregation                 |

**Critical KEW.AH-3 (Category A) Fields Required:**

```javascript
// Livestock.js - Massive expansion for Category A animals
Core Registration:
- registrationNumber (format: MINISTRY/DEPARTMENT/CENTER/CATEGORY/YEAR/SERIAL)
- nationalCode: String
- group: enum[Mammal, Aves, Reptile, Amfibia, Insecta]
- class: String (e.g., Bovidae, Equidae, Felidae, etc.)
- family: String (e.g., Babi, Badak Air, Unta, etc.)
- breed: String (e.g., Kambing Boer, Lembu Kedah, Kuda Arabian)
- classification: enum[IndukF/Pejantan/Jantan/Betina/AnakJantan/AnakBetina]

Identification & Sourcing:
- identificationNumber: String (if any existing marking)
- batchNumber: String
- purchaseOrderNumber: String
- contractNumber: String
- supplierName: String
- supplierAddress: String
- originalPurchasePrice: Decimal
- purchaseDate: Date
- birthDate: Date

Current Status:
- ageAtAcquisition: String (e.g., "3 months")
- weightAtAcquisition: Decimal with unit
- currentEstimatedAge: String
- currentLocation: String (placement section)
- placement: {
    location: String
    dateStarted: Date
    officer: String
    supervisor: String
  }
- healthStatus: enum[Healthy, Sick, Injured, UnderTreatment, Dead, Missing]

Valuations:
- estimatedCurrentValue: Decimal (updated at each inspection)
- lastValuationDate: Date
- valuationOfficer: String

History Tracking (nested/related):
- inspections: [{date, inspector, findings, ageEstimate}]
- transfers: [{date, toLocation, approvalRef}]
- disposals: [{date, method, approvalRef}]
- losses: [{date, reportedDate, status}]
- deaths: [{date, verifiedBy, notes}]
- writeOffs: [{date, approvalRef, reason}]

Notes & Documentation:
- remarks: String
- attachments: [ObjectId] (references)
```

### New Model: LivestockCategoryB

```javascript
// For birds <12 mo, insects, amphibians, etc.
- registrationYear: Number
- family: String
- breed: String
- quantity: Number
- unit: enum[Individual, Weight, Colony, Batch]
- transactionDate: Date
- transactionType: enum[Receipt, Outflow, Deaths, Loss, Sale]
- transactionQuantity: Number
- transactionValue: Decimal
- batchNumber: String
- remarks: String
```

### 1.3 Care, Maintenance & Treatment

| KEW Form      | Purpose                              | Current Model Support | Required Changes                  |
| ------------- | ------------------------------------ | --------------------- | --------------------------------- |
| **KEW.AH-7**  | Care & Treatment Record              | **No model**          | New **LivestockCareRecord** model |
| **KEW.AH-8**  | Loan/Movement Form                   | **No model**          | New **LivestockMovement** model   |
| **KEW.AH-9**  | Shortage/Illness/Injury/Death Report | **No model**          | New **LivestockIncident** model   |
| **KEW.AH-10** | Care & Sales Report (annual)         | **Report**            | Backend aggregation from above    |

**New Model: LivestockCareRecord (KEW.AH-7)**

```javascript
- livestockId: ObjectId (ref Livestock)
- registrationNumber: String
- dateOfCare: Date
- careType: enum[Vaccination, Deworming, Treatment, Feed, Checkup, Other]
- careDescription: String
- veterinarianName: String
- contractNumber: String
- costOfCare: Decimal
- notes: String
- recordedBy: ObjectId (ref User)
```

**New Model: LivestockMovement (KEW.AH-8)**

```javascript
- livestockId: ObjectId (ref Livestock)
- registrationNumber: String
- requesterName: String
- requesterPosition: String
- requesterDepartment: String
- purposeOfMovement: String
- destination: String
- dateRequested: Date
- dateExpectedReturn: Date
- dateActualReturn: Date
- status: enum[Requested, Approved, Rejected, Returned, Overdue]
- approverName: String
- approverPosition: String
- remarks: String
```

**New Model: LivestockIncident (KEW.AH-9)**

```javascript
- livestockId: ObjectId (ref Livestock)
- registrationNumber: String
- incidentType: enum[Illness, Injury, Death, Missing, Outbreak]
- dateIdentified: Date
- description: String
- estimatedTreatmentCost: Decimal
- recommendation: String
- approvalStatus: enum[Pending, Approved, Rejected]
- approverName: String
- approverPosition: String
- approvalDate: Date
- outcomeNotes: String
```

### 1.4 Inspection & Verification

| KEW Form      | Purpose                               | Current Model Support | Required Changes                  |
| ------------- | ------------------------------------- | --------------------- | --------------------------------- |
| **KEW.AH-11** | Animal Inspection Form (by inspector) | **No model**          | New **LivestockInspection** model |
| **KEW.AH-12** | Inspection Report (aggregated)        | **Report**            | Backend report generation         |
| **KEW.AH-13** | Annual Inspection Certificate         | **Report**            | Backend certificate generation    |

**New Model: LivestockInspection (KEW.AH-11)**

```javascript
- registrationNumber: String
- livestockId: ObjectId (ref Livestock)
- inspectionDate: Date
- inspectors: [{name, position, department}]
- physicalCondition: {
    inspected: Number (quantity)
    healthyCount: Number
    sickCount: Number
    injuredCount: Number
    underTreatmentCount: Number
    deadCount: Number
    missingCount: Number
    discrepancies: Number
  }
- recordAccuracy: Boolean
- allPresent: Boolean
- findings: String
- remarks: String
```

### 1.5 Transfer Between Departments

| KEW Form      | Purpose                  | Current Model Support | Required Changes                |
| ------------- | ------------------------ | --------------------- | ------------------------------- |
| **KEW.AH-14** | Animal Transfer Form     | **No model**          | New **LivestockTransfer** model |
| **KEW.AH-15** | Transfer Report (annual) | **Report**            | Backend aggregation             |

**New Model: LivestockTransfer (KEW.AH-14)**

```javascript
- registrationNumber: String
- livestockId: ObjectId (ref Livestock)
- quantityRequested: Number
- quantityApproved: Number
- status: enum[Pending, Approved, Rejected, Completed]
- fromDepartment: String
- toDepartment: String
- requestingOfficerName: String
- requestingOfficerPosition: String
- approvingOfficerName: String
- approvingOfficerPosition: String
- dateRequested: Date
- dateApproved: Date
- dateTransferred: Date
- remarks: String
- includesDocumentation: Boolean (KEW.AH-3 copy sent)
```

### 1.6 Disposal Management

| KEW Forms              | Purpose                                           | Current Model Support     | Required Changes                |
| ---------------------- | ------------------------------------------------- | ------------------------- | ------------------------------- |
| **KEW.AH-16**          | Disposal Certification (live animals)             | **No model**              | New **LivestockDisposal** model |
| **KEW.AH-17**          | Inspection Committee Appointment                  | **No model** (procedural) | Track in audit log              |
| **KEW.AH-18**          | Disposal Form                                     | **No model**              | New **LivestockDisposal** model |
| **KEW.AH-19**          | Destruction/Release Witness Certificate           | **No model**              | Add to **LivestockDisposal**    |
| **KEW.AH-20**          | Disposal Completion Certificate                   | **No model**              | Add to **LivestockDisposal**    |
| **KEW.AH-21 to AH-26** | Disposal method forms (auction, tender, handover) | **No model**              | Extended **LivestockDisposal**  |

**New Model: LivestockDisposal (KEW.AH-16/18/20)**

```javascript
- livestockId: ObjectId (ref Livestock)
- registrationNumber: String
- quantity: Number
- originalValue: Decimal
- currentValue: Decimal
- disposalReason: enum[NotProductive, Defective, QualityThreat, ExceededNeeds, UnsafeToKeep, UneconomicalToRecover, PublicInterest]
- disposalMethod: enum[SaleTender, SaleAuction, SaleDirect, Handover, ReleaseToWildlife, Destruction]
- approvalDate: Date
- approvalReference: String
- completionDate: Date
- saleProceed: Decimal (if applicable)
- handledToDepartment: String (if handover)
- handledToOrganization: String (if release)
- destructionMethod: String (if destroyed)
- destructionWitnesses: [{name, position}]
- saleDetails: {
    method: String
    biddersCount: Number
    successfulBidder: String
    salePrice: Decimal
    saleDate: Date
    paymentReceived: Date
    depositForfeited: Boolean
  }
- certificateIssued: Boolean
- certificateNumber: String
- notes: String
```

### 1.7 Loss & Write-off Management

| KEW Form      | Purpose                                   | Current Model Support     | Required Changes            |
| ------------- | ----------------------------------------- | ------------------------- | --------------------------- |
| **KEW.AH-27** | Initial Loss Report                       | **No model**              | New **LivestockLoss** model |
| **KEW.AH-28** | Investigation Committee Appointment       | **No model** (procedural) | Track in audit log          |
| **KEW.AH-29** | Final Loss Report (investigation closure) | **No model**              | Extend **LivestockLoss**    |
| **KEW.AH-30** | Write-off Certificate                     | **No model**              | Extend **LivestockLoss**    |
| **KEW.AH-31** | Write-off Annual Report                   | **Report**                | Backend aggregation         |

**New Model: LivestockLoss (KEW.AH-27/29/30)**

```javascript
- livestockId: ObjectId (ref Livestock)
- registrationNumber: String
- quantity: Number
- originalValue: Decimal
- currentValue: Decimal

Initial Report (KEW.AH-27):
- reportedDate: Date
- reportedBy: ObjectId (ref User)
- lossDiscoveredDate: Date
- lossLocation: String
- lossMethod: enum[Theft, Fraud, Negligence, Unknown]
- policeReportNumber: String
- policeReportDate: Date
- lastResponsibleOfficer: {name, position}
- supervisorName: String
- actionsTakenToPrevent: String
- immediateActions: String

Investigation (KEW.AH-29):
- investigationCommittee: [{name, position, department}]
- investigationStartDate: Date
- investigationEndDate: Date
- investigationFindings: String
- officersInvolved: [{name, position, role, responsibility}]
- procedureViolations: String
- oversight: String
- recommendSurcharge: Boolean
- surnameRecommendation: String
- recommendDiscipline: Boolean
- disciplineRecommendation: String
- investigationStatus: enum[Pending, InProgress, Completed]

Write-off (KEW.AH-30):
- writeOffApprovalDate: Date
- writeOffApprovalReference: String
- writeOffApprovedBy: String
- certificateNumber: String
- certificateIssued: Boolean
- writeOffStatus: enum[Approved, Rejected, Pending]
- notes: String
```

---

## 2. STORE/STOCK MANAGEMENT (AM 6) - MAPPING

### 2.1 Receipt & Goods In

| KEW Form     | Purpose              | Current Model Support    | Required Changes                                   |
| ------------ | -------------------- | ------------------------ | -------------------------------------------------- |
| **KEW.PS-1** | Goods Receipt Form   | **Inventory.js** (basic) | Enhance with receiving officer, technical approval |
| **KEW.PS-2** | Goods Rejection Form | **No model**             | New **InventoryRejection** model                   |

**Inventory.js Enhancements:**

```javascript
// Add fields for compliance with KEW.PS-1
- receivingOfficer: String
- technicalApprovalOfficer: String (if applicable)
- receivedCondition: String (good/damaged/partial)
- supplierWarranty: String
- conditionNotes: String
```

### 2.2 Stock Control & Management

| KEW Form     | Purpose             | Current Model Support | Required Changes                             |
| ------------ | ------------------- | --------------------- | -------------------------------------------- |
| **KEW.PS-3** | Stock Register      | **Inventory.js**      | Implement stock card tracking (bin/location) |
| **KEW.PS-4** | Stock Levels Report | **Report**            | Backend report generation                    |

**Inventory.js Enhancements:**

```javascript
- stockCardLocation: String (bin/location code)
- minStockLevel: Number
- maxStockLevel: Number
- reorderPoint: Number
- rotationCycle: String
- lastStockCountDate: Date
- discrepancies: Number (if any variance)
- inspectionNotes: String
```

### 2.3 Disposal of Goods

| KEW Forms              | Purpose                                                   | Current Model Support     | Required Changes                |
| ---------------------- | --------------------------------------------------------- | ------------------------- | ------------------------------- |
| **KEW.PS-19**          | Disposal Committee Appointment                            | **No model** (procedural) | Track in audit log              |
| **KEW.PS-20**          | Goods Disposal Form                                       | **No model**              | New **InventoryDisposal** model |
| **KEW.PS-21**          | Destruction Witness Certificate                           | **No model**              | Add to **InventoryDisposal**    |
| **KEW.PS-22**          | Disposal Completion Certificate                           | **No model**              | Add to **InventoryDisposal**    |
| **KEW.PS-23 to PS-31** | Disposal method forms (auction, tender, scrap sale, etc.) | **No model**              | Extended **InventoryDisposal**  |

**New Model: InventoryDisposal (KEW.PS-20/22)**

```javascript
- inventoryId: ObjectId (ref Inventory)
- itemCode: String
- quantity: Number
- originalValue: Decimal
- currentValue: Decimal
- disposalReason: enum[Obsolete, Damaged, Expired, Exceeded, Unnecessary]
- disposalMethod: enum[SaleTender, SaleAuction, ScrapSale, Handover, EWasteDisposal, Destruction]
- approvalDate: Date
- approvalReference: String
- approvalAuthority: enum[Department, Ministry, Treasury]
- completionDate: Date
- disposalProceeds: Decimal (if applicable)
- handedToDepartment: String (if handover)
- disposalCosts: Decimal
- destructionWitnesses: [{name, position}]
- certificateNumber: String
- certificateIssued: Boolean
- notes: String
```

---

## 3. CRITICAL FEATURES TO IMPLEMENT

### 3.1 Registration Number Generation

**Pattern (from KEW.AH-3):**

```
MINISTRY_CODE / DEPARTMENT_CODE / LOCATION_CODE / ANIMAL_CATEGORY / YEAR / SERIAL_NUMBER
Example: MOA/JPV/PTHL/HA/17/001
```

**Implementation Required:**

- Create utility function for generating unique registration numbers
- Manage serial counters per year per category
- Ensure no duplicates

### 3.2 Annual Report Generation

Required reports (backend scheduled tasks):

- **KEW.AH-5**: Animal Register Summary (all Category A animals by location)
- **KEW.AH-6**: Animal Status Report (inventory snapshot by agency)
- **KEW.AH-10**: Care & Sales Report (aggregated costs and receipts)
- **KEW.AH-12**: Inspection Report (100% inspection percentage tracking)
- **KEW.AH-15**: Transfer Report (all inter-departmental transfers)
- **KEW.AH-26**: Disposal Report (all disposals by method)
- **KEW.AH-31**: Write-off Report (all losses and write-offs)

**Due Dates (Malaysia):**

- PTJ submits to UPA: Before 15 February (year following reporting year)
- UPA submits to Treasury: Before 15 March

### 3.3 Approval Workflows

**Key approval chains needed:**

1. **Animal Reception** → Technical Officer approval
2. **Animal Transfer** → Approving Officer review & signature
3. **Animal Disposal** → Inspection Committee review → Approving Authority (Dept/Ministry/Treasury)
4. **Loss/Write-off** → Investigation Committee → Approving Authority (Dept/Ministry) + Disciplinary action
5. **Stock Disposal** → Approval Committee → Approving Authority (Dept/Ministry/Treasury)

**Implementation:**

- Extend audit log to track approval states
- Add workflow engine or simple state machine
- Implement role-based approval limits (by amount/value)

### 3.4 Physical vs. Recorded Inspection

**KEW.AH-11 Inspection Workflow:**

1. Inspector received KEW.AH-3 (register)
2. Physically verify all animals at location
3. Compare **records vs. physical count**
4. Document any discrepancies (+/- quantities)
5. Note health status of each animal group
6. Generate discrepancy report

**APP Requirements:**

- Inspection checklist screen
- Count verification interface
- Discrepancy logging
- Photo upload for audit trail

### 3.5 Animal Classification System

**Build taxonomy lookup tables:**

```javascript
// Animal Groups (Kumpulan)
[Mamalia, Aves, Reptilia, Amfibia, Insecta]

// Animal Classes (Kelas) per group
Mamalia → Artiodactyla, Perrisodactyla, Proboscidae, Pholidota, Rodentia, Dermopther, Chiroptera, Karnivora, Primat, Insectivora
Aves → Burung, Burung Unta, Burung Puyuh, Burung Bangau, Ayam, Itik, Angsa
Reptilia → Ghavialidae, Crocodylidae, Varanidae, Scincidae, Pythonidae, Viperidae, etc.

// Families per class
Bovidae → Lembu, Kerbau, Kambing, Biri-biri, Seladang, Banteng, Antelop, etc.
Equidae → Kuda, Zebra, Keldai
Felidae → Kucing, Harimau, Singa, etc.

// Breeds per family
Kambing → Kambing Boer, Kambing Katjang, Kambing Jamnapari
Lembu → Lembu Kedah, Lembu Brahman, Lembu Senepol, etc.
Ayam → Ross 308 (Daging), Lohmann Brown (Telur), etc.
```

---

## 4. DATA MODEL SUMMARY - NEW & MODIFIED

### New Models Required

1. **AnimalRejection** ← KEW.AH-2
2. **LivestockCategoryB** ← KEW.AH-4
3. **LivestockCareRecord** ← KEW.AH-7
4. **LivestockMovement** ← KEW.AH-8
5. **LivestockIncident** ← KEW.AH-9
6. **LivestockInspection** ← KEW.AH-11
7. **LivestockTransfer** ← KEW.AH-14
8. **LivestockDisposal** ← KEW.AH-16/18/20
9. **LivestockLoss** ← KEW.AH-27/29/30
10. **InventoryRejection** ← KEW.PS-2
11. **InventoryDisposal** ← KEW.PS-20/22

### Modified Models

1. **Livestock.js** - Major schema expansion (Category A animal details)
2. **Inventory.js** - Enhanced receiving & location tracking
3. **AuditLog.js** - Already tracks changes (leverage for approvals)

---

## 5. PRIORITY IMPLEMENTATION ROADMAP

### Phase 1 (Immediate - Foundation)

- [ ] Expand Livestock model schema (Category A fields)
- [ ] Create LivestockCategoryB model
- [ ] Create registration number generator utility
- [ ] Create AnimalRejection, InventoryRejection models
- [ ] Add to controllers & routes

### Phase 2 (Short-term - Core Operations)

- [ ] LivestockCareRecord, LivestockMovement, LivestockIncident models
- [ ] LivestockInspection model & inspection workflow
- [ ] Enhance Inventory model with KEW.PS compliance fields
- [ ] Add approval state tracking to models

### Phase 3 (Medium-term - Disposal & Reporting)

- [ ] LivestockDisposal, InventoryDisposal models
- [ ] Disposal approval workflows
- [ ] Annual report generation (backend scheduled tasks)
- [ ] Report frontend UI (export to Excel/PDF)

### Phase 4 (Long-term - Compliance & Auditing)

- [ ] LivestockLoss, LivestockTransfer models
- [ ] Loss investigation workflow
- [ ] Write-off approval process
- [ ] Comprehensive audit trail & compliance reporting
- [ ] Animal taxonomy configuration screen

---

## 6. IMMEDIATE ACTION ITEMS

1. **Replicate Livestock.js** to back it up as `Livestock.backup.js`
2. **Expand Livestock.js schema** with KEW.AH-3 Category A fields (CRITICAL)
3. **Create LivestockCategoryB.js** model for smaller animals
4. **Create registration number generator** utility function
5. **Update controllers** to handle new fields
6. **Update routes** with new endpoints for:
   - Animal reception & rejection
   - Care records
   - Movements & transfers
   - Inspections
   - Disposals
   - Loss reporting

---

## 7. NOTES FOR DEVELOPER

- KEW forms are **mandatory** for all Malaysian government agencies
- **Audit trail** must be comprehensive (who, when, what, why, approval state)
- **Approval workflows** are critical (violations can result in disciplinary action)
- **Annual reporting** deadlines are strict (Feb 15 / Mar 15)
- **Insurance & financial implications**: Loss/disposal values impact agency budgets
- **Physical-record reconciliation** (inspections) is a compliance requirement
- **Disposal method** heavily depends on **animal condition** and **value**
- **Surcharge & disciplinary action** can follow losses due to negligence
- System should **prevent data deletion** (immutable audit trail)
- Consider **data validation** on all numeric fields (quantities, values)
- **Images/documents** should be attached to forms for audit purposes

---

**Report prepared for:**
G-Vet Livestock & Asset Management System
Mapping KEW(Keluarga Harta Kerajaan) Malaysian Government Guidelines
