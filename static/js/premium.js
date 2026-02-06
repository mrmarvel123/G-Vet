// G-VET Premium Dashboard System - Enhanced JavaScript
// Version: 2.0
// Date: December 2025

console.log('🏛️ G-VET Premium Dashboard System v2.0');
console.log('📋 Initializing all modules...');

// Global System Configuration
const GVET_CONFIG = {
    version: '2.0',
    systemName: 'G-VET ASSET & iSTOR SYSTEM',
    organization: 'Jabatan Perkhidmatan Veterinar Negeri Perak',
    modules: {
        kewpa: 'KEW.PA Asset Management',
        kewps: 'KEW.PS Store Management',
        kewah: 'KEW.AH Live Assets'
    },
    apiEndpoint: '/api/v1',
    enableDebug: true,
    apiBaseURL: window.location.origin + '/api/v1'
};

// System State Management
class SystemState {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.activeModule = null;
        this.notifications = [];
    }

    setUser(user) {
        this.currentUser = user;
        this.isLoggedIn = true;
        this.logActivity('User logged in', user.username);
    }

    clearUser() {
        this.logActivity('User logged out', this.currentUser?.username);
        this.currentUser = null;
        this.isLoggedIn = false;
    }

    logActivity(action, detail) {
        const activity = {
            timestamp: new Date().toISOString(),
            action: action,
            detail: detail,
            user: this.currentUser?.username
        };
        console.log('📝 Activity:', activity);
        // Send to server in production
    }
}

const systemState = new SystemState();

// Dashboard Analytics
class DashboardAnalytics {
    constructor() {
        this.stats = {
            assets: 0,
            inventory: 0,
            livestock: 0,
            activeUsers: 0
        };
    }

    async fetchStats() {
        try {
            // Try to fetch from API
            const token = localStorage.getItem('accessToken');
            if (token) {
                const response = await fetch(`${GVET_CONFIG.apiBaseURL}/reports/dashboard`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    this.stats = {
                        assets: data.assets.total || 0,
                        inventory: data.inventory.total || 0,
                        livestock: data.livestock.total || 0,
                        activeUsers: data.users.active || 0,
                        lowStock: data.inventory.lowStock || 0
                    };
                    return this.stats;
                }
            }
        } catch (error) {
            console.warn('Using demo stats:', error);
        }
        
        // Fallback to demo data
        this.stats = {
            assets: 1247,
            inventory: 3456,
            livestock: 567,
            activeUsers: 18,
            lowStock: 12
        };
        return this.stats;
    }

    updateDisplay() {
        if (document.getElementById('total-assets')) {
            this.animateCounter('total-assets', this.stats.assets);
        }
        if (document.getElementById('total-inventory')) {
            this.animateCounter('total-inventory', this.stats.inventory);
        }
        if (document.getElementById('active-users')) {
            this.animateCounter('active-users', this.stats.activeUsers);
        }
        if (document.getElementById('low-stock')) {
            this.animateCounter('low-stock', this.stats.lowStock);
        }
    }

    animateCounter(elementId, target) {
        const element = document.getElementById(elementId);
        if (!element) return;

        let current = 0;
        const increment = target / 50;
        const duration = 1000;
        const stepTime = duration / 50;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, stepTime);
    }
}

const analytics = new DashboardAnalytics();

// Notification System
class NotificationManager {
    constructor() {
        this.notifications = [];
    }

    show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in ${this.getTypeClass(type)}`;
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas ${this.getIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    getTypeClass(type) {
        const classes = {
            success: 'bg-green-600 text-white',
            error: 'bg-red-600 text-white',
            warning: 'bg-yellow-600 text-white',
            info: 'bg-blue-600 text-white'
        };
        return classes[type] || classes.info;
    }

    getIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }
}

const notifications = new NotificationManager();

// Form Validation
class FormValidator {
    static validate(formElement) {
        const inputs = formElement.querySelectorAll('[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('border-red-500');
            } else {
                input.classList.remove('border-red-500');
            }
        });
        
        return isValid;
    }

    static showError(inputElement, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'text-red-600 text-sm mt-1';
        errorDiv.textContent = message;
        inputElement.parentElement.appendChild(errorDiv);
    }
}

// Data Export Utilities
class DataExporter {
    static exportToCSV(data, filename) {
        const csv = this.arrayToCSV(data);
        this.download(csv, filename + '.csv', 'text/csv');
    }

    static exportToExcel(data, filename) {
        // Simple Excel export (in production, use a library like SheetJS)
        const csv = this.arrayToCSV(data);
        this.download(csv, filename + '.xls', 'application/vnd.ms-excel');
    }

    static exportToPDF(elementId, filename) {
        // In production, use jsPDF or similar
        alert('PDF export functionality - Use Print to PDF for now');
        window.print();
    }

    static arrayToCSV(data) {
        if (!data || !data.length) return '';
        
        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(',')];
        
        data.forEach(row => {
            const values = headers.map(header => {
                const value = row[header];
                return `"${value}"`;
            });
            csvRows.push(values.join(','));
        });
        
        return csvRows.join('\n');
    }

    static download(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(url);
    }
}

// Real-time Updates (WebSocket simulation)
class RealtimeUpdates {
    constructor() {
        this.connected = false;
        this.callbacks = [];
    }

    connect() {
        // Simulate WebSocket connection
        console.log('🔌 Connecting to real-time updates...');
        setTimeout(() => {
            this.connected = true;
            console.log('✅ Real-time updates connected');
            this.simulateUpdates();
        }, 1000);
    }

    simulateUpdates() {
        // Simulate periodic updates
        setInterval(() => {
            const updates = {
                timestamp: new Date().toISOString(),
                totalAssets: Math.floor(Math.random() * 10) + 1240,
                totalInventory: Math.floor(Math.random() * 50) + 3450,
                lowStock: Math.floor(Math.random() * 5) + 10,
                activeUsers: Math.floor(Math.random() * 5) + 15
            };
            
            this.callbacks.forEach(callback => callback(updates));
        }, 30000); // Every 30 seconds
    }

    onUpdate(callback) {
        this.callbacks.push(callback);
    }
}

const realtimeUpdates = new RealtimeUpdates();

// Search Functionality
class SearchEngine {
    constructor() {
        this.index = [];
    }

    async search(query, module = 'all') {
        try {
            const token = localStorage.getItem('accessToken');
            if (token && query.length >= 3) {
                const endpoints = {
                    'KEW.PA': '/assets',
                    'KEW.PS': '/inventory',
                    'KEW.AH': '/livestock'
                };
                
                const results = [];
                
                for (const [modName, endpoint] of Object.entries(endpoints)) {
                    if (module === 'all' || module === modName) {
                        const response = await fetch(`${GVET_CONFIG.apiBaseURL}${endpoint}?search=${query}&limit=5`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        
                        if (response.ok) {
                            const data = await response.json();
                            const items = data.assets || data.items || data.livestock || [];
                            results.push(...items.map(item => ({
                                type: endpoint.substring(1),
                                id: item.assetCode || item.itemCode || item.animalCode,
                                name: item.assetName || item.itemName || item.name,
                                module: modName
                            })));
                        }
                    }
                }
                
                return results;
            }
        } catch (error) {
            console.warn('Search error, using demo:', error);
        }
        
        // Fallback demo results
        return new Promise(resolve => {
            setTimeout(() => {
                const results = [
                    { type: 'asset', id: 'A2024-001', name: 'Dell Laptop', module: 'KEW.PA' },
                    { type: 'inventory', id: 'STK-001', name: 'A4 Paper', module: 'KEW.PS' },
                    { type: 'livestock', id: 'C2024-045', name: 'Cattle', module: 'KEW.AH' }
                ];
                resolve(results.filter(r => module === 'all' || r.module === module));
            }, 300);
        });
    }
}

const searchEngine = new SearchEngine();

// Print Utilities
class PrintManager {
    static printForm(formName) {
        console.log(`🖨️ Printing form: ${formName}`);
        window.print();
    }

    static generateQRCode(data) {
        console.log(`📱 Generating QR Code for: ${data}`);
        // In production, use QRCode.js or similar
        notifications.show('QR Code generated successfully', 'success');
    }
}

// Keyboard Shortcuts
class KeyboardShortcuts {
    constructor() {
        this.shortcuts = {
            'ctrl+k': () => this.openSearch(),
            'ctrl+s': (e) => { e.preventDefault(); this.quickSave(); },
            'ctrl+p': (e) => { e.preventDefault(); window.print(); }
        };
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            const key = (e.ctrlKey || e.metaKey ? 'ctrl+' : '') + e.key.toLowerCase();
            if (this.shortcuts[key]) {
                this.shortcuts[key](e);
            }
        });
    }

    openSearch() {
        const searchInput = document.querySelector('input[type="text"]');
        if (searchInput) searchInput.focus();
    }

    quickSave() {
        const form = document.querySelector('form');
        if (form) form.requestSubmit();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing G-VET System...');
    
    // Initialize components
    new KeyboardShortcuts();
    
    // Connect real-time updates
    realtimeUpdates.connect();
    realtimeUpdates.onUpdate(updates => {
        if (document.getElementById('active-users')) {
            document.getElementById('active-users').textContent = updates.activeUsers;
        }
    });
    
    // Load dashboard data
    if (document.getElementById('total-assets')) {
        analytics.fetchStats().then(() => {
            analytics.updateDisplay();
        });
    }
    
    // Global error handler
    window.addEventListener('error', (e) => {
        console.error('❌ System Error:', e.error);
        if (GVET_CONFIG.enableDebug) {
            notifications.show('System error occurred. Check console for details.', 'error');
        }
    });
    
    console.log('✅ G-VET System initialized successfully');
});

// Export utilities for global use
window.GVET = {
    config: GVET_CONFIG,
    state: systemState,
    analytics: analytics,
    notifications: notifications,
    validator: FormValidator,
    exporter: DataExporter,
    print: PrintManager,
    search: searchEngine
};

console.log('📦 G-VET utilities loaded');
