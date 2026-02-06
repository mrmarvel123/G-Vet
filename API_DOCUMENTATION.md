# G-VET System API Documentation

**Base URL:** `http://localhost:3000/api/v1`  
**Version:** 2.0.0  
**Authentication:** Bearer Token (JWT)

---

## Table of Contents

1. [Authentication](#authentication)
2. [Assets (KEW.PA)](#assets-kewpa)
3. [Inventory (KEW.PS)](#inventory-kewps)
4. [Livestock (KEW.AH)](#livestock-kewah)
5. [Users](#users)
6. [Reports](#reports)
7. [Audit Logs](#audit-logs)
8. [Error Codes](#error-codes)

---

## Authentication

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string",
  "fullName": "string",
  "role": "admin|manager|staff|visitor",
  "department": "string",
  "position": "string",
  "phoneNumber": "string"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "fullName": "string",
    "role": "string"
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "accessToken": "jwt-token",
  "refreshToken": "jwt-refresh-token",
  "user": {
    "id": "uuid",
    "username": "string",
    "role": "string",
    "fullName": "string"
  }
}
```

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "string"
}
```

### Logout
```http
POST /auth/logout
Authorization: Bearer {accessToken}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer {accessToken}
```

### Change Password
```http
PUT /auth/change-password
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "currentPassword": "string",
  "newPassword": "string"
}
```

---

## Assets (KEW.PA)

### Get All Assets
```http
GET /assets?page=1&limit=20&category=Computer&status=Active&search=laptop
Authorization: Bearer {accessToken}
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `category` - Filter by category
- `status` - Filter by status
- `location` - Filter by location
- `department` - Filter by department
- `search` - Search in code, name, description

**Response:**
```json
{
  "assets": [
    {
      "id": "uuid",
      "assetCode": "A2024-001",
      "assetName": "Dell Laptop",
      "category": "Computer & IT",
      "status": "Active",
      "purchasePrice": 3500.00,
      "location": "Office Floor 3",
      "department": "IT Department"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "pages": 5
  }
}
```

### Get Single Asset
```http
GET /assets/:id
Authorization: Bearer {accessToken}
```

### Create Asset
```http
POST /assets
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "assetCode": "A2024-003",
  "assetName": "HP Printer",
  "category": "Computer & IT",
  "subCategory": "Printer",
  "description": "Office printer",
  "brand": "HP",
  "model": "LaserJet Pro",
  "serialNumber": "HP123456",
  "purchaseDate": "2024-12-01",
  "purchasePrice": 1200.00,
  "supplier": "HP Malaysia",
  "warrantyExpiry": "2027-12-01",
  "location": "Office Floor 2",
  "department": "Admin",
  "custodian": "John Doe",
  "status": "Active",
  "condition": "Excellent",
  "kewpaForm": "KEW.PA-3"
}
```

### Update Asset
```http
PUT /assets/:id
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "status": "Under Maintenance",
  "condition": "Fair",
  "notes": "Requires servicing"
}
```

### Delete Asset
```http
DELETE /assets/:id
Authorization: Bearer {accessToken}
```

**Required Role:** Admin, Manager

### Get Asset Statistics
```http
GET /assets/stats/summary
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "totalAssets": 1247,
  "activeAssets": 1180,
  "maintenanceAssets": 45,
  "disposedAssets": 22,
  "byCategory": [
    {"category": "Computer & IT", "count": 450},
    {"category": "Furniture", "count": 320}
  ],
  "totalValue": 2500000.00
}
```

---

## Inventory (KEW.PS)

### Get All Inventory Items
```http
GET /inventory?page=1&limit=20&category=Office&lowStock=true
Authorization: Bearer {accessToken}
```

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `category` - Filter by category
- `status` - Filter by status
- `location` - Filter by location
- `lowStock` - Show only low stock items (true/false)
- `search` - Search in code, name

### Get Single Item
```http
GET /inventory/:id
Authorization: Bearer {accessToken}
```

### Create Inventory Item
```http
POST /inventory
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "itemCode": "STK-003",
  "itemName": "Printer Ink Cartridge",
  "category": "Office Supplies",
  "description": "Black ink cartridge",
  "unit": "piece",
  "currentStock": 25,
  "minimumStock": 10,
  "maximumStock": 50,
  "unitPrice": 45.00,
  "location": "Store Room A",
  "shelf": "A-05",
  "supplier": "Office Mart",
  "kewpsForm": "KEW.PS-3"
}
```

### Update Inventory Item
```http
PUT /inventory/:id
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "currentStock": 30,
  "unitPrice": 48.00
}
```

### Adjust Stock
```http
POST /inventory/:id/adjust
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "adjustment": -5,
  "reason": "Issued to IT Department"
}
```

**Note:** Use negative values for stock reduction, positive for addition.

### Get Inventory Statistics
```http
GET /inventory/stats/summary
Authorization: Bearer {accessToken}
```

---

## Livestock (KEW.AH)

### Get All Livestock
```http
GET /livestock?page=1&limit=20&species=Cattle&healthStatus=Healthy
Authorization: Bearer {accessToken}
```

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `species` - Filter by species
- `healthStatus` - Filter by health status
- `location` - Filter by location
- `search` - Search in code, name, breed

### Get Single Livestock
```http
GET /livestock/:id
Authorization: Bearer {accessToken}
```

### Create Livestock
```http
POST /livestock
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "animalCode": "C2024-050",
  "species": "Cattle",
  "breed": "Kedah-Kelantan",
  "name": "Daisy",
  "gender": "Female",
  "dateOfBirth": "2023-05-10",
  "age": "1 year 7 months",
  "color": "Brown",
  "weight": 380.00,
  "acquisitionDate": "2024-12-01",
  "acquisitionType": "Purchase",
  "acquisitionPrice": 5000.00,
  "location": "Farm Block A",
  "pen": "A-15",
  "healthStatus": "Healthy",
  "vaccinationStatus": "Up to Date",
  "kewahForm": "KEW.AH-2"
}
```

### Update Livestock
```http
PUT /livestock/:id
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "healthStatus": "Under Treatment",
  "weight": 385.00,
  "notes": "Started medication on 2024-12-08"
}
```

### Get Livestock Statistics
```http
GET /livestock/stats/summary
Authorization: Bearer {accessToken}
```

---

## Users

**Note:** All user management endpoints require Admin role.

### Get All Users
```http
GET /users?page=1&limit=20&role=staff&isActive=true
Authorization: Bearer {accessToken}
```

### Get Single User
```http
GET /users/:id
Authorization: Bearer {accessToken}
```

### Update User
```http
PUT /users/:id
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "fullName": "Updated Name",
  "role": "manager",
  "department": "Operations"
}
```

### Delete User
```http
DELETE /users/:id
Authorization: Bearer {accessToken}
```

### Toggle User Active Status
```http
PATCH /users/:id/toggle-active
Authorization: Bearer {accessToken}
```

---

## Reports

### Generate Asset Report
```http
GET /reports/assets?format=pdf&category=Computer&startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer {accessToken}
```

**Query Parameters:**
- `format` - Report format: json, pdf, excel (default: json)
- `category` - Filter by category
- `status` - Filter by status
- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)

### Generate Inventory Report
```http
GET /reports/inventory?format=excel&lowStock=true
Authorization: Bearer {accessToken}
```

### Generate Livestock Report
```http
GET /reports/livestock?format=pdf&species=Cattle
Authorization: Bearer {accessToken}
```

### Get Dashboard Statistics
```http
GET /reports/dashboard
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "assets": {
    "total": 1247,
    "active": 1180,
    "totalValue": 2500000.00
  },
  "inventory": {
    "total": 3456,
    "lowStock": 12,
    "totalValue": 450000.00
  },
  "livestock": {
    "total": 567,
    "healthy": 540,
    "totalValue": 850000.00
  },
  "users": {
    "total": 45,
    "active": 42,
    "byRole": [
      {"role": "admin", "count": 3},
      {"role": "staff", "count": 35}
    ]
  }
}
```

---

## Audit Logs

**Note:** Requires Admin or Manager role.

### Get Audit Logs
```http
GET /audit?page=1&limit=50&action=create&module=asset&startDate=2024-12-01
Authorization: Bearer {accessToken}
```

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `userId` - Filter by user ID
- `action` - Filter by action (create, update, delete, login, etc.)
- `module` - Filter by module (asset, inventory, livestock, auth, user)
- `status` - Filter by status (success, failure, warning)
- `startDate` - Start date
- `endDate` - End date

**Response:**
```json
{
  "logs": [
    {
      "id": "uuid",
      "username": "admin",
      "action": "create",
      "module": "asset",
      "recordId": "uuid",
      "status": "success",
      "message": "Asset created successfully",
      "ipAddress": "192.168.1.100",
      "createdAt": "2024-12-08T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 5000,
    "page": 1,
    "limit": 50,
    "pages": 100
  }
}
```

### Get Audit Statistics
```http
GET /audit/stats/summary
Authorization: Bearer {accessToken}
```

---

## Error Codes

### HTTP Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

### Error Response Format

```json
{
  "error": "Error message",
  "details": "Detailed error information",
  "status": 400
}
```

### Common Errors

**Invalid Credentials**
```json
{
  "error": "Invalid credentials"
}
```

**Token Expired**
```json
{
  "error": "Token expired"
}
```

**Insufficient Permissions**
```json
{
  "error": "Forbidden",
  "message": "Required role: admin or manager"
}
```

**Validation Error**
```json
{
  "error": "Validation failed",
  "details": "Missing required fields: assetCode, assetName"
}
```

---

## WebSocket Events

**Connection:** `http://localhost:3000` or `ws://localhost:3001`

### Client Events

```javascript
// Connect
const socket = io('http://localhost:3000');

// Join specific room
socket.emit('join-room', 'assets');
```

### Server Events

**Asset Events:**
- `asset:created` - New asset created
- `asset:updated` - Asset updated
- `asset:deleted` - Asset deleted

**Inventory Events:**
- `inventory:created` - New item created
- `inventory:updated` - Item updated
- `inventory:deleted` - Item deleted
- `inventory:lowStock` - Low stock alert
- `inventory:stockAdjusted` - Stock adjusted

**Livestock Events:**
- `livestock:created` - New animal registered
- `livestock:updated` - Animal updated
- `livestock:deleted` - Animal removed
- `livestock:healthAlert` - Health status alert

**Example:**
```javascript
socket.on('inventory:lowStock', (item) => {
  console.log('Low stock alert:', item);
  // Display notification
});
```

---

## Rate Limiting

- **Window:** 15 minutes
- **Max Requests:** 100 per window
- **Applies to:** All `/api/*` endpoints

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1702045200
```

---

## File Upload

**Maximum File Size:** 10MB  
**Allowed Types:** JPEG, PNG, PDF, DOC, DOCX

### Upload Asset Image
```http
POST /assets/:id/upload
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

assetImage: [file]
```

### Upload Livestock Image
```http
POST /livestock/:id/upload
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

livestockImage: [file]
```

---

## Postman Collection

Import this base URL in Postman:
```
http://localhost:3000/api/v1
```

Set environment variable:
```
accessToken: {{YOUR_TOKEN}}
```

Use in requests:
```
Authorization: Bearer {{accessToken}}
```

---

## Support

For issues or questions:
- Check logs: `logs/combined.log`
- Health endpoint: `/api/health`
- API version: `/api/v1`

**System:** G-VET ASSET & iSTOR SYSTEM v2.0  
**Organization:** Jabatan Perkhidmatan Veterinar Negeri Perak  
**Documentation Updated:** December 2025
