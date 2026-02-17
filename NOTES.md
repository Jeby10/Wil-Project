# Fur Fetch Pet Adoption Portal - System Architecture

## Overview
A full-stack MERN application for pet adoption with role-based access control, featuring public pet browsing, user application tracking, and admin review workflows.

---

## 🏗️ Three-Layer Architecture

```mermaid
graph TB
    subgraph Frontend["🖥️ FRONTEND LAYER"]
        FE["React 19 + Chakra UI + Vite<br/>Component-based UI<br/>React Query for state"]
    end
    
    subgraph Backend["⚙️ BACKEND API LAYER"]
        BE["Express 4 + Node.js<br/>RESTful API<br/>JWT Authentication"]
    end
    
    subgraph Database["🗄️ DATABASE LAYER"]
        DB["MongoDB<br/>4 Collections<br/>Mongoose ODM"]
    end
    
    Frontend -->|"HTTPS / Axios<br/>Bearer Token"| Backend
    Backend -->|"Mongoose ODM<br/>Query Execution"| Database
    
    style Frontend fill:#f0fdfa,stroke:#14b8a6,stroke-width:3px,color:#0f766e
    style Backend fill:#eff6ff,stroke:#3b82f6,stroke-width:3px,color:#1e40af
    style Database fill:#faf5ff,stroke:#a78bfa,stroke-width:3px,color:#6b21a8
```

---

## 📱 Frontend Layer - React 19 + Chakra UI

### Component Hierarchy

```mermaid
graph TD
    Main["main.jsx<br/>Entry Point"]
    
    Main --> Chakra["ChakraProvider<br/>Custom teal theme"]
    Main --> Query["QueryClientProvider<br/>React Query"]
    Main --> Auth["AuthProvider<br/>Context API"]
    Main --> Router["BrowserRouter"]
    
    Router --> App["App.jsx<br/>Route Configuration"]
    
    App --> Layout["Layout<br/>Header + Footer"]
    App --> PublicRoutes["Public Routes"]
    App --> ProtectedRoutes["Protected Routes"]
    App --> AdminRoutes["Admin Routes"]
    
    PublicRoutes --> Home["HomePage<br/>/"]
    PublicRoutes --> PetDetail["PetDetailPage<br/>/pets/:id"]
    PublicRoutes --> Login["LoginPage<br/>/login"]
    PublicRoutes --> Register["RegisterPage<br/>/register"]
    
    ProtectedRoutes --> AppForm["ApplicationFormPage<br/>/apply/:petId"]
    ProtectedRoutes --> MyApps["MyApplicationsPage<br/>/my-applications"]
    
    AdminRoutes --> AdminDash["AdminDashboard<br/>/admin/dashboard"]
    
    style Main fill:#0f766e,stroke:#14b8a6,stroke-width:2px,color:#fff
    style App fill:#14b8a6,stroke:#0d9488,stroke-width:2px,color:#fff
    style PublicRoutes fill:#f0fdfa,stroke:#99f6e4,stroke-width:2px,color:#0f766e
    style ProtectedRoutes fill:#fff7ed,stroke:#fed7aa,stroke-width:2px,color:#9a3412
    style AdminRoutes fill:#fef2f2,stroke:#fca5a5,stroke-width:2px,color:#991b1b
```

### Pages & Components

#### 📄 Public Pages
| Component | Route | Purpose |
|-----------|-------|---------|
| **HomePage** | `/` | Browse pets with filters (breed, age, size, location, urgent) |
| **PetDetailPage** | `/pets/:id` | View detailed pet information + adoption button |
| **LoginPage** | `/login` | User authentication form |
| **RegisterPage** | `/register` | New user account creation |

#### 🔒 Protected Pages (Authenticated Users)
| Component | Route | Purpose |
|-----------|-------|---------|
| **ApplicationFormPage** | `/apply/:petId` | Submit adoption application (Week 3 schema) |
| **MyApplicationsPage** | `/my-applications` | Track submitted applications with status updates |

#### 👑 Admin Pages (Admin Role Only)
| Component | Route | Purpose |
|-----------|-------|---------|
| **AdminDashboard** | `/admin/dashboard` | Review all applications, view statistics, update statuses |

#### 🧩 Core Components
- **AuthProvider** - Context API for global auth state (user, isAdmin, login, logout)
- **Layout** - Shared header/footer with navigation and auth controls
- **PetCard** - Reusable pet display card with Week 2 teal design
- **ProtectedRoute** - Route guard for authenticated users
- **AdminRoute** - Route guard for admin-only pages

### API Client Layer

```mermaid
graph TB
    subgraph APIClient["API Client Architecture"]
        Axios["apiClient<br/>Axios Instance"]
        
        ReqInt["Request Interceptor<br/>Add Bearer token to headers"]
        ResInt["Response Interceptor<br/>Auto-refresh expired tokens"]
        ErrHandler["Error Handler<br/>401 → refresh → retry"]
        
        Axios --> ReqInt
        Axios --> ResInt
        ResInt --> ErrHandler
    end
    
    subgraph Modules["API Modules"]
        AuthAPI["authAPI<br/>Authentication operations"]
        PetAPI["petAPI<br/>Pet CRUD operations"]
        AppAPI["applicationAPI<br/>Application management"]
    end
    
    subgraph Storage["Token Management"]
        TokenMgr["tokenManager<br/>━━━━━━━━━━━━━"]
        Set["setTokens(access, refresh)"]
        GetAccess["getAccessToken()"]
        GetRefresh["getRefreshToken()"]
        Clear["clearTokens()"]
        Local["localStorage"]
        
        TokenMgr --> Set
        TokenMgr --> GetAccess
        TokenMgr --> GetRefresh
        TokenMgr --> Clear
        Set --> Local
        GetAccess --> Local
        GetRefresh --> Local
        Clear --> Local
    end
    
    AuthAPI --> Axios
    PetAPI --> Axios
    AppAPI --> Axios
    
    ReqInt --> TokenMgr
    ResInt --> TokenMgr
    
    style Axios fill:#f5f3ff,stroke:#a78bfa,stroke-width:2px,color:#5b21b6
    style AuthAPI fill:#f0fdfa,stroke:#2dd4bf,stroke-width:2px,color:#0f766e
    style PetAPI fill:#f0fdfa,stroke:#2dd4bf,stroke-width:2px,color:#0f766e
    style AppAPI fill:#f0fdfa,stroke:#2dd4bf,stroke-width:2px,color:#0f766e
    style TokenMgr fill:#fff7ed,stroke:#fb923c,stroke-width:2px,color:#9a3412
```

### State Management
| State Type | Solution | Location |
|------------|----------|----------|
| Server State | React Query | All API calls - caching, refetching |
| Auth State | Context API | AuthProvider - user info, login status |
| Local State | useState | Component forms, UI toggles |
| Form State | react-hook-form | Form validation & submission |

---

## ⚙️ Backend API Layer - Express 4 + Node.js

### API Endpoints

#### 🔑 Authentication Routes - `/api/auth`
```
POST   /api/auth/register
       ├─ Input: { username, email, password }
       ├─ Validation: Joi schema
       ├─ Process: Check duplicate → Hash password → Create user → Generate tokens
       └─ Output: { user, accessToken, refreshToken }

POST   /api/auth/login
       ├─ Input: { email, password }
       ├─ Validation: Joi schema
       ├─ Process: Find user → Compare hash → Generate tokens → Create session
       └─ Output: { user, accessToken, refreshToken }

POST   /api/auth/logout
       ├─ Middleware: verifyToken
       ├─ Process: Invalidate session
       └─ Output: { message: "Logged out successfully" }

POST   /api/auth/refresh
       ├─ Input: { refreshToken }
       ├─ Process: Verify token → Check session → Generate new tokens
       └─ Output: { accessToken, refreshToken }

GET    /api/auth/profile
       ├─ Middleware: verifyToken
       ├─ Process: Get user by ID from token
       └─ Output: { user }
```

#### 🐾 Pet Routes - `/api/pets`
```
GET    /api/pets
       ├─ Query Params: breed, age, size, location, urgent, search
       ├─ Middleware: None (public)
       ├─ Process: Filter pets + text search
       └─ Output: { pets[], total, filters }

GET    /api/pets/:id
       ├─ Middleware: None (public)
       ├─ Process: Find pet by ID
       └─ Output: { pet }

POST   /api/pets
       ├─ Middleware: verifyToken, isAdmin
       ├─ Input: Pet object (Week 2 schema)
       ├─ Validation: Joi schema
       └─ Output: { pet }

PUT    /api/pets/:id
       ├─ Middleware: verifyToken, isAdmin
       ├─ Input: Updated pet fields
       └─ Output: { pet }

DELETE /api/pets/:id
       ├─ Middleware: verifyToken, isAdmin
       ├─ Process: Soft delete (set isActive: false)
       └─ Output: { message }
```

#### 📋 Application Routes - `/api/applications`
```
POST   /api/applications
       ├─ Middleware: verifyToken
       ├─ Input: Application form (Week 3 schema)
       ├─ Validation: Joi schema
       ├─ Process: Check pet available → Check no duplicate pending → Create app
       └─ Output: { application }

GET    /api/applications
       ├─ Middleware: verifyToken
       ├─ Process: Get user's applications with pet details
       └─ Output: { applications[] }

GET    /api/applications/admin/all
       ├─ Middleware: verifyToken, isAdmin
       ├─ Query Params: status (all|pending|approved|rejected)
       ├─ Process: Get all applications with user + pet details
       └─ Output: { applications[], total }

GET    /api/applications/admin/stats
       ├─ Middleware: verifyToken, isAdmin
       ├─ Process: Aggregate statistics
       └─ Output: { total, pending, approved, rejected }

PUT    /api/applications/:id
       ├─ Middleware: verifyToken, isAdmin
       ├─ Input: { status, adminNotes }
       ├─ Process: Update application
       └─ Output: { application }

DELETE /api/applications/:id
       ├─ Middleware: verifyToken, isAdmin
       ├─ Process: Hard delete application
       └─ Output: { message }
```

### Middleware Chain

```mermaid
graph TB
    Request["Incoming Request"]
    
    Request --> Security["Security Headers<br/>helmet, CORS, rate limiting"]
    Security --> Validation["Joi Validation<br/>Validate body/params/query"]
    Validation --> Verify["verifyToken<br/>Extract & verify JWT"]
    Verify --> Admin["isAdmin<br/>Check user.role === 'admin'"]
    Admin --> Handler["Route Handler<br/>Execute business logic"]
    
    Verify -->|"Invalid/Expired"| Error401["401 Unauthorized"]
    Admin -->|"Not Admin"| Error403["403 Forbidden"]
    
    style Request fill:#f0fdfa,stroke:#14b8a6,stroke-width:2px,color:#0f766e
    style Security fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#15803d
    style Validation fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#15803d
    style Verify fill:#fef2f2,stroke:#ef4444,stroke-width:2px,color:#991b1b
    style Admin fill:#fef2f2,stroke:#ef4444,stroke-width:2px,color:#991b1b
    style Handler fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e40af
    style Error401 fill:#fee2e2,stroke:#dc2626,stroke-width:2px,color:#7f1d1d
    style Error403 fill:#fee2e2,stroke:#dc2626,stroke-width:2px,color:#7f1d1d
```

### JWT Token System

```mermaid
graph LR
    subgraph Tokens["Token Types"]
        Access["Access Token<br/>━━━━━━━━━━━<br/>Expiry: 15 minutes<br/>Payload: userId, email, role<br/>Usage: API requests"]
        Refresh["Refresh Token<br/>━━━━━━━━━━━<br/>Expiry: 7 days<br/>Payload: userId, sessionId<br/>Usage: Renew access token"]
    end
    
    subgraph Storage["Storage"]
        ClientStore["Client<br/>localStorage"]
        DBStore["Database<br/>sessions collection"]
    end
    
    subgraph Lifecycle["Token Lifecycle"]
        Login["1. User Login"]
        Receive["2. Receive Tokens"]
        UseAccess["3. Use Access Token"]
        Expires["4. Token Expires"]
        AutoRefresh["5. Auto Refresh"]
        NewTokens["6. New Token Pair"]
        Logout["7. Logout"]
        Invalidate["8. Invalidate Session"]
    end
    
    Access --> ClientStore
    Refresh --> ClientStore
    Refresh --> DBStore
    
    Login --> Receive
    Receive --> UseAccess
    UseAccess --> Expires
    Expires --> AutoRefresh
    AutoRefresh --> NewTokens
    NewTokens --> UseAccess
    UseAccess --> Logout
    Logout --> Invalidate
    
    style Access fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a
    style Refresh fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#14532d
    style ClientStore fill:#f5f3ff,stroke:#a78bfa,stroke-width:2px,color:#5b21b6
    style DBStore fill:#faf5ff,stroke:#c084fc,stroke-width:2px,color:#6b21a8
```

### Security Features

| Feature | Implementation | Purpose |
|---------|----------------|---------|
| **Password Hashing** | bcrypt (12 rounds) | Secure password storage |
| **JWT Authentication** | Access + Refresh tokens | Stateless auth with auto-renewal |
| **Role-Based Access** | User.role (user/admin) | Admin-only endpoints |
| **Input Validation** | Joi schemas | Prevent malformed data |
| **Rate Limiting** | express-rate-limit | 100 requests/hour per IP |
| **Security Headers** | helmet | XSS, clickjacking protection |
| **CORS** | cors middleware | Cross-origin request control |
| **Soft Deletes** | isActive flag | Data preservation |

---

## 🗄️ Database Layer - MongoDB + Mongoose

### Collections Schema

#### 1️⃣ **users** Collection
```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  email: String (unique, required),
  passwordHash: String (required),
  role: String (enum: ['user', 'admin'], default: 'user'),
  favoritePets: [ObjectId] (ref: 'Pet'),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}

Indexes:
  - email (unique)
  - username (unique)
  - isActive
```

#### 2️⃣ **sessions** Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  refreshToken: String (unique, required),
  deviceInfo: String,
  expiresAt: Date (required),
  isActive: Boolean (default: true),
  createdAt: Date
}

Indexes:
  - refreshToken (unique)
  - userId
  - expiresAt
```

#### 3️⃣ **pets** Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  petType: String (enum: ['dog', 'cat', 'other'], required),
  breed: String (required),
  age: Number (months, required),
  size: String (enum: ['small', 'medium', 'large']),
  gender: String (enum: ['male', 'female']),
  location: String (required),
  description: String,
  images: [String] (URLs),
  healthStatus: String,
  isUrgent: Boolean (default: false),
  isAvailable: Boolean (default: true),
  ownerId: ObjectId (ref: 'User'), // admin who created listing
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}

Indexes:
  - petType
  - isAvailable
  - isActive
  - location + breed + name (text index for search)
```

#### 4️⃣ **applications** Collection
```javascript
{
  _id: ObjectId,
  applicantId: ObjectId (ref: 'User', required),
  petId: ObjectId (ref: 'Pet', required),
  
  // Week 3 Schema Fields
  fullName: String (required),
  email: String (required),
  phone: String (required),
  address: String (required),
  housingType: String (enum: ['house', 'apartment', 'other']),
  hasYard: Boolean,
  householdMembers: Number,
  hasChildren: Boolean,
  childrenAges: String,
  hasPets: Boolean,
  currentPets: String,
  experience: String,
  reason: String (required),
  
  // Admin fields
  status: String (enum: ['pending', 'approved', 'rejected'], default: 'pending'),
  adminNotes: String,
  submittedDate: Date (default: Date.now),
  lastUpdated: Date,
  reviewedBy: ObjectId (ref: 'User'),
  
  isActive: Boolean (default: true)
}

Indexes:
  - applicantId
  - petId
  - status
  - submittedDate (descending)

Unique Constraint:
  - One pending application per (applicantId, petId) pair
```

### Database Relationships

```mermaid
erDiagram
    users ||--o{ sessions : "has many"
    users ||--o{ pets : "owns (admin)"
    users ||--o{ applications : "submits"
    users ||--o{ pets : "favorites"
    pets ||--o{ applications : "receives"
    
    users {
        ObjectId _id PK
        string username UK
        string email UK
        string passwordHash
        string role
        array favoritePets
        boolean isActive
    }
    
    sessions {
        ObjectId _id PK
        ObjectId userId FK
        string refreshToken UK
        string deviceInfo
        date expiresAt
        boolean isActive
    }
    
    pets {
        ObjectId _id PK
        string name
        string petType
        string breed
        number age
        string size
        string location
        array images
        boolean isUrgent
        boolean isAvailable
        ObjectId ownerId FK
        boolean isActive
    }
    
    applications {
        ObjectId _id PK
        ObjectId applicantId FK
        ObjectId petId FK
        string status
        string adminNotes
        date submittedDate
        date lastUpdated
        boolean isActive
    }
```

### Query Optimization

```sql
-- Most frequent queries and their indexes:

1. User Login
   Query: users.findOne({ email: "..." })
   Index: users.email (unique)

2. Pet Filtering
   Query: pets.find({ 
     petType: "dog", 
     isAvailable: true, 
     location: { $regex: "..." } 
   })
   Indexes: 
     - pets.petType
     - pets.isAvailable
     - pets TEXT (location + breed + name)

3. My Applications
   Query: applications.find({ applicantId: userId })
           .populate('petId')
           .sort({ submittedDate: -1 })
   Index: applications.applicantId

4. Admin Dashboard
   Query: applications.find({ status: "pending" })
           .populate('applicantId petId')
           .sort({ submittedDate: -1 })
   Index: applications.status

5. Token Refresh
   Query: sessions.findOne({ refreshToken: "..." })
   Index: sessions.refreshToken (unique)
```

---

## 🔄 Data Flow Examples

### 1. User Registration Flow

```mermaid
sequenceDiagram
    actor User
    participant Form as RegisterPage
    participant API as authAPI
    participant Client as apiClient
    participant Route as POST /api/auth/register
    participant Joi as Joi Validation
    participant DB as MongoDB users
    participant Hash as bcrypt
    participant JWT as generateTokens()
    participant Session as MongoDB sessions
    participant Store as tokenManager
    participant Auth as AuthProvider
    
    User->>Form: 1. Fill registration form
    Form->>API: 2. authAPI.register({username, email, password})
    API->>Client: 3. POST request
    Client->>Route: 4. POST /api/auth/register
    Route->>Joi: 5. Validate input schema
    Joi->>DB: 6. Check duplicate email/username
    DB-->>Joi: No duplicates found
    Joi->>Hash: 7. Hash password (12 rounds)
    Hash-->>Joi: passwordHash
    Joi->>DB: 8. Create user document
    DB-->>Joi: User created
    Joi->>JWT: 9. Generate JWT tokens
    JWT-->>Joi: accessToken (15m), refreshToken (7d)
    Joi->>Session: 10. Create session record
    Session-->>Joi: Session created
    Joi-->>Route: 11. Return response
    Route-->>Client: {user, accessToken, refreshToken}
    Client->>Store: 12. tokenManager.setTokens()
    Store->>Store: Store in localStorage
    Client->>Auth: 13. Update AuthProvider context
    Auth->>Auth: setUser({...user, isLoggedIn: true})
    Auth->>Form: 14. Navigate to HomePage
    Form-->>User: Registration complete
```

### 2. Pet Browsing with Filters Flow

```mermaid
sequenceDiagram
    actor User
    participant Home as HomePage
    participant API as petAPI
    participant Client as apiClient
    participant Route as GET /api/pets
    participant DB as MongoDB pets
    participant Query as React Query
    participant Card as PetCard
    
    User->>Home: 1. Select filters (breed: Golden Retriever, size: large)
    Home->>API: 2. petAPI.getPets({breed, size})
    API->>Client: 3. GET /api/pets?breed=Golden%20Retriever&size=large
    Client->>Route: 4. Request (public - no auth)
    Route->>Route: 5. Build query from params
    Route->>DB: 6. pets.find({breed: /golden retriever/i, size: large, isAvailable: true})
    Note over DB: Uses pets.breed and pets.size indexes
    DB-->>Route: 7. Return matching pets
    Route-->>Client: 8. {pets: [...], total: 5}
    Client->>Query: 9. Cache result
    Query->>Home: 10. Return data
    Home->>Card: 11. Map pets to PetCard components
    Card-->>User: 12. Display 5 filtered pet cards
```

### 3. Adoption Application Submission Flow

```mermaid
sequenceDiagram
    actor User
    participant Detail as PetDetailPage
    participant Form as ApplicationFormPage
    participant Hook as react-hook-form
    participant API as applicationAPI
    participant Client as apiClient
    participant Interceptor as Request Interceptor
    participant Route as POST /api/applications
    participant Verify as verifyToken
    participant Joi as Joi Validation
    participant PetDB as MongoDB pets
    participant AppDB as MongoDB applications
    participant Query as React Query
    participant MyApps as MyApplicationsPage
    
    User->>Detail: 1. Click "Apply to Adopt"
    Detail->>Form: 2. Navigate to form
    User->>Form: 3. Fill Week 3 schema fields
    Form->>Hook: 4. Client-side validation
    Hook->>API: 5. applicationAPI.submitApplication({petId, ...formData})
    API->>Client: 6. POST request
    Client->>Interceptor: 7. Inject access token
    Interceptor->>Route: 8. POST /api/applications (Authorization: Bearer token)
    Route->>Verify: 9. Verify JWT
    Verify->>Route: 10. req.user = {userId, email, role}
    Route->>Joi: 11. Validate request body
    Joi->>PetDB: 12. Check pet is available
    PetDB-->>Joi: Pet is available
    Joi->>AppDB: 13. Check for duplicate pending application
    AppDB-->>Joi: No duplicate found
    Joi->>AppDB: 14. Create application {applicantId, petId, status: pending, ...}
    AppDB-->>Route: Application created
    Route-->>Client: 15. {application: {...}}
    Client->>Query: 16. Invalidate 'myApplications' cache
    Query->>MyApps: 17. Navigate to MyApplicationsPage
    MyApps-->>User: 18. Show success + display application (Status: Pending)
```

### 4. Admin Application Review Flow

```mermaid
sequenceDiagram
    actor Admin
    participant Dash as AdminDashboard
    participant API as applicationAPI
    participant Client as apiClient
    participant Route as GET /api/applications/admin/all
    participant Verify as verifyToken
    participant IsAdmin as isAdmin middleware
    participant DB as MongoDB applications
    participant Modal as Update Modal
    participant Update as PUT /api/applications/:id
    participant Joi as Joi Validation
    participant Query as React Query
    
    Admin->>Dash: 1. Login and navigate to dashboard
    Dash->>API: 2. getAllApplications({status: 'pending'})
    API->>Client: 3. GET /api/applications/admin/all?status=pending
    Client->>Route: 4. Request with Bearer token
    Route->>Verify: 5. Verify JWT
    Verify->>IsAdmin: 6. Check user.role === 'admin'
    IsAdmin->>DB: 7. applications.find({status: pending}).populate('applicantId petId')
    DB-->>Route: 8. Return applications with user + pet details
    Route-->>Client: 9. {applications: [...], total: 12}
    Client->>Dash: 10. Display in dashboard
    Dash->>Dash: 11. Map to Application Cards
    Admin->>Modal: 12. Click "Update Status" on an application
    Admin->>Modal: 13. Change status to "approved", add adminNotes
    Modal->>API: 14. updateApplication(appId, {status: approved, adminNotes})
    API->>Client: 15. PUT /api/applications/:id
    Client->>Update: 16. Request with Bearer token
    Update->>Verify: 17. Verify JWT
    Verify->>IsAdmin: 18. Check admin role
    IsAdmin->>Joi: 19. Validate input
    Joi->>DB: 20. findByIdAndUpdate({status: approved, adminNotes, lastUpdated})
    DB-->>Update: 21. Return updated application
    Update-->>Client: 22. {application: {...}}
    Client->>Query: 23. Invalidate cache, refetch
    Query->>Dash: 24. Updated application reflected in UI
    Dash-->>Admin: Application status updated
```

### 5. Token Refresh Flow (Automatic)

```mermaid
sequenceDiagram
    actor User
    participant Comp as Component
    participant Client as apiClient
    participant Backend as Backend API
    participant Verify as verifyToken
    participant Interceptor as Response Interceptor
    participant TokenMgr as tokenManager
    participant Refresh as POST /api/auth/refresh
    participant JWT as JWT Helper
    participant Session as MongoDB sessions
    
    User->>Comp: 1. Trigger API call
    Comp->>Client: 2. Request with expired access token
    Client->>Backend: 3. API request
    Backend->>Verify: 4. Verify JWT
    Verify-->>Backend: 5. Token expired error
    Backend-->>Client: 6. 401 Unauthorized
    Client->>Interceptor: 7. Error caught by interceptor
    Interceptor->>TokenMgr: 8. Get refresh token from localStorage
    TokenMgr-->>Interceptor: 9. Return refresh token
    Interceptor->>Refresh: 10. POST /api/auth/refresh
    Refresh->>JWT: 11. Verify refresh token signature
    JWT-->>Refresh: 12. Token valid
    Refresh->>Session: 13. Check session exists and is active
    Session-->>Refresh: 14. Session valid
    Refresh->>JWT: 15. Generate new token pair
    JWT-->>Refresh: 16. New access (15m) + refresh (7d)
    Refresh->>Session: 17. Update session with new refresh token
    Session-->>Refresh: 18. Session updated
    Refresh-->>Interceptor: 19. {accessToken, refreshToken}
    Interceptor->>TokenMgr: 20. setTokens(accessToken, refreshToken)
    TokenMgr->>TokenMgr: 21. Update localStorage
    Interceptor->>Client: 22. Retry original request with new token
    Client->>Backend: 23. Original request (with new token)
    Backend-->>Client: 24. Success response
    Client-->>Comp: 25. Return data
    Note over User,Comp: User never noticed the refresh happened
```

---

## 🎨 UI Design System (Week 2 Inspired)

### Color Palette - Teal Theme

```css
/* Primary Teal Colors */
--teal-50:  #f0fdfa;  /* Light backgrounds */
--teal-100: #ccfbf1;  /* Borders, footer background */
--teal-500: #14b8a6;  /* Primary - header, buttons, headings */
--teal-600: #0d9488;  /* Hover states */
--teal-700: #0f766e;  /* Active/dark accents */

/* Usage */
Header Background:      teal.500
Footer Background:      teal.50
Primary Buttons:        colorPalette="teal"
Card Borders:           teal.100
Headings:               teal.600
Accent Elements:        teal.500-700
```

### Component Styling

```css
/* Card Design */
border-radius: 25px
padding: 22px
box-shadow: 0 10px 30px rgba(13, 148, 136, 0.15)
hover: translateY(-10px) scale(1.02)

/* Grid Layout */
max-width: 1400px
grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))
gap: 30px

/* Typography */
Header: 3em (Segoe UI, Poppins)
Pet Name: 1.5em (bold)
Body: 1em-1.2em
```

---

## 🔐 Security Model Summary

| Layer | Security Feature | Implementation |
|-------|-----------------|----------------|
| **Frontend** | Token Storage | localStorage with automatic injection |
| **Frontend** | Auto Refresh | Interceptor handles expired tokens transparently |
| **Frontend** | Protected Routes | React Router guards check authentication |
| **Backend** | Password Security | bcrypt hashing with 12 salt rounds |
| **Backend** | JWT Authentication | Access (15m) + Refresh (7d) token pair |
| **Backend** | Authorization | Role-based access control (user/admin) |
| **Backend** | Input Validation | Joi schemas on all POST/PUT routes |
| **Backend** | Rate Limiting | 100 requests/hour per IP |
| **Backend** | Security Headers | Helmet (XSS, clickjacking protection) |
| **Backend** | CORS | Configured for specific origins |
| **Database** | Soft Deletes | isActive flag preserves data integrity |
| **Database** | Unique Constraints | Prevent duplicate emails, usernames, sessions |
| **Database** | Indexes | Optimized queries, prevent full scans |

---

## 📊 Technology Stack Summary

### Frontend Stack
```
├── React 19.1           → UI library
├── Vite 7.0             → Build tool
├── Chakra UI 3.24       → Component library
├── React Query 5.83     → Server state management
├── React Router 7.7     → Client-side routing
├── Axios 1.11           → HTTP client
├── react-hook-form 7.62 → Form handling
└── ES6 Modules          → Modern JavaScript
```

### Backend Stack
```
├── Node.js              → Runtime
├── Express 4.21         → Web framework
├── Mongoose 8.0         → MongoDB ODM
├── jsonwebtoken 9.0     → JWT authentication
├── bcryptjs 2.4         → Password hashing
├── Joi 17.11            → Input validation
├── helmet 7.1           → Security headers
├── cors 2.8             → CORS middleware
├── express-rate-limit   → Rate limiting
└── CommonJS             → Module system
```

### Database
```
MongoDB
├── users collection
├── sessions collection
├── pets collection
└── applications collection
```

---

## 📝 Key Implementation Notes

### Critical API Path Fix (2026-02-05)
⚠️ **All frontend API endpoints MUST include `/api` prefix:**
- ✅ Correct: `GET /api/pets`
- ❌ Wrong: `GET /pets`

**Files requiring `/api` prefix:**
- `client/src/api/pet.js` - All endpoints
- `client/src/api/application.js` - All endpoints
- `client/src/api/auth.js` - Already correct (reference)

### Route Ordering (Critical)
In `server/routes/application.js`, admin routes MUST come before `:id` routes:
```javascript
// ✅ Correct order
router.get('/admin/all', verifyToken, isAdmin, handler)
router.get('/admin/stats', verifyToken, isAdmin, handler)
router.get('/:id', verifyToken, handler)  // Must be last

// ❌ Wrong - /:id catches /admin/all
router.get('/:id', verifyToken, handler)
router.get('/admin/all', verifyToken, isAdmin, handler)
```

### AuthProvider isAdmin
Changed from function to memoized value:
```javascript
// ✅ Correct usage
const { isAdmin } = useAuth()
if (isAdmin) { ... }

// ❌ Wrong usage (old)
if (isAdmin()) { ... }
```

---

## 🚀 Future Enhancements (Optional)

- Favorites system (backend ready, frontend not implemented)
- Image upload for pets (currently uses URLs)
- Email notifications for application status changes
- Search history tracking
- Advanced analytics dashboard
- Real-time updates with WebSockets
- Pet recommendation system based on user preferences
- Export applications to PDF
- Calendar integration for adoption appointments



