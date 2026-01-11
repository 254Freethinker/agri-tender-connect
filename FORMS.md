# SokoConnect Forms Documentation

**Last Updated:** January 11, 2026  
**Total Forms:** 35+

---

## 📋 FORM CATEGORIES

### 1. User & Authentication Forms

#### Login Form
- **Location:** `/auth`
- **Table:** `auth.users` (Supabase Auth)
- **Fields:**
  - Email (required, email validation)
  - Password (required, min 6 chars)
- **Status:** ✅ Complete

#### Registration Form
- **Location:** `/auth`
- **Table:** `auth.users`, `profiles`, `user_roles`
- **Fields:**
  - Full Name (required)
  - Email (required, email validation)
  - Password (required, min 6 chars, strength indicator)
  - Confirm Password (required, must match)
- **Status:** ✅ Complete

#### Profile Update Form
- **Location:** `/profile`
- **Table:** `profiles`
- **Fields:**
  - Full Name (required)
  - Phone Number (optional)
  - Location/Address (optional)
  - Bio (optional, textarea)
  - Avatar (file upload)
- **Status:** ✅ Complete

---

### 2. Marketplace & Trading Forms

#### Marketplace Listing Form
- **Location:** `/marketplace`
- **Table:** `marketplace_listings`
- **Fields:**
  - Product Name (required)
  - Category (required, dropdown)
  - Quantity (required, number)
  - Unit (required, dropdown: kg/tons/bags/crates)
  - Price per Unit (required, number)
  - County (required, dropdown)
  - Description (optional, textarea)
  - Images (file upload, max 5)
- **Status:** ✅ Complete

#### Equipment Listing Form
- **Location:** `/equipment-marketplace`
- **Table:** `equipment_marketplace`
- **Fields:**
  - Equipment Name (required)
  - Brand (optional)
  - Category (required, dropdown)
  - Condition (required: new/used/refurbished)
  - Sale Price (optional, number)
  - Rental Price per Day (optional, number)
  - Description (optional, textarea)
  - County (required, dropdown)
  - Images (file upload, max 5)
- **Status:** ✅ Complete

#### Bulk Order Form
- **Location:** `/bulk-orders`
- **Table:** `bulk_orders`
- **Fields:**
  - Produce Type (required, dropdown)
  - Quantity (required, number)
  - Unit (required, dropdown)
  - Target Price (optional, number)
  - Deadline (required, date picker)
  - Description (optional, textarea)
- **Status:** ✅ Complete

#### Barter Exchange Form
- **Location:** `/barter-exchange`
- **Table:** `barter_trades`
- **Fields:**
  - Offering Product (required)
  - Offering Quantity (required, number)
  - Offering Unit (required, dropdown)
  - Seeking Product (required)
  - Seeking Quantity (required, number)
  - Seeking Unit (required, dropdown)
  - County (required, dropdown)
  - Description (optional, textarea)
- **Status:** ✅ Complete

---

### 3. Farmer-Exporter Collaboration Forms

#### Farmer Collaboration Request Form
- **Location:** `/farmer-exporter-collaboration`
- **Table:** `farmer_exporter_collaborations`
- **Fields:**
  - **Farmer Information Section:**
    - Full Name (required)
    - Phone Number (required)
    - Email Address (optional)
    - County (required, dropdown)
    - Specific Location (required)
    - Farm Size in Acres (optional, number)
  - **Commodity Information Section:**
    - Commodity (required, dropdown)
    - Variety (optional)
    - Estimated Quantity (required, number)
    - Unit (required, dropdown: kg/tons/bags/crates)
    - Quality Grade (optional, dropdown)
    - Harvest Date (optional, date picker)
    - Availability Period (optional)
  - **Documentation Section:**
    - Has Export Documentation (checkbox)
    - Documentation Needs (multi-select checkboxes)
  - **Profile Section:**
    - About Your Farm (textarea)
    - Years of Experience (optional, number)
    - Target Markets (multi-select)
    - Certifications (multi-select)
- **Status:** ✅ Complete

#### Exporter Profile Form
- **Location:** `/exporter-profile`
- **Table:** `exporter_profiles`
- **Fields:**
  - **Company Information:**
    - Company Name (required)
    - Registration Number (optional)
    - Business License (optional)
    - Export License (optional)
    - Company Description (textarea)
  - **Contact Information:**
    - Contact Person Name (required)
    - Phone Number (required)
    - Email Address (required)
    - Office Location (required)
    - County (required, dropdown)
    - Website URL (optional)
  - **Business Details:**
    - Years in Business (number)
    - Export Markets (multi-select)
    - Commodities Handled (multi-select)
    - Services Offered (multi-select)
    - Minimum Quantity (tons)
    - Maximum Quantity (tons)
  - **Services Flags:**
    - Documentation Services (checkbox)
    - Logistics Services (checkbox)
    - Quality Assurance Services (checkbox)
    - Financing Services (checkbox)
- **Status:** ✅ Complete

---

### 4. Farm Input Forms

#### Farm Input Product Form
- **Location:** `/farm-input-marketplace` (Admin)
- **Table:** `farm_input_products`
- **Fields:**
  - Product Name (required)
  - Category (required, dropdown: seeds/fertilizers/pesticides/equipment)
  - Price per Unit (required, number)
  - Unit Type (required, dropdown)
  - Stock Quantity (number)
  - Minimum Order (number)
  - Description (textarea)
  - Image (file upload)
- **Status:** ✅ Complete

#### Group Input Order Form
- **Location:** `/group-input-orders`
- **Table:** `group_input_orders`
- **Fields:**
  - Product Type (required)
  - Target Quantity (required, number)
  - Unit (required, dropdown)
  - Target Price per Unit (optional, number)
  - Deadline (required, date picker)
  - Description (textarea)
  - County (required, dropdown)
- **Status:** ✅ Complete

---

### 5. Logistics Forms

#### Transportation Request Form
- **Location:** `/logistics`
- **Table:** `transportation_requests`
- **Fields:**
  - Cargo Type (required, dropdown)
  - Cargo Weight (required, number, tons)
  - Pickup Location (required)
  - Pickup County (required, dropdown)
  - Pickup Date (required, date picker)
  - Delivery Location (required)
  - Delivery County (required, dropdown)
  - Special Requirements (multi-select: refrigeration/fragile/livestock)
  - Notes (textarea)
- **Status:** ✅ Complete

#### Warehouse Booking Form
- **Location:** `/logistics`
- **Table:** `warehouse_bookings`
- **Fields:**
  - Warehouse (required, dropdown from warehouses table)
  - Product Type (required)
  - Quantity (required, tons)
  - Storage Start Date (required, date picker)
  - Storage Duration (required, number, days)
  - Special Requirements (textarea)
- **Status:** ✅ Complete

#### Transporter Registration Form
- **Location:** `/transporter-signup`
- **Table:** `transporters`
- **Fields:**
  - Name/Company Name (required)
  - Vehicle Type (required, dropdown)
  - Load Capacity (required, tons)
  - Counties Covered (multi-select)
  - Has Refrigeration (checkbox)
  - Contact Phone (required)
  - License Number (required)
- **Status:** ✅ Complete

---

### 6. Community Forms

#### Community Post Form
- **Location:** `/community-forum`
- **Table:** `community_posts`
- **Fields:**
  - Title (required, max 200 chars)
  - Content (required, textarea, rich text)
  - Category (required, dropdown)
  - Tags (optional, multi-select)
  - Images (file upload, max 3)
- **Status:** ✅ Complete

#### Comment Form
- **Location:** `/community-forum` (post detail)
- **Table:** `community_comments`
- **Fields:**
  - Comment Text (required, textarea)
  - Parent Comment ID (hidden, for replies)
- **Status:** ✅ Complete

#### Report Content Form
- **Location:** `/community-forum`
- **Table:** `community_reports`
- **Fields:**
  - Reason (required, dropdown)
  - Description (optional, textarea)
- **Status:** ✅ Complete

---

### 7. Contract Farming Forms

#### Contract Offer Form
- **Location:** `/contract-farming`
- **Table:** `contract_farming`
- **Fields:**
  - Crop Type (required, dropdown)
  - Quantity Required (required, number)
  - Unit (required, dropdown)
  - Price per Unit (required, number)
  - Contract Start Date (required, date picker)
  - Expected Harvest Date (required, date picker)
  - Quality Standards (textarea)
  - Delivery Terms (textarea)
- **Status:** ✅ Complete

---

### 8. Food Rescue Forms

#### Food Donation Form
- **Location:** `/food-rescue`
- **Table:** `imperfect_surplus_produce`
- **Fields:**
  - Product Name (required)
  - Category (required, dropdown)
  - Quantity (required, number)
  - Unit (required, dropdown)
  - Reason for Discount (required, dropdown)
  - Original Price (required, number)
  - Discounted Price (required, number)
  - Expiry Date (required, date picker)
  - Pickup Location (required)
  - County (required, dropdown)
  - Is Organic (checkbox)
  - Description (textarea)
  - Images (file upload, max 3)
  - Willing to Deliver (checkbox)
- **Status:** ✅ Complete

---

### 9. Training & Events Forms

#### Training Event Form
- **Location:** `/training-events` (Admin)
- **Table:** `training_events`
- **Fields:**
  - Title (required)
  - Description (required, textarea)
  - Start Date (required, datetime picker)
  - End Date (required, datetime picker)
  - Location (required, or "Online")
  - Is Online (checkbox)
  - Fee (number, 0 for free)
  - Max Participants (number)
  - Certificate Provided (checkbox)
  - Image (file upload)
- **Status:** ✅ Complete

#### Event Registration Form
- **Location:** `/training-events`
- **Table:** `training_event_registrations`
- **Fields:**
  - Name (required)
  - Email (required)
  - Phone (required)
  - Notes (textarea)
- **Status:** ✅ Complete

---

### 10. Cooperative Forms

#### Cooperative Registration Form
- **Location:** `/cooperatives`
- **Table:** `cooperative_groups`
- **Fields:**
  - Cooperative Name (required)
  - Group Type (required, dropdown)
  - Registration Number (optional)
  - Description (textarea)
  - Activities (multi-select)
  - County (required, dropdown)
  - Contact Phone (required)
  - Contact Email (required)
- **Status:** ✅ Complete

#### Join Cooperative Form
- **Location:** `/cooperatives`
- **Table:** `group_members`
- **Fields:**
  - Member Name (required)
  - Phone (required)
  - Reason for Joining (textarea)
- **Status:** ✅ Complete

---

### 11. Reviews & Ratings Forms

#### Product/Seller Review Form
- **Location:** Various marketplace pages
- **Table:** `reviews`
- **Fields:**
  - Rating (required, 1-5 stars)
  - Review Text (required, textarea)
  - Photos (optional, file upload)
- **Status:** ✅ Complete

#### Supplier Review Form
- **Location:** `/farm-input-marketplace`
- **Table:** `input_supplier_reviews`
- **Fields:**
  - Overall Rating (required, 1-5 stars)
  - Product Quality Rating (1-5)
  - Delivery Timeliness Rating (1-5)
  - Review Text (textarea)
- **Status:** ✅ Complete

---

### 12. Export & International Trade Forms

#### Export Opportunity Form
- **Location:** `/export-opportunities`
- **Table:** `export_opportunities`
- **Fields:**
  - Title (required)
  - Product Category (required, dropdown)
  - Description (textarea)
  - Quantity Needed (number)
  - Unit (dropdown)
  - Target Price (number)
  - Delivery Location (required)
  - Deadline (date picker)
  - Opportunity Type (dropdown)
  - Specifications (textarea)
- **Status:** ✅ Complete

---

### 13. Batch Tracking Forms

#### Create Batch Form
- **Location:** `/batch-tracking`
- **Table:** `batch_tracking`
- **Fields:**
  - Batch ID (auto-generated)
  - Product Type (required, dropdown)
  - Quantity (required, number)
  - Unit (required, dropdown)
  - Origin (required)
  - Destination (optional)
  - Certifications (multi-select)
  - Quality Score (number, 0-100)
  - Notes (textarea)
- **Status:** ✅ Complete

---

### 14. Carbon Footprint Forms

#### Carbon Provider Registration Form
- **Location:** `/carbon-forum`
- **Table:** `carbon_credit_providers`
- **Fields:**
  - Provider Name (required)
  - Provider Type (required, dropdown)
  - Contact Person (required)
  - Phone (required)
  - Email (required)
  - County (required, dropdown)
  - Physical Address (required)
  - Registration Number (optional)
  - Services Offered (multi-select)
  - Pricing Model (dropdown)
  - Description (textarea)
- **Status:** ✅ Complete

---

### 15. Partner Forms

#### Partner Registration Form
- **Location:** `/partner-with-us`
- **Table:** `partners`
- **Fields:**
  - Company Name (required)
  - Contact Email (required)
  - Website URL (optional)
  - Description (required, textarea)
  - Logo (file upload)
  - Partnership Type (dropdown)
- **Status:** ✅ Complete

---

## 📊 FORM VALIDATION STANDARDS

All forms implement:
- ✅ Required field validation
- ✅ Email format validation
- ✅ Phone number format validation (Kenyan format)
- ✅ Numeric range validation where applicable
- ✅ Date validation (future dates for deadlines, past dates for birth dates)
- ✅ File size limits (max 5MB per image)
- ✅ File type restrictions (images: jpg, png, webp)
- ✅ Client-side validation with react-hook-form + zod
- ✅ Server-side validation via Supabase constraints
- ✅ User-friendly error messages via toast notifications

---

## 🔒 FORM SECURITY

- All forms require authentication (except registration/login)
- CSRF protection via Supabase Auth
- Rate limiting on form submissions
- Input sanitization for text fields
- SQL injection prevention via Supabase client

---

**Document Version:** 1.0  
**Forms Count:** 35+  
**All Forms Status:** ✅ Complete
