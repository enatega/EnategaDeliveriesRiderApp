# EnategaDeliveriesRiderApp Rebranding Guide

This guide is the standard flow to prepare `EnategaDeliveriesRiderApp` for a new client.

## 1) Branch Strategy

1. Start from `main` and create a dedicated client branch.
2. Use naming like `client/<client-name>`.
3. Keep client-specific customizations only in that branch.
4. Continue fixing shared bugs in `main`, then merge `main` into each client branch.

## 2) Rebranding Inputs (Collect Before Changes)

Collect these from client/backend/devops first:

1. App name, slug, bundle/package ID:
   - App display name
   - Expo slug
   - iOS bundle identifier
   - Android package name
2. Expo project:
   - Expo project ID
   - Expo updates URL
3. Environment + backend:
   - `EXPO_PUBLIC_API_BASE_URL`
   - `EXPO_PUBLIC_SOCKET_URL`
4. Maps and location:
   - `GOOGLE_MAPS_API_KEY`
5. Firebase/Google services files:
   - Android `google-services.json`
   - iOS `GoogleService-Info.plist` (if iOS Firebase services are used)
6. Branding:
   - App icon, adaptive icon, splash icon, favicon
   - Primary color
   - Secondary color
   - Tertiary color
7. Legal/business:
   - Privacy policy URL
   - About URL
   - Help/support URL
   - Support email if shown in rider-facing copy

## 3) Update Environment Variables

Edit [`.env`](/Users/muhammadali/Desktop/Projects/super-app/EnategaDeliveriesRiderApp/.env) with client values:

1. `EXPO_PUBLIC_API_BASE_URL`
2. `EXPO_PUBLIC_SOCKET_URL`
3. `GOOGLE_MAPS_API_KEY`
4. Optional:
   - `EXPO_PUBLIC_EAS_PROJECT_ID` if you later use env fallback for push token resolution

Notes:

1. `EXPO_PUBLIC_API_BASE_URL` is required by the rider app API layer.
2. `EXPO_PUBLIC_SOCKET_URL` is required by rider socket clients.
3. `GOOGLE_MAPS_API_KEY` is read by [app.config.js](/Users/muhammadali/Desktop/Projects/super-app/EnategaDeliveriesRiderApp/app.config.js) for native map plugin setup.

## 4) Update Expo App Identity

Edit [app.config.js](/Users/muhammadali/Desktop/Projects/super-app/EnategaDeliveriesRiderApp/app.config.js):

1. `expo.name`
2. `expo.slug`
3. `expo.ios.bundleIdentifier`
4. `expo.android.package`
5. `expo.updates.url`
6. `expo.extra.eas.projectId`
7. iOS `googleServicesFile` if `GoogleService-Info.plist` is provided

Important:

1. `updates.url` and `extra.eas.projectId` should match the client’s Expo project, not the base rider app project.
2. The Android package must match the Android Firebase config.
3. The iOS bundle identifier must match the iOS Firebase config if iOS Firebase is enabled.

## 5) Replace Platform Config Files

1. Replace [google-services.json](/Users/muhammadali/Desktop/Projects/super-app/EnategaDeliveriesRiderApp/google-services.json) with the client’s Android Firebase config.
2. Confirm the `package_name` in that file matches `expo.android.package`.
3. If iOS Firebase is required, add `GoogleService-Info.plist` to the rider app and wire it in Expo config.

## 6) Replace Branding Assets

Replace:

1. [icon.png](/Users/muhammadali/Desktop/Projects/super-app/EnategaDeliveriesRiderApp/assets/icon.png)
2. [adaptive-icon.png](/Users/muhammadali/Desktop/Projects/super-app/EnategaDeliveriesRiderApp/assets/adaptive-icon.png)
3. [splash-icon.png](/Users/muhammadali/Desktop/Projects/super-app/EnategaDeliveriesRiderApp/assets/splash-icon.png)
4. [favicon.png](/Users/muhammadali/Desktop/Projects/super-app/EnategaDeliveriesRiderApp/assets/favicon.png)

## 7) Apply Client Theme Colors

Adjust default brand colors in [colors.ts](/Users/muhammadali/Desktop/Projects/super-app/EnategaDeliveriesRiderApp/src/theme/colors.ts):

1. `primary`
2. `secondary`
3. `tertiary`

Rider app note:

1. This app already supports brand-color application through its theme pipeline.
2. Updating the default brand colors gives a clean baseline for the client even before server-driven settings are loaded.

## 8) Update Client-Facing Text and Public Links

At minimum update:

1. App name:
   - [en.ts](/Users/muhammadali/Desktop/Projects/super-app/EnategaDeliveriesRiderApp/src/localization/en.ts)
   - [fr.ts](/Users/muhammadali/Desktop/Projects/super-app/EnategaDeliveriesRiderApp/src/localization/fr.ts)
2. Public external links:
   - [Sidebar.tsx](/Users/muhammadali/Desktop/Projects/super-app/EnategaDeliveriesRiderApp/src/components/Sidebar.tsx)
   - [ProfileScreen.tsx](/Users/muhammadali/Desktop/Projects/super-app/EnategaDeliveriesRiderApp/src/screens/profile/ProfileScreen.tsx)

Links to verify:

1. Privacy Policy
2. About Us
3. Help / Support

## 9) Validate Before Build

1. Start app once:
   - `npm start`
2. Validate:
   - App launches
   - Rider login works
   - Maps load
   - Sockets connect
   - Order detail map/navigation actions work
   - Privacy/about/help links open correctly
3. Run native builds:
   - `npx expo run:android`
   - `npx expo run:ios`

## 10) Submission Checklist

1. Confirm IDs are unique per client:
   - iOS bundle identifier
   - Android package
   - Expo project ID
2. Confirm production URLs and keys are production-ready.
3. Confirm Firebase config matches the final Android/iOS app IDs.
4. Confirm maps key is valid for the client environment.
5. Confirm app icon/splash are client-specific.
6. Confirm privacy/about/help URLs are client-specific.
7. Commit changes with message:
   - `chore(client): rebrand <client-name> rider app baseline config`

## 11) Recommended Operational Improvement

Current rider app setup is simple, but for future client work prefer:

1. `.env.template` with required keys only
2. `.env.client-<name>` per client
3. A small setup script later to switch env and Expo identity values quickly

## 12) Client Intake Form (Fill This First)

Use this exact format. Developer fills it once, then AI agent uses it to apply changes in `.env`, `app.config.js`, assets, theme, Firebase config, maps key, and public links.

```md
# Client Rebranding Intake - EnategaDeliveriesRiderApp

## Client Identity
CLIENT_NAME=EatMile
CLIENT_BRANCH=client/EatMile
APP_DISPLAY_NAME=EatMile Rider
EXPO_SLUG=eatmile-rider
IOS_BUNDLE_IDENTIFIER=
ANDROID_PACKAGE_NAME=

## Expo Project
EXPO_PROJECT_ID=
EXPO_UPDATES_URL=
EXPO_PUBLIC_EAS_PROJECT_ID=

## Backend and Socket URLs
EXPO_PUBLIC_API_BASE_URL=
EXPO_PUBLIC_SOCKET_URL=

## Maps
GOOGLE_MAPS_API_KEY=

## Branding and Design
PRIMARY_COLOR=#020201
SECONDARY_COLOR=#FEDB03
TERTIARY_COLOR=#FFF8CB

## Legal and Support Links
PRIVACY_POLICY_URL=
ABOUT_US_URL=
HELP_URL=
SUPPORT_EMAIL=

## Files Provided
ANDROID_GOOGLE_SERVICES_JSON_PATH=
IOS_GOOGLE_SERVICE_INFO_PLIST_PATH=
ICON_PATH=
ADAPTIVE_ICON_PATH=
SPLASH_ICON_PATH=
FAVICON_PATH=

## Notes
CUSTOM_CLIENT_REQUIREMENTS=
```

## 13) Rebranding Progress Tracker (Tick as Completed)

Mark each step with `✅` when done.

- ✅ 1. Client branch created from `main`
- ✅ 2. Intake form completed and validated
- ✅ 3. `.env` values replaced from intake form
- ✅ 4. `app.config.js` identity updated (`name`, `slug`, bundle/package)
- ✅ 5. `updates.url` and `extra.eas.projectId` updated for client Expo project
- ✅ 6. `google-services.json` replaced and package verified
- ✅ 7. iOS `GoogleService-Info.plist` added/configured (if needed)
- ✅ 8. Branding assets replaced (`icon`, `adaptive-icon`, `splash`, `favicon`)
- ✅ 9. Theme colors updated in `colors.ts`
- ✅ 10. App name/public links updated
- ⬜ 11. Smoke test passed (`npm start`)
- ⬜ 12. Android native run passed (`npx expo run:android`)
- ⬜ 13. iOS native run passed (`npx expo run:ios`)
- ⬜ 14. Final QA checklist passed for submission
- ⬜ 15. Commit created: `chore(client): rebrand <client-name> rider app baseline config`
