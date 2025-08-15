// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { Eye, EyeClosed } from "lucide-react";

// export default function RegisterPage() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [redirect, setRedirect] = useState(false);
//   const [registrationError, setRegistrationError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (formData.password !== formData.confirmPassword) {
//       setRegistrationError("Passwords do not match");
//       return;
//     }
//     setRedirect(true);
//     try {
//       const { confirmPassword, ...formDataToSend } = formData; //exclude confirmPassword from data being sent to the api;
//       const response = await fetch("/api/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formDataToSend),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         // Determine dashboard path based on role
//         let dashboardPath;
//         if (data.role === "hr") {
//           dashboardPath = "/hrdashboard";
//         } else if (data.role === "cc") {
//           dashboardPath = "/ccdashboard";
//         } else if (data.role === "bi") {
//           dashboardPath = "/bidashboard";
//         } else {
//           dashboardPath = "/staffdashboard";
//         }

//         // Redirect with page reload
//         window.location.href = dashboardPath;
//       } else {
//         const data = await response.json();
//         setRegistrationError(data.message || "Registration Failed");
//         setRedirect(false);
//       }
//     } catch (error) {
//       console.error("Error during registration", error);
//       setRegistrationError("Internal error!, contact support");
//       setRedirect(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
//       <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
//         <h1 className="mb-6 text-center text-3xl font-bold text-red-800">
//           Create Account
//         </h1>

//         {registrationError && (
//           <div className="mb-4 rounded-xl bg-red-100 p-3 text-center text-red-700">
//             {registrationError}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
//           <div className="relative">
//             <input
//               type="text"
//               name="name"
//               id="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               placeholder=" " // <-- important to trigger :placeholder-shown behavior
//               className="peer w-full rounded-xl border border-gray-300 px-4 py-3 placeholder-transparent focus:border-blue-600 focus:outline-none"
//             />
//             <label
//               htmlFor="name"
//               className="absolute -top-3 left-4 bg-white px-1 text-sm text-blue-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-600"
//             >
//               Full Name
//             </label>
//           </div>

//           <div className="relative">
//             <input
//               type="email"
//               name="email"
//               id="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               placeholder=" " // <-- important to trigger :placeholder-shown behavior
//               className="peer w-full rounded-xl border border-gray-300 px-4 py-3 placeholder-transparent focus:border-blue-600 focus:outline-none"
//             />
//             <label
//               htmlFor="email"
//               className="absolute -top-3 left-4 bg-white px-1 text-sm text-blue-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-600"
//             >
//               Email Address
//             </label>
//           </div>

//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               id="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               placeholder=" " // <-- important to trigger :placeholder-shown behavior
//               minLength="8"
//               className="peer w-full rounded-xl border border-gray-300 px-4 py-3 placeholder-transparent focus:border-blue-600 focus:outline-none"
//             />
//             <label
//               htmlFor="password"
//               className="absolute -top-3 left-4 bg-white px-1 text-sm text-blue-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-600"
//             >
//               Password
//             </label>

//             {/* Eye Icon */}
//             <div
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
//             >
//               {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
//             </div>
//           </div>

//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               name="confirmPassword"
//               id="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               required
//               placeholder=" " // <-- important to trigger :placeholder-shown behavior
//               className="peer w-full rounded-xl border border-gray-300 px-4 py-3 placeholder-transparent focus:border-blue-600 focus:outline-none"
//             />
//             {formData.confirmPassword &&
//               formData.password !== formData.confirmPassword && (
//                 <p className="mt-1 text-sm text-red-600">
//                   Passwords do not match
//                 </p>
//               )}
//             <label
//               htmlFor="confirmPassword"
//               className="absolute -top-3 left-4 bg-white px-1 text-sm text-blue-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-600"
//             >
//               Confirm Password
//             </label>
//           </div>

//           <button
//             type="submit"
//             disabled={
//               redirect ||
//               (formData.confirmPassword &&
//                 formData.password !== formData.confirmPassword)
//             }
//             className={`w-full rounded-xl px-4 py-3 font-medium text-white transition duration-200 ${
//               redirect ||
//               (formData.confirmPassword &&
//                 formData.password !== formData.confirmPassword)
//                 ? "cursor-not-allowed bg-red-400"
//                 : "cursor-pointer bg-red-600 hover:bg-red-700"
//             }`}
//           >
//             {redirect ? (
//               <div className="flex items-center justify-center gap-2">
//                 Registering...
//                 <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
//               </div>
//             ) : (
//               <>Register</>
//             )}
//           </button>
//         </form>

//         <div className="mt-6 text-center text-sm text-gray-600">
//           Already have an account?{" "}
//           <Link
//             href="/login"
//             className="font-medium text-red-600 hover:underline"
//           >
//             Sign in
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Step1Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/register/verifyemail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send code");

      router.push("/register/verifycode");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-red-800">
          Verify Your Email
        </h1>

        {error && <div className="mb-4 text-center text-red-700">{error}</div>}

        <form
          onSubmit={handleEmailSubmit}
          className="space-y-5"
          autoComplete="off"
        >
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder=" "
              className="peer w-full rounded-xl border border-gray-300 px-4 py-3 placeholder-transparent focus:border-blue-600 focus:outline-none"
            />
            <label className="absolute -top-3 left-4 bg-white px-1 text-sm text-blue-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-600">
              Email Address
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-xl px-4 py-3 font-medium text-white transition duration-200 ${
              loading
                ? "cursor-not-allowed bg-red-400"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? (
              <>
                <div className="flex items-center justify-center gap-2">
                  Sending...
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                </div>
              </>
            ) : (
              <>Send Verification Code</>
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-red-600 hover:underline"
            >
              login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
