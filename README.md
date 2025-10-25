# NoBug Pest Control Landing Page

A professional pest control landing page built with React, TypeScript, and modern web technologies.

## Features

- 🐜 **Professional Design** - Modern, responsive landing page
- 📱 **Mobile Optimized** - Works perfectly on all devices
- 📧 **Email Integration** - Automatic lead notifications via Resend
- 📊 **Analytics Tracking** - Google Analytics integration
- 🎯 **Form Validation** - Phone number validation (Israeli format)
- 🏙️ **City Dropdown** - Complete list of Israeli cities
- ⚡ **Fast Performance** - Optimized for speed

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, tRPC
- **Email**: Resend API
- **Analytics**: Google Analytics
- **Database**: Drizzle ORM
- **Build Tool**: Vite

## Quick Start

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Start development server**:
   ```bash
   pnpm dev
   ```

3. **Build for production**:
   ```bash
   pnpm build
   ```

4. **Start production server**:
   ```bash
   pnpm start
   ```

## Email Configuration

The site is configured to send emails using Resend:
- **Lead notifications**: Sent to `nobughello@gmail.com`
- **Professional HTML templates** with company branding
- **Automatic email sending** on form submission

## Analytics

Google Analytics (G-QFCH9K3EXR) is integrated to track:
- Form submissions (conversions)
- Button clicks and user engagement
- Traffic sources and user behavior
- Page performance metrics

## Form Features

- **Name**: Required field
- **Phone**: 10 digits, must start with "05" (Israeli format)
- **City**: Dropdown with all Israeli cities
- **Date**: Future date selection
- **Real-time validation** with error messages

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## License

MIT License - see LICENSE file for details.
