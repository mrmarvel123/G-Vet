/**
 * G-VET Modules Manager
 * Handles navigation and module routing
 */

const GVETModules = (() => {
  const MODULES = {
    // KEW.PA Asset Management
    "kewpa-dashboard": { path: "/kewpa", title: "Asset Management Dashboard" },
    "asset-registration": {
      path: "/asset-registration",
      title: "Asset Registration",
    },
    "asset-receipt": { path: "/asset-receipt", title: "Asset Receipt" },
    "asset-movement": { path: "/asset-movement", title: "Asset Movement" },
    "asset-inspection": {
      path: "/asset-inspection",
      title: "Asset Inspection",
    },
    "asset-maintenance": {
      path: "/asset-maintenance",
      title: "Asset Maintenance",
    },
    "asset-verification": {
      path: "/asset-verification",
      title: "Asset Verification",
    },

    // KEW.PS Store Management
    "kewps-dashboard": { path: "/kewps", title: "Store Dashboard" },
    "store-receipt": { path: "/store-receipt", title: "Store Receipt" },
    "stock-control": { path: "/stock-control", title: "Stock Control" },
    "store-issuance": { path: "/store-issuance", title: "Store Issuance" },
    "store-verification": {
      path: "/store-verification",
      title: "Store Verification",
    },
    "inventory-management": {
      path: "/inventory",
      title: "Inventory Management",
    },

    // KEW.AH Live Assets
    "kewah-dashboard": { path: "/kewah", title: "Livestock Management" },
    "livestock-register": {
      path: "/livestock-register",
      title: "Livestock Register",
    },
    "veterinary-care": { path: "/veterinary-care", title: "Veterinary Care" },

    // Analytics & Reports
    analytics: { path: "/reports", title: "Analytics & Reports" },
    "advanced-search": { path: "/advanced-search", title: "Advanced Search" },

    // Tools & Integration
    qrcode: { path: "/qr-scanner", title: "QR Code Scanner" },
    forms: { path: "/forms", title: "Forms" },
    procurement: { path: "/procurement", title: "Procurement" },
    suppliers: { path: "/suppliers", title: "Suppliers" },

    // Administration
    admin: { path: "/admin", title: "System Administration" },
    "it-admin": { path: "/it-admin", title: "IT Administration" },

    // Legacy Support
    assets: { path: "/asset-registration", title: "Assets" },
    inventory: { path: "/inventory", title: "Inventory" },
  };

  /**
   * Initialize modules manager
   */
  const init = () => {
    attachEventListeners();
  };

  /**
   * Open a module
   * @param {string} moduleName - Module identifier
   * @param {object} options - Additional options
   */
  const open = (moduleName, options = {}) => {
    const module = MODULES[moduleName];

    if (!module) {
      console.warn(`Module "${moduleName}" not found`);
      if (window.GVETNotifications) {
        window.GVETNotifications.show(
          `Module "${moduleName}" is not available`,
          "warning",
        );
      }
      return false;
    }

    // Check authentication if needed
    if (options.requireAuth && !GVETAuth.isAuthenticated()) {
      window.location.href = "/";
      return false;
    }

    console.log(`📍 Opening module: ${moduleName} → ${module.path}`);

    // Show loading notification
    if (window.GVETNotifications) {
      window.GVETNotifications.show(
        `<i class="fas fa-spinner fa-spin mr-2"></i>Loading ${module.title}...`,
        "info",
      );
    }

    // Navigate to module
    setTimeout(() => {
      window.location.href = module.path;
    }, 100);

    return true;
  };

  /**
   * Get module info
   * @param {string} moduleName
   * @returns {object|null}
   */
  const getModule = (moduleName) => {
    return MODULES[moduleName] || null;
  };

  /**
   * Get all modules
   * @returns {object}
   */
  const getAll = () => {
    return MODULES;
  };

  /**
   * Get modules by category
   * @param {string} category - 'assets', 'store', 'livestock', 'tools', 'admin'
   * @returns {array}
   */
  const getByCategory = (category) => {
    const categoryMap = {
      assets: [
        "kewpa-dashboard",
        "asset-registration",
        "asset-receipt",
        "asset-movement",
        "asset-inspection",
        "asset-maintenance",
        "asset-verification",
      ],
      store: [
        "kewps-dashboard",
        "store-receipt",
        "stock-control",
        "store-issuance",
        "store-verification",
        "inventory-management",
      ],
      livestock: ["kewah-dashboard", "livestock-register", "veterinary-care"],
      tools: ["qrcode", "forms", "procurement", "suppliers"],
      admin: ["admin", "it-admin"],
      reports: ["analytics", "advanced-search"],
    };

    return (categoryMap[category] || []).map((name) => ({
      id: name,
      ...MODULES[name],
    }));
  };

  /**
   * Search modules
   * @param {string} query
   * @returns {array}
   */
  const search = (query) => {
    const q = query.toLowerCase();
    return Object.entries(MODULES)
      .filter(
        ([name, module]) =>
          name.toLowerCase().includes(q) ||
          module.title.toLowerCase().includes(q),
      )
      .map(([id, module]) => ({ id, ...module }));
  };

  /**
   * Attach event listeners
   */
  const attachEventListeners = () => {
    // Delegate module open buttons
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-module]");
      if (btn) {
        const moduleName = btn.dataset.module;
        e.preventDefault();
        open(moduleName, { requireAuth: true });
      }
    });
  };

  /**
   * Get navigation breadcrumb
   * @param {string} moduleName
   * @returns {array}
   */
  const getBreadcrumb = (moduleName) => {
    const module = MODULES[moduleName];
    if (!module) return [];

    return [
      { name: "Home", path: "/dashboard-main.html" },
      { name: module.title, path: module.path },
    ];
  };

  // Public API
  return {
    init,
    open,
    getModule,
    getAll,
    getByCategory,
    search,
    getBreadcrumb,
    MODULES,
  };
})();

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  GVETModules.init();
});
