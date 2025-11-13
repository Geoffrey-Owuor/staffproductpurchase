export default function ProductItemsInfo({ products }) {
  //Calculate total discounted value using the reduce function
  const totalDiscountedValue = products
    .reduce((sum, p) => sum + parseFloat(p.discountedValue || 0), 0)
    .toFixed(2);

  return (
    <div className="border-b border-gray-200 p-6 dark:border-gray-700">
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        Product & Pricing Details
      </h2>
      <div className="overflow-x-auto">
        <table className="mb-4 min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-700 text-white dark:bg-gray-800">
            <tr>
              {[
                "Item Name",
                "Status",
                "Policy",
                "Code",
                "TD Price",
                "Discount",
                "Discounted Value",
              ].map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-medium whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {products.length > 0 ? (
              products.map((product, index) => (
                <tr key={index}>
                  <td
                    className="overflow-hidden px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-white"
                    title={product.itemName}
                  >
                    {product.itemName}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-300">
                    {product.itemStatus}
                  </td>
                  <td
                    className="overflow-hidden px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-300"
                    title={product.productPolicy}
                  >
                    {product.productPolicy || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-300">
                    {product.productCode}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-300">
                    {Number(product.tdPrice).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-300">
                    {Number(product.discountRate).toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-white">
                    {Number(product.discountedValue).toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No products found for this purchase.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Display the total discounted value here (Only when there are products) */}
      {products.length > 0 && (
        <div className="mt-6 flex justify-end">
          <div className="text-right">
            <p className="font-semibold text-gray-900 dark:text-white">
              Total Discounted Value:
            </p>
            <p className="text-lg font-bold text-gray-600 dark:text-gray-300">
              {totalDiscountedValue}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
