import Link from "next/link";
import { Icon } from "@/components/Icons";

export default function NewBannerPage() {
  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">CONTENT</p>
          <h2>Create a Home-page Banner</h2>
          <p>Home-page banners are offers with the “Show on home page” option enabled.</p>
        </div>
      </div>
      <div className="panel">
        <p>Create an offer to publish its title, description, and coupon code on the customer website.</p>
        <Link className="primary-btn" href="/admin/offers/new">
          <Icon name="plus" /> Create Offer Banner
        </Link>
      </div>
    </section>
  );
}
