-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 07, 2025 at 03:54 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `staffpurchases`
--

-- --------------------------------------------------------

--
-- Table structure for table `purchasesinfo`
--

CREATE TABLE `purchasesinfo` (
  `id` int(11) NOT NULL,
  `staffName` varchar(255) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `payrollNo` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `itemName` varchar(255) NOT NULL,
  `itemStatus` varchar(255) NOT NULL,
  `productCode` varchar(255) NOT NULL,
  `tdPrice` decimal(10,2) NOT NULL,
  `discountRate` decimal(5,2) NOT NULL,
  `discountedValue` decimal(10,2) NOT NULL,
  `date` date NOT NULL,
  `signature` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `HR_Approval` varchar(50) DEFAULT NULL,
  `CC_Approval` varchar(50) DEFAULT NULL,
  `BI_Approval` varchar(50) DEFAULT NULL,
  `is_employed` varchar(50) DEFAULT NULL,
  `on_probation` varchar(50) DEFAULT NULL,
  `hr_comments` text DEFAULT NULL,
  `hr_approver_name` varchar(100) DEFAULT NULL,
  `hr_approver_id` int(11) DEFAULT NULL,
  `hr_approval_date` date DEFAULT NULL,
  `hr_signature` varchar(255) DEFAULT NULL,
  `credit_period` text DEFAULT NULL,
  `one_third_rule` text DEFAULT NULL,
  `purchase_history_comments` text DEFAULT NULL,
  `pending_invoices` text DEFAULT NULL,
  `cc_signature` varchar(100) DEFAULT NULL,
  `cc_approval_date` date DEFAULT NULL,
  `cc_approver_id` int(11) DEFAULT NULL,
  `invoice_date` date DEFAULT NULL,
  `invoice_number` varchar(255) DEFAULT NULL,
  `invoice_amount` decimal(10,2) DEFAULT NULL,
  `invoice_recorded_date` date DEFAULT NULL,
  `payment_method` varchar(300) DEFAULT NULL,
  `payment_reference` text DEFAULT NULL,
  `payment_date` date DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `bi_signature` varchar(100) DEFAULT NULL,
  `bi_approver_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchasesinfo`
--

INSERT INTO `purchasesinfo` (`id`, `staffName`, `user_id`, `payrollNo`, `department`, `itemName`, `itemStatus`, `productCode`, `tdPrice`, `discountRate`, `discountedValue`, `date`, `signature`, `createdAt`, `HR_Approval`, `CC_Approval`, `BI_Approval`, `is_employed`, `on_probation`, `hr_comments`, `hr_approver_name`, `hr_approver_id`, `hr_approval_date`, `hr_signature`, `credit_period`, `one_third_rule`, `purchase_history_comments`, `pending_invoices`, `cc_signature`, `cc_approval_date`, `cc_approver_id`, `invoice_date`, `invoice_number`, `invoice_amount`, `invoice_recorded_date`, `payment_method`, `payment_reference`, `payment_date`, `amount`, `bi_signature`, `bi_approver_id`) VALUES
(6, 'Humphrey Odhiambo', 3, '112268', 'HR', 'Von Fridge', 'New', 'p675234', 15000.00, 0.05, 14568.00, '2025-05-19', 'HUMPHREY ODHIAMBO', '2025-05-03 09:08:29', 'approved', 'declined', 'pending', 'contract', 'yes', 'No current comment', 'Cerah Imani', 2, '2025-06-05', 'CERAH IMANI', 'Bad purchase history, no credit period given. ', '1/3 rule Observed', 'Bad Purchase History', '1 pending invoice', 'CREDIT CONTROL', '2025-05-29', 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(7, 'Lapspot Ify', 4, '674581', 'ENGINEERING & HVAC', 'Ramtoms Cooker', 'RHD2', 'r567123', 446667.90, 4.19, 436542.80, '2025-05-18', 'LAPSPOT IFY', '2025-05-05 06:23:01', 'approved', 'approved', 'approved', 'permanent', 'no', 'Staff Purchase Form Approved for Lapspot Ify', 'Cerah Imani', 2, '2025-05-18', 'CERAH IMANI', 'Credit Period is good', 'Third Rule Assessment has been met', 'Employee has a good purchase history', 'No pending invoices', 'CREDIT CONTROL', '2025-05-30', 5, '2025-05-29', '4551233446', 45678.00, '2025-05-31', 'cash', 'Cash Payment', '2025-06-07', 47000.00, 'BILLING INVOICE', 6);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `session_token` varchar(36) NOT NULL,
  `role` varchar(55) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `role` varchar(55) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `name`, `role`, `created_at`, `reset_token`, `reset_token_expiry`) VALUES
(2, 'cerah@gmail.com', '$2b$10$XhoNCNXyGkKmpzDNF10Y4Og5mh2dPSkfizz1UPoGb8uFtvhpNoOTy', 'Cerah Imani', 'hr', '2025-05-01 07:50:22', NULL, NULL),
(3, 'ho@hotpoint.co.ke', '$2b$10$ZBI30ZRkq6LFAEL6R9EtK.MYElNf/Qz6XPp32q9qvoNiQckSG.R4K', 'Humphrey Odhiambo', 'staff', '2025-05-03 09:06:37', NULL, NULL),
(4, 'lapspotify2@gmail.com', '$2b$10$INd5PnF2ty52EJwfoYaGTeIqdNH44J1XPzOGuEAvxyZUH5iAkZFWS', 'Lapspot Ify', 'staff', '2025-05-05 06:19:01', NULL, NULL),
(5, 'cc@hotpoint.co.ke', '$2b$10$BeiNHaI6orgXB/1TEVm/k.I5Ve0lGc4LwuBOYPTBm06TTngBa6tZq', 'Credit Control', 'cc', '2025-05-06 12:47:14', NULL, NULL),
(6, 'bi@hotpoint.co.ke', '$2b$10$/j.Yv4obnJjcBqZtwUrd9ep/GCbLDETtvpjRld5YutLo0oU/x3Rg6', 'Billing Invoice', 'bi', '2025-05-07 11:39:58', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `purchasesinfo`
--
ALTER TABLE `purchasesinfo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `purchasesinfo_ibfk_2` (`hr_approver_id`),
  ADD KEY `purchasesinfo_ibfk_3` (`cc_approver_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `session_token` (`session_token`),
  ADD KEY `idx_session_token` (`session_token`),
  ADD KEY `idx_user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `purchasesinfo`
--
ALTER TABLE `purchasesinfo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `purchasesinfo`
--
ALTER TABLE `purchasesinfo`
  ADD CONSTRAINT `purchasesinfo_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchasesinfo_ibfk_2` FOREIGN KEY (`hr_approver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchasesinfo_ibfk_3` FOREIGN KEY (`cc_approver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
