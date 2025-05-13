// app/components/Testimonials.js
export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-white py-20">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            What Our Employees Say
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Hear from Hotpoint team members who've used the Staff Purchase
            System
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-xl bg-gray-50 p-8">
            <div className="mb-4 flex items-center">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <span className="font-bold text-red-600">JD</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">John D.</h4>
                <p className="text-sm text-gray-500">Production Team</p>
              </div>
            </div>
            <p className="text-gray-700 italic">
              "The staff purchase program saved me over $500 on my new
              appliances. The process was seamless and delivery was faster than
              retail!"
            </p>
          </div>
          <div className="rounded-xl bg-gray-50 p-8">
            <div className="mb-4 flex items-center">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
                <span className="font-bold text-rose-600">SM</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Sarah M.</h4>
                <p className="text-sm text-gray-500">Marketing Department</p>
              </div>
            </div>
            <p className="text-gray-700 italic">
              "I love being able to get our products at employee prices. It's
              one of the best benefits of working at Hotpoint."
            </p>
          </div>
          <div className="rounded-xl bg-gray-50 p-8">
            <div className="mb-4 flex items-center">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <span className="font-bold text-red-600">RT</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Robert T.</h4>
                <p className="text-sm text-gray-500">Customer Service</p>
              </div>
            </div>
            <p className="text-gray-700 italic">
              "The online portal makes it so easy to order. I've furnished my
              entire kitchen with Hotpoint products at amazing prices."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
