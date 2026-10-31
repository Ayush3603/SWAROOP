<div align="center">

<img src="public/favicon.svg" width="80" height="80" alt="Swaruoop Pay Logo" />

# Swaruoop Pay

### Pay with your face — no card, no PIN, just you.

[![React](https://img.shields.io/badge/React-18.3-61dafb?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff?style=flat-square&logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06b6d4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![face-api.js](https://img.shields.io/badge/face--api.js-1.7-8b5cf6?style=flat-square)](https://github.com/vladmandic/face-api)
[![100% Browser](https://img.shields.io/badge/runs-100%25%20in%20browser-22c55e?style=flat-square)](#)

**A full facial recognition payment app — sign up, link your bank, link your face, and pay just by looking at the camera. Everything runs in your browser. Zero data leaves your device.**

---

</div>

## Table of Contents

- [What is Swaruoop Pay?](#what-is-swaruoop-pay)
- [How It Works](#how-it-works)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [How to Run](#how-to-run)
- [App Flow Walkthrough](#app-flow-walkthrough)
- [Face Recognition — How It Works](#face-recognition--how-it-works)
- [Banking — How It Works](#banking--how-it-works)
- [Security & Privacy](#security--privacy)
- [Why We Chose Each Technology](#why-we-chose-each-technology)
- [Known Limitations](#known-limitations)

---

## What is Swaruoop Pay?

Swaruoop Pay is a **browser-based facial recognition payment app** — similar to how real payment apps like PhonePe, GPay, or Paytm work, but with your **face as the authentication method** instead of a PIN or fingerprint.

You register with a phone number, 2 bank accounts get auto-linked to your number (simulating how UPI fetches accounts from your bank), you enroll your face, and from that point on you can pay by simply **looking at the camera**.

> This is a demo/organizational project. All face recognition runs locally in the browser using TensorFlow.js — no face data, no payment data, and no personal information is ever sent to any server.

---

## How It Works

```
┌─────────────────────────────────────────────────────────┐
│                     SWARUOOP PAY FLOW                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. SIGN UP          2. BANKING          3. ENROLL FACE │
│  ───────────         ──────────          ──────────────  │
│  Phone number   →    2 banks        →    Camera scans   │
│  No OTP needed       auto-linked         your face       │
│  (demo mode)         to number           128-d vector    │
│                                          stored locally  │
│                                                         │
│  4. PAY              5. DONE!                           │
│  ──────              ──────                             │
│  Camera scans   →    Payment                            │
│  your face           complete ✓                         │
│  Matches 128-d       Balance updated                    │
│  vector              History recorded                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Features

| Feature | Description |
|---|---|
| 📱 **Phone-based auth** | Sign up / log in with just a phone number — like real UPI payment apps |
| 🏦 **Auto-linked banks** | 2 bank accounts automatically linked to your number on signup |
| ➕ **Manual bank linking** | Add any bank account manually (only last 4 digits stored) |
| 💳 **Wallet top-up** | Transfer funds from a linked bank account to your wallet |
| 🙂 **Face enrollment** | Register your face with a live camera — stored as a 128-dimensional vector |
| 🤳 **Face payment** | Pay by looking at the camera — face is matched to your account instantly |
| 🧾 **Transaction history** | Every payment and top-up is recorded with timestamp and balance |
| 👤 **Profile management** | View account details, face status, manage banking, delete account |
| 📱 **Responsive design** | Works on desktop and mobile — with a dedicated mobile bottom nav |
| 🔒 **100% private** | Everything runs in-browser — zero server, zero data upload |

---

## Tech Stack

### Core Framework

| Technology | Version | Why We Used It |
|---|---|---|
| **React** | 18.3 | Component-based UI with hooks for state management |
| **TypeScript** | 5.6 | Type safety across all files — catches bugs at compile time |
| **Vite** | 5.4 | Extremely fast dev server and build tool; native ESM support |

### Styling

| Technology | Version | Why We Used It |
|---|---|---|
| **Tailwind CSS** | 3.4 | Utility-first CSS — no separate stylesheet files, consistent design system |
| **Inter font** | — | Clean, modern sans-serif — standard for fintech UIs |

### Face Recognition

| Technology | Version | Why We Used It |
|---|---|---|
| **@vladmandic/face-api** | 1.7.15 | TypeScript-native fork of face-api.js; runs fully in the browser via TensorFlow.js |
| **TinyFaceDetector** | — | Lightweight 200KB model — fast enough for real-time video |
| **FaceLandmark68Net** | — | Detects 68 facial landmark points for accurate alignment |
| **FaceRecognitionNet** | — | Generates the 128-dimensional face descriptor used for matching |

### State & Storage

| Technology | Why We Used It |
|---|---|
| **React Context + useMemo/useCallback** | Global state without external libraries — keeps bundle lean |
| **localStorage** | Persists profiles, banks, transactions, and session across refreshes |

---

## Project Structure

Every domain has its **own folder** — each folder owns its files completely and nothing leaks across wrong boundaries.

```
project in kiro ide/
│
├── public/
│   ├── favicon.svg                  ← App icon
│   └── models/                      ← Face recognition model files (served at /models)
│       ├── tiny_face_detector_model.bin
│       ├── face_landmark_68_model.bin
│       └── face_recognition_model.bin
│
├── src/
│   │
│   ├── auth/                        ── AUTHENTICATION DOMAIN
│   │   ├── AuthScreen.tsx           ← Login / Signup UI (phone number only)
│   │   └── authHelpers.ts           ← Phone validation helper
│   │
│   ├── banking/                     ── BANKING DOMAIN
│   │   ├── Banking.tsx              ← Linked accounts view + manual add + top-up modal
│   │   └── linkedAccounts.ts        ← Generates 2 mock banks from phone number
│   │
│   ├── dashboard/                   ── DASHBOARD DOMAIN
│   │   └── Dashboard.tsx            ← Wallet balance, quick actions, setup checklist, recent activity
│   │
│   ├── face/                        ── FACE RECOGNITION DOMAIN
│   │   ├── Camera.tsx               ← Live webcam feed + cyan detection overlay
│   │   ├── Enroll.tsx               ← Face registration UI
│   │   ├── faceApi.ts               ← face-api wrapper: loadModels, detectFace, matchFace
│   │   └── useCamera.ts             ← Webcam lifecycle hook (open/close stream)
│   │
│   ├── history/                     ── TRANSACTION HISTORY DOMAIN
│   │   └── TransactionHistory.tsx   ← All payments and top-ups, with totals
│   │
│   ├── pay/                         ── PAYMENT DOMAIN
│   │   └── Pay.tsx                  ← Face scan → identity match → charge wallet
│   │
│   ├── profile/                     ── PROFILE DOMAIN
│   │   └── Profile.tsx              ← Account details, face status, danger zone
│   │
│   ├── shared/                      ── SHARED / FOUNDATION LAYER
│   │   ├── AppContext.tsx           ← All global state: auth, face, banking, pay, navigation
│   │   ├── types.ts                 ← Domain types: Profile, BankAccount, Transaction, View
│   │   ├── payment.ts               ← formatCurrency, parseAmountToCents, generateId, formatDate
│   │   ├── storage.ts               ← localStorage read/write for all data
│   │   └── ui.tsx                   ← Reusable UI: Button, Card, Badge, Spinner, Field, TextInput, Logo
│   │
│   ├── App.tsx                      ← Root: auth gate + nav shell + routing
│   ├── main.tsx                     ← React DOM entry point
│   └── index.css                    ← Tailwind directives
│
├── index.html                       ← HTML shell
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── postcss.config.js
```

---

## How to Run

### Prerequisites

Node.js is bundled at `/home/yuno/.tools/node` — no system install needed.

### Development server

```bash
# From the project folder:
PATH="/home/yuno/.tools/node/bin:$PATH" npm run dev
```

Then open **http://localhost:5173** in your browser.

### Production build

```bash
PATH="/home/yuno/.tools/node/bin:$PATH" npm run build
```

Output goes to `dist/` — a fully self-contained static site including the model files.

### Preview production build

```bash
PATH="/home/yuno/.tools/node/bin:$PATH" npm run preview
```

Opens at **http://localhost:4173**

---

## App Flow Walkthrough

### 1. Sign Up

Open the app → you see the Swaruoop Pay auth screen.

- Click **Sign up**
- Enter your **full name** (e.g. `Swaruoop`)
- Enter any **phone number** (e.g. `9876543210`)
- Click **Create account →**

> **What happens under the hood:** `AppContext.signup()` validates the phone number, creates a `Profile` record, calls `generateLinkedBanks()` to seed 2 mock bank accounts derived from the phone number, saves everything to `localStorage`, and sets the session.

### 2. Banking — Link a bank & add funds

Go to **🏦 Banking**.

- You'll see 2 banks already linked (auto-seeded from your phone number)
- Click **Add funds** on any bank
- Enter an amount (e.g. `500`) and confirm

> **What happens:** `addFunds()` in AppContext increases the profile's `wallet` balance by the amount in cents, creates a `topup` Transaction record, and persists both.

### 3. Link Face

Go to **🙂 Link face**.

- Allow camera permission when the browser asks
- Look at the camera — a **cyan bounding box** with corner accents appears on your face
- Click **Link this face**

> **What happens:** `faceApi.detectFace()` runs TinyFaceDetector on each video frame. Once a face is found, `faceRecognitionNet` computes a **128-dimensional descriptor vector** (a unique numerical representation of your face geometry). This Float32Array is converted to a plain array and stored in your Profile in `localStorage`.

### 4. Pay with Face

Go to **🤳 Pay**.

- The camera opens and scans automatically
- Your face is detected → the app runs `FaceMatcher` against all enrolled face descriptors
- When a match is found (Euclidean distance < 0.55), the badge shows **Identity verified ✓**
- Your account card appears on the right — enter an amount or tap a quick button
- Click **Confirm payment**

> **What happens:** `identifyFace()` in AppContext runs `faceApi.matchFace()` — it builds a `FaceMatcher` from all enrolled descriptors using face-api's `LabeledFaceDescriptors`, finds the closest match, and returns the profile if the distance is below the threshold. Then `chargeProfile()` deducts the amount from the wallet and records a `payment` Transaction.

### 5. History & Profile

- **🧾 History** — see every transaction with amount, type, date, and running balance
- **Profile avatar (top right)** — full account details, face status, bank count, danger zone

---

## Face Recognition — How It Works

```
Webcam frame
     │
     ▼
TinyFaceDetector (200KB model)
  → Finds face bounding box
  → Confidence score (0–1)
     │
     ▼
FaceLandmark68Net (349KB model)
  → Finds 68 landmark points
    (eyes, nose, mouth, jaw...)
  → Aligns face geometrically
     │
     ▼
FaceRecognitionNet (6.1MB model)
  → Computes 128-dimensional
    descriptor vector
  → Unique to each person's
    face geometry
     │
     ▼
FaceMatcher (at payment time)
  → Euclidean distance between
    live descriptor and stored
  → Distance < 0.55 = match
  → Returns matched Profile
```

**Why 128 dimensions?** Each number represents a geometric measurement of your face (e.g. distance between eyes, nose width, jaw angle). Two photos of the same person produce vectors very close to each other. Two different people produce vectors far apart. The threshold `0.55` balances false accepts vs. false rejects.

**Total model size: ~6.8 MB** — loaded once, cached by the browser for subsequent visits.

---

## Banking — How It Works

Real payment apps (PhonePe, GPay) work like this:
1. You enter your phone number
2. The app calls the banking network (NPCI/UPI) via a backend server
3. The backend fetches all bank accounts registered to that mobile number
4. Those accounts are displayed for you to select

**Swaruoop Pay simulates this:**
1. You enter your phone number
2. `generateLinkedBanks()` in `banking/linkedAccounts.ts` derives 2 bank accounts **deterministically** from your number (same number = same banks, always)
3. The accounts appear as if they were "fetched" from the network

This gives the correct UX and mental model without requiring a real backend or bank API.

---

## Security & Privacy

| Concern | How Swaruoop Pay handles it |
|---|---|
| Face data leaving the device | ❌ Never happens — all recognition runs in the browser via TensorFlow.js WASM/WebGL |
| Raw face photos stored | ❌ Never — only the 128-d descriptor vector is kept, not the image itself |
| Payment data sent to server | ❌ No server exists — all data is in `localStorage` |
| Real bank credentials | ❌ Never asked — only last 4 digits of account number are stored |
| Session persistence | ✅ Session ID stored in `localStorage`, cleared on logout |

> ⚠️ **Demo disclaimer:** Because there is no server, there is also no real security enforcement. Anyone with access to the browser's localStorage can read the stored data. This app is for demonstration purposes only — never use it with real financial information.

---

## Why We Chose Each Technology

### React 18 + TypeScript
React's component model maps cleanly to the domain structure (each domain = a component tree). TypeScript catches type mismatches at build time — especially important for the money math (all values in cents as `number`) and the face descriptor (`Float32Array` vs `number[]`).

### Vite
Vite uses native ES modules in development — meaning each source file is served as-is without bundling. This gives near-instant hot reload even with 20 source files. The production build uses Rollup under the hood, which produces an optimised bundle.

### Tailwind CSS
Instead of writing CSS files, Tailwind lets us style components inline with utility classes. This keeps styles co-located with the component, removes dead CSS automatically, and enforces a consistent design system (spacing scale, colour palette, radius values) across all 20 components.

### @vladmandic/face-api
This is a maintained, TypeScript-native fork of the original `face-api.js`. It runs entirely in the browser using TensorFlow.js, which can use WebGL for GPU acceleration or fall back to CPU. We use 3 of its models:
- **TinyFaceDetector** — fast real-time face detection
- **FaceLandmark68Net** — accurate landmark alignment for better descriptors
- **FaceRecognitionNet** — state-of-the-art 128-d descriptor generation

### React Context (no Redux)
The app has one global state tree (AppContext) with ~10 actions. Redux would add 3+ packages and boilerplate for no benefit at this scale. `useMemo` + `useCallback` ensure expensive derivations and callbacks don't recreate on every render.

### localStorage
No database, no backend, no auth tokens. Every `Profile`, `BankAccount`, and `Transaction` is persisted to `localStorage` under namespaced keys (`swaruoop.*`). The data model is simple enough that there's no need for IndexedDB or a real DB.

---

## Known Limitations

| Limitation | Reason |
|---|---|
| No real SMS OTP | No backend / SMS gateway — phone number is trusted directly |
| No real bank API | No UPI/NPCI integration — bank accounts are deterministically generated |
| Face recognition accuracy | Works best in good lighting, front-facing, single person in frame |
| Data lost on browser clear | localStorage is wiped when the user clears browser data |
| Single device only | No sync across devices — data is local to the browser |
| ~7 MB initial load | TensorFlow.js + 3 face models — cached after first visit |

---

<div align="center">

Built with ❤️ by **Swaruoop**

*Swaruoop Pay — face recognition runs entirely in your browser · no data leaves your device*

</div>
