import { FileSignature } from "lucide-react";

const TermsConditions = () => {
  const terms = [
    "1/3 rule must be observed. This includes monthly average commissions for the sales staff.",
    "Maximum repayment period is 4 months.",
    "Item purchased on a staff discount benefit for the purpose of reselling is prohibited.",
    "The company shall deduct any outstanding balances from the employee's final dues in case of separation.",
    "The employee should not be on probation.",
    "Limited to only one item of similar category within a year for both new and RHD2.",
    "The employee will not have an outstanding amount from a previous purchase.",
    "For new products, normal warranty terms and conditions shall apply, while for RHD2 items, a 3-month warranty period will be applicable.",
    "Items purchased on discount cannot be returned, exchanged, or refunded unless the item is faulty and covered under warranty.",
  ];

  return (
    <div className="mx-2 mt-8 mb-2 rounded-2xl border border-gray-200 bg-white p-6 text-sm">
      <div className="mb-4 ml-0.5 flex items-center gap-2">
        <FileSignature className="h-5 w-5 text-red-600" />
        <h3 className="text-xl font-semibold text-gray-800">
          Terms & Conditions
        </h3>
      </div>
      <div className="space-y-4">
        {terms.map((term, index) => (
          <div key={index} className="flex items-start">
            <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-600">
              {index + 1}
            </span>
            <p className="leading-relaxed text-gray-700">{term}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermsConditions;
