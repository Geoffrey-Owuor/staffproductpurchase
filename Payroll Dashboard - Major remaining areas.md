Major remaining areas

Changing Payroll/HR Approval to HR Approval - In view purchases and edit purchases - **DONE**

GeneralEditPurchases - New component for editing the one-third rule in general edit purchases - **DONE**

generaleditpurchases api - New role payroll And their editable columns - **DONE**

register api - New role (payroll) - **DONE**

Approval Cards - New role (payroll) - **DONE**

Database , New Column (payroll Approval) - **DONE**

Metadata - Payroll Approval - **DONE**

All action clicks **- DONE**

Login and Register Dashboard Routes and APIS - **DONE**

Purchases history and Staff Purchases History - Payroll Approval - **DONE**

staffposts - new pending for payroll approval first email to payroll first and then from payroll to hr in generaleditpurchases - **DONE**

RecentActionButtons - Editing Done

The email sending templates - New folder for payroll - **DONE FOR NOW, TESTING REMAINING** **TESTED**

Editing the return purchase pdf format to include payroll approval - **DONE**
Editing the delete api to fetch the data first and check if biApproval is approved - **DONE**

Fetch Terms & Conditions from the database - a server component - **DONE**
create table and add condition_descriptions - file already included - **DONE**

KEY AREA TO ALSO CHECK - ASK IN THE DEMONSTRATION MEETING

Special pricing by Product Managers - **DONE** **The workaround is already implemented**

If Cash Payment, which approval levels should be skipped - **DONE**

Tommorrow - TASK AT HAND

Add mpesa_code to all tables (Insert dummy data into the database) - **DONE**

Extract all emails directly from the database - (APPROVER EMAILS table) - **DONE**

---Restricting per category - Requires api to return product category - **PENDING**

Check on Payments Tracking - Fully Approved Requests (START HERE) - **FORMATTING DONE FOR NOW**
Remove the payment received section, and all its columns from the database (And all its related logic) - **DONE**

Default for all approver names in General Edit Purchases - **DONE**
Reduce the first loader time - Reduced to 1 second **DONE**
Add an email that sends back to credit control notifying them of Billing Invoice Approval finishing - **DONE**

(WILL BE USED BY CREDIT CONTROL - For closing requests after invoicing approval) **DONE** **MAJOR & MEANINGFUL**
Add two approval cards for how many requests are open and how many are closed - **DONE**
--RETURN request_closure (open & closed) - **DONE**
--Add Mark as closed (In RecentActionButtons with a boolean check) - **DONE**

---ONE SECURITY AREA---
How to invalidate all logged in browser cookies directly from your server (Regardless of all browsers) **PENDING** (Server-side session validation)

---Auto Code Verification---
Done for register one
Done for change email address

--How to create a shortcut in next.js
Alt + N (To open new purchase) - Done

Test deleting a purchase request - Done
Test closing a purchase request - Done
Test updating a request with refresh of approval cards - Done
Create a context for payment tracking approval cards - Done

Once you approve (for any role) - you cannot delete - Done
The concatenation for the period given & mode of payments (payment terms and user credit period) - Pending - Done

SHOW VARIABLES; -- All settings

-- Common ones
SHOW VARIABLES LIKE 'innodb_buffer_pool_size';
SHOW VARIABLES LIKE 'key_buffer_size';
SHOW VARIABLES LIKE 'query_cache_size';
SHOW VARIABLES LIKE 'sort_buffer_size';
SHOW VARIABLES LIKE 'join_buffer_size';
SHOW VARIABLES LIKE 'read_buffer_size';

Check if a port is available in windows command prompt: netstat -ano | findstr :1556 (Our default port)

our url will be http://192.168.0.27:1556 (our url)

(DEPLOYMENT TO PRODUCTION REMAINING) - EXPLORE THIS
--HOSTING YOUR APPLICATION (Intranet Server Host) WITH PM2--
--With best deployment practices - like utilizing all the cores of the server's cpu and such
-- Restrarting the application when it fails to run (PM2)
