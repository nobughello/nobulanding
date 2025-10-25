# NoBug Pest Control - Deployment Guide

## Email Configuration

The application is configured to send emails using Resend. The API key is already configured in the code.

### Email Recipients
- **Lead notifications**: `nobughello@gmail.com`
- **Customer confirmations**: Sent to customer's email (if provided)

## Environment Variables for Production

Create a `.env` file in the root directory with the following variables:

```bash
# Resend Email Configuration
RESEND_API_KEY=re_SLhc2wqR_Co5an9AdEftBHjfGzSWrAwi9

# OAuth Configuration (update for production)
VITE_OAUTH_PORTAL_URL=https://your-oauth-provider.com
VITE_APP_ID=your-production-app-id

# App Configuration
VITE_APP_TITLE=NoBug - הדברה מקצועית
VITE_APP_LOGO=/logo.png

# Analytics (configured)
GOOGLE_ANALYTICS_ID=G-QFCH9K3EXR

# OAuth Server URL
OAUTH_SERVER_URL=https://your-oauth-provider.com

# Production Server Configuration
NODE_ENV=production
PORT=3000
```

## Deployment Steps

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Build the application**:
   ```bash
   pnpm build
   ```

3. **Start the production server**:
   ```bash
   pnpm start
   ```

## Email Features

### Lead Notification Email
- **From**: Resend verified domain (automatic)
- **To**: `nobughello@gmail.com`
- **Subject**: "🐜 New Pest Control Lead from [City]"
- **Includes**: Customer name, phone, city, email, submission time
- **Professional HTML template** with company branding

### Customer Confirmation Email
- **From**: Resend verified domain (automatic)
- **To**: Customer's email (if provided)
- **Subject**: "🐜 תודה על פנייתך - נובאג הדברה"
- **Hebrew language confirmation**
- **Explains next steps and timeline**

## Analytics Tracking

The site includes Google Analytics (G-QFCH9K3EXR) with the following tracking:

### Tracked Events
- **Form submissions**: `form_submit` event when leads are submitted
- **WhatsApp clicks**: `whatsapp_contact` event when users click WhatsApp
- **CTA button clicks**: `cta_order_now` event when users click main CTA buttons
- **Page views**: Automatic tracking of all page visits

### Analytics Data
- **Lead conversions**: Track form submissions as conversions
- **User engagement**: Monitor button clicks and interactions
- **Traffic sources**: See where visitors come from
- **Performance metrics**: Page load times and user behavior

## Form Validation

- **Name**: Required
- **Phone**: Required, 10 digits, must start with "05"
- **City**: Required, dropdown with Israeli cities
- **Date**: Required, future date

## Testing

To test the email functionality:

1. Visit the website
2. Fill out the form with valid data
3. Submit the form
4. Check `nobughello@gmail.com` for the lead notification
5. If email provided, check customer's email for confirmation

## Production Checklist

- [ ] Environment variables configured
- [ ] Resend API key working
- [ ] Email addresses correct
- [ ] Form validation working
- [ ] Phone validation working
- [ ] City dropdown populated
- [ ] Server running on correct port
- [ ] SSL/HTTPS configured (recommended)
