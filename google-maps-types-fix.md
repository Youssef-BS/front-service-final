# Fixing Google Maps TypeScript Errors

To fix the TypeScript errors related to the `google` object not being found, follow these steps:

## Method 1: Add Google Maps Types Package

1. Install the Google Maps types package:
   ```bash
   npm install @types/google.maps --save-dev
   ```

2. If needed, add the types to your `tsconfig.json` file:
   ```json
   {
     "compilerOptions": {
       "types": [
         "google.maps"
       ]
     }
   }
   ```

## Method 2: Add Google Maps Script to index.html

If Method 1 doesn't resolve the issues, you can modify the `index.html` file to include the Google Maps script directly:

1. Open `src/index.html`
2. Add the Google Maps script before the closing `</head>` tag:
   ```html
   <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDGaW_cPEW5NgmOMQY01BOQ09WtKt9kOXg"></script>
   ```

3. Remove the dynamic script loading from `chambre-maps.component.ts` (keep only the `setupMap` method call in `ngOnInit`).

## Method 3: Declare Google as a Global Variable

As a quick fix, you can declare the `google` variable as a global type:

1. Create a new file called `src/app/typings.d.ts` (or add to existing typings file)
2. Add the following content:
   ```typescript
   declare var google: any;
   ```

This approach isn't ideal for production as it doesn't provide type checking, but it will resolve the TypeScript errors.

## Method 4: Use @types/googlemaps Package

Another approach is to use the `@types/googlemaps` package:

1. Install it with:
   ```bash
   npm install @types/googlemaps --save-dev
   ```

2. Add reference to it in your component file:
   ```typescript
   /// <reference types="googlemaps" />
   ```

## Recommended Solution

The recommended solution is Method 1, as it provides proper TypeScript typing for Google Maps objects while maintaining the dynamic loading approach you have in your component. 