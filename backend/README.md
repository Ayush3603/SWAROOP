# Swaruoop Pay Backend

Spring Boot backend for Swaruoop Pay - Facial Recognition Payment System.

## Features

- **Authentication**: Phone-based login/signup with auto-linked bank accounts
- **Face Recognition**: Face enrollment and matching using 128-d embeddings
- **Banking**: Manage linked bank accounts and wallet top-ups
- **Payments**: Face-based payment processing

## Tech Stack

- Java 21
- Spring Boot 3.3.5
- Spring Data JPA (Hibernate)
- H2 Database (in-memory for development)
- Maven

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login existing user
- `GET /api/auth/{id}` - Get user profile
- `DELETE /api/auth/{id}` - Delete account

### Face Recognition
- `POST /api/face/enroll/{profileId}` - Enroll face
- `POST /api/face/identify` - Identify face

### Banking
- `GET /api/banking/{profileId}/accounts` - Get linked accounts
- `POST /api/banking/{profileId}/accounts` - Add bank account
- `DELETE /api/banking/accounts/{bankId}` - Remove bank account
- `POST /api/banking/{profileId}/add-funds` - Add funds to wallet

### Payments
- `POST /api/pay/charge` - Process payment

## Running the Application

### Prerequisites

- Java 21+
- Maven 3.6+

### Build

```bash
cd backend
mvn clean install
```

### Run

```bash
mvn spring-boot:run
```

The application will start on port 8080.

### H2 Console

Access the H2 database console at `http://localhost:8080/h2-console`

- JDBC URL: `jdbc:h2:mem:swaruoop-pay`
- Username: `sa`
- Password: (empty)

## Project Structure

```
backend/
├── src/main/java/com/swaruoop/pay/
│   ├── SwaruoopPayApplication.java
│   ├── controller/       # REST API controllers
│   │   ├── AuthController.java
│   │   ├── BankingController.java
│   │   ├── FaceController.java
│   │   └── PaymentController.java
│   ├── model/            # JPA entities
│   │   ├── AccountType.java
│   │   ├── BankAccount.java
│   │   ├── Profile.java
│   │   ├── Transaction.java
│   │   └── TxnType.java
│   ├── repository/       # JPA repositories
│   │   ├── BankAccountRepository.java
│   │   ├── ProfileRepository.java
│   │   └── TransactionRepository.java
│   └── service/          # Business logic
│       ├── AuthService.java
│       ├── BankingService.java
│       ├── FaceService.java
│       └── PaymentService.java
└── pom.xml
```

## Configuration

See `src/main/resources/application.yml` for configuration options:

- Server port: `8080`
- H2 console: `/h2-console`
- Face matching threshold: `0.55` (default)

## License

MIT
