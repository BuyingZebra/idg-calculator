# IDG Training Aid — v19 structure

v19 is an architecture refactor of v18. It is intended to preserve the same
visible behaviour while making future development easier.

## Current modules

- `modules/inspection-detail/`
  - owns the Inspection Detail inputs and calculations
  - produces the Dockside Grading Summary data sheet

- `modules/inspection-summary/`
  - owns Inspection Summary inputs and calculations
  - produces the Sampling Plan and Landed Pounds Summary data sheets
  - consumes required Inspection Detail results through shared application state

- `modules/activity-slip/`
  - remains a placeholder in v19
  - no timesheet interface or assumptions have been added

## Shared application code

- `app/state.js` — live shared state and cross-module recalculation
- `app/navigation.js` — timeline, preview-card, workspace and header transitions
- `ui/formula-helper.js` — formula helper behaviour
- `ui/icons.js` — local SVG loading
- `ui/*.css` — shell, navigation, modules and animation styling

## Reserved for Activity Slip

- `services/time.js` — 24-hour time, wait, inspection and setup/cleanup arithmetic
- `services/travel.js` — local origin/destination travel lookup and totals
- `services/storage.js` — IndexedDB/local history and profiles
- `data/travel/` — future offline NL community-to-community reference dataset

The future Activity Slip should support multiple inspection periods and travel
legs, paid travel time/mileage, automatic wait time, optional one-time setup and
cleanup allowances, and arbitrary origin/destination communities.

## Shared state names

- `appState.inspectionDetail`
- `appState.inspectionSummary`
- `appState.activitySlip` (reserved)
- `appState.profile` (reserved)

## v21 Activity Slip prototype

Activity Slip now has a functional Arrival → Inspection → optional Departure workflow.

- Arrival uses an offline community-to-community route matrix derived from the official
  NL Community to Community Distances CSV.
- Arrival time determines the calculated travel-start time.
- Inspection Start and Inspection End calculate base inspection time.
- Two independent 15-minute Setup / Clean Up allowances can be added or removed.
- Wait time is calculated from Arrival Time to Inspection Start.
- Departure is explicitly toggled on; it is not assumed after every inspection.
- When enabled, Departure begins at Inspection End and can route to any supported
  destination.
- Travel time and mileage totals include both enabled travel legs.

## v22 Activity Slip refinement

- Activity Slip output is condensed to two data sheets:
  1. Work Activity
  2. Return Travel
- Return Travel is disabled by default and remains visible in a greyed-out state.
- Disabled return travel contributes nothing.
- The two setup/cleanup allowances now use 00:00 / 15:00 segmented controls.
- 00:00 uses the red active inner ring; 15:00 uses the green active inner ring.
- Work Activity follows the paper Activity Slip style with Category / Start / End / Hrs-Kms columns.

## v28 Offline PWA

- Adds `manifest.webmanifest`.
- Adds `service-worker.js`.
- Precaches the complete static app, fonts, icons, scripts, styles and the offline NL travel matrix.
- Adds iOS Home Screen metadata and Android/Chromium install metadata.
- Uses a versioned cache (`idg-training-v28`) so later releases can replace stale cached files.
- No user data is synchronized online.
