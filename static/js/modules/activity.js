/**
 * G-VET WebSocket & Activity Manager
 * Handles real-time updates and activity tracking
 */

const GVETActivity = (() => {
  let socket = null;
  const CONFIG = {
    maxRetries: 5,
    retryDelay: 2000,
  };

  let reconnectAttempts = 0;

  /**
   * Initialize WebSocket connection
   */
  const init = () => {
    if (typeof io === "undefined") {
      console.warn("Socket.io not loaded");
      return false;
    }

    connect();
    return true;
  };

  /**
   * Connect to WebSocket server
   */
  const connect = () => {
    try {
      const token = GVETAuth.getToken();
      if (!token) {
        console.log("No authentication token, skipping WebSocket connection");
        return;
      }

      socket = io("/", {
        auth: {
          token: token,
        },
        reconnection: true,
        reconnectionDelay: CONFIG.retryDelay,
        reconnectionDelayMax: 10000,
        reconnectionAttempts: CONFIG.maxRetries,
      });

      attachSocketListeners();
      console.log("📡 WebSocket connection initialized");
    } catch (error) {
      console.error("WebSocket connection error:", error);
    }
  };

  /**
   * Attach Socket.io event listeners
   */
  const attachSocketListeners = () => {
    if (!socket) return;

    socket.on("connect", () => {
      console.log("✅ WebSocket connected");
      reconnectAttempts = 0;

      if (window.GVETNotifications) {
        window.GVETNotifications.show(
          "Real-time connection established",
          "success",
        );
      }
    });

    socket.on("disconnect", () => {
      console.log("⚠️ WebSocket disconnected");
    });

    socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    // Listen for real-time updates
    socket.on("dashboard:update", (data) => {
      if (window.GVETDashboard) {
        window.GVETDashboard.updateStatCards();
      }
    });

    socket.on("activity:new", (activity) => {
      logActivity(activity);
      if (window.GVETNotifications) {
        window.GVETNotifications.show(activity.description, "info");
      }
    });

    socket.on("alert:system", (alert) => {
      if (window.GVETNotifications) {
        window.GVETNotifications.show(
          alert.message,
          alert.type || "warning",
          0,
        );
      }
    });

    socket.on("notification:send", (notification) => {
      if (window.GVETNotifications) {
        window.GVETNotifications.show(
          notification.message,
          notification.type || "info",
        );
      }
    });
  };

  /**
   * Log an activity
   * @param {object} activity
   */
  const logActivity = (activity) => {
    const timestamp = new Date().toISOString();
    const user = GVETAuth.getCurrentUser();

    const activityLog = {
      id: generateId(),
      userId: user?.id,
      username: user?.username,
      action: activity.action,
      description: activity.description,
      status: activity.status || "info",
      timestamp: timestamp,
      metadata: activity.metadata || {},
    };

    // Send to server
    emit("activity:log", activityLog);

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log("📝 Activity logged:", activityLog);
    }
  };

  /**
   * Track user action
   * @param {string} action
   * @param {string} description
   * @param {object} metadata
   */
  const trackAction = (action, description, metadata = {}) => {
    logActivity({
      action: action,
      description: description,
      status: "info",
      metadata: metadata,
    });
  };

  /**
   * Track error
   * @param {string} errorMessage
   * @param {object} context
   */
  const trackError = (errorMessage, context = {}) => {
    logActivity({
      action: "Error",
      description: errorMessage,
      status: "error",
      metadata: context,
    });
  };

  /**
   * Emit event to server
   * @param {string} event
   * @param {object} data
   */
  const emit = (event, data) => {
    if (!socket || !socket.connected) {
      console.warn(`Cannot emit "${event}", WebSocket not connected`);
      return;
    }

    socket.emit(event, data, (response) => {
      if (response?.error) {
        console.error(`Server error for "${event}":`, response.error);
      }
    });
  };

  /**
   * Listen for event
   * @param {string} event
   * @param {function} callback
   */
  const on = (event, callback) => {
    if (!socket) return;
    socket.on(event, callback);
  };

  /**
   * Remove event listener
   * @param {string} event
   * @param {function} callback
   */
  const off = (event, callback) => {
    if (!socket) return;
    socket.off(event, callback);
  };

  /**
   * Check if connected
   * @returns {boolean}
   */
  const isConnected = () => {
    return socket?.connected || false;
  };

  /**
   * Disconnect
   */
  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  };

  /**
   * Generate unique ID
   * @returns {string}
   */
  const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  /**
   * Get connection status
   * @returns {object}
   */
  const getStatus = () => {
    return {
      connected: isConnected(),
      socketId: socket?.id || null,
      reconnectAttempts: reconnectAttempts,
    };
  };

  // Public API
  return {
    init,
    emit,
    on,
    off,
    isConnected,
    disconnect,
    getStatus,
    logActivity,
    trackAction,
    trackError,
  };
})();

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  if (GVETAuth.isAuthenticated()) {
    GVETActivity.init();
  }
});

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  GVETActivity.disconnect();
});
