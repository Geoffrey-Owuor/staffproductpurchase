"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { AnimatePresence } from "framer-motion";
import { Eye, EyeClosed, Loader2 } from "lucide-react"; // Import icons
import Alert from "../Alert";
import FormAsterisk from "../Reusables/FormAsterisk/FormAsterisk";
import ConfirmationDialog from "../Reusables/ConfirmationDialog";
import ChangeEmail from "./ChangeEmail";

export default function SecuritySettingsPage() {
  const { email } = useUser();
  const [showChangeEmail, setShowChangeEmail] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const [errorType, setErrorType] = useState("");
  const [confirmationDialogue, setConfirmationDialogue] = useState(false);

  // Effect to check if new passwords match
  useEffect(() => {
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
    } else if (
      currentPassword &&
      newPassword &&
      newPassword === currentPassword
    ) {
      setPasswordError("New password should not be same as current password");
    } else {
      setPasswordError("");
    }
  }, [currentPassword, newPassword, confirmPassword]);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setConfirmationDialogue(false);
    setUpdating(true);

    try {
      const response = await fetch("/api/reset-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, currentPassword, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setShowAlert(true);
        setErrorType("success");
        setMessage(data.message || "Password reset successfull");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setUpdating(false);
      } else {
        setShowAlert(true);
        setErrorType("error");
        setMessage(data.message || "Failed to reset password");
      }
    } catch (error) {
      setShowAlert(true);
      setErrorType("error");
      setMessage("Failed to reset password");
      console.error("Failed to update password:", error);
    } finally {
      setUpdating(false);
    }
  };
  return (
    <>
      <AnimatePresence>
        {showChangeEmail && (
          <ChangeEmail onClose={() => setShowChangeEmail(false)} />
        )}

        {confirmationDialogue && (
          <ConfirmationDialog
            title="Confirm password update"
            message="Are you sure you want to update your password?"
            onConfirm={handleUpdatePassword}
            onCancel={() => setConfirmationDialogue(false)}
          />
        )}
      </AnimatePresence>

      {showAlert && (
        <Alert
          message={message}
          type={errorType}
          onClose={() => setShowAlert(false)}
        />
      )}

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Security Settings
        </h2>

        {/* Email Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Address
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-lg border border-gray-300 bg-gray-100 p-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
              {email}
            </div>
            <button
              type="button"
              onClick={() => setShowChangeEmail(true)}
              className="rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              change email
            </button>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Change Password
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setConfirmationDialogue(true);
            }}
            className="space-y-4"
          >
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Password <FormAsterisk />
              </label>
              <div className="relative mt-1">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-white p-2 pr-10 text-gray-900 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="Enter current password"
                  required
                />
                <div
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showCurrent ? <EyeClosed size={20} /> : <Eye size={20} />}
                </div>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                New Password <FormAsterisk />
              </label>
              <div className="relative mt-1">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-white p-2 pr-10 text-gray-900 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="Enter new password"
                  required
                />
                <div
                  onClick={() => setShowNew(!showNew)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showNew ? <EyeClosed size={20} /> : <Eye size={20} />}
                </div>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm New Password <FormAsterisk />
              </label>
              <div className="relative mt-1">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-white p-2 pr-10 text-gray-900 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="Confirm new password"
                  required
                />
                <div
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showConfirm ? <EyeClosed size={20} /> : <Eye size={20} />}
                </div>
              </div>
              {passwordError && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-500">
                  {passwordError}
                </p>
              )}
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={
                  passwordError ||
                  !newPassword ||
                  updating ||
                  !currentPassword ||
                  !confirmPassword
                }
                className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-500 dark:hover:bg-red-600"
              >
                {updating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
