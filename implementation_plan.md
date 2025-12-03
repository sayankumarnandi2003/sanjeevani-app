# Implementation Plan - Real Backend & Mock Payment

We will upgrade **Sanjeevani** from a local-only app to a cloud-connected application using **Firebase**. We will also add a realistic **Mock Payment Gateway** for the pharmacy.

## User Review Required
> [!IMPORTANT]
> **Firebase Setup**: You will need to create a free Firebase project at [console.firebase.google.com](https://console.firebase.google.com) to get your API keys. I cannot do this for you.

> [!NOTE]
> **Authentication Decision**: Currently, you have a simple "Profile Switcher".
> *   **Option A (Simple)**: Keep the Profile Switcher, but save all profiles to a shared cloud database (good for a family app).
> *   **Option B (Secure)**: Implement real Email/Password Login (users can only see their own data).
> *   *I will proceed with **Option A** for now to keep the current UI, but let me know if you want real Login.*

## Proposed Changes

### 1. Firebase Integration
We will install the Firebase SDK and set up the connection.

#### [NEW] [firebase.js](file:///c:/Users/dayal/Desktop/health-app/src/firebase.js)
- Initialize Firebase app.
- Export `db` (Firestore database).

#### [NEW] [db.js](file:///c:/Users/dayal/Desktop/health-app/src/services/db.js)
- Functions to `getProfiles()`, `addProfile()`, `saveOrder()`, `getReminders()`.

### 2. Mock Payment Gateway
A realistic UI that simulates a payment processor (like Razorpay/Stripe) without processing real money.

#### [NEW] [PaymentModal.jsx](file:///c:/Users/dayal/Desktop/health-app/src/components/PaymentModal.jsx)
- A modal popup.
- Fields for Card Number, Expiry, CVV (validation only, no real processing).
- "Processing..." spinner state.
- Success/Failure animation.

### 3. App Integration

#### [MODIFY] [App.jsx](file:///c:/Users/dayal/Desktop/health-app/src/App.jsx)
- Replace `localStorage` calls with `db.js` functions.
- Use `useEffect` to load data from Firebase on startup.

#### [MODIFY] [MedicineOrder](file:///c:/Users/dayal/Desktop/health-app/src/App.jsx)
- Integrate `PaymentModal` into the checkout flow.
- Save order to Firebase upon successful "payment".

## Verification Plan

### Automated Tests
- None (Visual verification required).

### Manual Verification
1.  **Data Persistence**: Reload the page and ensure Profiles/Reminders are loaded from Firebase (not just local storage).
2.  **Payment Flow**:
    -   Add items to cart.
    -   Click Checkout.
    -   Enter dummy card details in the Mock Gateway.
    -   Verify "Payment Successful" screen.
    -   Verify order is saved in database.
