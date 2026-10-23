import DashboardShell from "../../../../../components/partner/DashboardShell";
import PartnerSection from "../../../../../components/partner/PartnerSection";
export default function Page(){return <DashboardShell><PartnerSection title={'Work Completed'} description={'Completion is recorded by the backend and is separate from payment and payout status.'}><div className="ckp-alert">Connect the completion endpoint, required OTP/photos and completion timestamp before using this for live jobs.</div></PartnerSection></DashboardShell>}
