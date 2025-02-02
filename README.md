# Faqs-backend-test

This project is a backend service for managing FAQs and user authentication. It is built using Node.js, Express, and MongoDB. The service provides endpoints for user registration, login, and FAQ management, including adding, deleting, and retrieving FAQs in different languages.

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Deployment**: AWS (Amazon ECS or EKS)

## User Routes

| Endpoint                  | Method | Parameters                                                                 | Response                                                                                     |
|---------------------------|--------|----------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|
| `/api/v1/users/register`  | POST   | `email` (string), `password` (string)                                      | `{ success: true, message: "User registered successfully" }`                                 |
| `/api/v1/users/verify`    | POST   | `email` (string), `otp` (string)                                           | `{ success: true, message: "User verified successfully" }`                                   |
| `/api/v1/users/login`     | POST   | `email` (string), `password` (string)                                      | `{ success: true, message: "User logged in successfully" }`                                  |
| `/api/v1/users/resend`    | POST   | `email` (string)                                                           | `{ success: true, message: "OTP sent successfully" }`                                        |
| `/api/v1/users/isLoggedIn`| GET    | `Authorization` (header)                                                   | `{ success: true, user: { ...userDetails } }`                                                |
| `/api/v1/users/logout`    | GET    | `Authorization` (header)                                                   | `{ success: true, message: "User logged out successfully" }`                                 |

## FAQ Routes

| Endpoint              | Method | Parameters                                                                 | Response                                                                                     |
|-----------------------|--------|----------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|
| `/api/v1/faqs/add`    | POST   | `question` (string), `answer` (string), `Authorization` (header)            | `{ success: true, message: "FAQ added successfully", faq: { ...faqDetails } }`               |
| `/api/v1/faqs/delete` | POST   | `id` (string), `Authorization` (header)                                    | `{ success: true, message: "FAQ deleted successfully" }`                                     |
| `/api/v1/faqs/get`    | POST   | `email` (string)                                                           | `{ success: true, faqs: [ ...faqList ] }`                                                    |
| `/api/v1/faqs/get`    | POST   | `email` (string), `lang` (query parameter, optional, default: 'en')        | `{ success: true, faqs: [ ...translatedFaqList ] }`                                          |

### Note:
- The `Authorization` header should contain the JWT token in the format `Bearer <token>`.
- The `lang` query parameter in the `/api/v1/faqs/get` endpoint specifies the language to which the FAQs should be translated.

## Docker, CI/CD, and Deployment on AWS

### Docker
This project uses Docker to containerize the application. The Docker image is built and pushed to Docker Hub using GitHub Actions.

### CI/CD
Continuous Integration and Continuous Deployment (CI/CD) are set up using GitHub Actions. The workflow defined in `.github/workflows/deploy.yaml` automates the process of building and pushing the Docker image to Docker Hub whenever changes are pushed to the `main` branch.

### Deployment on AWS
The Docker image can be deployed on AWS using services like Amazon ECS (Elastic Container Service) or Amazon EKS (Elastic Kubernetes Service). You can configure your AWS environment to pull the Docker image from Docker Hub and run it as a containerized application.
