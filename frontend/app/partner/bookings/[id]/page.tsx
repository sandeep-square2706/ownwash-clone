import DashboardShell from "../../../../components/partner/DashboardShell";
import PartnerSection from "../../../../components/partner/PartnerSection";
export default function Page(){return <DashboardShell><PartnerSection title={'Booking Details'} description={'Booking details are shown only after the backend verifies this booking belongs to your account.'}><div className="ckp-alert">Booking detail endpoint must enforce partner ownership before returning customer or location details.</div></PartnerSection></DashboardShell>}
