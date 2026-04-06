# ProductsApp — React Native Frontend

A cross-platform mobile application  built using React Native CLI. The app connects to a local .NET 10 backend and lets users browse products, filter by category, and search  all with a clean UI and proper state management.

---


## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React Native CLI | Latest | Mobile app framework |
| TypeScript | Latest | Type safety |
| Redux Toolkit | Latest | State management |
| React Navigation | v6 | Screen navigation |
| Axios | Latest | HTTP requests |
| NativeWind v4 | Latest | Tailwind CSS utility classes |
| react-native-vector-icons | Latest | Icon library |
| lodash.debounce | Latest | Debounced search input |
| react-native-config | Latest | Environment variable management |

---

## Project Structure

```
ProductsApp/
├── android/                        ← Android native project
├── ios/                            ← iOS native project
├── src/
│   ├── api/
│   │   └── productsApi.ts          ← All Axios API calls in one place
│   ├── components/
│   │   ├── CategoryFilter.tsx      ← Horizontal scrollable category chips
│   │   ├── ProductCard.tsx         ← Individual product card with press animation
│   │   ├── SearchBar.tsx           ← Animated search input with sanitization
│   │   └── SkeletonCard.tsx        ← Shimmer loading placeholder
│   ├── navigation/
│   │   └── AppNavigator.tsx        ← React Navigation stack setup
│   ├── screens/
│   │   ├── ProductDetailScreen.tsx ← Full product detail with parallax image
│   │   └── ProductListScreen.tsx   ← Product grid with search and filter
│   ├── store/
│   │   ├── index.ts                ← Redux store configuration
│   │   └── slices/
│   │       ├── categoriesSlice.ts  ← Category state + async thunks
│   │       └── productsSlice.ts    ← Product state + async thunks
│   └── types/
│       └── index.ts                ← Shared TypeScript interfaces
├── .env                            ← Environment variables (not committed)
├── .env.example                    ← Template showing required variables
├── App.tsx                         ← Root component with Redux Provider
├── babel.config.js
├── global.css                      ← Tailwind directives for NativeWind
├── nativewind-env.d.ts             ← NativeWind TypeScript support
└── tailwind.config.js              ← Tailwind configuration with custom colors
```

---

## Screens and Features

### Product List Screen
- Displays all products in a 2 column grid fetched from the backend
- Animated header that fades and slides in on mount
- Horizontal scrollable category filter chips  tapping a chip filters products by that category, tapping "All" resets back to the full list
- Skeleton loading cards with a shimmer animation shown while data is loading instead of a plain spinner
- Empty state screen with a reset button if no products match the search or filter
- Error state screen with a retry button if the API call fails

### Product Detail Screen
- Floating back button that gains a solid background as the user scrolls down
- Product title fades into the header bar as the user scrolls past the image
- Content card slides up with a fade animation when the product data loads
- Price displayed in a highlighted green box
- Product description section
- Info pills showing secure checkout, easy returns, and fast delivery
- Add to Cart button with a coloured shadow
- Secondary wishlist button

---

## Architecture Overview

I structured the frontend around a clear separation of concerns:

**API layer** — all HTTP calls live in `src/api/productsApi.ts`. No component ever calls Axios directly. The Axios instance has a response interceptor that catches errors and converts them to safe, human-readable messages before they reach the UI.

**State management** — Redux Toolkit manages all server data. Products and categories each have their own slice with async thunks for the API calls. Components dispatch thunks and read from the store — they never manage loading or error state locally.

**Components** — kept small and focused on one job each. `SearchBar` handles input and sanitization. `CategoryFilter` handles chip rendering and dispatch. `ProductCard` handles card display and press animation. None of them know about navigation or API calls directly.

**Navigation** — a simple native stack with two screens. The stack is typed with `RootStackParamList` so TypeScript catches any mistakes when navigating between screens.

---

## Prerequisites

Before running this project make sure you have the following set up on your machine:

- [Node.js](https://nodejs.org/) v20 LTS or higher
- [JDK 17](https://adoptium.net/) with `JAVA_HOME` environment variable set
- [Android Studio](https://developer.android.com/studio) with Android SDK installed
- `ANDROID_HOME` environment variable set pointing to your Android SDK folder
- An Android emulator created and running in Android Studio
- The **ProductsApi backend running locally** — the app has no data without it

---

## Environment Variables Setup

I used `react-native-config` to manage environment-specific values instead of hardcoding the API URL directly in the source code. This is important because the API URL is different depending on whether you are running on an emulator, a physical device, or a production server.

Create a `.env` file in the project root:

```
API_BASE_URL=http://10.0.2.2:5108/api
APP_TIMEOUT=10000
```

The IP address `10.0.2.2` is how the Android emulator refers to your PC's localhost.

The `.env` file is listed in `.gitignore` and is never committed to the repository. An `.env.example` file is included instead to show what variables are needed.

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ProductsApp.git
cd ProductsApp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create your .env file

Copy the example file and fill in your values:

```bash
cp env.example .env.local
```

Then open `.env` and confirm the `API_BASE_URL` matches your local backend address.

### 4. Set up Android environment variables

Make sure these are set in your Windows System Environment Variables:

```
ANDROID_HOME = C:\Users\<YourUsername>\AppData\Local\Android\Sdk
```

And these two entries added to `Path`:

```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\emulator
```

### 5. Add the SDK path to local.properties

Open `android/local.properties` (create it if it doesn't exist) and add:

```
sdk.dir=C:\\Users\\<YourUsername>\\AppData\\Local\\Android\\Sdk
```

Replace `<YourUsername>` with your actual Windows username.

### 6. Start an Android emulator

Open Android Studio → Virtual Device Manager → press the play button next to any device. Wait until the emulator fully boots to the Android home screen before continuing.

### 7. Start the Metro bundler

Open a terminal and run:

```bash
npx react-native start
```

Wait until Metro shows it is ready before moving to the next step.

### 8. Build and run the app

Open a second terminal and run:

```bash
npx react-native run-android
```

The first build takes 3–5 minutes. Once it finishes the app will open automatically on the emulator.

---

## Make Sure the Backend Is Running

The app has no data without the backend. Before launching the app, open the `ProductsApi` solution in Visual Studio and press F5 to start it. Confirm Swagger UI opens at `https://localhost:5108/swagger` and the endpoints return data. Then launch the React Native app.

---


