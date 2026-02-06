# G-Vet API Quick Start Guide

## 🚀 Getting Started

### 1. Database Setup

```bash
# Run migrations to create all tables
npm run migrate

# Seed database with test data
npm run seed
```

### 2. Start the Server

```bash
npm start
```

Server runs on: **<http://localhost:3000>**

---

## 🔐 Authentication

All endpoints require JWT token except login.

### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gvet.gov.my",
    "password": "admin123"
  }'
```

Response includes `accessToken` and `refreshToken`. Use `accessToken` in requests:

```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Test Users

| Username          | Email                       | Password     | Role              |
| ----------------- | --------------------------- | ------------ | ----------------- |
| admin             | <admin@gvet.gov.my>         | admin123     | admin             |
| vet_dr_mohd       | <dr.mohd@gvet.gov.my>       | vet123       | veterinarian      |
| livestock_manager | <livestock.mgr@gvet.gov.my> | livestock123 | livestock_manager |
| inventory_keeper  | <inventory@gvet.gov.my>     | inv123       | store_keeper      |
| field_officer     | <field@gvet.gov.my>         | field123     | field_officer     |

---

## 📚 Core API Endpoints

### Livestock Management

#### Get All Livestock

```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:3000/api/v1/livestock?page=1&limit=20"
```

#### Get Livestock by ID

```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:3000/api/v1/livestock/{id}"
```

#### Create Livestock

```bash
curl -X POST http://localhost:3000/api/v1/livestock \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "animalCode": "C2024-046",
    "species": "Cattle",
    "breed": "Kedah",
    "name": "Bessie",
    "gender": "Female",
    "dateOfBirth": "2023-01-15",
    "weight": 400,
    "location": "Farm Block A",
    "pen": "A-13"
  }'
```

---

## 🏥 Livestock Care Records (KEW.AH-4)

#### Get Care Records

```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:3000/api/v1/livestock-care-records?page=1&limit=20"
```

#### Create Care Record

```bash
curl -X POST http://localhost:3000/api/v1/livestock-care-records \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "livestockId": "livestock-id",
    "dateOfCare": "2026-02-06",
    "careType": "Vaccination",
    "description": "Annual vaccination",
    "vaccines": "FMD, Anthrax",
    "veterinarian": "Dr. Mohd"
  }'
```

#### Generate PDF

```bash
curl -X POST http://localhost:3000/api/v1/livestock-care-records/{id}/generate-pdf \
  -H "Authorization: Bearer TOKEN" \
  -o care-record.pdf
```

---

## 🏨 Livestock Incidents

#### Get Incidents

```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:3000/api/v1/livestock-incidents?page=1&limit=20"
```

#### Create Incident

```bash
curl -X POST http://localhost:3000/api/v1/livestock-incidents \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "livestockId": "livestock-id",
    "incidentDate": "2026-02-05",
    "incidentType": "Illness",
    "description": "Respiratory infection",
    "severity": "Medium"
  }'
```

#### Approve Incident

```bash
curl -X POST http://localhost:3000/api/v1/livestock-incidents/{id}/approve \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "costApproved": 500.00
  }'
```

#### Generate Incident Report PDF

```bash
curl -X POST http://localhost:3000/api/v1/livestock-incidents/{id}/generate-pdf \
  -H "Authorization: Bearer TOKEN" \
  -o incident-report.pdf
```

---

## 📦 Inventory Management

#### Get Inventory

```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:3000/api/v1/inventory?page=1&limit=20"
```

#### Create Inventory Item

```bash
curl -X POST http://localhost:3000/api/v1/inventory \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "itemCode": "STK-004",
    "itemName": "Vaccines",
    "category": "Veterinary Supplies",
    "unit": "vial",
    "currentStock": 50,
    "unitPrice": 150.00
  }'
```

#### Create Inventory Rejection

```bash
curl -X POST http://localhost:3000/api/v1/inventory-rejections \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "inventoryId": "inventory-id",
    "itemCode": "STK-001",
    "rejectionReason": "Damaged packaging",
    "quantity": 5
  }'
```

#### Approve Rejection

```bash
curl -X POST http://localhost:3000/api/v1/inventory-rejections/{id}/approve \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Approved for return"
  }'
```

---

## 🚚 Livestock Movement

#### Get Movements

```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:3000/api/v1/livestock-movements?page=1&limit=20"
```

#### Create Movement

```bash
curl -X POST http://localhost:3000/api/v1/livestock-movements \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "livestockId": "livestock-id",
    "fromLocation": "Farm Block A",
    "toLocation": "Veterinary Clinic",
    "reason": "Veterinary consultation"
  }'
```

#### Record Return

```bash
curl -X POST http://localhost:3000/api/v1/livestock-movements/{id}/record-return \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Return successful"
  }'
```

---

## 🔄 Livestock Transfer

#### Get Transfers

```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:3000/api/v1/livestock-transfers?page=1&limit=20"
```

#### Create Transfer

```bash
curl -X POST http://localhost:3000/api/v1/livestock-transfers \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "livestockId": "livestock-id",
    "fromDepartment": "Livestock Management",
    "toDepartment": "Breeding Program",
    "reason": "Breeding stock assignment"
  }'
```

#### Approve & Record Receipt

```bash
curl -X POST http://localhost:3000/api/v1/livestock-transfers/{id}/approve \
  -H "Authorization: Bearer TOKEN"

curl -X POST http://localhost:3000/api/v1/livestock-transfers/{id}/record-receipt \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Received in good condition"
  }'
```

---

## 📋 Livestock Inspection

#### Get Inspections

```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:3000/api/v1/livestock-inspections?page=1&limit=20"
```

#### Create Inspection

```bash
curl -X POST http://localhost:3000/api/v1/livestock-inspections \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "livestockId": "livestock-id",
    "inspectionDate": "2026-02-06",
    "inspectionType": "Health Inspection",
    "findings": "Animal in good health",
    "recommendations": "Continue monitoring"
  }'
```

---

## 🚫 Animal Rejection

#### Get Rejections

```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:3000/api/v1/animal-rejections?page=1&limit=20"
```

#### Create Rejection

```bash
curl -X POST http://localhost:3000/api/v1/animal-rejections \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "livestockId": "livestock-id",
    "rejectionReason": "Does not meet standards",
    "severity": "Medium"
  }'
```

#### Approve Reversal

```bash
curl -X POST http://localhost:3000/api/v1/animal-rejections/{id}/approve-reversal \
  -H "Authorization: Bearer TOKEN"
```

---

## ❌ Livestock Loss/Disposal

#### Create Loss Record

```bash
curl -X POST http://localhost:3000/api/v1/livestock-losses \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "livestockId": "livestock-id",
    "lossDate": "2026-02-05",
    "lossType": "Death",
    "cause": "Natural causes",
    "estimatedValue": 5500.00
  }'
```

#### Create Disposal Record

```bash
curl -X POST http://localhost:3000/api/v1/livestock-disposals \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "livestockId": "livestock-id",
    "disposalDate": "2026-02-06",
    "reason": "Health risk",
    "disposalMethod": "Humane euthanasia"
  }'
```

#### Approve Disposal

```bash
curl -X POST http://localhost:3000/api/v1/livestock-disposals/{id}/approve \
  -H "Authorization: Bearer TOKEN"
```

#### Generate Disposal Report PDF

```bash
curl -X POST http://localhost:3000/api/v1/livestock-disposals/{id}/generate-pdf \
  -H "Authorization: Bearer TOKEN" \
  -o disposal-report.pdf
```

---

## 💼 Category B (Livestock Registry)

#### Get Category B Records

```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:3000/api/v1/livestock-category-b?page=1&limit=20"
```

#### Create Category B Record

```bash
curl -X POST http://localhost:3000/api/v1/livestock-category-b \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "livestockId": "livestock-id",
    "categoryCode": "CB-2024-002",
    "classification": "Breeding Stock",
    "subClassification": "Foundation Animals",
    "certificationNo": "CERT-2024-002"
  }'
```

---

## 📄 Assets & Original Features

All original G-Vet endpoints remain operational:

- `/api/v1/assets` - Asset management
- `/api/v1/inventory` - Stock management
- `/api/v1/users` - User management
- `/api/v1/reports` - Reports
- `/api/v1/audit-logs` - Audit trails

---

## 🛠️ Error Handling

All errors return JSON with status codes:

```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

Common status codes:

- **200**: Success
- **201**: Created
- **400**: Validation error
- **404**: Not found
- **500**: Server error

---

## 📝 Form Validation

All `POST` endpoints include built-in form validation using KEWFormConverter.

Invalid requests return:

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "livestockId",
      "message": "livestockId is required"
    }
  ]
}
```

---

## 🔗 Additional Resources

- [API Documentation](API_DOCUMENTATION.md)
- [System Status](SYSTEM_HEALTH_REPORT.md)
- [Installation Guide](INSTALLATION.md)
- [Database Schema](DATABASE_SCHEMA.md)

---

## ✅ Todos

After setup:

1. ✅ Database running on MySQL
2. ✅ npm migrate (create tables)
3. ✅ npm seed (add test data)
4. ✅ npm start (run server)
5. Test endpoints with curl or Postman
6. Integrate frontend forms with API
7. Configure backup and logging

---

**Questions?** Check logs in `logs/` directory for troubleshooting.
