# 🛒 Staff Product Purchase Portal

### Internal Workflow Automation & Request Management System

The **Staff Product Purchase Portal** is a specialized web application designed to digitize and automate the internal purchasing process for employees. By moving away from manual paperwork/emails to a centralized digital workflow, this system increases transparency, reduces processing time, and ensures accurate record-keeping for staff transactions.

## 🎯 Project Overview

This application serves as a self-service bridge between staff members and the HR/finance departments. It is built to handle the specific lifecycle of a staff product purchase:

- **Request Initiation:** Staff members can browse approved items and initiate purchase requests.
- **Workflow Automation:** Requests are automatically routed through the set approval workflow (e.g., Payroll - Hr - Invoicing, etc.).
- **Status Tracking:** Real-time visibility into the status of a purchase (Pending, Approved, Declined, Closed).
- **Historical Auditing:** A permanent, accessible record of all past transactions for both the user and administration - which
  can be exported into an excel file.

## 🚀 Key Features

### ⚡ Workflow & Automation

- **Self-Service Dashboard:** Personalized views for different roles (Staff, Hr, Payroll, Credit Control) to manage their specific actions.
- **Route-Based Logic:** Intelligent routing ensures users only see data relevant to their role (e.g., `/hrdashboard` vs `/ccdashboard`).
- **Digital History:** Automated logging (Data is saved to a MySQL database) of all requests creates a seamless audit trail,
  replacing manual spreadsheets.
- **Real-time Feedback:** Immediate visual feedback through automated email notifications on request states
  (Pending, Approved, Declined) to reduce user uncertainty.

### 🎨 User Experience

- **Modern Interface:** A clean, responsive UI built for efficiency.
- **Theme Support:** Fully accessible Dark and Light modes to suit user preference.
- **Optimized Performance:** Fast page loads and transitions using the Next.js App Router.

## 🛠️ Technology Stack

- **Core Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
- **UI Library:** React
- **Styling:** Tailwind CSS (Inferred)
- **Icons:** Lucide React
- **Typography:** Geist Font Family
- **Deployment:** Vercel

---

### Basic Folder Structure

- `/app`: Contains the App Router pages and layouts.
- `/components`: Reusable UI components (Sidebar, LoadingLine, etc.).
- `/utils`: Helper functions and hooks e.g., Email Templates.
- `/public`: Static assets.
