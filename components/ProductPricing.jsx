// const ProductPricing = ({ formData, handleChange }) => {
//   return (
//     <div className="mb-8 rounded-xl border border-red-200 bg-white shadow-sm">
//       <div className="rounded-t-xl bg-red-900 px-6 py-3 text-lg font-bold text-white">
//         Product & Pricing Details
//       </div>
//       <div className="overflow-x-auto p-6">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-red-50">
//               <th className="border border-red-200 p-3 text-left font-medium text-red-900">
//                 Item Name
//               </th>
//               <th className="border border-red-200 p-3 text-left font-medium text-red-900">
//                 Status (New/RHD2)
//               </th>
//               <th className="border border-red-200 p-3 text-left font-medium text-red-900">
//                 Product Code
//               </th>
//               <th className="border border-red-200 p-3 text-left font-medium text-red-900">
//                 TD Price
//               </th>
//               <th className="border border-red-200 p-3 text-left font-medium text-red-900">
//                 Discount Rate
//               </th>
//               <th className="border border-red-200 p-3 text-left font-medium text-red-900">
//                 Discounted Value
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td className="border border-red-200 p-2">
//                 <input
//                   type="text"
//                   name="itemname"
//                   value={formData.itemname}
//                   onChange={handleChange}
//                   className="w-full rounded-xl border border-red-200 p-2 focus:border-red-500 focus:ring-2 focus:ring-red-200"
//                   required
//                 />
//               </td>
//               <td className="border border-red-200 p-2">
//                 <select
//                   name="itemstatus"
//                   value={formData.itemstatus}
//                   onChange={handleChange}
//                   className={`w-full rounded-xl border border-red-200 p-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 ${formData.itemstatus === "" ? "text-gray-400" : "text-black"}`}
//                   required
//                 >
//                   <option value="" disabled>
//                     Select
//                   </option>
//                   <option value="New">New</option>
//                   <option value="RHD2">RHD2</option>
//                 </select>
//               </td>
//               <td className="border border-red-200 p-2">
//                 <input
//                   type="text"
//                   name="productcode"
//                   value={formData.productcode}
//                   onChange={handleChange}
//                   className="w-full rounded-xl border border-red-200 p-2 focus:border-red-500 focus:ring-2 focus:ring-red-200"
//                 />
//               </td>
//               <td className="border border-red-200 p-2">
//                 <input
//                   type="number"
//                   step="0.01"
//                   name="tdprice"
//                   value={formData.tdprice}
//                   onChange={handleChange}
//                   className="w-full rounded-xl border border-red-200 p-2 focus:border-red-500 focus:ring-2 focus:ring-red-200"
//                 />
//               </td>
//               <td className="border border-red-200 p-2">
//                 <input
//                   type="number"
//                   step="0.01"
//                   name="discountrate"
//                   value={formData.discountrate}
//                   onChange={handleChange}
//                   className="w-full rounded-xl border border-red-200 p-2 focus:border-red-500 focus:ring-2 focus:ring-red-200"
//                 />
//               </td>
//               <td className="border border-red-200 p-2">
//                 <input
//                   type="number"
//                   step="0.01"
//                   name="discountedvalue"
//                   value={formData.discountedvalue}
//                   readOnly
//                   className="w-full rounded-xl border border-red-200 bg-gray-100 p-2 focus:border-red-500 focus:ring-2 focus:ring-red-200"
//                 />
//               </td>
//             </tr>
//           </tbody>
//         </table>

//         <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
//           <div>
//             <label
//               htmlFor="employee_payment_terms"
//               className="mb-2 block font-medium text-red-900"
//             >
//               Payment Terms/Options
//             </label>
//             <select
//               id="employee_payment_terms"
//               name="employee_payment_terms"
//               value={formData.employee_payment_terms}
//               onChange={handleChange}
//               className={`w-full rounded-xl border border-red-200 p-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 ${formData.employee_payment_terms === "" ? "text-gray-400" : "text-black"}`}
//               required
//             >
//               <option value="" disabled>
//                 Select a payment option
//               </option>
//               <option value="CREDIT">Credit</option>
//               <option value="CASH">Cash</option>
//               <option value="BANK">Bank</option>
//               <option value="MPESA">Mpesa</option>
//             </select>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductPricing;

import { useEffect } from "react";

const discountpolicy = {
  "Von Hotpoint on Account": { New: 10, RHD2: 15 },
  "Von Hotpoint on Cash Payment": { New: 12.5, RHD2: 17.5 },
  "Non Von Hotpoint on Cash Payment": { New: 10, RHD2: 15 },
  "Non Von Hotpoint on Account": { New: 7.5, RHD2: 12.5 },
  "Samsung Brand on Cash payment": { New: 5, RHD2: 7.5 },
  "Samsung Brand on Account": { New: 2.5, RHD2: 5 },
};

const ProductPricing = ({ formData, handleChange, setFormData }) => {
  // Auto-calculate discountrate when itemstatus or productpolicy changes
  useEffect(() => {
    const { itemstatus, productpolicy } = formData;
    if (itemstatus && productpolicy && discountpolicy[productpolicy]) {
      const rate = discountpolicy[productpolicy][itemstatus];
      if (rate !== undefined) {
        setFormData((prev) => ({
          ...prev,
          discountrate: rate,
        }));
      }
    }
  }, [formData.itemstatus, formData.productpolicy]);

  return (
    <div className="mb-8 rounded-xl border border-red-200 bg-white shadow-sm">
      <div className="rounded-t-xl bg-red-900 px-6 py-3 text-lg font-bold text-white">
        Product & Pricing Details
      </div>
      <div className="overflow-x-auto p-6">
        {/* Item Name Field Full Width */}
        <div className="mb-4">
          <label className="mb-1 block font-medium text-red-900">
            Item Name
          </label>
          <input
            type="text"
            name="itemname"
            value={formData.itemname}
            onChange={handleChange}
            className="w-full rounded-xl border border-red-200 p-3 focus:border-red-500 focus:ring-2 focus:ring-red-200"
            required
          />
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-red-50">
              <th className="border border-red-200 p-3 text-left font-medium text-red-900">
                Status (New/RHD2)
              </th>
              <th className="border border-red-200 p-3 text-left font-medium text-red-900">
                Item Policy Type
              </th>
              <th className="border border-red-200 p-3 text-left font-medium text-red-900">
                Product Code
              </th>
              <th className="border border-red-200 p-3 text-left font-medium text-red-900">
                TD Price
              </th>
              <th className="border border-red-200 p-3 text-left font-medium text-red-900">
                Discount Rate
              </th>
              <th className="border border-red-200 p-3 text-left font-medium text-red-900">
                Discounted Value
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {/* Status */}
              <td className="border border-red-200 p-2">
                <select
                  name="itemstatus"
                  value={formData.itemstatus}
                  onChange={handleChange}
                  className={`w-full rounded-xl border border-red-200 p-2 focus:border-red-500 focus:ring-2 focus:ring-red-200`}
                  required
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="New">New</option>
                  <option value="RHD2">RHD2</option>
                </select>
              </td>

              {/* Product Policy Type */}
              <td className="border border-red-200 p-2">
                <select
                  name="productpolicy"
                  value={formData.productpolicy || ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-red-200 p-2 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                >
                  <option value="" disabled>
                    Select Policy
                  </option>
                  {Object.keys(discountpolicy).map((policy) => (
                    <option key={policy} value={policy}>
                      {policy}
                    </option>
                  ))}
                </select>
              </td>

              {/* Product Code */}
              <td className="border border-red-200 p-2">
                <input
                  type="text"
                  name="productcode"
                  value={formData.productcode}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-red-200 p-2 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                />
              </td>

              {/* TD Price */}
              <td className="border border-red-200 p-2">
                <input
                  type="number"
                  step="0.01"
                  name="tdprice"
                  value={formData.tdprice}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-red-200 p-2 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                />
              </td>

              {/* Discount Rate - ReadOnly */}
              <td className="border border-red-200 p-2">
                <input
                  type="number"
                  step="0.01"
                  name="discountrate"
                  value={formData.discountrate}
                  readOnly
                  className="w-full rounded-xl border border-red-200 bg-gray-100 p-2 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                />
              </td>

              {/* Discounted Value - ReadOnly */}
              <td className="border border-red-200 p-2">
                <input
                  type="number"
                  step="0.01"
                  name="discountedvalue"
                  value={formData.discountedvalue}
                  readOnly
                  className="w-full rounded-xl border border-red-200 bg-gray-100 p-2 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Payment Terms */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="employee_payment_terms"
              className="mb-2 block font-medium text-red-900"
            >
              Payment Terms/Options
            </label>
            <select
              id="employee_payment_terms"
              name="employee_payment_terms"
              value={formData.employee_payment_terms}
              onChange={handleChange}
              className={`w-full rounded-xl border border-red-200 p-3 focus:border-red-500 focus:ring-2 focus:ring-red-200`}
              required
            >
              <option value="" disabled>
                Select a payment option
              </option>
              <option value="CREDIT">Credit</option>
              <option value="CASH">Cash</option>
              <option value="BANK">Bank</option>
              <option value="MPESA">Mpesa</option>
            </select>
          </div>

          {/* Conditional field to appear when user selects the credit option in payment terms/options */}
          {formData.employee_payment_terms === "CREDIT" && (
            <div>
              <label
                htmlFor="user_credit_period"
                className="mb-2 block font-medium text-red-900"
              >
                Credit Period
              </label>
              <select
                id="user_credit_period"
                name="user_credit_period"
                value={formData.user_credit_period || ""}
                onChange={handleChange}
                className={`w-full rounded-xl border border-red-200 p-3 focus:border-red-500 focus:ring-2 focus:ring-red-200`}
                required
              >
                <option value="" disabled>
                  Select period
                </option>
                <option value="1">1 Month</option>
                <option value="2">2 Months</option>
                <option value="3">3 Months</option>
                <option value="4">4 Months</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPricing;
