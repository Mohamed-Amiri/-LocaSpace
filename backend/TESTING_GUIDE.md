# LocaSpace Backend Unit Tests Guide

## What Are Unit Tests?

Unit tests are small, fast tests that verify individual pieces of code (usually methods) work correctly in isolation. They help us:

1. **Catch bugs early** - Before the code goes to production
2. **Document behavior** - Tests show how code should work
3. **Enable safe refactoring** - We can change code confidently
4. **Improve code quality** - Writing testable code leads to better design

## Test Structure

Every test follows the **AAA Pattern**:

```java
@Test
void testMethodName() {
    // ARRANGE: Set up test data and mocks
    when(mockRepository.findById(1L)).thenReturn(Optional.of(testUser));
    
    // ACT: Call the method being tested
    User result = userService.getUserById(1L);
    
    // ASSERT: Verify the results
    assertNotNull(result);
    assertEquals(1L, result.getId());
}
```

## Our Test Files

### 1. UserServiceTest.java
- **Most comprehensive example**
- Shows all testing concepts
- Tests user registration, validation, CRUD operations
- Demonstrates exception testing
- **Start here to learn testing fundamentals**

### 2. LieuServiceTest.java  
- **Medium complexity**
- Tests business logic (authorization, validation)
- Shows how to test conditional logic
- Tests search and filtering functionality

### 3. AvisServiceTest.java
- **Simplest example**
- Basic CRUD operations only
- Perfect for beginners
- Shows essential testing patterns

## Key Testing Concepts

### Mocking with @Mock
```java
@Mock
private UserRepository userRepository;  // Creates a fake repository
```

### Dependency Injection with @InjectMocks
```java
@InjectMocks
private UserService userService;  // Injects mocks into this service
```

### Setting Up Mock Behavior
```java
// Tell the mock what to return
when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

// Tell the mock to throw an exception
when(userRepository.findById(999L)).thenThrow(new RuntimeException());

// For void methods
doNothing().when(userRepository).deleteById(1L);
```

### Assertions
```java
// Check values
assertEquals(expected, actual);
assertNotNull(result);
assertTrue(condition);
assertFalse(condition);

// Check exceptions
assertThrows(BadRequestException.class, () -> userService.registerUser(user));
```

### Verifying Mock Interactions
```java
// Verify method was called once
verify(userRepository, times(1)).save(any(User.class));

// Verify method was never called
verify(userRepository, never()).deleteById(anyLong());
```

## How to Run the Tests

### Option 1: Using Maven (Command Line)
```bash
# Run all tests
mvn test

# Run tests for a specific class
mvn test -Dtest=UserServiceTest

# Run a specific test method
mvn test -Dtest=UserServiceTest#registerUser_WhenEmailNotExists_ShouldReturnSavedUser
```

### Option 2: Using IDE
- **IntelliJ IDEA**: Right-click on test class → "Run Tests"
- **Eclipse**: Right-click on test class → "Run As" → "JUnit Test"

### Option 3: Maven with detailed output
```bash
# Run tests with detailed output
mvn test -Dtest=UserServiceTest -DforkCount=0

# Run tests and generate report
mvn test jacoco:report
```

## Test Output Explanation

### Successful Test
```
[INFO] Tests run: 10, Failures: 0, Errors: 0, Skipped: 0
```

### Failed Test
```
[ERROR] Tests run: 10, Failures: 1, Errors: 0, Skipped: 0
[ERROR] Failures:
[ERROR] registerUser_WhenEmailNotExists_ShouldReturnSavedUser: expected: <LOCATAIRE> but was: <null>
```

## Common Test Patterns

### Testing Happy Path (Success)
```java
@Test
void createUser_WithValidData_ShouldSucceed() {
    // Test when everything works correctly
}
```

### Testing Error Cases
```java
@Test
void createUser_WithInvalidEmail_ShouldThrowException() {
    // Test when something goes wrong
}
```

### Testing Edge Cases
```java
@Test
void searchUsers_WithEmptyString_ShouldReturnAllUsers() {
    // Test boundary conditions
}
```

## Best Practices

1. **One concept per test** - Each test should verify one specific behavior
2. **Descriptive names** - Test names should explain what they test
3. **Arrange-Act-Assert** - Follow the AAA pattern consistently
4. **Independent tests** - Tests shouldn't depend on each other
5. **Use @DisplayName** - Add human-readable descriptions

## Troubleshooting

### Common Issues:

1. **NullPointerException in tests**
   - Check that all mocks are properly set up
   - Ensure @ExtendWith(MockitoExtension.class) is present

2. **Tests fail randomly**
   - Avoid using static data that changes
   - Reset mocks between tests (done automatically)

3. **Mocks not working**
   - Verify method signatures match exactly
   - Check that you're mocking the right object

## Next Steps

1. **Start with AvisServiceTest** - It's the simplest
2. **Read UserServiceTest** - Learn comprehensive testing
3. **Practice with LieuServiceTest** - Understand business logic testing
4. **Write your own tests** - Try testing ReservationService

Remember: **Good tests make better code!** Writing tests will help you understand the code better and catch bugs before they reach production.