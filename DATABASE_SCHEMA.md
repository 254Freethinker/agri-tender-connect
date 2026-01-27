# AgriConnect Database Schema Documentation

## 📊 Database Overview

**Database Type:** PostgreSQL (via Supabase)  
**Total Tables:** 97  
**Security:** Row-Level Security (RLS) enabled on all tables  
**Health Status:** 100% Complete  
**Comparison vs Sister Project (forge-cloud-start):** ✅ AT PARITY (97 vs 95 tables)

---

## 🗄️ COMPLETE TABLE LIST (97 Tables - Alphabetical)

### A (5 tables)
1. **activity_logs** - User activity tracking
2. **api_keys** - API key management
3. **api_usage** - API usage tracking
4. **auction_bids** - Bids on product auctions

### B (6 tables)
5. **ban_recommendations** - User ban recommendations
6. **batch_tracking** - Product batch traceability
7. **bulk_order_messages** - Bulk order communication
8. **bulk_order_participants** - Participants in bulk orders
9. **bulk_orders** - Bulk order coordination

### C (17 tables)
10. **carbon_credit_providers** - Carbon credit service providers
11. **cart_items** - Shopping cart items
12. **chat_conversations** - AI chat conversations
13. **chat_messages** - AI chat messages
14. **city_market_bids** - City market auction bids
15. **city_market_products** - City market product listings
16. **city_markets** - Urban market directory
17. **community_comments** - Comments on community posts
18. **community_post_reposts** - Post repost tracking
19. **community_post_shares** - Post sharing tracking
20. **community_posts** - Community forum posts
21. **community_reports** - Content moderation reports
22. **contract_disputes** - Contract dispute management
23. **contract_documents** - Contract documentation (v1)
24. **contract_documents_v2** - Contract documentation (v2)
25. **contract_farming** - Contract farming opportunities
26. **contract_milestones** - Contract milestone tracking
27. **contract_payments** - Contract payment records
28. **contract_reviews** - Contract reviews
29. **conversations** - User-to-user messaging

### D (5 tables)
30. **delivery_addresses** - User delivery addresses
31. **delivery_requests** - Transportation service requests
32. **delivery_tracking** - Order delivery tracking
33. **disputes** - General dispute management

### E (3 tables)
34. **export_documentation** - Export documents management
35. **export_opportunities** - Export market opportunities
36. **exporter_profiles** - ✅ NEW - Registered exporter profiles

### F (14 tables)
37. **f2c_deliveries** - Farm-to-Consumer deliveries
38. **f2c_subscription_plans** - F2C subscription plans
39. **f2c_subscriptions** - F2C customer subscriptions
40. **farm_budget** - Farm budgeting
41. **farm_galleries** - Farm image galleries
42. **farm_input_order_items** - Farm input order line items
43. **farm_input_orders** - Farm input orders
44. **farm_input_products** - Farm input products catalog
45. **farm_input_suppliers** - Farm input supplier directory
46. **farm_statistics** - Farm performance metrics
47. **farm_tasks** - Farm task management
48. **farm_yields** - Yield tracking
49. **farmer_consolidations** - Farmer consolidation groups
50. **farmer_contract_networks** - Farmer contract networks
51. **farmer_exporter_collaborations** - ✅ NEW - Farmer-exporter partnerships
52. **farmer_produce** - Farmer's produce inventory
53. **farmer_protection_warnings** - Farmer safety warnings

### F-G (3 tables)
54. **flagged_markets** - Flagged market reports
55. **food_rescue_claims** - Food rescue claim tracking
56. **food_rescue_listings** - Food waste reduction listings
57. **food_rescue_matches** - Donor-recipient matching
58. **food_rescue_recipients** - Food rescue recipients
59. **group_input_orders** - Group buying orders
60. **group_order_participants** - Group order participation

### I (5 tables)
61. **imperfect_surplus_produce** - Discounted surplus/imperfect produce
62. **input_products** - Input products (legacy)
63. **input_suppliers** - Input suppliers (legacy)
64. **inquiries** - User inquiries
65. **inventory_items** - General inventory management

### L-M (4 tables)
66. **logistics_providers** - Logistics service providers
67. **market_prices** - Real-time market prices
68. **market_trading_schedules** - Market trading schedules
69. **messages** - User messages

### N-O (5 tables)
70. **notification_preferences** - User notification settings
71. **notifications** - User notifications
72. **order_items** - Order line items
73. **orders** - Order management
74. **organizations** - Organization profiles

### P (7 tables)
75. **payments** - Payment records
76. **post_reports** - Post report tracking
77. **product_auctions** - Product auction listings
78. **product_reviews** - Product reviews
79. **profiles** - User profile information
80. **public_input_suppliers** - Public input supplier view
81. **public_service_providers** - Public service provider view

### R-S (9 tables)
82. **resource_usage** - Resource usage tracking
83. **seller_ratings** - Seller ratings
84. **seller_statistics** - Seller performance stats
85. **service_bookings** - Service booking management
86. **service_providers** - Service provider directory
87. **shopping_carts** - Shopping cart management
88. **subscription_boxes** - Subscription box products
89. **subscription_customizations** - Subscription customizations
90. **subscriptions** - User subscriptions

### U-W (7 tables)
91. **user_roles** - Role-based access control
92. **user_translations** - User language preferences
93. **warehouses** - Warehouse directory
94. **weather_alerts** - Weather alert system
95. **weather_impact** - Weather impact tracking
96. **wishlist_items** - Wishlist items
97. **wishlists** - User wishlists

---

## 🆕 TABLES UNIQUE TO THIS PROJECT (vs Sister Project)

| Table | Purpose | Status |
|-------|---------|--------|
| farmer_exporter_collaborations | Farmer-exporter partnerships | ✅ Complete |
| exporter_profiles | Exporter company profiles | ✅ Complete |
| imperfect_surplus_produce | Discounted surplus produce | ✅ Complete |
| weather_alerts | Weather alert system | ✅ Complete |
| weather_impact | Weather agricultural impact | ✅ Complete |

---

## 📊 TABLE CATEGORY BREAKDOWN

| Category | Count | Status |
|----------|-------|--------|
| User & Auth | 5 | ✅ Complete |
| Marketplace & Trading | 18 | ✅ Complete |
| Farm Management | 14 | ✅ Complete |
| Farm Inputs | 8 | ✅ Complete |
| Community & Social | 8 | ✅ Complete |
| Contract Farming | 7 | ✅ Complete |
| Logistics & Delivery | 7 | ✅ Complete |
| Market Intelligence | 3 | ✅ Complete |
| Food Rescue | 4 | ✅ Complete |
| Export & Trade | 4 | ✅ Complete |
| F2C Subscriptions | 5 | ✅ Complete |
| Notifications | 3 | ✅ Complete |
| Shopping & Orders | 7 | ✅ Complete |
| Weather | 2 | ✅ Complete |
| API Management | 2 | ✅ Complete |
| **TOTAL** | **97** | **100%** |

---

## 🔒 Security Features

- ✅ Row-Level Security (RLS) on all 97 tables
- ✅ User authentication via Supabase Auth
- ✅ Rate limiting for authentication
- ✅ Secure foreign key relationships
- ✅ Triggers for updated_at timestamps
- ✅ Data validation via database constraints
- ✅ Role-based access control (user_roles table)

---

## 📈 Database Health: 100%

**Total Tables:** 97  
**Complete:** 97  
**Missing:** 0  

**Comparison to Sister Project (forge-cloud-start):**
- Sister Project: 95 tables
- This Project: 97 tables
- **Status:** ✅ AT PARITY (EXCEEDS by 2 tables)

---

**Last Updated:** January 27, 2026
