# 🔒 Security Setup Guide

This guide will help you secure your portfolio website against spam, bots, and attacks.

## 📋 Prerequisites

- EmailJS account
- Google reCAPTCHA account
- Domain name (for production)

## 🚀 Step-by-Step Setup

### 1. Environment Variables Setup

Create a `.env` file in your project root (this file is already in .gitignore):

```bash
# EmailJS Configuration
VITE_EMAILJS_PUBLIC_KEY=your_actual_emailjs_public_key
VITE_EMAILJS_SERVICE_ID=your_actual_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_actual_emailjs_template_id

# Security Configuration
VITE_RECAPTCHA_SITE_KEY=your_actual_recaptcha_site_key
VITE_MAX_REQUESTS_PER_MINUTE=5
VITE_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# API Configuration (if needed)
VITE_API_BASE_URL=https://your-api-endpoint.com
```

### 2. EmailJS Setup

1. **Create EmailJS Account**
   - Go to [EmailJS.com](https://www.emailjs.com/)
   - Sign up and verify your email
   - Get your Public Key from Account → API Keys

2. **Create Email Service**
   - Go to Email Services → Add New Service
   - Choose your email provider (Gmail, Outlook, etc.)
   - Connect your email account
   - Note down the Service ID

3. **Create Email Template**
   - Go to Email Templates → Create New Template
   - Use this template:

```html
Subject: New Contact Form Message from {{from_name}}

Hello {{to_name}},

You have received a new message from your portfolio website:

Name: {{from_name}}
Email: {{from_email}}
Timestamp: {{timestamp}}
Origin: {{origin}}
User Agent: {{user_agent}}

Message:
{{message}}

Best regards,
Your Portfolio Contact Form
```

4. **Update Environment Variables**
   - Replace the EmailJS placeholders in your `.env` file

### 3. Google reCAPTCHA Setup

1. **Create reCAPTCHA Account**
   - Go to [Google reCAPTCHA](https://www.google.com/recaptcha/admin)
   - Sign in with your Google account
   - Click "Create" to add a new site

2. **Configure reCAPTCHA**
   - Choose "reCAPTCHA v2" → "I'm not a robot" Checkbox
   - Add your domain(s):
     - `localhost` (for development)
     - `yourdomain.com` (for production)
   - Get your Site Key and Secret Key

3. **Update Environment Variables**
   - Add your reCAPTCHA Site Key to `.env`

### 4. Security Features Enabled

✅ **Rate Limiting**: 5 requests per minute per user
✅ **Input Validation**: Sanitizes and validates all inputs
✅ **XSS Protection**: Prevents cross-site scripting attacks
✅ **reCAPTCHA**: Bot protection
✅ **Origin Validation**: Restricts requests to allowed domains
✅ **Error Logging**: Tracks security events
✅ **Environment Variables**: Keeps sensitive data secure

### 5. Production Deployment Security

#### For Netlify:
```bash
# Add these environment variables in Netlify dashboard
VITE_EMAILJS_PUBLIC_KEY=your_key
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_key
VITE_MAX_REQUESTS_PER_MINUTE=5
VITE_ALLOWED_ORIGINS=https://yourdomain.com
```

#### For Vercel:
```bash
# Add these environment variables in Vercel dashboard
VITE_EMAILJS_PUBLIC_KEY=your_key
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_key
VITE_MAX_REQUESTS_PER_MINUTE=5
VITE_ALLOWED_ORIGINS=https://yourdomain.com
```

### 6. Additional Security Measures

#### Content Security Policy (CSP)
The app includes a strict CSP that:
- Prevents XSS attacks
- Restricts resource loading
- Allows only necessary external resources

#### Security Headers
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

#### Input Sanitization
- Removes HTML tags from messages
- Validates email format
- Limits input lengths
- Prevents SQL injection

### 7. Monitoring and Logging

The app logs security events including:
- Rate limit violations
- Failed form submissions
- Configuration errors
- Successful submissions

### 8. Testing Security Features

1. **Test Rate Limiting**
   - Submit the form 6 times quickly
   - Should be blocked after 5 attempts

2. **Test Input Validation**
   - Try submitting with invalid email
   - Try submitting with HTML in message
   - Try submitting with very long inputs

3. **Test reCAPTCHA**
   - Form should be disabled until reCAPTCHA is completed

### 9. Troubleshooting

#### Common Issues:

1. **"Email service not configured"**
   - Check your `.env` file
   - Ensure EmailJS credentials are correct

2. **"reCAPTCHA not working"**
   - Verify your reCAPTCHA site key
   - Check domain configuration in Google reCAPTCHA

3. **"Rate limit exceeded"**
   - Wait 5 minutes before trying again
   - This is working as intended

4. **"Request not allowed from this origin"**
   - Add your domain to `VITE_ALLOWED_ORIGINS`
   - For development, leave it empty

### 10. Security Best Practices

✅ **Never commit `.env` files**
✅ **Use HTTPS in production**
✅ **Regularly update dependencies**
✅ **Monitor security logs**
✅ **Use strong passwords for services**
✅ **Enable 2FA on all accounts**

## 🛡️ Security Features Summary

| Feature | Protection Against | Status |
|---------|-------------------|--------|
| Rate Limiting | Spam/Bot attacks | ✅ Active |
| Input Validation | XSS/Injection | ✅ Active |
| reCAPTCHA | Bot automation | ✅ Active |
| Origin Validation | CSRF attacks | ✅ Active |
| Environment Variables | Data exposure | ✅ Active |
| CSP Headers | XSS/Clickjacking | ✅ Active |
| Error Logging | Security monitoring | ✅ Active |

Your portfolio is now secured against common web attacks! 🚀 