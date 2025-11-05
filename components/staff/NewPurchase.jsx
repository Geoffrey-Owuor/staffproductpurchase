"use client";
import { useState, useMemo, useEffect } from "react";
import StaffInformation from "../StaffInformation";
import ProductPricing from "../ProductPricing";
import Alert from "../Alert";
import { LoadingBarWave } from "../Reusables/LoadingBar";
import { ClipboardList, PackagePlus, PlusCircle, Trash2 } from "lucide-react";
import ConfirmationDialog from "../Reusables/ConfirmationDialog";
import PaymentDetails from "../PaymentDetails";
import TopBarButtons from "../Reusables/TopBarButtons/TopBarButtons";
import { FetchPeriodsPolicies } from "@/app/lib/FetchPeriodsPolicies";
import { useUser } from "@/context/UserContext";

// The initial state for a single product
const initialProductState = {
  itemName: "",
  itemStatus: "",
  productPolicy: "",
  productCode: "",
  tdPrice: "",
  discountRate: "",
  discountedValue: "",
};

export default function NewPurchase() {
  const user = useUser();

  const [discountPolicies, setDiscountPolicies] = useState([]);
  const [staffInfo, setStaffInfo] = useState({
    // Staff Information
    staffName: user.name,
    payrollNo: user.payrollNo,
    department: user.department,
  });

  //Initially setting periods to an empty array
  const [periods, setPeriods] = useState([]);

  const [products, setProducts] = useState([{ ...initialProductState }]);

  //Calculating the total discountedValue from the products
  const purchaseTotal = useMemo(() => {
    //Using reduce to sum up discounted value of all products
    return products.reduce((total, product) => {
      const value = parseFloat(product.discountedValue) || 0;
      return total + value;
    }, 0);
  }, [products]);

  const [paymentInfo, setPaymentInfo] = useState({
    employee_payment_terms: "",
    invoicing_location: "",
    delivery_details: "",
    mpesa_code: "",
    user_credit_period: "",
    createdAt: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  //useEffect for fetching credit periods and discount policies
  useEffect(() => {
    const fetchData = async () => {
      // Fetching credit periods and discount policies
      const { periods, policies } = await FetchPeriodsPolicies();

      //Setting the credit periods and discount policies
      setPeriods(periods);
      setDiscountPolicies(policies);
    };
    fetchData();
  }, []);

  //Handler for staff change
  const handleStaffChange = (e) => {
    const { name, value } = e.target;
    setStaffInfo((prev) => ({ ...prev, [name]: value }));
  };

  //Handle for payment change
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({ ...prev, [name]: value }));
  };

  //Handler for product change
  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = products.map((product, i) =>
      i === index ? { ...product, [name]: value } : product,
    );

    setProducts(updatedProducts);
  };

  const setProductData = (index, updater) => {
    setProducts((currentProducts) =>
      currentProducts.map((product, i) => {
        if (i === index) {
          // Check if the 'updater' is a function (the (prev) => ... pattern)
          if (typeof updater === "function") {
            // If it is, call it with the current product to get the new state
            return updater(product);
          }
          // Otherwise, it's a plain object, so merge it
          return { ...product, ...updater };
        }
        return product;
      }),
    );
  };

  //Adding a product
  const addProduct = () => {
    setProducts([...products, { ...initialProductState }]);
  };

  //Removing a product
  const removeProduct = (index) => {
    if (products.length > 1) {
      //Prevent removing the last item
      const updatedProducts = products.filter((_, i) => i !== index);
      setProducts(updatedProducts);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);

    //Combine all state parts into 1 object for the API
    const finalFormData = {
      staffInfo,
      products,
      paymentInfo,
    };

    try {
      const response = await fetch("/api/staffposts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalFormData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      const data = await response.json();

      setAlertMessage(data.message || "Purchase request sent");
      setAlertType("success");
      setShowAlert(true);

      // Reset the form
      setProducts([{ ...initialProductState }]);
      setPaymentInfo({
        employee_payment_terms: "",
        invoicing_location: "",
        delivery_details: "",
        user_credit_period: "",
        mpesa_code: "",
        createdAt: "",
      });
      setStaffInfo({ staffName: "", payrollNo: "", department: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      setAlertMessage(
        error.message || "An error occurred while submitting the form",
      );
      setAlertType("error");
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mx-auto p-2 leading-relaxed dark:text-white">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center justify-center gap-2 text-gray-900 dark:text-gray-200">
            <ClipboardList className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Purchase Request Form</h1>
          </div>
          <TopBarButtons />
        </div>

        <form
          id="staffInformation"
          onSubmit={(e) => {
            e.preventDefault();
            setShowConfirmDialog(true);
          }}
          autoComplete="off"
        >
          {isSubmitting && <LoadingBarWave isLoading={true} />}

          <StaffInformation
            formData={staffInfo}
            handleChange={handleStaffChange}
            userRole={user.role}
          />

          {/* New Payment Details Component */}
          <PaymentDetails
            formData={paymentInfo}
            handleChange={handlePaymentChange}
            userRole={user.role}
            periods={periods}
          />

          {/* Main Product Pricing title */}
          <div className="mt-8 mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <PackagePlus className="h-6 w-6" />
            <span className="text-xl">Product & Pricing Details</span>
          </div>

          {/* Map over the products array to render a component for each */}
          {products.map((product, index) => (
            <div key={index} className="relative">
              <ProductPricing
                formData={product}
                handleChange={(e) => handleProductChange(index, e)}
                setFormData={(data) => setProductData(index, data)}
                discountPolicies={discountPolicies}
                productNumber={index + 1}
                userRole={user.role}
                paymentTerms={paymentInfo.employee_payment_terms}
              />
              {products.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProduct(index)}
                  className="absolute top-2 right-4 rounded-full p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-[#4c2e2f]"
                  title="Remove Product"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}

          <div className="my-4 flex flex-col items-center space-y-3 md:flex-row md:justify-between md:space-y-0">
            {purchaseTotal > 0 && (
              <span className="text-lg">
                Total Purchase Value:{" "}
                <span className="font-bold">{`Ksh ${purchaseTotal.toFixed(2)}`}</span>
              </span>
            )}
            <button
              type="button"
              onClick={addProduct}
              className="flex items-center gap-2 rounded-xl bg-gray-950 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
            >
              <PlusCircle className="h-5 w-5" />
              Add Product
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mx-auto mt-8 block rounded-xl bg-gray-900 px-6 py-2.5 text-sm text-white transition-colors hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300"
          >
            Submit Purchase
          </button>
        </form>

        {/* Alert Component */}
        {showAlert && (
          <Alert
            message={alertMessage}
            type={alertType}
            onClose={() => setShowAlert(false)}
          />
        )}
      </div>
      {showConfirmDialog && (
        <ConfirmationDialog
          message="Are you sure you want to submit this purchase request? (You cannot edit after submission)"
          onConfirm={() => {
            setShowConfirmDialog(false);
            handleSubmit();
          }}
          onCancel={() => setShowConfirmDialog(false)}
          title="Submit Purchase"
        />
      )}
    </>
  );
}
