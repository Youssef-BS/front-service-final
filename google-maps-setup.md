# Google Maps API Setup Guide

This guide provides information about the Google Maps API setup in this application.

## Current API Key

The application is already configured with the following Google Maps API key:
```
AIzaSyDGaW_cPEW5NgmOMQY01BOQ09WtKt9kOXg
```

This key has been added to both environment files:
- `src/environments/environment.ts` for development
- `src/environments/environment.prod.ts` for production

## Enabled APIs

The following APIs have been enabled for this project:
- Maps JavaScript API
- Places API (for autocomplete features)
- Geocoding API (for address lookup)

## Securing Your API Key (Recommended)

For better security, you may want to restrict the API key:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Credentials"
3. Find the API key and click "Edit"
4. Under "Application restrictions", you can limit the key to:
   - HTTP referrers (websites): specify your domain 
   - IP addresses: limit to your server's IP
5. Under "API restrictions", limit the key to only the APIs you need

## Troubleshooting

If you encounter any issues:

1. **"Google is not defined" errors**
   - Verify the Google Maps JavaScript API is enabled in your project
   - Check that the script is properly loading in your HTML

2. **"This API project is not authorized" errors**
   - Ensure billing is set up for your project
   - Verify your domain is properly configured in API restrictions (if used)

3. **Map doesn't display**
   - Check the browser console for specific errors
   - Ensure the map container element has a defined height
   - Verify the map initialization code is properly triggered after the component loads

## Creating a New API Key (If Needed)

If you need to create a new API key:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Credentials"
3. Click "Create Credentials" and select "API Key"
4. Copy the new API key and update it in the environment files

## Further Documentation

- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- [Angular Google Maps (AGM) Documentation](https://angular-maps.com/) if using this library 