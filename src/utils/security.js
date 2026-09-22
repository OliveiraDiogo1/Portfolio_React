import CryptoJS from 'crypto-js';

const requestCounts = new Map();
const blockedIPs = new Set();

const SECURITY_CONFIG = {
  MAX_REQUESTS_PER_MINUTE: parseInt(import.meta.env.VITE_MAX_REQUESTS_PER_MINUTE) || 5,
  ALLOWED_ORIGINS: (import.meta.env.VITE_ALLOWED_ORIGINS || '').split(',').filter(Boolean),
  RECAPTCHA_ENABLED: !!import.meta.env.VITE_RECAPTCHA_SITE_KEY,
  BLOCK_DURATION_MS: 300000,
};

export const checkRateLimit = (identifier) => {
  const now = Date.now();
  const oneMinuteAgo = now - 60000;
  
  if (requestCounts.has(identifier)) {
    const requests = requestCounts.get(identifier).filter(time => time > oneMinuteAgo);
    if (requests.length === 0) {
      requestCounts.delete(identifier);
    } else {
      requestCounts.set(identifier, requests);
    }
  }
  
  if (blockedIPs.has(identifier)) {
    return { allowed: false, code: 'rateLimited' };
  }

  const currentRequests = requestCounts.get(identifier) || [];

  if (currentRequests.length >= SECURITY_CONFIG.MAX_REQUESTS_PER_MINUTE) {
    blockedIPs.add(identifier);
    setTimeout(() => blockedIPs.delete(identifier), SECURITY_CONFIG.BLOCK_DURATION_MS);
    return { allowed: false, code: 'rateLimited' };
  }
  
  currentRequests.push(now);
  requestCounts.set(identifier, currentRequests);
  
  return { allowed: true };
};

export const validateAndSanitizeInput = (data) => {
  const errors = [];
  const sanitized = {};
  
  if (data.name) {
    const name = data.name.trim();
    if (name.length < 2 || name.length > 50) {
      errors.push({ field: 'name', code: 'nameLength' });
    } else if (!/^[\p{L}\p{M}\s\-'’]+$/u.test(name)) {
      errors.push({ field: 'name', code: 'nameChars' });
    } else {
      sanitized.name = name;
    }
  } else {
    errors.push({ field: 'name', code: 'nameRequired' });
  }
  
  if (data.email) {
    const email = data.email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push({ field: 'email', code: 'emailInvalid' });
    } else if (email.length > 254) {
      errors.push({ field: 'email', code: 'emailLength' });
    } else {
      sanitized.email = email;
    }
  } else {
    errors.push({ field: 'email', code: 'emailRequired' });
  }
  
  if (data.message) {
    const message = data.message.trim();
    if (message.length < 10) {
      errors.push({ field: 'message', code: 'messageLength' });
    } else if (message.length > 2000) {
      errors.push({ field: 'message', code: 'messageMax' });
    } else {
      const sanitizedMessage = message
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
      sanitized.message = sanitizedMessage;
    }
  } else {
    errors.push({ field: 'message', code: 'messageRequired' });
  }
  
  return { errors, sanitized };
};

export const generateIdentifier = (userData) => {
  const { email, name } = userData;
  const userAgent = navigator.userAgent;
  const timestamp = Math.floor(Date.now() / 60000);
  
  const dataString = `${email}-${name}-${userAgent}-${timestamp}`;
  return CryptoJS.SHA256(dataString).toString();
};

export const validateOrigin = () => {
  if (SECURITY_CONFIG.ALLOWED_ORIGINS.length === 0) {
    return true;
  }
  
  const currentOrigin = window.location.origin;
  return SECURITY_CONFIG.ALLOWED_ORIGINS.includes(currentOrigin);
};

export const logSecurityEvent = (event, details) => {
  console.warn(`Security Event: ${event}`, details);
};

export const validateRecaptcha = async (token) => {
  if (!SECURITY_CONFIG.RECAPTCHA_ENABLED) {
    return true;
  }
  
  try {
    return !!token;
  } catch (error) {
    logSecurityEvent('RECAPTCHA_VALIDATION_ERROR', error);
    return false;
  }
}; 