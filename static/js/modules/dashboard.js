/**
 * G-VET Dashboard Data Loader
 * Handles loading and managing dashboard data
 */

const GVETDashboard = (() => {
  const CONFIG = {
    refreshInterval: 30000, // 30 seconds
    animationDuration: 1000,
  };

  let refreshTimer = null;
  let dashboardData = {
    stats: {
      totalAssets: 0,
      inventoryItems: 0,
      lowStockItems: 0,
      activeUsers: 0,
    },
    trends: {
      assets: 5.2,
      inventory: 8.3,
      lowStock: -2.1,
      users: 3.7,
    },
    recentActivities: [],
  };

  /**
   * Initialize dashboard
   */
  const init = () => {
    loadDashboardData();
    setupAutoRefresh();
    attachEventListeners();
  };

  /**
   * Load dashboard data
   */
  const loadDashboardData = async () => {
    try {
      const token = GVETAuth.getToken();
      if (!token) return false;

      const response = await fetch("/api/v1/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load dashboard data");
      }

      const data = await response.json();
      dashboardData = { ...dashboardData, ...data };

      // Update UI
      updateStatCards();
      updateRecentActivities();

      return true;
    } catch (error) {
      console.error("Dashboard data load error:", error);

      // Load demo data
      loadDemoData();
      updateStatCards();
      updateRecentActivities();

      return false;
    }
  };

  /**
   * Load demo data for development/testing
   */
  const loadDemoData = () => {
    dashboardData = {
      stats: {
        totalAssets: 1248,
        inventoryItems: 3456,
        lowStockItems: 12,
        activeUsers: 24,
      },
      trends: {
        assets: 5.2,
        inventory: 8.3,
        lowStock: -2.1,
        users: 3.7,
      },
      recentActivities: [
        {
          id: "1",
          action: "Asset Registration",
          description: "Registered new server equipment (SRV-2024-045)",
          status: "success",
          timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        },
        {
          id: "2",
          action: "Stock Receipt",
          description: "Received 50 units of medical supplies",
          status: "success",
          timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
        },
        {
          id: "3",
          action: "Livestock Transfer",
          description: "Transferred 5 cattle to secondary facility",
          status: "warning",
          timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
        },
        {
          id: "4",
          action: "System Check",
          description: "Database integrity verification completed",
          status: "success",
          timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
        },
      ],
    };
  };

  /**
   * Update stat cards in UI
   */
  const updateStatCards = () => {
    const stats = [
      {
        id: "total-assets",
        value: dashboardData.stats.totalAssets,
        trend: dashboardData.trends.assets,
      },
      {
        id: "inventory-items",
        value: dashboardData.stats.inventoryItems,
        trend: dashboardData.trends.inventory,
      },
      {
        id: "low-stock",
        value: dashboardData.stats.lowStockItems,
        trend: dashboardData.trends.lowStock,
      },
      {
        id: "active-users",
        value: dashboardData.stats.activeUsers,
        trend: dashboardData.trends.users,
      },
    ];

    stats.forEach((stat) => {
      const element = document.getElementById(stat.id);
      if (element) {
        animateCounter(element, stat.value);
        updateTrendIndicator(element, stat.trend);
      }
    });
  };

  /**
   * Animate counter to target value
   * @param {HTMLElement} element
   * @param {number} target
   */
  const animateCounter = (element, target) => {
    const start = parseInt(element.textContent) || 0;
    const increment = (target - start) / (CONFIG.animationDuration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (
        (increment > 0 && current >= target) ||
        (increment < 0 && current <= target)
      ) {
        element.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current).toLocaleString();
      }
    }, 16);
  };

  /**
   * Update trend indicator for stat card
   * @param {HTMLElement} element
   * @param {number} trend
   */
  const updateTrendIndicator = (element, trend) => {
    let trendEl = element.closest("[data-stat]")?.querySelector("[data-trend]");
    if (!trendEl) return;

    const icon = trend >= 0 ? "📈" : "📉";
    const color = trend >= 0 ? "trend-up" : "trend-down";
    const sign = trend >= 0 ? "+" : "";

    trendEl.innerHTML = `<span class="${color}">${icon} ${sign}${trend.toFixed(1)}%</span>`;
  };

  /**
   * Update recent activities list
   */
  const updateRecentActivities = () => {
    const container = document.getElementById("recent-activities");
    if (!container) return;

    container.innerHTML = dashboardData.recentActivities
      .map(
        (activity) => `
      <div class="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 last:pb-0">
        <div class="flex-shrink-0">
          <i class="${getActivityIcon(activity.action)} text-xl ${getActivityColor(activity.status)}"></i>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-medium text-gray-900 dark:text-white">${activity.action}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">${activity.description}</p>
          <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">${getTimeAgo(activity.timestamp)}</p>
        </div>
      </div>
    `,
      )
      .join("");
  };

  /**
   * Get activity icon based on action type
   * @param {string} action
   * @returns {string}
   */
  const getActivityIcon = (action) => {
    const iconMap = {
      "Asset Registration": "fas fa-box",
      "Stock Receipt": "fas fa-boxes",
      "Livestock Transfer": "fas fa-horse",
      "System Check": "fas fa-heartbeat",
      "Asset Movement": "fas fa-arrows-alt",
      Inspection: "fas fa-clipboard-check",
    };

    return iconMap[action] || "fas fa-activity";
  };

  /**
   * Get activity color based on status
   * @param {string} status
   * @returns {string}
   */
  const getActivityColor = (status) => {
    const colorMap = {
      success: "text-green-600 dark:text-green-400",
      warning: "text-yellow-600 dark:text-yellow-400",
      error: "text-red-600 dark:text-red-400",
      info: "text-blue-600 dark:text-blue-400",
    };

    return colorMap[status] || "text-gray-600";
  };

  /**
   * Get time ago string
   * @param {string} dateString
   * @returns {string}
   */
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  /**
   * Setup auto-refresh
   */
  const setupAutoRefresh = () => {
    clearInterval(refreshTimer);
    refreshTimer = setInterval(() => {
      loadDashboardData();
    }, CONFIG.refreshInterval);
  };

  /**
   * Attach event listeners
   */
  const attachEventListeners = () => {
    const refreshBtn = document.getElementById("refresh-dashboard");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        const icon = refreshBtn.querySelector("i");
        if (icon) {
          icon.classList.add("fa-spin");
          loadDashboardData().finally(() => {
            icon.classList.remove("fa-spin");
          });
        }
      });
    }
  };

  /**
   * Get current dashboard data
   * @returns {object}
   */
  const getData = () => {
    return dashboardData;
  };

  /**
   * Refresh dashboard data manually
   * @returns {Promise<boolean>}
   */
  const refresh = () => {
    return loadDashboardData();
  };

  // Public API
  return {
    init,
    getData,
    refresh,
    updateStatCards,
    updateRecentActivities,
  };
})();

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  if (GVETAuth.isAuthenticated()) {
    GVETDashboard.init();
  }
});
