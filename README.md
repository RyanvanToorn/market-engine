# market-engine

A personal financial data platform that scrapes market data from Yahoo Finance, stores it in a PostgreSQL database, and exposes it through a REST API with a React frontend for visualization and analysis.

## What it does

- **Scrapes** stock listings, price history (daily/weekly/monthly), and dividend data from Yahoo Finance using Playwright-driven browser automation
- **Stores** historical OHLCV data and instrument metadata in PostgreSQL
- **Serves** the data via a REST API for querying by instrument, type, and date range
- **Visualizes** data through a React client (in progress)

## Tech Stack

| Layer | Technology |
|---|---|
| API | Node.js, TypeScript, Express |
| Database | PostgreSQL (`pg` driver) |
| Client | React 19, TypeScript, Vite |
| Scraper | TypeScript, Playwright |
| Dev runtime | `tsx` |

## Quick Start

### Prerequisites

- Node.js
- PostgreSQL running locally (default: `localhost:5432`)

### 1. Configure environment

```bash
cp .env-example .env
# Edit .env with your database credentials
```

### 2. Install dependencies

```bash
cd apps/api && npm install
cd ../client && npm install
```

### Terminal 1 — API

```bash
cd apps/api
npm run dev
```

### Terminal 2 — Client

```bash
cd apps/client
npm run dev
```

---

## Monorepo Structure

```
apps/api       — Express REST API
apps/client    — React frontend
apps/scraper   — Playwright-based Yahoo Finance scraper
packages/      — Shared types and utilities
```
