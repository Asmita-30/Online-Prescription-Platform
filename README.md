# Online Prescription Platform

This project is an **Online Prescription Platform** developed as part of the IdeaMagix technical assignment. The application has separate portals for doctors and patients.

Patients can register, log in, view available doctors, consult a doctor, submit their consultation details, enter payment information, and receive prescriptions. Doctors can register, manage their profile, view patient consultations, create prescriptions, generate prescription PDFs, and send the prescription to the patient.

---

## Project Overview

The application has two main sections:

* **Doctor Portal**

  * Doctor registration and login
  * Doctor profile management
  * View patient consultations
  * Create prescriptions
  * Generate prescription PDFs
  * Download prescriptions
  * Send prescriptions to patients

* **Patient Portal**

  * Patient registration and login
  * View available doctors
  * Select a doctor for consultation
  * Submit consultation details
  * Submit payment transaction details
  * View received prescriptions

---

## Features

### Doctor Portal

The doctor section includes:

* Doctor Sign-up and Sign-in
* Profile picture upload
* Doctor name
* Specialty
* Unique email address
* Unique phone number
* Years of experience with decimal support
* Doctor profile
* View consultations submitted by patients
* View patient consultation details
* Create prescriptions
* Mandatory care instructions
* Medicines field
* Generate prescription PDF
* Download generated prescription
* Send prescription to patient through email

### Patient Portal

The patient section includes:

* Patient Sign-up and Sign-in
* Profile picture upload
* Patient name
* Age
* Unique email address
* Unique phone number
* Surgery history
* Illness history
* Illness history displayed separately in the interface
* View available doctors
* Doctor cards with:

  * Profile picture
  * Name
  * Specialty
  * Consult button
* Submit consultation details
* Multi-step consultation form
* QR-based payment flow
* Transaction ID submission
* View received prescriptions

---

# Consultation Workflow

The consultation form is divided into three steps.

### Step 1 – Current Medical Information

The patient provides:

* Current illness history
* Recent surgery
* Surgery time span

### Step 2 – Family Medical History

The patient provides:

* Diabetes status:

  * Diabetic
  * Non-Diabetic
* Allergies
* Other relevant medical information

### Step 3 – Payment

The patient can:

* View the payment QR code
* Make the required payment
* Enter the transaction ID
* Submit the consultation

Once the consultation is submitted:

* The consultation details are stored in MongoDB.
* The doctor can view the submitted consultation from the Doctor Portal.

---

# Prescription Workflow

The prescription process works as follows:

1. The patient submits a consultation.
2. The consultation is stored in the database.
3. The doctor can see the submitted consultation from the Doctor Portal.
4. The doctor opens the patient's consultation details.
5. The doctor creates a prescription.
6. The doctor enters:

   * Care to be taken
   * Medicines
7. The prescription is saved.
8. A PDF prescription is generated.
9. The doctor can download/save the generated PDF.
10. The prescription can be sent to the patient through email.

---

# Technology Stack

## Frontend

* React.js
* Vite
* React Router
* Axios
* React Hot Toast
* HTML5
* CSS3

## Backend

* Node.js
* Express.js
* JWT Authentication
* Multer
* PDFKit
* Nodemailer

## Database

* MongoDB
* Mongoose

## Cloud Services

* Cloudinary – Used for storing profile images
* SMTP / Email Service – Used for sending prescriptions through email


# Authentication

JWT-based authentication is used for both doctors and patients.

There are separate authentication flows for:

* Doctors
* Patients

Protected routes require a valid authentication token.

The roles are also checked so that:

* Doctors can manage consultations and prescriptions.
* Patients can consult doctors and access their prescriptions.

---

# Main API Modules

## Doctor APIs

```text
POST   /api/doctors/signup
POST   /api/doctors/login
GET    /api/doctors
GET    /api/doctors/:id
```

## Patient APIs

```text
POST   /api/patients/signup
POST   /api/patients/login
```

## Consultation APIs

```text
POST   /api/consultations
GET    /api/consultations
GET    /api/consultations/:id
```

## Prescription APIs

```text
POST   /api/prescriptions
GET    /api/prescriptions
GET    /api/prescriptions/:id
GET    /api/prescriptions/:id/pdf
```
---

# Data Flow

The main flow of the application is:

```text
Patient
   │
   ▼
Patient Registration / Login
   │
   ▼
Doctors List
   │
   ▼
Select Doctor
   │
   ▼
Consultation Form
   │
   ├── Step 1: Current Illness / Surgery
   │
   ├── Step 2: Family Medical History
   │
   └── Step 3: Payment / Transaction ID
   │
   ▼
Consultation Saved
   │
   ▼
Doctor Views Consultation
   │
   ▼
Doctor Creates Prescription
   │
   ├── Care to be Taken
   │
   └── Medicines
   │
   ▼
PDF Generated
   │
   ├── Doctor Downloads PDF
   │
   └── Prescription Sent to Patient
```


The following table shows how the project covers the requirements given in the assignment.

| Requirement                 | Implementation                    |
| --------------------------- | --------------------------------- |
| Doctor Sign-up/Sign-in      | Doctor authentication             |
| Patient Sign-up/Sign-in     | Patient authentication            |
| Doctor profile picture      | Cloudinary                        |
| Doctor specialty            | Doctor profile                    |
| Unique doctor email         | Database validation               |
| Unique doctor phone         | Database validation               |
| Decimal experience          | Number field with decimal support |
| Patient profile picture     | Cloudinary                        |
| Patient medical history     | Patient profile                   |
| Doctors grid                | Patient portal                    |
| Consult button              | Doctor selection                  |
| Multi-step consultation     | Consultation form                 |
| Current illness history     | Consultation Step 1               |
| Recent surgery              | Consultation Step 1               |
| Diabetes status             | Consultation Step 2               |
| Allergies                   | Consultation Step 2               |
| Other medical information   | Consultation Step 2               |
| Payment QR                  | Consultation Step 3               |
| Transaction ID              | Consultation Step 3               |
| Save consultation           | MongoDB                           |
| Doctor profile              | Doctor portal                     |
| View consultations          | Doctor portal                     |
| Prescription creation       | Prescription form                 |
| Mandatory care instructions | Prescription validation           |
| Medicines                   | Prescription form                 |
| PDF generation              | PDFKit                            |
| Save/download PDF           | Prescription PDF endpoint         |
| Send prescription           | Email service                     |

--
# Security Considerations

The application currently includes:

* JWT authentication
* Password hashing
* Protected routes
* Role-based authorization
* Unique email validation
* Unique phone validation
* Environment-based configuration
* Cloudinary for profile image storage


---

# Project

**Online Prescription Platform**

This project was developed as a full-stack MERN application for the **IdeaMagix technical assignment**.

**Technology:** MongoDB · Express.js · React.js · Node.js
