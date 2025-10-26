// import { useState } from "react";
// import { CircleUserRound, ShieldUser, X } from "lucide-react";
// import GeneralSettingsPage from "./GeneralSettingsPage";
// import SecuritySettingsPage from "./SecuritySettingsPage";

// export default function SettingsPage({ onClose }) {
//   const [activeTab, setActiveTab] = useState("general");

//   return (
//     <div className="custom-blur fixed inset-0 z-50 flex items-center justify-center bg-white/50 p-4 dark:bg-gray-950/50">
//       <div className="relative">
//         <div className="mx-auto flex h-138 w-full min-w-3xl overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
//           {/* Side Navigation */}
//           <div className="w-1/4 border-r border-gray-200 bg-white/50 p-4 dark:border-gray-800 dark:bg-gray-950/50">
//             <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
//               Settings
//             </h3>
//             <nav className="flex flex-col space-y-2">
//               <button
//                 onClick={() => setActiveTab("general")}
//                 className={`flex items-center space-x-3 rounded-lg p-2 text-left text-sm font-medium transition-colors ${
//                   activeTab === "general"
//                     ? "bg-gray-200 text-black dark:bg-gray-800 dark:text-white"
//                     : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
//                 }`}
//               >
//                 <CircleUserRound className="h-5 w-5" />
//                 <span>General</span>
//               </button>
//               <button
//                 onClick={() => setActiveTab("security")}
//                 className={`flex items-center space-x-3 rounded-lg p-2 text-left text-sm font-medium transition-colors ${
//                   activeTab === "security"
//                     ? "bg-gray-200 text-black dark:bg-gray-800 dark:text-white"
//                     : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
//                 }`}
//               >
//                 <ShieldUser className="h-5 w-5" />
//                 <span>Security</span>
//               </button>
//             </nav>
//           </div>

//           {/* Content Panel */}
//           <div className="w-3/4 p-8">
//             {/* Conditionally rendered content */}
//             {activeTab === "general" && <GeneralSettingsPage />}
//             {activeTab === "security" && <SecuritySettingsPage />}
//           </div>
//         </div>
//         {/* Close Icon */}
//         <button
//           onClick={onClose}
//           className="absolute top-0.5 -right-11 cursor-pointer rounded-full bg-gray-200 p-1.5 text-gray-600 transition-colors hover:text-gray-800 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-100"
//           aria-label="Close dialog"
//         >
//           <X className="h-5 w-5" />
//         </button>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { CircleUserRound, ShieldUser, X } from "lucide-react";
import GeneralSettingsPage from "./GeneralSettingsPage";
import SecuritySettingsPage from "./SecuritySettingsPage";

export default function SettingsPage({ onClose }) {
  const [activeTab, setActiveTab] = useState("general");

  return (
    // MODAL WRAPPER:
    // Remove default padding for mobile, add it back on `md` screens.
    <div className="custom-blur fixed inset-0 -left-159 z-[80] flex items-center justify-center bg-white/50 md:inset-0 md:p-4 dark:bg-gray-950/50">
      <div className="relative">
        {/* MODAL CARD:
            - Default (mobile): Full width, full height, flex-col.
            - `md` (desktop): Apply original fixed-width/height, flex-row, rounding, etc.
        */}
        <div className="mx-auto flex h-full w-92 flex-col overflow-hidden rounded-2xl bg-gray-50 shadow-2xl md:h-138 md:w-full md:min-w-3xl md:flex-row md:border md:border-gray-200 dark:bg-gray-900 dark:md:border-gray-800">
          {/* Side Navigation */}
          {/* - Default (mobile): `w-full`, `border-b` (bottom border).
            - `md` (desktop): `w-1/4`, `border-r` (right border), remove `border-b`.
          */}
          <div className="w-full border-b border-gray-200 bg-white/50 p-4 md:w-1/4 md:border-r md:border-b-0 dark:border-gray-800 dark:bg-gray-950/50">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Settings
            </h3>
            {/* - Default (mobile): `flex-row`, `overflow-x-auto` for a tab bar.
              - `md` (desktop): `flex-col`, reset overflow and spacing.
            */}
            <nav className="flex flex-row items-center justify-center space-x-2 overflow-x-auto pb-2 md:flex-col md:space-y-2 md:space-x-0 md:overflow-x-visible md:pb-0">
              <button
                onClick={() => setActiveTab("general")}
                /* - Default (mobile): Add `flex-shrink-0` and `whitespace-nowrap` so tabs don't wrap.
                 */
                className={`flex flex-shrink-0 items-center space-x-2 rounded-lg p-2 text-left text-sm font-medium whitespace-nowrap transition-colors md:w-full ${
                  activeTab === "general"
                    ? "bg-gray-200 text-black dark:bg-gray-800 dark:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
                }`}
              >
                <CircleUserRound className="h-5 w-5" />
                <span className="mt-0.5 md:mt-0">General</span>
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`flex flex-shrink-0 items-center space-x-2 rounded-lg p-2 text-left text-sm font-medium whitespace-nowrap transition-colors md:w-full ${
                  activeTab === "security"
                    ? "bg-gray-200 text-black dark:bg-gray-800 dark:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
                }`}
              >
                <ShieldUser className="h-5 w-5" />
                <span className="mt-0.5 md:mt-0">Security</span>
              </button>
            </nav>
          </div>

          {/* Content Panel */}
          {/* - Default (mobile): `w-full`, `flex-grow` (to fill height), `overflow-y-auto`, smaller padding.
            - `md` (desktop): `w-3/4`, reset grow/scroll, original padding.
          */}
          <div className="w-full flex-grow overflow-y-auto p-4 md:w-3/4 md:flex-grow-0 md:p-8">
            {/* Conditionally rendered content */}
            {activeTab === "general" && <GeneralSettingsPage />}
            {activeTab === "security" && <SecuritySettingsPage />}
          </div>
        </div>

        {/* Close Icon */}
        {/* - Default (mobile): Positioned top-right (e.g., `top-4 right-4`).
          - `md` (desktop): Uses original "outside" position.
        */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer rounded-full bg-gray-200 p-1.5 text-gray-600 transition-colors hover:text-gray-800 md:top-0.5 md:-right-11 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-100"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
