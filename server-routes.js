/**
 * G-VET Server Routes Configuration
 * Handles routing for all static pages and API endpoints
 *
 * This file sets up Express.js routes to serve the modular HTML pages
 * and provides the authentication flow, logo serving, and API endpoints.
 */

const express = require("express");
const path = require("path");
const router = express.Router();

/**
 * SERVE STATIC ASSETS
 * Serve static files from public directories
 */

// Static files middleware (images, CSS, JS, etc.)
router.use(express.static(path.join(__dirname, "..", "public")));
router.use(express.static(path.join(__dirname, "..", "static")));

/**
 * PAGE ROUTES
 * Serve the individual HTML pages
 */

// Security notice page (entry point)
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "popup.html"));
});

// Alternative entry point
router.get("/popup", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "popup.html"));
});

// Login page
router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "login.html"));
});

router.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "login.html"));
});

// Main dashboard
router.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "dashboard-main.html"));
});

router.get("/dashboard.html", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "dashboard-main.html"));
});

router.get("/dashboard-main.html", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "dashboard-main.html"));
});

// Reports page
router.get("/reports", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "reports.html"));
});

router.get("/reports.html", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "reports.html"));
});

// Admin panel
router.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "admin.html"));
});

router.get("/admin.html", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "admin.html"));
});

// Inventory management
router.get("/inventory", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "inventory-management.html"));
});

router.get("/inventory-management.html", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "inventory-management.html"));
});

// Asset management
router.get("/assets", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "asset-management.html"));
});

router.get("/asset-management.html", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "asset-management.html"));
});

// Settings page
router.get("/settings", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "settings.html"));
});

router.get("/settings.html", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "settings.html"));
});

/**
 * KEW MODULE PAGES
 * Routes for KEW (Kemudahan E-Watermark) subsystems
 */

// KEW.PA Dashboard
router.get("/kewpa", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "kewpa.html"));
});

/**
 * KEW.PA FORM ROUTES
 * Individual form access with and without .html extension
 */
const kewpaForms = [
  "kewpa-1",
  "kewpa-2",
  "kewpa-3",
  "kewpa-4",
  "kewpa-5-8",
  "kewpa-9-10",
  "kewpa-11-12",
  "kewpa-13-16",
  "kewpa-17-20",
  "kewpa-21-28",
  "kewpa-29-36",
];

kewpaForms.forEach((form) => {
  // Without .html
  router.get(`/kewpa/${form}`, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "kewpa", `${form}.html`), (err) => {
      if (err) {
        res.status(404).sendFile(path.join(__dirname, "..", "index.html"));
      }
    });
  });

  // With .html
  router.get(`/kewpa/${form}.html`, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "kewpa", `${form}.html`), (err) => {
      if (err) {
        res.status(404).sendFile(path.join(__dirname, "..", "index.html"));
      }
    });
  });
});

// KEW.PS Dashboard
router.get("/kewps", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "kewps.html"));
});

/**
 * KEW.PS FORM ROUTES
 * Individual form access with and without .html extension
 */
const kewpsForms = [
  "kewps-1-2",
  "kewps-3-4",
  "kewps-5-6",
  "kewps-7-9",
  "kewps-10-12",
  "kewps-13-36",
];

kewpsForms.forEach((form) => {
  // Without .html
  router.get(`/kewps/${form}`, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "kewps", `${form}.html`), (err) => {
      if (err) {
        res.status(404).sendFile(path.join(__dirname, "..", "index.html"));
      }
    });
  });

  // With .html
  router.get(`/kewps/${form}.html`, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "kewps", `${form}.html`), (err) => {
      if (err) {
        res.status(404).sendFile(path.join(__dirname, "..", "index.html"));
      }
    });
  });
});

// KEW.AH Dashboard
router.get("/kewah", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "kewah.html"));
});

/**
 * KEW.AH FORM ROUTES
 * Individual form access with and without .html extension
 */
const kewaForms = [
  "kewah-1",
  "kewah-2",
  "kewah-3-4",
  "kewah-5",
  "kewah-6",
  "kewah-7",
  "kewah-8",
];

kewaForms.forEach((form) => {
  // Without .html
  router.get(`/kewah/${form}`, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "kewah", `${form}.html`), (err) => {
      if (err) {
        res.status(404).sendFile(path.join(__dirname, "..", "index.html"));
      }
    });
  });

  // With .html
  router.get(`/kewah/${form}.html`, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "kewah", `${form}.html`), (err) => {
      if (err) {
        res.status(404).sendFile(path.join(__dirname, "..", "index.html"));
      }
    });
  });
});

/**
 * SPECIALIZED PAGES
 * Routes for specialized functionality pages
 */

// All available specialized pages
const specializedPages = [
  "asset-registration",
  "asset-receipt",
  "asset-verification",
  "asset-inspection",
  "asset-movement",
  "asset-maintenance",
  "livestock-register",
  "veterinary-care",
  "procurement",
  "suppliers",
  "store-receipt",
  "store-issuance",
  "store-verification",
  "stock-control",
  "qr-scanner",
  "forms",
  "it-admin",
  "advanced-search",
  "inventory",
  "dashboard-main",
];

// Dynamic routes for all specialized pages
specializedPages.forEach((page) => {
  // Route without .html
  router.get(`/${page}`, (req, res) => {
    const filePath = path.join(__dirname, "..", `${page}.html`);
    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(404).sendFile(path.join(__dirname, "..", "index.html"));
      }
    });
  });

  // Route with .html extension
  router.get(`/${page}.html`, (req, res) => {
    const filePath = path.join(__dirname, "..", `${page}.html`);
    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(404).sendFile(path.join(__dirname, "..", "index.html"));
      }
    });
  });
});

/**
 * API ENDPOINTS
 * These handle authentication and data operations
 */

// Authentication endpoint
router.post("/api/auth/login", (req, res) => {
  // This would connect to your backend authentication
  // For now, returns success response
  res.json({
    success: true,
    message: "Login successful",
    accessToken: "demo_token_" + Date.now(),
    refreshToken: "refresh_token_" + Date.now(),
    user: {
      id: 1,
      username: req.body.username || "user",
      fullName: "User Name",
      role: "staff",
    },
  });
});

// Logout endpoint
router.post("/api/auth/logout", (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

// Get dashboard data
router.get("/api/dashboard/stats", (req, res) => {
  res.json({
    success: true,
    data: {
      totalAssets: 1245,
      inventoryItems: 5240,
      lowStockAlerts: 148,
      activeUsers: 12,
    },
  });
});

// Get reports
router.get("/api/reports", (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 1,
        name: "Asset Inventory Report",
        date: "2026-02-05",
        status: "Completed",
      },
      {
        id: 2,
        name: "Stock Analysis Report",
        date: "2026-02-04",
        status: "Completed",
      },
      {
        id: 3,
        name: "Compliance Report",
        date: "2026-02-03",
        status: "In Progress",
      },
    ],
  });
});

// Get inventory items
router.get("/api/inventory", (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 1,
        code: "INV-001",
        name: "Medical Supplies Kit",
        category: "Medical",
        quantity: 156,
        status: "In Stock",
      },
      {
        id: 2,
        code: "INV-002",
        name: "Equipment Parts",
        category: "Equipment",
        quantity: 45,
        status: "Low Stock",
      },
    ],
  });
});

// Get assets
router.get("/api/assets", (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 1,
        assetId: "AST-2026-001",
        name: "Server HP ProLiant DL380 Gen10",
        status: "Active",
        location: "Server Room A",
      },
      {
        id: 2,
        assetId: "AST-2026-002",
        name: "Network Switch Cisco Catalyst",
        status: "Active",
        location: "Floor 2 Network Room",
      },
    ],
  });
});

// Get user profile
router.get("/api/user/profile", (req, res) => {
  res.json({
    success: true,
    data: {
      id: 1,
      username: "user",
      fullName: "User Name",
      email: "user@gvet.gov.my",
      role: "staff",
      department: "Asset Management",
      lastLogin: new Date().toISOString(),
    },
  });
});

// Update user profile
router.post("/api/user/profile", (req, res) => {
  res.json({
    success: true,
    message: "Profile updated successfully",
    data: req.body,
  });
});

// Change password
router.post("/api/user/change-password", (req, res) => {
  res.json({
    success: true,
    message: "Password changed successfully",
  });
});

/**
 * ERROR HANDLING
 * Catch-all routes for undefined pages
 */

// 404 handler - serve index or error page
router.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "..", "index.html"), (err) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: "Page not found",
        error: err.message,
      });
    }
  });
});

module.exports = router;
