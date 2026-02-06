/**
 * G-VET Authentication Module
 * Handles user login, logout, session management, and token refresh
 */

const GVETAuth = (() => {
  const CONFIG = {
    tokenKey: "accessToken",
    refreshTokenKey: "refreshToken",
    userKey: "currentUser",
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
  };

  let sessionTimer = null;

  /**
   * Initialize authentication system
   */
  const init = () => {
    attachEventListeners();
    checkExistingSession();
  };

  /**
   * Check if user has valid session
   * @returns {Promise<boolean>}
   */
  const checkExistingSession = async () => {
    try {
      const token = localStorage.getItem(CONFIG.tokenKey);
      const user = localStorage.getItem(CONFIG.userKey);

      if (!token || !user) {
        return false;
      }

      // Verify token is still valid
      const isValid = await verifyToken(token);
      if (!isValid) {
        const refreshed = await refreshToken();
        if (!refreshed) {
          clearSession();
          return false;
        }
      }

      restoreSession();
      return true;
    } catch (error) {
      console.error("Session check error:", error);
      clearSession();
      return false;
    }
  };

  /**
   * Login user with credentials
   * @param {string} username
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  const login = async (username, password) => {
    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      const data = await response.json();

      // Store tokens and user info
      localStorage.setItem(CONFIG.tokenKey, data.accessToken);
      localStorage.setItem(CONFIG.refreshTokenKey, data.refreshToken);
      localStorage.setItem(CONFIG.userKey, JSON.stringify(data.user));

      // Setup session timeout
      setupSessionTimeout();

      // Show success notification
      if (window.GVETNotifications) {
        window.GVETNotifications.show(
          `Welcome back, ${data.user.fullName}!`,
          "success",
        );
      }

      return true;
    } catch (error) {
      console.error("Login error:", error);
      if (window.GVETNotifications) {
        window.GVETNotifications.show(error.message, "error");
      }
      return false;
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      const token = localStorage.getItem(CONFIG.tokenKey);

      // Call logout endpoint
      if (token) {
        await fetch("/api/v1/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).catch(() => {}); // Ignore errors on logout
      }

      clearSession();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      clearSession();
    }
  };

  /**
   * Refresh access token
   * @returns {Promise<boolean>}
   */
  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem(CONFIG.refreshTokenKey);

      if (!refreshToken) {
        clearSession();
        return false;
      }

      const response = await fetch("/api/v1/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        clearSession();
        return false;
      }

      const data = await response.json();
      localStorage.setItem(CONFIG.tokenKey, data.accessToken);

      setupSessionTimeout();
      return true;
    } catch (error) {
      console.error("Token refresh error:", error);
      clearSession();
      return false;
    }
  };

  /**
   * Verify token validity
   * @param {string} token
   * @returns {Promise<boolean>}
   */
  const verifyToken = async (token) => {
    try {
      const response = await fetch("/api/v1/auth/verify", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error("Token verification error:", error);
      return false;
    }
  };

  /**
   * Setup session timeout
   */
  const setupSessionTimeout = () => {
    clearTimeout(sessionTimer);
    sessionTimer = setTimeout(() => {
      if (window.GVETNotifications) {
        window.GVETNotifications.show(
          "Session expired. Please login again.",
          "warning",
        );
      }
      logout();
    }, CONFIG.sessionTimeout);
  };

  /**
   * Clear session data
   */
  const clearSession = () => {
    localStorage.removeItem(CONFIG.tokenKey);
    localStorage.removeItem(CONFIG.refreshTokenKey);
    localStorage.removeItem(CONFIG.userKey);
    clearTimeout(sessionTimer);
  };

  /**
   * Restore session UI
   */
  const restoreSession = () => {
    const user = JSON.parse(localStorage.getItem(CONFIG.userKey) || "{}");
    if (user.fullName) {
      const userElements = document.querySelectorAll("[data-user-name]");
      userElements.forEach((el) => {
        el.textContent = user.fullName;
      });
    }
  };

  /**
   * Get current access token
   * @returns {string|null}
   */
  const getToken = () => {
    return localStorage.getItem(CONFIG.tokenKey);
  };

  /**
   * Get current user
   * @returns {object|null}
   */
  const getCurrentUser = () => {
    const userStr = localStorage.getItem(CONFIG.userKey);
    return userStr ? JSON.parse(userStr) : null;
  };

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  const isAuthenticated = () => {
    return (
      !!localStorage.getItem(CONFIG.tokenKey) &&
      !!localStorage.getItem(CONFIG.userKey)
    );
  };

  /**
   * Attach event listeners
   */
  const attachEventListeners = () => {
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", handleLoginSubmit);
    }

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", logout);
    }
  };

  /**
   * Handle login form submission
   */
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const username = document
      .getElementById("username")
      ?.value.toLowerCase()
      .trim();
    const password = document.getElementById("password")?.value;

    if (!username || !password) {
      if (window.GVETNotifications) {
        window.GVETNotifications.show(
          "Please enter username and password",
          "error",
        );
      }
      return;
    }

    const loginBtn = e.target.querySelector('button[type="submit"]');
    const originalText = loginBtn.innerHTML;
    loginBtn.disabled = true;
    loginBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin mr-2"></i>Logging in...';

    const success = await login(username, password);

    if (success) {
      setTimeout(() => {
        window.location.href = "/dashboard-main.html";
      }, 500);
    } else {
      loginBtn.disabled = false;
      loginBtn.innerHTML = originalText;
    }
  };

  // Public API
  return {
    init,
    login,
    logout,
    checkExistingSession,
    refreshToken,
    getToken,
    getCurrentUser,
    isAuthenticated,
  };
})();

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  GVETAuth.init();
});
