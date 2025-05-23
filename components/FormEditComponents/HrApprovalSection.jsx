export default function HRApprovalSection({ formData, handleChange }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-red-200 shadow">
      <div className="bg-red-900 px-6 py-3 text-white">
        <h3 className="text-lg font-medium">HR/Payroll Approval</h3>
      </div>
      <div className="grid grid-cols-1 gap-6 bg-white p-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="is_employed"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Employment Status
          </label>
          <select
            id="is_employed"
            name="is_employed"
            value={formData.is_employed}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500"
          >
            <option value="">select status</option>
            <option value="contract">Contract</option>
            <option value="permanent">Permanent</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="on_probation"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Probation ?
          </label>
          <select
            id="on_probation"
            name="on_probation"
            value={formData.on_probation}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500"
          >
            <option value="">select status</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="hr_approval"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Approval Status
          </label>
          <select
            id="hr_approval"
            name="hr_approval"
            value={formData.hr_approval}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500"
          >
            <option value="">select status</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="hr_approver_name"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            HR Approver Name
          </label>
          <input
            type="text"
            id="hr_approver_name"
            name="hr_approver_name"
            value={formData.hr_approver_name}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
        </div>

        <div>
          <label
            htmlFor="hr_approval_date"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Approval Date
          </label>
          <input
            type="date"
            id="hr_approval_date"
            name="hr_approval_date"
            value={formData.hr_approval_date}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
        </div>

        <div>
          <label
            htmlFor="hr_signature"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            HR Signature
          </label>
          <input
            type="text"
            id="hr_signature"
            name="hr_signature"
            value={formData.hr_signature}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="hr_comments"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            HR Comments
          </label>
          <textarea
            id="hr_comments"
            name="hr_comments"
            rows={3}
            value={formData.hr_comments}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
        </div>
      </div>
    </div>
  );
}
