You are an autonomous senior full-stack engineer working inside an existing local development environment.

Build a complete full-stack web application called DispatchDesk.

The application is a small-business delivery and dispatch management system.

The goal is NOT to build an over-engineered enterprise platform. Build a polished, believable, maintainable application that looks like something a small logistics company could actually use.

1. CORE TECHNOLOGY
Backend

Use:

Java 17+
Spring Boot
Spring Web
Spring Data JPA
Spring Security
PostgreSQL
Maven
Bean Validation
Flyway for database migrations
Lombok only if it genuinely improves readability
JUnit + Mockito for tests

Backend architecture should be conventional Spring Boot.

Use:

Controllers
Services
Repositories
DTOs
Entities
Exception handling
Validation
Security configuration

Do NOT create dozens of unnecessary abstractions.

Use REST APIs.

Frontend

Use:

React
TypeScript
Vite
React Router
TanStack Query
CSS / plain CSS modules or a clean CSS architecture

Avoid unnecessary frontend frameworks.

Do NOT use a giant component library that makes the application look generic.

Prefer building the interface yourself with reusable components.

Database

Use PostgreSQL.

The application should work with a real PostgreSQL database rather than an in-memory database.

Use Flyway migrations.

2. PRODUCT CONCEPT

DispatchDesk is used by a small delivery operation.

There are three primary types of users:

ADMIN

Can:

View all deliveries
Create deliveries
Edit deliveries
Assign drivers
Manage drivers
View customers
View operational statistics
View activity history
DISPATCHER

Can:

Create deliveries
Assign drivers
Change delivery status
View drivers
View delivery queues
Manage active deliveries
DRIVER

Can:

View deliveries assigned to them
View delivery details
Change delivery status
Mark a delivery as picked up
Mark it as out for delivery
Mark it as delivered
Report a failed delivery

Do not build complicated permissions beyond this.

3. IMPORTANT DESIGN PHILOSOPHY

This should feel like a real 2020-ish SaaS application.

Do NOT make it look like a 2025/2026 AI-generated dashboard.

Avoid:

giant gradients
excessive glassmorphism
glowing cards
purple/blue AI gradients
excessive rounded rectangles
huge typography
floating blobs
unnecessary animations
“AI-powered” labels
meaningless charts
excessive shadows
every element being inside a card
overly futuristic UI
excessive whitespace
generic Tailwind-looking SaaS templates

The interface should look like a competent product designed around 2019–2021.

Think:

practical
dense but readable
slightly conservative
functional
desktop-first
straightforward navigation
tables
sidebars
tabs
simple badges
restrained colors
subtle borders
small shadows where appropriate

It should feel like software a logistics company would actually use.

4. VISUAL DIRECTION

Use a restrained visual system.

Suggested palette:

off-white / very light gray page background
white content areas
dark charcoal text
muted gray secondary text
one primary accent color
green for successful states
orange/yellow for warnings
red for failures

Do not use gradients.

Do not use neon colors.

Do not make every button pill-shaped.

Buttons should generally have modest border radii around 4–6px.

Cards should have modest radius around 6–8px.

Inputs should look like traditional professional web application inputs.

Use subtle 1px borders.

Use a readable system font stack such as:

Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif

Do not import a huge number of fonts.

5. APPLICATION SHELL

Create a desktop-oriented application shell.

Layout:

Sidebar should contain:

DISPATCHDESK

Overview

Deliveries

Drivers

Customers

Activity

Settings

At the bottom:

Logged-in user
Role
Logout

The sidebar should be around 220–240px wide.

Do not make it enormous.

Navigation should be simple.

Use small icons if useful, but don't turn the interface into an icon-only navigation system.

6. DASHBOARD

The dashboard should be useful rather than decorative.

Header:

"Overview"

Small supporting text:

"Today's delivery operations"

Then a compact row of statistics:

Active deliveries
Pending assignment
Out for delivery
Delivered today

These should NOT look like giant futuristic metric cards.

Use restrained rectangular statistic panels.

Below:

Delivery activity

Show a simple chart representing deliveries over the last 7 days.

Use a basic line or bar chart.

Do not create a gigantic analytics dashboard.

Below the chart:

Current deliveries

A table containing:

Order
Customer
Destination
Driver
Status
Created
Actions

Include realistic sample data.

Example:

#DLV-1048
Mekdes Cafe
Bole, Addis Ababa
Samuel T.
Out for delivery
10:42

Use realistic Ethiopian names and Addis Ababa locations where appropriate.

Examples:

Bole
Kazanchis
CMC
Saris
Gerji
Piassa
Megenagna
Yeka
Mexico
Old Airport

Do not overdo the localization. The application should still look globally usable.

7. DELIVERY MANAGEMENT

This is the primary feature.

Route:

/deliveries

Page title:

"Deliveries"

Top area:

Deliveries
[+ New delivery]

Underneath, provide filters.

Filters:

Search
Status
Driver
Date

Search should search:

delivery ID
customer name
recipient
destination

Status options:

Pending
Assigned
Picked Up
Out for Delivery
Delivered
Failed
Cancelled

Then a professional table.

Columns:

ID
Customer
Recipient
Destination
Driver
Status
Created
Actions

Rows should have compact status badges.

Example:

Pending = neutral
Assigned = blue-ish
Picked Up = orange-ish
Out for Delivery = another restrained accent
Delivered = green
Failed = red
Cancelled = gray

Do not use huge pills.

8. CREATE DELIVERY

Clicking "+ New delivery" should open a proper form page or modal.

Fields:

Customer

Recipient name

Recipient phone

Delivery address

City

Delivery notes

Package description

Package size

Priority

Scheduled delivery date

Optional driver

Validation:

Recipient name required.

Phone required.

Address required.

Package description required.

Priority should be:

NORMAL
HIGH
URGENT

The server must validate all important fields.

Never rely only on React validation.

9. DELIVERY DETAIL PAGE

Route:

/deliveries/

This page should feel like a real operational record.

Header:

Delivery #DLV-1048

Status badge

Actions:

Assign driver
Change status
Edit
Cancel

Main content split into two sections.

LEFT:

Delivery information

Customer
Recipient
Phone
Address
Package
Priority
Created
Scheduled date

RIGHT:

Driver information

Driver name
Phone
Vehicle
Current assignment

Below:

Status history

Display a vertical timeline.

Example:

09:14
Delivery created

09:22
Assigned to Samuel Tesfaye

10:03
Package picked up

10:41
Out for delivery

12:18
Delivered

Each status transition should be stored in the database.

Do NOT fake the timeline on the frontend.

10. DELIVERY STATE MACHINE

Implement proper backend business logic.

Valid transitions:

PENDING -> ASSIGNED
PENDING -> CANCELLED

ASSIGNED -> PICKED_UP
ASSIGNED -> CANCELLED

PICKED_UP -> OUT_FOR_DELIVERY

OUT_FOR_DELIVERY -> DELIVERED
OUT_FOR_DELIVERY -> FAILED

FAILED -> OUT_FOR_DELIVERY

Do not allow arbitrary status changes.

For example:

DELIVERED -> OUT_FOR_DELIVERY

must be rejected.

The backend should return an appropriate HTTP error.

This is an important part of the project.

11. DRIVER MANAGEMENT

Route:

/drivers

Show:

Drivers

[+ Add driver]

Table:

Name
Phone
Vehicle
Status
Active deliveries
Actions

Driver statuses:

AVAILABLE
ON_DELIVERY
OFFLINE

Driver detail page:

/drivers/

Show:

Driver profile

Name
Phone
Vehicle
License/reference number
Status

Current deliveries

Delivery history

A driver should be assignable to deliveries.

Prevent assigning a driver who is OFFLINE.

A driver can have multiple deliveries, but keep the business logic reasonable.

12. DRIVER VIEW

When logged in as a DRIVER, the interface should be simplified.

Dashboard:

"My deliveries"

Show:

Today's assigned deliveries

Each delivery should show:

Delivery ID
Recipient
Address
Priority
Status

Driver can open a delivery and update its status.

For example:

Assigned

[Mark picked up]

Then:

Picked up

[Start delivery]

Then:

Out for delivery

[Mark delivered]
[Report failed]

Do not allow drivers to access admin-only screens.

Backend authorization must enforce this too.

Do not merely hide frontend buttons.

13. CUSTOMERS

Route:

/customers

Create a simple customer management page.

Fields:

Customer name
Contact person
Phone
Email
Address
Notes

Customer detail page should show:

Customer information

Recent deliveries

Total deliveries

Successful deliveries

Failed deliveries

Keep this feature intentionally simple.

14. ACTIVITY LOG

Route:

/activity

Show an operational audit/activity feed.

Examples:

Samuel Tesfaye was assigned to DLV-1048

Delivery DLV-1048 changed to OUT_FOR_DELIVERY

Mekdes Cafe created delivery DLV-1051

Delivery DLV-1039 marked as delivered

Store these activities in the database.

Include:

timestamp
actor
action
entity
entity ID

The UI can display them as a simple chronological list.

15. AUTHENTICATION

Implement authentication.

Use Spring Security.

Use username/email + password.

Passwords must be hashed using BCrypt.

Do NOT store plaintext passwords.

Authentication can use JWT.

Create:

POST /api/auth/login

Response:

token
user
role

Frontend should store authentication state appropriately.

Protect API routes.

Roles:

ADMIN
DISPATCHER
DRIVER

Use Spring Security method/request authorization.

Examples:

ADMIN can access everything.

DISPATCHER can manage deliveries and drivers.

DRIVER can access only their assigned deliveries and their own profile.

16. DATABASE MODEL

Create sensible entities.

At minimum:

User

Driver

Customer

Delivery

DeliveryStatusHistory

ActivityLog

Potential structure:

User

id
name
email
passwordHash
role
createdAt

Driver

id
user
phone
vehicle
licenseNumber
status
createdAt

Customer

id
name
contactPerson
phone
email
address
notes
createdAt

Delivery

id
deliveryNumber
customer
recipientName
recipientPhone
address
city
packageDescription
packageSize
priority
status
driver
scheduledDate
createdAt
updatedAt

DeliveryStatusHistory

id
delivery
oldStatus
newStatus
changedBy
changedAt
note

ActivityLog

id
actor
action
entityType
entityId
description
createdAt

Use proper relationships.

Avoid unnecessary bidirectional relationships where they create serialization problems.

Use DTOs rather than exposing JPA entities directly from controllers.

17. DELIVERY NUMBER GENERATION

Do not expose raw database IDs as the primary delivery identifier.

Generate delivery numbers such as:

DLV-1001
DLV-1002
DLV-1003

They should be unique.

The exact implementation can be simple.

Do not over-engineer distributed ID generation.

18. API DESIGN

Use clean REST endpoints.

Examples:

POST /api/auth/login

GET /api/deliveries

GET /api/deliveries/{id}

POST /api/deliveries

PUT /api/deliveries/{id}

POST /api/deliveries/{id}/assign

POST /api/deliveries/{id}/status

POST /api/deliveries/{id}/cancel

GET /api/deliveries/{id}/history

GET /api/drivers

GET /api/drivers/{id}

POST /api/drivers

PUT /api/drivers/{id}

GET /api/customers

GET /api/customers/{id}

POST /api/customers

PUT /api/customers/{id}

GET /api/activity

GET /api/dashboard/stats

GET /api/dashboard/activity

Keep endpoints predictable.

19. ERROR HANDLING

Create global exception handling using:

@RestControllerAdvice

Return consistent error responses.

Example:

{
"timestamp": "...",
"status": 400,
"error": "Bad Request",
"message": "Invalid delivery status transition",
"path": "/api/deliveries/12/status"
}

Handle:

Validation errors
Not found
Unauthorized
Forbidden
Invalid state transitions
Duplicate resources
Database-related errors where appropriate

Frontend should display useful errors rather than silently failing.

20. FRONTEND STRUCTURE

Organize React logically.

Possible structure:

src/

components/

layout/

deliveries/

drivers/

customers/

dashboard/

activity/

pages/

services/

hooks/

types/

utils/

routes/

Do not create a 200-file architecture for a relatively small application.

Keep things understandable.

21. FRONTEND UX

Important:

Loading states.

Empty states.

Error states.

Confirmation dialogs.

Form validation.

Success feedback.

Disable buttons while requests are being submitted.

Do not allow users to accidentally submit a form twice.

Tables should handle:

no results
loading
errors

Example empty state:

"No deliveries found"

"Try changing your filters or create a new delivery."

22. SEARCH + FILTERING

Delivery filtering should work through backend query parameters.

Example:

GET /api/deliveries?search=cafe&status=OUT_FOR_DELIVERY&driverId=3

Do not download every delivery to the browser and filter everything in JavaScript.

Implement reasonable server-side filtering.

Pagination should be supported.

Example:

?page=0&size=20

Response should contain:

content
page
size
totalElements
totalPages

The frontend should display pagination.

Do not build infinite scroll.

23. DASHBOARD STATISTICS

Backend should calculate actual statistics from the database.

For example:

Active deliveries
Pending assignments
Out for delivery
Delivered today
Failed today

Do not hard-code these values.

Use database queries.

Keep the analytics basic.

24. SEED DATA

Provide development seed data.

Create a few users.

Example:

admin@dispatchdesk.local
dispatcher@dispatchdesk.local
driver1@dispatchdesk.local
driver2@dispatchdesk.local

Use a documented development password.

Create:

5–10 customers

5 drivers

15–25 deliveries

multiple delivery statuses

status history

activity log records

Use realistic but fictional information.

Make the initial dashboard immediately look populated.

25. RESPONSIVE DESIGN

Desktop is the primary target.

However, the application should remain usable around:

1024px

768px

Mobile does not need to be perfect.

At smaller widths:

Sidebar can collapse.

Tables can become horizontally scrollable.

Forms can become one column.

Do not spend excessive time building a mobile app.

26. VISUAL DETAILS

Use:

small icons

subtle hover states

simple transitions

clear typography

consistent spacing

border separators

compact tables

professional forms

Avoid:

confetti

animated backgrounds

3D effects

glassmorphism

gradient buttons

huge rounded cards

AI chat bubbles

floating assistant widgets

dark futuristic dashboards

27. IMPORTANT: MAKE IT FEEL REAL

The biggest goal is believability.

If someone opens the project on GitHub and runs it, they should immediately understand:

"This is a delivery operations system."

The application should not look like a portfolio toy.

Use realistic terminology.

Examples:

"Assign driver"

"Change status"

"Delivery history"

"Failed delivery"

"Scheduled date"

"Recipient"

"Operational activity"

Avoid meaningless marketing copy such as:

"Unlock the future of logistics"

"Revolutionize your workflow"

"AI-powered logistics intelligence"

This is normal business software.

28. BACKEND CODE QUALITY

Follow standard Java conventions.

Use:

meaningful class names
meaningful method names
constructor injection
DTOs
enums
service-layer business logic
repository interfaces
validation annotations
centralized error handling

Avoid:

giant controllers
business logic inside controllers
static utility abuse
unnecessary design patterns
massive service classes
duplicated code
magic strings
29. TESTING

Write meaningful backend tests.

At minimum test:

Authentication

Delivery creation

Delivery retrieval

Delivery assignment

Valid status transition

Invalid status transition

Driver authorization

Validation failures

Dashboard statistics

Use unit tests for business logic.

Use integration tests where useful.

The important business rules must have tests.

Do not write tests just to inflate test count.

30. DOCUMENTATION

Create a good README.

Include:

Project overview

Features

Tech stack

Architecture overview

Database setup

Environment variables

How to run backend

How to run frontend

How to run PostgreSQL

Seed accounts

API overview

Screenshots section placeholder

Testing instructions

Example credentials

Possible future improvements

Do not write fake claims such as "production-ready enterprise architecture."

Be honest.

31. LOCAL DEVELOPMENT

Provide:

.env.example

application configuration example

Docker Compose for PostgreSQL

The application should be easy to start.

Ideally:

docker compose up -d

then:

cd backend
./mvnw spring-boot

and:

cd frontend
npm install
npm run dev

Adapt commands to the actual project structure.

32. DOCKER

Create a Docker Compose configuration containing PostgreSQL.

Do not necessarily containerize every development component unless it is straightforward.

The goal is simple local setup.

33. SECURITY

Implement basic sensible security.

Never:

hardcode production secrets
commit passwords
expose password hashes
trust role information from the frontend
rely only on frontend route protection

Use environment variables for secrets.

CORS should be configured intentionally.

34. WHAT NOT TO BUILD

Do NOT add:

AI chatbot
machine learning
payment processing
maps API
live GPS tracking
WebSockets
microservices
Kafka
Redis
Kubernetes
Elasticsearch
event sourcing
CQRS
complicated geospatial calculations

Those technologies are unnecessary for this project.

The purpose is to demonstrate strong fundamentals.

35. DEVELOPMENT PROCESS

Before writing significant code:

Inspect the existing repository.
Determine whether a project already exists.
Understand the current directory structure.
Do not overwrite unrelated work.
Decide on a clean project structure.
Implement backend foundation.
Implement database migrations.
Implement authentication.
Implement delivery functionality.
Implement drivers/customers.
Implement dashboard.
Implement frontend.
Connect frontend to backend.
Add seed data.
Add tests.
Run the application.
Fix compile errors.
Fix runtime errors.
Test important flows.
Polish the UI.

Do not stop after creating files.

Actually run the application and verify it.

36. AGENT BEHAVIOR

You have autonomy to make reasonable implementation decisions.

Do not repeatedly ask me questions for small design decisions.

If something is ambiguous, choose the simplest professional implementation.

Do not over-engineer.

Do not add dependencies unless necessary.

Do not replace the requested stack.

Do not switch Spring Boot for another backend framework.

Do not switch React for another frontend framework.

Do not use Next.js.

Do not use Firebase/Supabase as a replacement for the Spring backend.

Do not use mock APIs instead of the real backend.

37. DEFINITION OF DONE

The project is complete only when:

Backend compiles.
Frontend compiles.
PostgreSQL starts correctly.
Flyway migrations execute successfully.
Seed data loads.
Login works.
Role-based authorization works.
Dashboard displays real database data.
Deliveries can be created.
Deliveries can be searched.
Deliveries can be filtered.
Deliveries can be paginated.
Drivers can be assigned.
Status transitions work.
Invalid status transitions are rejected.
Delivery history is recorded.
Activity logs are recorded.
Driver view works.
Customers can be managed.
Errors are handled cleanly.
Important backend logic has tests.
README explains how to run everything.
UI is visually consistent.
UI does NOT look like an AI-generated futuristic SaaS template.
38. FINAL UI CHECK

Before declaring completion, inspect every major page:

/login

/dashboard

/deliveries

/deliveries/

/drivers

/drivers/

/customers

/customers/

/activity

/settings

Ask yourself:

Does this look like something designed around 2020?

Does it feel practical?

Are there too many cards?

Are there unnecessary gradients?

Are there too many rounded elements?

Does everything look like a modern AI dashboard?

If yes, simplify it.

The design should communicate:

"boring, competent business software"

rather than:

"AI startup landing page."

39. PRIORITY ORDER

If time becomes limited, prioritize in this order:

Backend correctness
Authentication/authorization
Delivery state machine
Database integrity
Delivery management UI
Driver management
Dashboard
Customer management
Activity history
Visual polish

A smaller application that actually works is preferable to a huge application with broken features.

Start by inspecting the repository and then implement the project end-to-end.