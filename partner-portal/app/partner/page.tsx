import "./partner-portal.css";
import Image from "next/image";
import { ArrowRight, CalendarCheck, IndianRupee, ShieldCheck, Sparkles } from "lucide-react";
import { PartnerPublicShell, PrimaryButton } from "../../components/partner/PartnerUI";
import { customerSiteUrl } from "../../lib/partner/urls";

const steps = [
  ["Create your profile", "Share your contact details and operating location."],
  ["Choose your services", "Select the Zaapino services you are trained to deliver."],
  ["Submit documents", "Upload the requested identity, address and supporting documents."],
  ["Complete verification", "The Zaapino team reviews your application and service requests."],
  ["Receive eligible jobs", "Approved partners can view and manage jobs assigned to them."],
];

export default function PartnerHome() {
  return (
    <PartnerPublicShell>
      <main className="cp-main">
        <section className="cp-hero">
          <div>
            <div className="cp-eyebrow">Zaapino · Partner with us</div>
            <h1>Build your cleaning business with Zaapino.</h1>
            <p>Join our network of cleaning professionals. Create your partner profile, choose the work you can provide, manage your schedule and track jobs from one simple portal.</p>
            <div className="cp-hero-actions">
              <PrimaryButton href="/partner/register">Register as a partner <ArrowRight size={16}/></PrimaryButton>
              <PrimaryButton href="/partner/login" variant="secondary">Already a partner? Log in</PrimaryButton>
            </div>
          </div>
          <div className="cp-hero-art">
            <div
              className="cp-worker-card"
              style={{
                width: "min(380px, 100%)",
                height: 350,
                padding: 0,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Image
                src="/images/partner-cleaning-professional.png"
                alt="Zaapino cleaning professional ready to work"
                fill
                priority
                sizes="(max-width: 760px) 90vw, 380px"
                style={{ objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: "auto 0 0",
                  padding: "42px 18px 18px",
                  background: "linear-gradient(transparent, rgba(8, 38, 91, .88))",
                  color: "white",
                  textAlign: "left",
                }}
              >
                <b style={{ display: "block", fontSize: 17 }}>Cleaning Partner</b>
                <span style={{ display: "block", marginTop: 5, fontSize: 12 }}>
                  Reliable service. Flexible schedule.
                </span>
              </div>
            </div>
          </div>
        </section>
        <section className="cp-benefit-grid">
          <article className="cp-benefit"><div className="cp-benefit-icon"><CalendarCheck size={19}/></div><b>Eligible bookings</b><span>View jobs assigned after partner approval.</span></article>
          <article className="cp-benefit"><div className="cp-benefit-icon"><Sparkles size={19}/></div><b>Flexible availability</b><span>Set your working days and operating hours.</span></article>
          <article className="cp-benefit"><div className="cp-benefit-icon"><IndianRupee size={19}/></div><b>Earnings overview</b><span>Review completed-job value and payout status.</span></article>
          <article className="cp-benefit"><div className="cp-benefit-icon"><ShieldCheck size={19}/></div><b>Partner-first support</b><span>Manage documents and raise support requests.</span></article>
        </section>
        <section className="cp-card">
          <h2>How partner onboarding works</h2>
          <p>Follow the steps below to submit your Zaapino partner application.</p>
          <div className="cp-process-grid">{steps.map(([title, description], index) => <article className="cp-process-card" key={title}><div className="cp-process-num">{index + 1}</div><b>{title}</b><p>{description}</p></article>)}</div>
          <div className="cp-note">Submitting an application does not guarantee approval or job allocation. Partner status, document verification and service approval are controlled by Zaapino administrators.</div>
        </section>
        {customerSiteUrl ? <p style={{textAlign:"center",marginTop:18,fontSize:12,color:"#71839b"}}>Looking for a cleaning service? <a className="cp-inline-link" href={customerSiteUrl}>Return to the Zaapino customer website</a>.</p> : null}
      </main>
    </PartnerPublicShell>
  );
}
