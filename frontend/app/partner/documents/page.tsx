import DashboardShell from "../../../components/partner/DashboardShell";
import PartnerSection from "../../../components/partner/PartnerSection";
export default function Page(){return <DashboardShell><PartnerSection title={'Documents'} description={'Review your own uploaded document status and any correction requests.'}><div className="ckp-alert">Private document list/download endpoints must enforce partner ownership and admin permissions.</div></PartnerSection></DashboardShell>}
