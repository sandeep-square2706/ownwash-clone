import DashboardShell from "../../../components/partner/DashboardShell";
import PartnerSection from "../../../components/partner/PartnerSection";
export default function Page(){return <DashboardShell><PartnerSection title={'Partner Profile'} description={'View and update your personal/business information.'}><div className="ckp-alert">Connect the existing /api/partners/me/ endpoint for read/update operations.</div></PartnerSection></DashboardShell>}
