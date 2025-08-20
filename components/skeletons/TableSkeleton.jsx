// components/Skeletons/TableSkeleton.jsx
export default function TableSkeleton() {
  return (
    <div className="flex justify-center p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-900 border-t-transparent"></div>
    </div>
    // <div className="animate-pulse p-2">
    //   {/* Table Skeleton */}
    //   <div className="rounded-2xl border border-gray-200 shadow">
    //     <table className="min-w-full divide-y divide-gray-200">
    //       {/* Table Header Skeleton */}
    //       <thead className="bg-gray-200">
    //         <tr>
    //           {[...Array(8)].map((_, i) => (
    //             <th key={i} className="px-6 py-3">
    //               <div className="mx-auto h-4 w-3/4 rounded bg-gray-300"></div>
    //             </th>
    //           ))}
    //         </tr>
    //       </thead>

    //       {/* Table Body Skeleton */}
    //       <tbody className="divide-y divide-gray-200 bg-white">
    //         {[...Array(5)].map((_, rowIndex) => (
    //           <tr key={rowIndex} className="hover:bg-gray-50">
    //             {[...Array(8)].map((_, cellIndex) => (
    //               <td key={cellIndex} className="px-6 py-4">
    //                 <div
    //                   className="h-4 rounded bg-gray-200"
    //                   style={{ width: `${70 + cellIndex * 5}%` }}
    //                 ></div>
    //               </td>
    //             ))}
    //           </tr>
    //         ))}
    //       </tbody>
    //     </table>
    //   </div>
    // </div>
  );
}
