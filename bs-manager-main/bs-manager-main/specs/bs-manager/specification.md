# BS-Manager

## Project Title & Description

**BS-Manager (Business Management Manager)** is a web application designed to help small businesses manage their daily professional activities in one centralized platform.

The application is intended for businesses such as bakeries, pastry shops, restaurants, fast-food businesses, and other small businesses that work with raw materials, products, production, inventory, customers, and orders.

BS-Manager allows authorized business personnel to manage inventory items, products, production records, production costs, customers, orders, services, and promotional information. Customers can interact with the public-facing portion of the application to browse available products or services, create an account, and submit orders or requests.

The initial release focuses on the core business-management workflows required to replace fragmented paper-based or manual records with a centralized digital system.

## Purpose & Target Audience

### Purpose

The purpose of BS-Manager is to make everyday business management easier by providing a centralized system for:

* Managing inventory and raw materials.
* Managing products and their required ingredients.
* Tracking production and product stock.
* Calculating production costs.
* Managing customers.
* Managing customer orders.
* Managing promotions and promotional codes.
* Receiving and managing customer requests.
* Separating public customer functionality from protected administrative functionality.

### Target Audience

* Small bakery owners and employees.
* Pastry shop owners and employees.
* Restaurant and fast-food business owners.
* Small food-production businesses.
* Other small businesses that need to manage inventory, products, production, customers, and orders.

## Core Business Concepts

BS-Manager must clearly distinguish between the following business concepts:

### Inventory Item

An inventory item represents a raw material, ingredient, supply, or other stockable resource used by the business.

Examples:

* Flour
* Sugar
* Eggs
* Chocolate
* Cooking oil
* Packaging materials

### Product

A product represents a good or service offered by the business to customers.

A product may require one or more inventory items and quantities to produce or provide it.

Example:

**Chocolate Cake**

* Flour: 500 g
* Sugar: 300 g
* Eggs: 4 units
* Chocolate: 200 g

### Production

Production represents the process of transforming or consuming inventory items to create product stock.

Production records must allow the business to understand what was produced and how inventory was consumed.

### Client

A client represents a customer of the business.

Clients may have an account for interacting with the public application or may exist as business records managed by authorized personnel.

### Order

An order represents a customer's request for one or more products or services.

An order must contain the requested products or services and their quantities, together with the information required to process the request.

## User Stories

### Account & Access

1. As a customer, I want to create an account so that I can use the public features of BS-Manager.

2. As a customer, I want to sign in to my account so that I can access my personal information and manage my requests or orders.

3. As an administrator, I want to securely access the administrative area so that only authorized personnel can manage business information.

### Inventory Management

4. As an administrator, I want to create an inventory item so that I can record a raw material or resource used by the business.

5. As an administrator, I want to view inventory items so that I can monitor available resources.

6. As an administrator, I want to update an inventory item so that its information and available stock remain accurate.

7. As an administrator, I want to delete or deactivate an inventory item so that obsolete resources are no longer actively used.

### Product Management

8. As an administrator, I want to create a product so that the business can offer it to customers.

9. As an administrator, I want to define the inventory items and quantities required for a product so that its production requirements are known.

10. As an administrator, I want to view products so that I can manage the products offered by the business.

11. As an administrator, I want to update a product so that its information, ingredients, quantities, and pricing remain accurate.

12. As an administrator, I want to delete or deactivate a product so that products that are no longer offered cannot be ordered.

### Production Management

13. As an administrator, I want to record production so that the business can track how many products were produced.

14. As an administrator, I want production to consume the appropriate inventory quantities so that stock levels remain accurate.

15. As an administrator, I want to see the cost associated with producing a product so that I can understand its production expenses.

### Client Management

16. As an administrator, I want to create a client record so that I can manage customers who interact with the business.

17. As an administrator, I want to view client information so that I can understand who has requested or purchased products or services.

18. As an administrator, I want to update client information so that customer records remain accurate.

19. As an administrator, I want to deactivate a client when appropriate so that inactive records are not unnecessarily used in active business workflows.

### Order Management

20. As a customer, I want to browse available products or services so that I can decide what I want to request.

21. As a customer, I want to create an order so that I can request products or services from the business.

22. As a customer, I want to view my orders so that I can track the requests I have submitted.

23. As an administrator, I want to view customer orders so that I can process incoming requests.

24. As an administrator, I want to update an order's status so that customers and staff can understand its current state.

25. As an administrator, I want to update or cancel an order when necessary so that the order information accurately reflects the business operation.

### Promotions

26. As an administrator, I want to create promotional codes so that I can offer discounts or special promotions to customers.

27. As an administrator, I want to update or deactivate promotional codes so that expired or invalid promotions cannot be used.

28. As a customer, I want to apply a valid promotional code to my order so that I can receive the corresponding promotion.

## Acceptance Criteria

### Story 1: Create an account

* Given a customer who does not have an account, when they submit valid registration information, then a new customer account is created.
* Given registration information with missing required fields, when the customer submits the form, then the system prevents account creation and identifies the invalid fields.
* Given an email address already associated with an account, when registration is attempted, then the system prevents the duplicate account and informs the customer.

### Story 2: Sign in

* Given a registered customer with valid credentials, when they sign in, then they gain access to the features available to their account.
* Given invalid credentials, when sign-in is attempted, then access is denied and an appropriate error message is displayed.

### Story 3: Create an inventory item

* Given an authorized administrator, when valid inventory information is submitted, then the inventory item is created.
* Given required information is missing or invalid, when the form is submitted, then the item is not created.
* The inventory item must have a valid stock representation and must not create an unexplained negative stock quantity.

### Story 4: Read inventory items

* Given an authorized administrator, when the inventory area is opened, then available inventory items are displayed.
* The administrator must be able to identify relevant information such as item name, quantity, unit, and applicable cost.

### Story 5: Update an inventory item

* Given an existing inventory item, when an authorized administrator submits valid changes, then the item's information is updated.
* Existing business records that depend on the item must remain consistent after the update.

### Story 6: Delete or deactivate an inventory item

* Given an inventory item that is no longer actively used, when an authorized administrator deactivates it, then it is no longer available for new active business operations.
* Historical records that reference the item must remain understandable.

### Story 7: Create a product

* Given an authorized administrator, when valid product information is submitted, then a product is created.
* A product must have the information required to identify and offer it to customers.
* If the product requires inventory items, those requirements must be defined before production can use them.

### Story 8: Define product ingredients

* Given an existing product, when an authorized administrator defines valid inventory items and quantities, then those requirements are associated with the product.
* Invalid or non-positive quantities must not be accepted.
* The defined quantities must be available for production-cost calculations.

### Story 9: Record production

* Given an authorized administrator and a valid product, when a production record is created, then the corresponding product stock is increased.
* The required inventory quantities are deducted according to the product's defined requirements.
* Production must not consume more inventory than the business rules allow.
* The production record must identify the product, quantity, and relevant production information.

### Story 10: Calculate production cost

* Given a product with defined inventory requirements and applicable inventory costs, when its production cost is requested, then the system calculates the cost using the required quantities and applicable costs.
* Changes to applicable inventory costs must be reflected in future cost calculations.
* The calculation must not modify inventory stock by itself.

### Story 11: Create a client

* Given an authorized administrator, when valid client information is submitted, then a client record is created.
* Required client information must be validated before the record is saved.

### Story 12: Create an order

* Given a customer and available products or services, when valid order information is submitted, then the order is created.
* The order must identify the customer and requested items.
* Each requested item must have a valid quantity.
* Products that are unavailable or inactive must not be added to new orders.

### Story 13: Read orders

* Given an authorized administrator, when the order management area is opened, then the administrator can view relevant customer orders.
* Given a signed-in customer, when they open their orders, then they can only view orders associated with their account.

### Story 14: Update an order

* Given an authorized administrator, when an order status is changed, then the new status is stored and visible to authorized users.
* Invalid status transitions must be rejected when they conflict with established business rules.

### Story 15: Create a promotion

* Given an authorized administrator, when valid promotion information is submitted, then the promotion is created.
* A promotional code must be unique within its applicable scope.
* An expired or inactive promotion must not be applied to new orders.

## Functional Requirements

### Authentication & Authorization

* FR-001: The system must allow customers to create accounts.
* FR-002: The system must allow registered customers to authenticate.
* FR-003: The system must protect administrative functionality from unauthorized users.
* FR-004: The system must enforce authorization on protected operations.
* FR-005: Customers must only be able to access their own account and order information.

### Inventory

* FR-006: The system must allow authorized administrators to create inventory items.
* FR-007: The system must allow authorized administrators to view inventory items.
* FR-008: The system must allow authorized administrators to update inventory items.
* FR-009: The system must allow authorized administrators to deactivate inventory items.
* FR-010: The system must maintain valid stock quantities.
* FR-011: Inventory changes must be attributable to a business operation.

### Products

* FR-012: The system must allow authorized administrators to create products.
* FR-013: The system must allow authorized administrators to view products.
* FR-014: The system must allow authorized administrators to update products.
* FR-015: The system must allow authorized administrators to deactivate products.
* FR-016: The system must allow administrators to associate inventory items with products.
* FR-017: The system must store the quantity of each inventory item required by a product.

### Production

* FR-018: The system must allow authorized administrators to record production.
* FR-019: Production must update product stock according to the quantity produced.
* FR-020: Production must consume the inventory quantities defined for the product.
* FR-021: The system must calculate production costs from product requirements and inventory costs.
* FR-022: The system must prevent production operations that violate applicable stock rules.

### Clients

* FR-023: The system must allow authorized administrators to create client records.
* FR-024: The system must allow authorized administrators to view client records.
* FR-025: The system must allow authorized administrators to update client records.
* FR-026: The system must allow authorized administrators to deactivate client records.

### Orders

* FR-027: The system must allow customers to browse active products or services.
* FR-028: The system must allow customers to create orders.
* FR-029: The system must allow customers to view their own orders.
* FR-030: The system must allow authorized administrators to view customer orders.
* FR-031: The system must allow authorized administrators to update order status.
* FR-032: The system must validate order quantities and requested products.
* FR-033: The system must prevent unauthorized users from accessing another customer's orders.

### Promotions

* FR-034: The system must allow authorized administrators to create promotional codes.
* FR-035: The system must allow authorized administrators to update promotional codes.
* FR-036: The system must allow authorized administrators to deactivate promotional codes.
* FR-037: The system must validate promotional codes before applying them to an order.

## Technical Requirements

* Framework: Next.js using the App Router.
* Language: TypeScript with strict type checking enabled.
* Type safety: The application must not use `any` as a shortcut for missing types.
* Styling: Tailwind CSS using a utility-first approach.
* Custom CSS should only be introduced when a Tailwind-based solution is not technically appropriate.
* Next.js Server Components should be the default.
* Client Components should only be used when browser-side interactivity or client-only APIs require them.
* The application must use Next.js file-based routing through the App Router.
* Critical business logic must have automated tests.
* Sensitive credentials, tokens, API keys, and environment secrets must not be exposed to the browser or committed to source control.
* The application must maintain a clear separation between public customer functionality and protected administrative functionality.
* The interface must be responsive and use accessible interaction patterns.
* Code should use clear English naming conventions for variables, functions, components, types, and files.

## Core API Endpoints

### Authentication

* POST `/api/auth/register`
* POST `/api/auth/login`
* POST `/api/auth/logout`
* GET `/api/auth/me`

### Inventory

* GET `/api/inventory`
* GET `/api/inventory/:id`
* POST `/api/inventory`
* PATCH `/api/inventory/:id`
* DELETE `/api/inventory/:id`

### Products

* GET `/api/products`
* GET `/api/products/:id`
* POST `/api/products`
* PATCH `/api/products/:id`
* DELETE `/api/products/:id`

### Product Ingredients

* GET `/api/products/:id/ingredients`
* POST `/api/products/:id/ingredients`
* PATCH `/api/products/:id/ingredients/:ingredientId`
* DELETE `/api/products/:id/ingredients/:ingredientId`

### Production

* GET `/api/production`
* GET `/api/production/:id`
* POST `/api/production`

### Clients

* GET `/api/clients`
* GET `/api/clients/:id`
* POST `/api/clients`
* PATCH `/api/clients/:id`
* DELETE `/api/clients/:id`

### Orders

* GET `/api/orders`
* GET `/api/orders/:id`
* POST `/api/orders`
* PATCH `/api/orders/:id`
* DELETE `/api/orders/:id`

### Promotions

* GET `/api/promotions`
* GET `/api/promotions/:id`
* POST `/api/promotions`
* PATCH `/api/promotions/:id`
* DELETE `/api/promotions/:id`

### Public Products & Requests

* GET `/api/public/products`
* GET `/api/public/products/:id`
* POST `/api/public/orders`

## Implementation Priority

### P0 — Core Foundation

The first implementation phase should establish the workflows required for the application to operate as a basic business-management system.

* Project structure and application foundation.
* User registration and authentication.
* Administrative authorization.
* Inventory item CRUD.
* Product CRUD.
* Product-to-inventory-item relationships.
* Basic production records.
* Production cost calculation.
* Basic client management.
* Basic order creation and management.

### P1 — Business Operations

* Product stock tracking.
* Improved production history.
* Complete order status management.
* Public product browsing.
* Customer order history.
* Promotional codes.
* Administrative dashboards and business summaries.
* Improved validation and error handling.

### P2 — Extended Features

* Advanced reporting.
* Business performance analytics.
* Advanced promotion management.
* Additional services management.
* Notifications.
* Additional customer-facing functionality.
* Future integrations and payment-related functionality.

## Success Criteria

* A new customer can create an account and authenticate successfully.
* An authorized administrator can create, view, update, and deactivate inventory items.
* An authorized administrator can create products and define their required inventory items.
* Production records correctly increase product stock and consume the corresponding inventory quantities.
* Production cost calculations reflect the quantities and applicable costs of the inventory items used by a product.
* Customers can create orders containing valid products and quantities.
* Customers can view only their own orders.
* Administrators can view and manage customer orders.
* Invalid inventory, product, production, client, and order data is rejected with understandable validation feedback.
* Unauthorized users cannot access protected administrative operations.
* Core inventory and production operations have automated tests covering their critical business rules.
* A typical administrator can complete common inventory and product management tasks without relying on paper records or external spreadsheets.
* The application remains usable on desktop and mobile screen sizes.

## Assumptions

* The initial release targets small businesses rather than large enterprise organizations.
* Administrative users are trusted business personnel with different levels of access from public customers.
* Inventory quantities may use units appropriate to the business, such as kilograms, grams, liters, units, or packages.
* Product production requirements are defined before production is recorded.
* Product production costs are derived from the inventory items required by the product.
* Historical business records should remain understandable even when related inventory items, products, or clients are deactivated.
* Payment processing is outside the core initial release unless explicitly added in a future feature.
* Advanced accounting, taxation, payroll, and enterprise resource planning functionality are outside the initial scope.
