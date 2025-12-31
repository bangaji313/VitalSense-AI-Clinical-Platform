# VitalSense AI: Clinical Decision Support System

![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Health Informatics](https://img.shields.io/badge/Health_Informatics-SC4_SC6-red?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-EAS_READY-success?style=for-the-badge)

**VitalSense AI** is an advanced Clinical Decision Support System (CDSS) designed to predict ICU mortality risk in real-time. Developed for the **Applied Health Informatics (IFB-499)** Final Term Examination, this platform demonstrates the integration of operational data handling, interoperability standards (FHIR), and AI governance.

---

## 🏥 Key Features (SC Coverage)

### SC4: Operational Data Handling
- **ICU Command Center:** Real-time dashboard monitoring patient vitals and risk trends.
- **ETL Data Migration Engine:** Simulated pipeline for extracting legacy CSV data, validating against schema, and loading into the production database with visual logs.

### SC5: Integration & Platform
- **FHIR R4 Interoperability:** Built-in viewer to convert patient data into HL7 FHIR Standard JSON format for data exchange (SatuSehat/BPJS ready).
- **Security & Access Control:** Simulated secure login with Role-Based Access Control (RBAC) for Chief Medical Officers.

### SC6: Insight & Governance
- **AI Mortality Prediction:** Logistic Regression model trained on clinical records (12 variables) to predict mortality risk (Low/High/Critical) with "Explainable AI" insights.
- **Governance & Audit Trail:** Comprehensive logs tracking user activities, data access, and anomaly detection to ensure HIPAA/GDPR compliance.

---

## 🛠 Tech Stack

* **Framework:** Next.js 15 (App Router)
* **Styling:** Tailwind CSS + Lucide React Icons
* **Visualization:** Recharts
* **AI Logic:** Client-side Inference (Logistic Regression weights extracted from Python/Scikit-Learn)
* **Deployment:** Vercel Ready

---

## 🚀 Getting Started

To run this project locally on your machine:

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/bangaji313/VitalSense-AI-Clinical-Platform.git](https://github.com/bangaji313/VitalSense-AI-Clinical-Platform.git)
    cd VitalSense-AI-Clinical-Platform
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 📄 License

This project is intended for educational purposes (Final Exam IFB-499).
Dataset Source: *Heart Failure Clinical Records* (Davison Chicco & Giuseppe Jurman, 2020).