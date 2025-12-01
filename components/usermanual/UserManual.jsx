import {
  LogIn,
  UserPlus,
  ShoppingCart,
  Bell,
  GitPullRequest,
  LifeBuoy,
  CheckCircle2,
  CreditCard,
  BrainCog,
  Banknote,
  AlertCircle,
} from "lucide-react";
import ThemeToggle from "../Reusables/ThemeProviders/ThemeToggle";
import Header from "../landingpage/Header";

// --- STATIC DATA ---
const manualSteps = [
  {
    id: 1,
    title: "How to Access the Portal",
    icon: LogIn,
    content: [
      "Click the login link to access the portal.",
      "Use your company email when registering (recommended).",
      "If you don't have a company email, you may use your personal email.",
    ],
  },
  {
    id: 2,
    title: "New User Registration",
    icon: UserPlus,
    content: [
      "Fill in the required details on the registration page.",
      "Check your email for a verification code.",
      "Enter the code to complete your registration.",
    ],
  },
  {
    id: 3,
    title: "Submitting a Purchase Request",
    icon: ShoppingCart,
    content: [
      "Log in to the portal and click “New Purchase” on the left sidebar.",
      "Enter the required information.",
      "Add the products you wish to purchase.",
      "Important: If buying items on special/offer pricing, indicate this in the “Other Details” field.",
      "Review and submit your request.",
    ],
  },
  {
    id: 4,
    title: "Email Notifications",
    icon: Bell,
    content: [
      "You will receive email updates when your request is successfully submitted.",
      "You will be notified as your request passes through approval stages (Payroll → HR → Credit Control → Invoicing).",
    ],
  },
  {
    id: 5,
    title: "Approval Workflows",
    icon: GitPullRequest,
    description: "Different purchase types follow specific approval routes:",
    // This section has nested types, so we structure it differently
    subTypes: [
      {
        subtitle: "Cash Purchases",
        subIcon: Banknote,
        details: [
          "Approvals: 2 Stages (Credit Control → Invoicing).",
          "Action Required: You must enter the M-PESA payment code.",
        ],
      },
      {
        subtitle: "Credit Purchases",
        subIcon: CreditCard,
        details: [
          "Approvals: 4 Stages (Payroll → HR → Credit Control → Invoicing).",
          "Action Required: You must select a credit period (1 - 4 months).",
        ],
      },
      {
        subtitle: "Partial Payment (Cash + Credit)",
        subIcon: AlertCircle,
        details: [
          "Action Required: Select the credit period AND enter the M-PESA payment code.",
        ],
      },
    ],
  },
  {
    id: 6,
    title: "Need Assistance?",
    icon: LifeBuoy,
    content: [
      "If you encounter issues or have questions, please contact IT for support.",
    ],
  },
];

const UserManual = () => {
  return (
    <>
      {/* Header */}
      <Header />

      <section className="min-h-screen w-full bg-white px-4 py-20 md:px-8 dark:bg-gray-950">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-16 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl dark:text-white">
              Staff Purchase Portal
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              User Guide & Documentation
            </p>
          </div>

          {/* Vertical Timeline */}
          <div className="relative ml-3 border-l-2 border-gray-200 md:ml-6 dark:border-gray-800">
            {manualSteps.map((step) => (
              <div key={step.id} className="relative mb-12 ml-8 md:ml-12">
                {/* Timeline Dot / Icon */}
                <span className="absolute -left-[52px] flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 ring-8 ring-white md:-left-[68px] dark:bg-blue-950 dark:ring-gray-950">
                  <step.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </span>

                {/* Content Card */}
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900/50">
                  <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                    {step.id}. {step.title}
                  </h3>

                  {/* Render Standard List Content */}
                  {step.content && (
                    <ul className="space-y-3">
                      {step.content.map((point, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-gray-600 dark:text-gray-300"
                        >
                          <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-green-500" />
                          <span className="text-base leading-relaxed">
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Render Complex Sub-types (For Section 5) */}
                  {step.subTypes && (
                    <div className="mt-2 grid gap-4 md:grid-cols-1">
                      {step.description && (
                        <p className="mb-2 text-gray-600 dark:text-gray-400">
                          {step.description}
                        </p>
                      )}
                      {step.subTypes.map((sub, subIdx) => (
                        <div
                          key={subIdx}
                          className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
                        >
                          <div className="mb-2 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                            <sub.subIcon className="h-4 w-4 text-blue-500" />
                            {sub.subtitle}
                          </div>
                          <ul className="ml-6 list-disc space-y-1 text-sm text-gray-600 marker:text-gray-400 dark:text-gray-300">
                            {sub.details.map((detail, dIdx) => (
                              <li key={dIdx}>{detail}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-12 rounded-xl bg-blue-50 p-6 text-center dark:bg-blue-900/20">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Note: This manual serves as a guide for the Staff Purchase Portal.
              Workflows are subject to system updates.
            </p>
          </div>
        </div>
      </section>
      <div className="relative px-10 py-14 dark:border-gray-800">
        {/* Centered Part */}
        <div className="absolute inset-0 top-0 flex items-center justify-center space-x-1 text-sm md:top-7">
          <span className="text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Hotpoint Appliances Ltd. Built by
          </span>
          <a
            href="https://jeff-portfolio-web.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-gray-500 hover:text-gray-600 hover:underline dark:hover:text-gray-400"
          >
            <span className="font-semibold">Jeff</span>
            <BrainCog className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* ThemeToggle pinned right */}
        <div className="absolute top-18.5 right-4 md:top-18 md:-translate-y-1/2">
          <ThemeToggle />
        </div>
      </div>
    </>
  );
};

export default UserManual;
