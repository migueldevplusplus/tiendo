# tiendo

> 🚧 In active development. Features below describe the planned scope; see the [roadmap](#roadmap) for current progress.

Multi-tenant ordering system for local businesses in Venezuela, starting with fast-food restaurants. Each business gets its own digital menu link; customers build an order and send it to the business via WhatsApp, and the business manages its menu and orders from an admin panel.

One codebase and one deployment serve every business.

---

## Why

Many local food businesses take orders entirely through WhatsApp chats. Customers ask for the menu, prices and exchange rate over and over, orders arrive incomplete, and owners calculate totals, delivery fees and bolívar conversions by hand.

tiendo gives each business a shareable menu where the customer builds a complete, correctly priced order, which is saved in the system and delivered to the business as a clean WhatsApp message.

---

## Features

### For customers
- Menu by category with photos, prices in USD and bolívares (official BCV rate)
- Product options and extras (e.g. sauce choice, extra cheese)
- Delivery by zone or pickup, payment method selection
- Automatic totals, including packaging and delivery fees
- Order sent via WhatsApp with a formatted summary
- Ordering disabled outside the business's opening hours

### For business owners
- Manage categories, products, extras and availability (sold out)
- Configure delivery zones, payment methods, opening hours and branding
- See incoming orders and move them through statuses

### Planned: voice
- **Customers** can say their order out loud; it's matched against the menu and pre-filled in the cart for review
- **Owners** can manage their store by voice ("mark fries as sold out", "how much did I sell today?")
- Zero running cost: speech recognition in the browser, rule-based matching on the server

---

## Tech stack

| Area | Technology |
|---|---|
| Language | TypeScript |
| Framework | NestJS (ES Modules) |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT (Passport) |
| Validation | class-validator |
| API docs | Swagger / OpenAPI |
| Tests | Vitest, Supertest |
| Infrastructure | Docker, docker-compose |

---

## Architecture

Feature modules, each split into controller (HTTP) → service (business rules) → Prisma (data access).

```
src/
├── common/          # guards, decorators, exception filters
├── prisma/          # database client
└── modules/
    ├── auth/
    ├── platform/    # super admin: create businesses
    ├── shops/       # profile, settings, branding, hours
    ├── categories/
    ├── products/
    ├── modifiers/   # extras and options
    ├── delivery-zones/
    ├── payment-methods/
    ├── exchange-rates/
    ├── public-menu/
    └── orders/
```

### Multi-tenancy
- Shared database and schema; every business-owned record carries a `shopId`.
- Admin requests take the business from the authenticated user's token, never from the request, and every query is scoped to it.
- Public requests resolve the business by its URL slug.
- Per-business behavior is driven by settings with safe defaults, never by business-specific code.

### Orders
- Totals are always calculated on the server; client prices are never trusted.
- Orders store snapshots of product names, prices and the exchange rate, so order history stays accurate after menu changes.
- Status transitions are validated (`PENDING → CONFIRMED → READY / ON_THE_WAY → DELIVERED`, or `CANCELLED`).

---

## Getting started

Requirements: Node.js 22+, Docker.

```bash
git clone https://github.com/migueldevplusplus/tiendo.git
cd tiendo
cp .env.example .env
docker compose up -d
npm install
npm run start:dev
```

API docs will be available at `http://localhost:3000/docs`.

```bash
npm run test        # unit tests
npm run test:e2e    # end-to-end tests
```

---

## Roadmap

- [x] Project setup
- [ ] Catalog: categories and products
- [ ] Orders and WhatsApp message
- [ ] PostgreSQL + Prisma
- [ ] Multi-tenancy (shops)
- [ ] Authentication and roles
- [ ] Extras, delivery zones, payment methods
- [ ] BCV exchange rate
- [ ] Image uploads
- [ ] Deployment
- [ ] Frontend (public menu + admin panel)
- [ ] Voice ordering and owner voice assistant