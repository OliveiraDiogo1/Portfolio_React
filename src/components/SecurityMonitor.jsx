import React, { useEffect, useState } from 'react';
import { logSecurityEvent } from '../utils/security';

const SecurityMonitor = () => {
    const [securityEvents, setSecurityEvents] = useState([]);
    const [isMonitoring, setIsMonitoring] = useState(true);

    useEffect(() => {
        if (!isMonitoring) return;

        // Monitor for various security events
        const securityChecks = {
            // Monitor for console access attempts
            consoleAccess: () => {
                const originalConsole = { ...console };
                Object.keys(console).forEach(key => {
                    console[key] = (...args) => {
                        logSecurityEvent('CONSOLE_ACCESS_ATTEMPT', {
                            method: key,
                            args: args.map(arg => typeof arg === 'string' ? arg.substring(0, 100) : typeof arg)
                        });
                        originalConsole[key].apply(console, args);
                    };
                });
            },

            // Monitor for keyboard events (potential keyloggers)
            keyboardMonitoring: () => {
                let suspiciousKeyCount = 0;
                const suspiciousKeys = ['F12', 'F5', 'Ctrl+Shift+I', 'Ctrl+U', 'Ctrl+Shift+C'];
                
                document.addEventListener('keydown', (e) => {
                    const keyCombo = [
                        e.ctrlKey ? 'Ctrl+' : '',
                        e.shiftKey ? 'Shift+' : '',
                        e.altKey ? 'Alt+' : '',
                        e.key
                    ].join('');
                    
                    if (suspiciousKeys.includes(keyCombo)) {
                        suspiciousKeyCount++;
                        logSecurityEvent('SUSPICIOUS_KEY_COMBO', {
                            keyCombo,
                            count: suspiciousKeyCount,
                            timestamp: new Date().toISOString()
                        });
                    }
                });
            },

            // Monitor for mouse events (potential clickjacking)
            mouseMonitoring: () => {
                let rapidClicks = 0;
                let lastClickTime = 0;
                
                document.addEventListener('click', (e) => {
                    const now = Date.now();
                    if (now - lastClickTime < 100) {
                        rapidClicks++;
                        if (rapidClicks > 10) {
                            logSecurityEvent('RAPID_CLICKING_DETECTED', {
                                count: rapidClicks,
                                timestamp: new Date().toISOString()
                            });
                        }
                    } else {
                        rapidClicks = 0;
                    }
                    lastClickTime = now;
                });
            },

            // Monitor for network requests
            networkMonitoring: () => {
                const originalFetch = window.fetch;
                window.fetch = (...args) => {
                    const url = args[0];
                    if (typeof url === 'string' && !url.includes('api.emailjs.com') && !url.includes('localhost')) {
                        logSecurityEvent('SUSPICIOUS_NETWORK_REQUEST', {
                            url: url.substring(0, 100),
                            timestamp: new Date().toISOString()
                        });
                    }
                    return originalFetch.apply(window, args);
                };
            },

            // Monitor for DOM manipulation attempts
            domMonitoring: () => {
                const originalCreateElement = document.createElement;
                document.createElement = function(tagName) {
                    if (tagName.toLowerCase() === 'script') {
                        logSecurityEvent('SCRIPT_CREATION_ATTEMPT', {
                            timestamp: new Date().toISOString()
                        });
                    }
                    return originalCreateElement.call(document, tagName);
                };
            },

            // Monitor for localStorage/sessionStorage access
            storageMonitoring: () => {
                const originalSetItem = localStorage.setItem;
                const originalGetItem = localStorage.getItem;
                
                localStorage.setItem = function(key, value) {
                    if (key.includes('token') || key.includes('auth') || key.includes('session')) {
                        logSecurityEvent('SENSITIVE_STORAGE_ACCESS', {
                            type: 'setItem',
                            key: key.substring(0, 20),
                            timestamp: new Date().toISOString()
                        });
                    }
                    return originalSetItem.call(localStorage, key, value);
                };
                
                localStorage.getItem = function(key) {
                    if (key.includes('token') || key.includes('auth') || key.includes('session')) {
                        logSecurityEvent('SENSITIVE_STORAGE_ACCESS', {
                            type: 'getItem',
                            key: key.substring(0, 20),
                            timestamp: new Date().toISOString()
                        });
                    }
                    return originalGetItem.call(localStorage, key);
                };
            },

            // Monitor for iframe creation (potential clickjacking)
            iframeMonitoring: () => {
                const originalCreateElement = document.createElement;
                document.createElement = function(tagName) {
                    if (tagName.toLowerCase() === 'iframe') {
                        logSecurityEvent('IFRAME_CREATION_ATTEMPT', {
                            timestamp: new Date().toISOString()
                        });
                    }
                    return originalCreateElement.call(document, tagName);
                };
            },

            // Monitor for clipboard access
            clipboardMonitoring: () => {
                document.addEventListener('copy', (e) => {
                    logSecurityEvent('CLIPBOARD_COPY_ATTEMPT', {
                        timestamp: new Date().toISOString()
                    });
                });
                
                document.addEventListener('paste', (e) => {
                    logSecurityEvent('CLIPBOARD_PASTE_ATTEMPT', {
                        timestamp: new Date().toISOString()
                    });
                });
            },

            // Monitor for window events
            windowMonitoring: () => {
                window.addEventListener('beforeunload', () => {
                    logSecurityEvent('PAGE_UNLOAD_ATTEMPT', {
                        timestamp: new Date().toISOString()
                    });
                });
                
                window.addEventListener('resize', () => {
                    logSecurityEvent('WINDOW_RESIZE', {
                        width: window.innerWidth,
                        height: window.innerHeight,
                        timestamp: new Date().toISOString()
                    });
                });
            }
        };

        // Initialize all security monitors
        Object.values(securityChecks).forEach(check => {
            try {
                check();
            } catch (error) {
                logSecurityEvent('SECURITY_MONITOR_ERROR', {
                    error: error.message,
                    timestamp: new Date().toISOString()
                });
            }
        });

        // Log successful security monitoring start
        logSecurityEvent('SECURITY_MONITORING_STARTED', {
            timestamp: new Date().toISOString()
        });

        return () => {
            setIsMonitoring(false);
            logSecurityEvent('SECURITY_MONITORING_STOPPED', {
                timestamp: new Date().toISOString()
            });
        };
    }, [isMonitoring]);

    // This component doesn't render anything visible
    return null;
};

export default SecurityMonitor; 