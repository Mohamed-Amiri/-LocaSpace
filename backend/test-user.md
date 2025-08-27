# Test Users for LocaSpace

## Test Credentials
All test users have the password: **Password123!**

### Tenant User
- Email: `tenant@test.com`
- Password: `Password123!`
- Role: LOCATAIRE (tenant)

### Owner User  
- Email: `owner@test.com`
- Password: `Password123!`
- Role: PROPRIETAIRE (owner)

### Admin User
- Email: `admin@test.com`
- Password: `Password123!`
- Role: ADMIN (admin)

## Testing the Flow

1. **Register a new user** with any email and the role you want to test
2. **Login** with the credentials above to test existing users
3. **Check routing** - each role should redirect to the appropriate dashboard:
   - Tenant → `/locataire`
   - Owner → `/proprietaire`  
   - Admin → `/admin`

## Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter  
- At least one digit
- At least one special character (!@#$%^&*(),.?":{}|<>)