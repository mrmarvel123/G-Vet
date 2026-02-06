/**
 * G-VET Notifications System
 * Handles all user notifications and alerts
 */

const GVETNotifications = (() => {
  const CONFIG = {
    containerId: "notification-container",
    defaultDuration: 5000,
    maxNotifications: 5,
  };

  /**
   * Initialize notifications system
   */
  const init = () => {
    ensureContainer();
  };

  /**
   * Ensure notification container exists
   */
  const ensureContainer = () => {
    let container = document.getElementById(CONFIG.containerId);
    if (!container) {
      container = document.createElement("div");
      container.id = CONFIG.containerId;
      container.setAttribute("role", "region");
      container.setAttribute("aria-label", "System notifications");
      container.setAttribute("aria-live", "polite");
      container.className = "fixed top-20 right-4 space-y-3 z-50 max-w-sm";
      document.body.appendChild(container);
    }
    return container;
  };

  /**
   * Show notification
   * @param {string} message - Notification message
   * @param {string} type - 'success', 'error', 'warning', 'info'
   * @param {number} duration - Auto-dismiss duration in ms (0 = no auto-dismiss)
   * @returns {HTMLElement}
   */
  const show = (message, type = "info", duration = CONFIG.defaultDuration) => {
    const container = ensureContainer();

    // Limit number of notifications
    while (container.children.length >= CONFIG.maxNotifications) {
      container.removeChild(container.firstChild);
    }

    const notification = createNotification(message, type);

    container.appendChild(notification);

    // Auto-dismiss
    if (duration > 0) {
      setTimeout(() => {
        dismiss(notification);
      }, duration);
    }

    return notification;
  };

  /**
   * Create notification element
   * @param {string} message
   * @param {string} type
   * @returns {HTMLElement}
   */
  const createNotification = (message, type) => {
    const notification = document.createElement("div");
    notification.className = `rounded-lg shadow-lg p-4 animate-fade-in flex items-start gap-3 border-l-4 ${getStyles(type).wrapper}`;

    const { icon, bgColor, borderColor, textColor } = getStyles(type);

    notification.innerHTML = `
      <i class="${icon} text-xl flex-shrink-0 mt-0.5"></i>
      <div class="flex-1">
        <p class="${textColor} text-sm font-medium">${message}</p>
      </div>
      <button class="text-gray-500 hover:text-gray-700 flex-shrink-0 transition-colors"
              onclick="this.parentElement.remove()"
              aria-label="Close notification">
        <i class="fas fa-times"></i>
      </button>
    `;

    return notification;
  };

  /**
   * Get notification styles
   * @param {string} type
   * @returns {object}
   */
  const getStyles = (type) => {
    const styles = {
      success: {
        wrapper: "bg-green-50 border-green-600",
        icon: "fas fa-check-circle text-green-600",
        textColor: "text-green-800",
      },
      error: {
        wrapper: "bg-red-50 border-red-600",
        icon: "fas fa-exclamation-circle text-red-600",
        textColor: "text-red-800",
      },
      warning: {
        wrapper: "bg-yellow-50 border-yellow-600",
        icon: "fas fa-alert-triangle text-yellow-600",
        textColor: "text-yellow-800",
      },
      info: {
        wrapper: "bg-blue-50 border-blue-600",
        icon: "fas fa-info-circle text-blue-600",
        textColor: "text-blue-800",
      },
    };

    return styles[type] || styles.info;
  };

  /**
   * Dismiss notification
   * @param {HTMLElement} notification
   */
  const dismiss = (notification) => {
    notification.style.animation = "fadeOut 0.3s ease-out forwards";
    setTimeout(() => {
      notification.remove();
    }, 300);
  };

  /**
   * Dismiss all notifications
   */
  const dismissAll = () => {
    const container = document.getElementById(CONFIG.containerId);
    if (container) {
      container.innerHTML = "";
    }
  };

  /**
   * Show success notification
   * @param {string} message
   * @param {number} duration
   */
  const success = (message, duration = CONFIG.defaultDuration) => {
    return show(message, "success", duration);
  };

  /**
   * Show error notification
   * @param {string} message
   * @param {number} duration
   */
  const error = (message, duration = CONFIG.defaultDuration) => {
    return show(message, "error", duration);
  };

  /**
   * Show warning notification
   * @param {string} message
   * @param {number} duration
   */
  const warning = (message, duration = CONFIG.defaultDuration) => {
    return show(message, "warning", duration);
  };

  /**
   * Show info notification
   * @param {string} message
   * @param {number} duration
   */
  const info = (message, duration = CONFIG.defaultDuration) => {
    return show(message, "info", duration);
  };

  // Public API
  return {
    init,
    show,
    success,
    error,
    warning,
    info,
    dismiss,
    dismissAll,
  };
})();

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  GVETNotifications.init();
});
