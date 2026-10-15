const faqs = [
  {
    question: "How do I book a service?",
    answer:
      "Choose a service, select a suitable date and time, provide your address and confirm the booking.",
  },
  {
    question: "Do you provide doorstep service?",
    answer:
      "Yes. Our services are designed to be delivered at the customer's selected location.",
  },
  {
    question: "How can I contact customer support?",
    answer:
      "You can contact customer support through phone or email.",
  },
  {
    question: "Can I cancel my booking?",
    answer:
      "Cancellation and refund rules will be displayed during the booking process.",
  },
];

export default function FAQPage() {
  return (
    <main className="bg-gray-50">

      <section className="bg-[#0C706A] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          <p className="text-sm font-semibold uppercase tracking-[2px] text-teal-100">
            FAQ & Support
          </p>

          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            Frequently Asked Questions
          </h1>

        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-4">

          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <summary className="cursor-pointer list-none font-bold text-gray-900">
                {faq.question}
              </summary>

              <p className="mt-4 text-sm leading-7 text-gray-600">
                {faq.answer}
              </p>
            </details>
          ))}

        </div>
      </section>

    </main>
  );
}