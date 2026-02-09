# Knowledge Graph - Fur Fetch Pet Adoption Portal

## Entities

| Entity | Type | Location | Description |
|--------|------|----------|-------------|
| User | Model | server/models/user.js | User entity with authentication, role management ✓ |
| Pet | Model | server/models/pet.js | Pet entity with details for adoption listings ✓ |
| AdoptionApplication | Model | server/models/application.js | Application entity for pet adoption requests ✓ |
| Session | Model | server/models/user.js:58 | Session management for refresh tokens ✓ |
| petRoutes | Router | server/routes/pet.js | Pet CRUD endpoints with filters ✓ |
| applicationRoutes | Router | server/routes/application.js | Application management endpoints ✓ |
| isAdmin | Middleware | server/middleware/auth.js:35 | Admin authorization middleware ✓ |
| authAPI | API Module | client/src/api/auth.js | Client-side authentication API functions ✓ |
| petAPI | API Module | client/src/api/pet.js | Client-side pet API functions ✓ |
| applicationAPI | API Module | client/src/api/application.js | Client-side application API functions ✓ |
| apiClient | Axios Instance | client/src/api/client.js | Configured axios instance with interceptors ✓ |
| tokenManager | Utility | client/src/api/client.js:15 | Token storage and management utilities ✓ |
| AuthProvider | Component | client/src/components/AuthProvider.jsx | React context for auth state with useMemo isAdmin value ✓ |
| Layout | Component | client/src/components/Layout.jsx | Main layout with header and footer ✓ |
| PetCard | Component | client/src/components/PetCard.jsx | Pet card with Week 2 design ✓ |
| HomePage | Page | client/src/pages/HomePage.jsx | Pet listing with filters ✓ |
| PetDetailPage | Page | client/src/pages/PetDetailPage.jsx | Individual pet details ✓ |
| LoginPage | Page | client/src/pages/LoginPage.jsx | User login form ✓ |
| RegisterPage | Page | client/src/pages/RegisterPage.jsx | User registration form ✓ |
| ApplicationFormPage | Page | client/src/pages/ApplicationFormPage.jsx | Adoption application form ✓ |
| MyApplicationsPage | Page | client/src/pages/MyApplicationsPage.jsx | User's application tracking ✓ |
| AdminDashboard | Page | client/src/pages/AdminDashboard.jsx | Admin application management ✓ |
| App | Component | client/src/App.jsx | Router configuration with protected routes ✓ |
| theme | Configuration | client/src/theme.js | Chakra UI theme with Week 2 colors ✓ |

## Relationships

| Source | Relationship | Target | Description |
|--------|--------------|--------|-------------|
| User | has_many | Pet | User can create/own multiple pets (admin) |
| User | has_many | AdoptionApplication | User can submit multiple adoption applications |
| User | has_many | Session | User can have multiple active sessions |
| Pet | belongs_to | User | Pet has an owner (admin user) |
| Pet | has_many | AdoptionApplication | Pet can have multiple adoption applications |
| AdoptionApplication | belongs_to | User | Application submitted by a user |
| AdoptionApplication | belongs_to | Pet | Application for a specific pet |
| User | has_many | favoritePets | User can favorite multiple pets |
| apiClient | uses | tokenManager | Axios interceptors use token manager for auth |
| authAPI | uses | apiClient | Auth functions use axios client for API calls |
| Session | belongs_to | User | Session tracks user authentication |

## Patterns Applied

| Pattern | Implementation | Location | Purpose |
|---------|----------------|----------|---------|
| MVC Architecture | Model-View-Controller | Full stack | Separation of concerns between data, UI, and logic |
| JWT Authentication | Access + Refresh Tokens | server/routes/auth.js | Secure stateless authentication |
| Token Refresh Pattern | Automatic token renewal | client/src/api/client.js:40-70 | Seamless auth experience |
| Password Hashing | bcryptjs with salt | server/models/user.js:40-50 | Secure password storage |
| Middleware Chain | Express middleware | server/middleware/auth.js | Request authentication and authorization |
| API Interceptors | Request/Response hooks | client/src/api/client.js:29-71 | Automatic token injection and refresh |
| Context API | React Context | client/src/components/AuthProvider.jsx | Global auth state management ✓ |
| React Query | Data fetching | client/src | Server state management and caching |
| Chakra UI | Component library | client/src | Consistent UI components |
| Soft Delete | isActive flag | All models | Preserve data integrity |
| Role-Based Access | User.role enum | server/models/user.js | Admin vs regular user permissions |
| Schema Validation | Joi schemas | server/routes | Input validation |
| Repository Pattern | Mongoose models | server/models | Data access abstraction |

## Data Flow

### User Registration Flow
```
Client Registration Form
    ↓
authAPI.register()
    ↓
POST /api/auth/register
    ↓
Joi Validation
    ↓
Check Duplicate User
    ↓
Create User (hash password)
    ↓
Generate JWT Tokens
    ↓
Create Session
    ↓
Return User + Tokens
    ↓
tokenManager.setTokens()
    ↓
Store in localStorage
```

### User Login Flow
```
Client Login Form
    ↓
authAPI.login()
    ↓
POST /api/auth/login
    ↓
Joi Validation
    ↓
Find User by Email
    ↓
Compare Password Hash
    ↓
Generate JWT Tokens
    ↓
Create Session
    ↓
Return User + Tokens
    ↓
tokenManager.setTokens()
    ↓
Store in localStorage
```

### Token Refresh Flow
```
API Request with Expired Access Token
    ↓
Response 401 Unauthorized
    ↓
Interceptor Catches Error
    ↓
POST /api/auth/refresh (with refresh token)
    ↓
Verify Refresh Token
    ↓
Check Session Active
    ↓
Generate New Tokens
    ↓
Update Session
    ↓
Return New Tokens
    ↓
Retry Original Request
```

### Pet Adoption Application Flow (IMPLEMENTED ✓)
```
User Browses Pets (HomePage)
    ↓
Filters Applied (Breed, Age, Size, Location, Urgent)
    ↓
petAPI.getPets(filters)
    ↓
View Pet Cards (PetCard component)
    ↓
Click "Learn More" → PetDetailPage
    ↓
Click "Apply to Adopt"
    ↓
Redirect to ApplicationFormPage
    ↓
Fill Application Form (Week 3 schema fields)
    ↓
applicationAPI.submitApplication()
    ↓
POST /api/applications
    ↓
Joi Validation
    ↓
Check Pet Available
    ↓
Check No Duplicate Pending Application
    ↓
Create Application Record
    ↓
Link to User and Pet
    ↓
Status: Pending
    ↓
Return Success
    ↓
Redirect to MyApplicationsPage
```

### Admin Application Review Flow (IMPLEMENTED ✓)
```
Admin Login
    ↓
Navigate to AdminDashboard
    ↓
applicationAPI.getAllApplications(status)
    ↓
GET /api/applications/admin/all?status=...
    ↓
View Statistics (total, pending, approved, rejected)
    ↓
Filter by Status (all/pending/approved/rejected)
    ↓
View Application Cards
    ↓
Click "Update Application"
    ↓
Edit Status + Add Admin Notes
    ↓
applicationAPI.updateApplication(id, data)
    ↓
PUT /api/applications/:id
    ↓
Update status, notes, lastUpdated
    ↓
Joi Validation
    ↓
Save to Database
    ↓
Invalidate queries, refresh UI
    ↓
Return Updated Application
```

## Security Model

| Component | Security Feature | Implementation |
|-----------|-----------------|----------------|
| Password Storage | bcrypt hashing (salt rounds: 12) | User.pre('save') hook |
| Authentication | JWT with expiry | Access token (15min), Refresh token (7 days) |
| Authorization | Role-based access control | User.role field (user/admin) |
| Token Storage | localStorage (client) | tokenManager utility |
| Session Tracking | Session model with expiry | Tracks refresh tokens and device info |
| Request Headers | Bearer token | Authorization: Bearer <token> |
| CORS | Enabled with helmet | server/index.js:19 |
| Rate Limiting | Express rate limit | server/index.js:24-28 |
| Input Validation | Joi schemas | All POST/PUT routes |
| Soft Deletes | isActive flag | Prevents data loss |

## API Endpoints

### Authentication Endpoints (IMPLEMENTED)
```
POST   /api/auth/register     - Create new user account
POST   /api/auth/login        - Authenticate user
POST   /api/auth/logout       - Invalidate session
POST   /api/auth/refresh      - Renew access token
GET    /api/auth/profile      - Get user profile (authenticated)
```

### Pet Endpoints (IMPLEMENTED ✓)
```
GET    /api/pets              - List available pets (public, filterable)
GET    /api/pets/:id          - Get pet details (public)
POST   /api/pets              - Create pet (admin only)
PUT    /api/pets/:id          - Update pet (admin only)
DELETE /api/pets/:id          - Soft delete pet (admin only)
```

### Application Endpoints (IMPLEMENTED ✓)
```
POST   /api/applications           - Submit adoption application (authenticated)
GET    /api/applications           - Get user's applications (authenticated)
GET    /api/applications/admin/all - Get all applications with filters (admin only)
GET    /api/applications/admin/stats - Get statistics (admin only)
GET    /api/applications/:id       - Get single application (owner or admin)
PUT    /api/applications/:id       - Update application status (admin only)
DELETE /api/applications/:id       - Delete application (admin only)
```

### User Endpoints (TO IMPLEMENT)
```
GET    /api/user/favorites         - Get favorite pets (authenticated)
POST   /api/user/favorites/:petId  - Add to favorites (authenticated)
DELETE /api/user/favorites/:petId  - Remove from favorites (authenticated)
```

## Frontend Architecture

### Component Hierarchy (IMPLEMENTED ✓)
```
main.jsx ✓
  ├── Provider (Chakra UI with custom theme) ✓
  ├── QueryClientProvider (React Query) ✓
  ├── AuthProvider ✓
  └── BrowserRouter ✓
      └── App.jsx ✓
          ├── Layout ✓
          │   ├── Header (Navigation, Auth buttons) ✓
          │   └── Footer ✓
          ├── Routes (Public) ✓
          │   ├── HomePage (Pet Listing with filters) ✓
          │   ├── PetDetailPage ✓
          │   ├── LoginPage ✓
          │   └── RegisterPage ✓
          ├── Routes (Protected) ✓
          │   ├── ApplicationFormPage ✓
          │   └── MyApplicationsPage ✓
          └── Routes (Admin) ✓
              └── AdminDashboard (Application management + stats) ✓
```

### State Management
| State Type | Solution | Location | Purpose |
|------------|----------|----------|---------|
| Server State | React Query | All API calls | Caching, refetching, mutations |
| Auth State | Context API | AuthProvider | User info, login status |
| Local State | useState | Components | Form inputs, UI toggles |
| Form State | react-hook-form | Forms | Form validation and submission |

## UI Design System (Week 2 Inspired)

### Color Palette (defined in client/src/theme.js & global-css.ts)
```css
/* Primary Color Scheme: Teal (applied globally) */
/* Set via global-css.ts: colorPalette: "teal" */

/* Teal Palette (used throughout app) */
teal.50:   /* Light backgrounds */
teal.100:  /* Borders, footer bg */
teal.500:  /* Primary - header bg, buttons, headings */
teal.600:  /* Hover states */
teal.700:  /* Active/dark accents */

/* Brand Green Palette (accent colors in About sections) */
brand.green.50:  #f7fef6  /* Lightest - backgrounds */
brand.green.100: #d9fdd3  /* Light - borders, accents */
brand.green.400: #98e6b5  /* Secondary - accents */
brand.green.600: #65cc79  /* Text accents */
brand.green.700: #4cbf5b  /* Headings */

/* Semantic Tokens */
bg.primary:     #fafafa                  /* Page background */
bg.card:        white                    /* Card background */

/* Application Usage */
Header:         bg="teal.500"
Footer:         bg="teal.50"
Buttons:        colorPalette="teal"
Headings:       color="teal.600"
Accents:        teal.100, teal.500, teal.600
```

### Spacing & Layout
```
Container Max Width: 1400px
Card Border Radius: 25px
Grid Gap: 30px
Card Padding: 22px
Grid Template: repeat(auto-fill, minmax(280px, 1fr))
```

### Typography
```
Header Font: 3em (Segoe UI, Poppins)
Pet Name: 1.5em (bold)
Body: 1em-1.2em
```

### Effects
```
Card Shadow: 0 10px 30px rgba(255, 182, 193, 0.25)
Hover Transform: translateY(-10px) scale(1.02)
Button Hover: scale(1.05)
```

## Database Schema

### Collections (IMPLEMENTED ✓)
1. **users** - User accounts and authentication ✓
2. **sessions** - Active refresh token sessions ✓
3. **pets** - Pet listings for adoption ✓
4. **applications** - Adoption applications ✓

### Indexes (IMPLEMENTED ✓)
```javascript
// Users ✓
users.email (unique)
users.username (unique)
users.isActive

// Pets ✓
pets.petType
pets.isAvailable
pets.isActive
pets.location + breed + name (text index for search)

// Applications ✓
applications.applicantId
applications.petId
applications.status
applications.submittedDate (descending)

// Sessions ✓
sessions.refreshToken (unique)
sessions.userId
sessions.expiresAt
```

## File Structure

```
/workspaces/Wil-Project/
├── client/                          # React frontend
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.js             # Auth API functions ✓
│   │   │   ├── client.js           # Axios instance ✓
│   │   │   ├── pet.js              # Pet API functions ✓
│   │   │   └── application.js      # Application API functions ✓
│   │   ├── components/
│   │   │   ├── ui/                 # Chakra UI components ✓
│   │   │   ├── AuthProvider.jsx    # Auth context ✓
│   │   │   ├── Layout.jsx          # Header + Footer ✓
│   │   │   └── PetCard.jsx         # Pet card with Week 2 design ✓
│   │   ├── pages/
│   │   │   ├── HomePage.jsx        # Pet listing + filters ✓
│   │   │   ├── PetDetailPage.jsx   # Pet details ✓
│   │   │   ├── LoginPage.jsx       # Login form ✓
│   │   │   ├── RegisterPage.jsx    # Registration form ✓
│   │   │   ├── ApplicationFormPage.jsx  # Adoption form ✓
│   │   │   ├── MyApplicationsPage.jsx   # User applications ✓
│   │   │   └── AdminDashboard.jsx  # Admin panel ✓
│   │   ├── theme.js                # Custom Chakra theme ✓
│   │   ├── App.jsx                 # Router with protected routes ✓
│   │   └── main.jsx                # Entry point ✓
│   └── package.json                # Dependencies ✓
├── server/                          # Express backend
│   ├── models/
│   │   ├── user.js                 # User + Session models ✓
│   │   ├── pet.js                  # Pet model ✓
│   │   └── application.js          # Application model ✓
│   ├── routes/
│   │   ├── auth.js                 # Auth routes ✓
│   │   ├── pet.js                  # Pet CRUD routes ✓
│   │   ├── application.js          # Application routes ✓
│   │   └── user.js                 # User routes (partial)
│   ├── middleware/
│   │   └── auth.js                 # JWT + Admin middleware ✓
│   ├── helper/
│   │   └── jwt.js                  # JWT utilities ✓
│   ├── index.js                    # Server entry ✓
│   └── package.json                # Dependencies ✓
├── Week2/                           # UI inspiration reference
│   ├── index.html
│   └── style.css
├── Week3/                           # MVC reference for applications
│   ├── model.js
│   ├── view.js
│   ├── controller.js
│   └── app.js
├── CLAUDE.md                        # Development instructions ✓
├── KNOWLEDGE.md                     # This file ✓
└── .dev_plan.md                     # Development plan ✓
```

## Technology Stack

### Backend
- **Runtime**: Node.js with CommonJS modules
- **Framework**: Express.js 4.21
- **Database**: MongoDB with Mongoose 8.0
- **Authentication**: JWT (jsonwebtoken 9.0)
- **Password**: bcryptjs 2.4
- **Validation**: Joi 17.11
- **Security**: helmet 7.1, cors 2.8, express-rate-limit 7.1

### Frontend
- **Framework**: React 19.1 with ES6 modules
- **Build Tool**: Vite 7.0
- **UI Library**: Chakra UI 3.24
- **Data Fetching**: React Query 5.83
- **Routing**: React Router 7.7
- **HTTP Client**: Axios 1.11
- **Forms**: react-hook-form 7.62

## Development Status

### Completed Features ✓
- ✅ Backend fully implemented (Models, Routes, Middleware)
- ✅ Pet model with Week 2 schema
- ✅ Application model with Week 3 schema
- ✅ User model with role field (user/admin)
- ✅ Pet CRUD routes with filters
- ✅ Application routes with admin management
- ✅ Admin middleware for authorization
- ✅ Frontend core architecture (AuthProvider, App, Layout, theme)
- ✅ Pet browsing with filters (breed, age, size, location, urgent)
- ✅ Pet detail pages with Week 2 design
- ✅ Adoption application submission (Week 3 schema)
- ✅ User application tracking (MyApplicationsPage)
- ✅ Admin dashboard with statistics
- ✅ Application status management
- ✅ Custom Chakra UI theme with Week 2 colors

### Optional Future Enhancements
- Favorites system (backend ready, frontend not implemented)
- Image upload for pets
- Email notifications
- Search history
- Advanced analytics
- Real-time updates with WebSockets
- Pet recommendation system

## Recent Changes

### 2026-02-05: CRITICAL - API Integration Fixed ⚠️
**Problem Discovered:**
During pre-deployment verification, found that frontend and backend API endpoints were mismatched, which would cause all API calls to fail with 404 errors.

**Three Critical Issues Fixed:**

1. **Missing `/api` Prefix in Pet API** (client/src/api/pet.js)
   - **Root Cause**: Frontend was calling `/pets` but backend expected `/api/pets`
   - **Impact**: All pet browsing would fail (HomePage, PetDetailPage)
   - **Fix**: Added `/api` prefix to all endpoints (lines 16, 24, 30, 36, 42)
   - **Affected Endpoints**:
     - `GET /pets` → `GET /api/pets`
     - `GET /pets/:id` → `GET /api/pets/:id`
     - `POST /pets` → `POST /api/pets`
     - `PUT /pets/:id` → `PUT /api/pets/:id`
     - `DELETE /pets/:id` → `DELETE /api/pets/:id`

2. **Missing `/api` Prefix in Application API** (client/src/api/application.js)
   - **Root Cause**: Frontend was calling `/applications` but backend expected `/api/applications`
   - **Impact**: Application submission and tracking would fail completely
   - **Fix**: Added `/api` prefix to all endpoints (lines 6, 12, 18, 25-26, 33, 39, 45)
   - **Affected Endpoints**:
     - `POST /applications` → `POST /api/applications`
     - `GET /applications` → `GET /api/applications`
     - `GET /applications/:id` → `GET /api/applications/:id`
     - `GET /applications/admin/all` → `GET /api/applications/admin/all`
     - `GET /applications/admin/stats` → `GET /api/applications/admin/stats`
     - `PUT /applications/:id` → `PUT /api/applications/:id`
     - `DELETE /applications/:id` → `DELETE /api/applications/:id`

3. **Route Ordering Problem in Application Routes** (server/routes/application.js)
   - **Root Cause**: Express routes matched in order - generic `/:id` was defined before specific `/admin/all` and `/admin/stats`
   - **Impact**: Requests to `/api/applications/admin/all` would match `/:id` route, treating 'admin' as an application ID
   - **Fix**: Moved admin routes (GET /admin/all, GET /admin/stats) to lines 91-157, BEFORE the `:id` route at line 159
   - **Why This Matters**: Express matches routes sequentially, so more specific routes must come before generic parameterized routes

**Verification Summary:**
- ✅ Auth API: All endpoints correctly use `/api/auth/*` (was already correct)
- ✅ Pet API: All endpoints now use `/api/pets/*` (fixed)
- ✅ Application API: All endpoints now use `/api/applications/*` (fixed)
- ✅ Route ordering: Admin routes now accessible before `:id` catch-all (fixed)

**Why This Happened:**
- Auth API was implemented first and correctly included `/api` prefix as a reference
- Pet and Application APIs were created later and inconsistently omitted the prefix
- Frontend baseURL is `http://localhost:3000` without `/api`, so each endpoint must include the full path

**Lesson Learned:**
Always verify endpoint paths match between frontend API clients and backend route registration during integration phase, not just at deployment.

### 2026-02-05: Database Seed Script Created with Image URLs
**New File:**
- server/seed.js - Comprehensive database seeding script

**Seed Data:**
- 4 Users (1 admin + 3 regular users)
- 18 Pets (7 dogs, 8 cats, 3 other animals)
- 8 Sample Applications (3 approved, 3 pending, 2 rejected)

**Pet Variety:**
- Dogs: Golden Retriever, Labrador, German Shepherd, Beagle, Bulldog, Mixed Breed, Husky
- Cats: Tabby, Siamese, Black Cat, Persian, Calico, Orange Tabby, Ragdoll
- Other: Dwarf Rabbit, Guinea Pig, Parakeet, Red-Eared Slider (turtle)
- Age ranges: Puppy/Kitten (6-8 months), Young (12-24 months), Adult (36-60 months), Senior (96-108 months)
- Sizes: Small, Medium, Large
- Locations: 15+ different US cities
- 4 pets marked as urgent adoption
- All pets include emojis, descriptions, health status

**Image URLs:**
- Dog images: Using Dog CEO API (https://dog.ceo) - 2-3 breed-specific images per dog
- Cat images: Using CATAAS API (https://cataas.com) - 2-3 varied images per cat with different filters
- All pets now have realistic image URLs for frontend display

**Usage:**
```bash
cd server
npm run seed
```

**Default Credentials:**
- Admin: admin@furetch.com / password123
- Users: john.doe@example.com, jane.smith@example.com, petlover@example.com / password123

### 2026-02-05: Backend Cleanup - Removed Unused Link Code
**Removed Entities:**
- Link Model (server/models/link.js) - Legacy pastebin functionality
- Link Routes (server/routes/link.js) - CRUD operations for links/pastes
- Public Link Routes (server/routes/public/link.js) - Public paste access

**Updated Files:**
- server/index.js:
  - Removed linkRoutes and publicRoutes imports
  - Removed `/api/links` and `/paste` route registrations
  - Updated database name from 'pastebin' to 'pet-adoption'

**Impact:**
- Codebase now fully focused on pet adoption functionality
- No remnants of original pastebin project
- Database properly named for pet adoption portal

### 2026-02-05: UI Consistency - Teal Color Scheme & AuthProvider Optimization
**Color Scheme Update:**
- Changed entire app from pink to teal color scheme
- Layout.jsx: Header bg teal.500, Footer bg teal.50
- All pages updated: HomePage, PetDetailPage, LoginPage, RegisterPage, ApplicationFormPage, MyApplicationsPage, AdminDashboard
- PetCard: Updated to teal accent colors
- All colorPalette props changed from "pink" to "teal"
- All brand.pink references changed to teal equivalents

**AuthProvider Optimization:**
- Changed `isAdmin` from function to memoized value using useMemo
- Usage: Access `isAdmin` as a value (not `isAdmin()`)
- Files using isAdmin: Layout.jsx (line 35), App.jsx (ProtectedRoute)

## Notes
- All frontend code uses ES6: arrow functions, no semicolons, no var
- All backend code uses CommonJS: require/module.exports
- Dates stored in ISO format
- Soft deletes using isActive flag
- Follow Week 2 pastel color scheme
- Implement Week 3 application schema exactly
- Update this file after any code changes
