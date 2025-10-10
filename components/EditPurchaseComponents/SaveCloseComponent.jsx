import { useRouter } from "next/navigation";
import { X, Save } from "lucide-react";
import { useUser } from "@/context/UserContext";
import Alert from "../Alert";
import { useState } from "react";

export default function SaveCloseComponent({ hrApproval, ccApproval }) {
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("error");
  const [alertMessage, setAlertMessage] = useState("");
  const router = useRouter();
  const { role: userRole } = useUser();

  //Handler to check conditions before allowing form submission
  const handleSaveAttempt = (event) => {
    // Condition for 'cc' role
    if (userRole === "cc" && hrApproval !== "approved") {
      event.preventDefault(); // Stop the form from submitting
      setAlertMessage("Request is either not approved or declined by HR");
      setAlertType("error");
      setShowAlert(true);
      return; // End the function
    }

    // Condition for 'bi' role
    if (
      userRole === "bi" &&
      (hrApproval !== "approved" || ccApproval !== "approved")
    ) {
      event.preventDefault(); // Stop the form from submitting
      setAlertMessage(
        "Request is either not approved or declined by HR/Credit",
      );
      setAlertType("error");
      setShowAlert(true);
      return; // End the function
    }
  };

  return (
    <>
      {showAlert && (
        <Alert
          message={alertMessage}
          type={alertType}
          onClose={() => setShowAlert(false)}
        />
      )}
      <div className="flex justify-center space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <X className="mr-2 h-4 w-4" />
          Close
        </button>
        <button
          type="submit"
          onClick={handleSaveAttempt} //The onlick handler
          className="inline-flex items-center rounded-xl border border-transparent bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300"
        >
          <Save className="mr-2 h-4 w-4" />
          Save changes
        </button>
      </div>
    </>
  );
}
