# Backend Integration Plan for LocaSpace

## Current Status
- ✅ **Backend**: Fully implemented Spring Boot API with MySQL
- ❌ **Frontend**: Using mock data and localStorage
- 🔗 **Gap**: Frontend services need to connect to real backend APIs

## Priority Integration Tasks

### 1. **HIGH PRIORITY - Reviews System** 🎯
**Current**: ReviewService uses localStorage
**Backend Available**: 
- `AvisRepository` with full CRUD
- Average rating calculations
- Review validation

**Integration Needed**:
```typescript
// Replace localStorage with HTTP calls
addReview() -> POST /api/lieux/{id}/avis
getUserReviews() -> GET /api/users/me/avis  
getPlaceReviews() -> GET /api/lieux/{id}/avis
```

### 2. **HIGH PRIORITY - Places Data** 🏠
**Current**: place-details uses hardcoded mock data
**Backend Available**: 
- `/api/lieux/{id}` - Get place details
- `/api/lieux/search` - Search places
- Includes photos, ratings, reviews

**Integration Needed**:
```typescript
// Replace mock data with real API calls
loadPlaceDetails() -> GET /api/lieux/{id}
searchPlaces() -> GET /api/lieux/search
```

### 3. **MEDIUM PRIORITY - Reservations** 📅
**Current**: ReservationService uses localStorage
**Backend Status**: Controller exists but needs implementation

**Integration Needed**:
```typescript
// Complete backend implementation first, then connect
createBooking() -> POST /api/reservations
getUserBookings() -> GET /api/reservations/my
cancelBooking() -> DELETE /api/reservations/{id}
```

### 4. **LOW PRIORITY - Authentication** 🔐
**Current**: Basic auth service
**Backend Available**: Full JWT implementation

**Integration Needed**:
```typescript
// Connect to real auth endpoints
login() -> POST /api/auth/signin
register() -> POST /api/auth/signup
```

## Database Schema (Already Exists)
```sql
- users (id, nom, email, mot_de_passe, role)
- lieux (id, titre, description, type, prix, adresse, valide, owner_id)
- lieu_photos (lieu_id, photo_url)
- reservations (id, date_debut, date_fin, statut, user_id, lieu_id)
- avis (id, note, commentaire, user_id, lieu_id)
```

## Sample Data Available
- 6 test users (admin, owners, tenants)
- 3 sample places with photos
- Sample reservations and reviews
- All passwords: "Password123!"

## Next Steps
1. **Start MySQL server** (localhost:3306)
2. **Run Spring Boot backend** (port 8082)
3. **Update frontend services** to use real APIs
4. **Test integration** with existing sample data
5. **Complete reservation controller** implementation

## API Base URL
- Backend: `http://localhost:8082/api`
- Frontend should proxy to this URL