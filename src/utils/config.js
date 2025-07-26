// Security and configuration settings
export const CONFIG = {
  // EmailJS Configuration
  EMAILJS: {
    PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID,
    TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  },
  
  // Security Configuration
  SECURITY: {
    RECAPTCHA_SITE_KEY: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
    MAX_REQUESTS_PER_MINUTE: parseInt(import.meta.env.VITE_MAX_REQUESTS_PER_MINUTE) || 5,
    ALLOWED_ORIGINS: (import.meta.env.VITE_ALLOWED_ORIGINS || '').split(',').filter(Boolean),
  },
  
  // API Configuration
  API: {
    BASE_URL: import.meta.env.VITE_API_BASE_URL,
  },
  
  // Environment
  ENV: import.meta.env.MODE,
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,
};

// Validation functions for configuration
export const validateConfig = () => {
  const errors = [];
  
  // Check EmailJS configuration
  if (!CONFIG.EMAILJS.PUBLIC_KEY || CONFIG.EMAILJS.PUBLIC_KEY === 'your_emailjs_public_key_here') {
    errors.push('EmailJS public key not configured');
  }
  
  if (!CONFIG.EMAILJS.SERVICE_ID || CONFIG.EMAILJS.SERVICE_ID === 'your_emailjs_service_id_here') {
    errors.push('EmailJS service ID not configured');
  }
  
  if (!CONFIG.EMAILJS.TEMPLATE_ID || CONFIG.EMAILJS.TEMPLATE_ID === 'your_emailjs_template_id_here') {
    errors.push('EmailJS template ID not configured');
  }
  
  return errors;
};

// Security headers configuration
export const SECURITY_HEADERS = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.emailjs.com; frame-src https://www.google.com/recaptcha/;",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = {
  WINDOW_MS: 60000, // 1 minute
  MAX_REQUESTS: CONFIG.SECURITY.MAX_REQUESTS_PER_MINUTE,
  BLOCK_DURATION_MS: 300000, // 5 minutes
};

// Input validation rules
export const VALIDATION_RULES = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z\s\-']+$/,
  },
  EMAIL: {
    MAX_LENGTH: 254,
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  MESSAGE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 2000,
  },
};

// Error messages
export const ERROR_MESSAGES = {
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',
  INVALID_INPUT: 'Please check your input and try again.',
  EMAIL_SEND_FAILED: 'Failed to send email. Please try again.',
  RECAPTCHA_REQUIRED: 'Please complete the reCAPTCHA verification.',
  ORIGIN_NOT_ALLOWED: 'Request not allowed from this origin.',
  CONFIGURATION_ERROR: 'Service not properly configured.',
}; 