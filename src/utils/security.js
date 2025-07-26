import CryptoJS from 'crypto-js';

// Rate limiting storage
const requestCounts = new Map();
const blockedIPs = new Set();
const suspiciousActivities = new Map();

// Security configuration
const SECURITY_CONFIG = {
  MAX_REQUESTS_PER_MINUTE: parseInt(import.meta.env.VITE_MAX_REQUESTS_PER_MINUTE) || 5,
  ALLOWED_ORIGINS: (import.meta.env.VITE_ALLOWED_ORIGINS || '').split(',').filter(Boolean),
  RECAPTCHA_ENABLED: !!import.meta.env.VITE_RECAPTCHA_SITE_KEY,
  MAX_SUSPICIOUS_ACTIVITIES: 10,
  BLOCK_DURATION_MS: 300000, // 5 minutes
  SESSION_TIMEOUT_MS: 1800000, // 30 minutes
};

// Generate CSRF token
export const generateCSRFToken = () => {
  return CryptoJS.lib.WordArray.random(32).toString();
};

// Validate CSRF token
export const validateCSRFToken = (token, storedToken) => {
  return token === storedToken;
};

/**
 * Enhanced rate limiting with suspicious activity detection
 */
export const checkRateLimit = (identifier) => {
  const now = Date.now();
  const oneMinuteAgo = now - 60000;
  
  // Clean old entries
  if (requestCounts.has(identifier)) {
    const requests = requestCounts.get(identifier).filter(time => time > oneMinuteAgo);
    if (requests.length === 0) {
      requestCounts.delete(identifier);
    } else {
      requestCounts.set(identifier, requests);
    }
  }
  
  // Check if IP is blocked
  if (blockedIPs.has(identifier)) {
    logSecurityEvent('BLOCKED_IP_ACCESS', { identifier, timestamp: now });
    return { allowed: false, reason: 'IP blocked due to excessive requests' };
  }
  
  // Get current requests for this identifier
  const currentRequests = requestCounts.get(identifier) || [];
  
  // Check rate limit
  if (currentRequests.length >= SECURITY_CONFIG.MAX_REQUESTS_PER_MINUTE) {
    blockedIPs.add(identifier);
    setTimeout(() => blockedIPs.delete(identifier), SECURITY_CONFIG.BLOCK_DURATION_MS);
    logSecurityEvent('RATE_LIMIT_EXCEEDED', { identifier, requests: currentRequests.length });
    return { allowed: false, reason: 'Rate limit exceeded' };
  }
  
  // Add current request
  currentRequests.push(now);
  requestCounts.set(identifier, currentRequests);
  
  return { allowed: true };
};

/**
 * Enhanced input validation and sanitization with advanced protection
 */
export const validateAndSanitizeInput = (data) => {
  const errors = [];
  const sanitized = {};
  
  // Name validation with enhanced security
  if (data.name) {
    const name = data.name.trim();
    if (name.length < 2 || name.length > 50) {
      errors.push('Name must be between 2 and 50 characters');
    } else if (!/^[a-zA-Z\s\-']+$/.test(name)) {
      errors.push('Name contains invalid characters');
    } else if (name.toLowerCase().includes('script') || name.toLowerCase().includes('javascript')) {
      errors.push('Name contains suspicious content');
    } else {
      sanitized.name = name;
    }
  } else {
    errors.push('Name is required');
  }
  
  // Email validation with enhanced security
  if (data.email) {
    const email = data.email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Please enter a valid email address');
    } else if (email.length > 254) {
      errors.push('Email address is too long');
    } else if (email.includes('javascript:') || email.includes('data:')) {
      errors.push('Email contains suspicious content');
    } else {
      sanitized.email = email;
    }
  } else {
    errors.push('Email address is required');
  }
  
  // Message validation with enhanced XSS protection
  if (data.message) {
    const message = data.message.trim();
    if (message.length < 10) {
      errors.push('Message must be at least 10 characters long');
    } else if (message.length > 2000) {
      errors.push('Message is too long (maximum 2000 characters)');
    } else {
      // Enhanced XSS protection
      const suspiciousPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /data:text\/html/gi,
        /vbscript:/gi,
        /on\w+\s*=/gi,
        /expression\s*\(/gi,
        /url\s*\(/gi,
        /eval\s*\(/gi,
        /document\./gi,
        /window\./gi,
        /location\./gi,
        /alert\s*\(/gi,
        /confirm\s*\(/gi,
        /prompt\s*\(/gi
      ];
      
      const hasSuspiciousContent = suspiciousPatterns.some(pattern => pattern.test(message));
      if (hasSuspiciousContent) {
        errors.push('Message contains suspicious content');
        logSecurityEvent('XSS_ATTEMPT', { message: message.substring(0, 100) });
      } else {
        // Sanitize message
        const sanitizedMessage = message
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
          .replace(/&/g, '&amp;');
        sanitized.message = sanitizedMessage;
      }
    }
  } else {
    errors.push('Message is required');
  }
  
  return { errors, sanitized };
};

/**
 * Generate a unique identifier for rate limiting with enhanced security
 */
export const generateIdentifier = (userData) => {
  const { email, name } = userData;
  const userAgent = navigator.userAgent;
  const timestamp = Math.floor(Date.now() / 60000); // Round to minute
  const screenResolution = `${screen.width}x${screen.height}`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Create a more robust hash for rate limiting
  const dataString = `${email}-${name}-${userAgent}-${timestamp}-${screenResolution}-${timezone}`;
  return CryptoJS.SHA256(dataString).toString();
};

/**
 * Enhanced origin validation
 */
export const validateOrigin = () => {
  if (SECURITY_CONFIG.ALLOWED_ORIGINS.length === 0) {
    return true; // No restrictions set
  }
  
  const currentOrigin = window.location.origin;
  const isValid = SECURITY_CONFIG.ALLOWED_ORIGINS.includes(currentOrigin);
  
  if (!isValid) {
    logSecurityEvent('INVALID_ORIGIN', { 
      currentOrigin, 
      allowedOrigins: SECURITY_CONFIG.ALLOWED_ORIGINS 
    });
  }
  
  return isValid;
};

/**
 * Enhanced security headers
 */
export const getSecurityHeaders = () => {
  return {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://api.emailjs.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.emailjs.com; frame-src https://www.google.com/recaptcha/; object-src 'none'; base-uri 'self'; form-action 'self';",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'X-DNS-Prefetch-Control': 'off',
    'X-Download-Options': 'noopen',
    'X-Permitted-Cross-Domain-Policies': 'none'
  };
};

/**
 * Enhanced security event logging
 */
export const logSecurityEvent = (event, details) => {
  const timestamp = new Date().toISOString();
  const eventData = {
    event,
    details,
    timestamp,
    userAgent: navigator.userAgent,
    origin: window.location.origin,
    url: window.location.href
  };
  
  console.warn(`Security Event: ${event}`, eventData);
  
  // Track suspicious activities
  const key = `${event}_${details?.identifier || 'unknown'}`;
  const currentCount = suspiciousActivities.get(key) || 0;
  suspiciousActivities.set(key, currentCount + 1);
  
  // Block if too many suspicious activities
  if (currentCount >= SECURITY_CONFIG.MAX_SUSPICIOUS_ACTIVITIES) {
    logSecurityEvent('SUSPICIOUS_ACTIVITY_THRESHOLD_EXCEEDED', { key, count: currentCount });
  }
  
  // In production, you might want to send this to a logging service
  // Example: sendToLoggingService(eventData);
};

/**
 * Enhanced reCAPTCHA validation
 */
export const validateRecaptcha = async (token) => {
  if (!SECURITY_CONFIG.RECAPTCHA_ENABLED) {
    return true; // Skip if not enabled
  }
  
  try {
    // Basic token validation
    if (!token || token.length < 10) {
      logSecurityEvent('INVALID_RECAPTCHA_TOKEN', { tokenLength: token?.length });
      return false;
    }
    
    // In a real implementation, you would verify the token with Google's servers
    // For now, we'll just check if the token exists and has proper format
    return !!token;
  } catch (error) {
    logSecurityEvent('RECAPTCHA_VALIDATION_ERROR', error);
    return false;
  }
};

/**
 * Encrypt sensitive data before sending
 */
export const encryptData = (data, key) => {
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
  } catch (error) {
    logSecurityEvent('ENCRYPTION_ERROR', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypt sensitive data
 */
export const decryptData = (encryptedData, key) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    logSecurityEvent('DECRYPTION_ERROR', error);
    throw new Error('Failed to decrypt data');
  }
};

/**
 * Session management and timeout
 */
export const createSecureSession = () => {
  const sessionId = CryptoJS.lib.WordArray.random(32).toString();
  const expiresAt = Date.now() + SECURITY_CONFIG.SESSION_TIMEOUT_MS;
  
  return {
    sessionId,
    expiresAt,
    isValid: () => Date.now() < expiresAt
  };
};

/**
 * Validate session
 */
export const validateSession = (session) => {
  if (!session || !session.isValid()) {
    logSecurityEvent('INVALID_SESSION', { session });
    return false;
  }
  return true;
};

/**
 * Sanitize URLs to prevent open redirect attacks
 */
export const sanitizeUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const allowedProtocols = ['http:', 'https:'];
    const allowedDomains = ['yourdomain.com', 'www.yourdomain.com', 'localhost'];
    
    if (!allowedProtocols.includes(urlObj.protocol)) {
      return null;
    }
    
    if (!allowedDomains.some(domain => urlObj.hostname.includes(domain))) {
      return null;
    }
    
    return url;
  } catch (error) {
    logSecurityEvent('INVALID_URL', { url, error: error.message });
    return null;
  }
}; 