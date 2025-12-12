//CURRENTLY NOT IN USE

// import { useEffect } from "react";

// export function usePaymentBalanceCalculator(formData, setFormData) {
//   useEffect(() => {
//     //Get numerical values - default to 0 if invalid numbers
//     const invoiceAmount = parseFloat(formData.invoice_amount) || 0;
//     const amountReceived = parseFloat(formData.amount) || 0;

//     //Get current balance and current completion status
//     const currentBalance = parseFloat(formData.payment_balance) || 0;
//     const currentCompletionStatus = formData.payment_completion;

//     //Calculate the balance
//     const balance = invoiceAmount - amountReceived;

//     //Determine new value of completion status
//     const newCompletionStatus = balance <= 0 ? "complete" : "incomplete";

//     //Update payment balance in the state if it has changed

//     if (
//       balance !== currentBalance ||
//       newCompletionStatus !== currentCompletionStatus
//     ) {
//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         payment_balance: balance.toFixed(2),
//         payment_completion: newCompletionStatus,
//       }));
//     }
//   }, [
//     formData.invoice_amount,
//     formData.amount,
//     formData.payment_completion,
//     formData.payment_balance,
//   ]);
// }
