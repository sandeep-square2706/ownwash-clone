import OfferEditor from "../OfferEditor";

export default function NewOfferPage() {
  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">PROMOTIONS</p>
          <h2>Create Offer</h2>
          <p>Customers can enter the coupon code at checkout. Active offers can also appear on the home page.</p>
        </div>
      </div>
      <OfferEditor />
    </section>
  );
}
