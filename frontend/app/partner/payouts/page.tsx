import DashboardShell from "../../../components/partner/DashboardShell";
import PartnerSection from "../../../components/partner/PartnerSection";
export default function Page(){return <DashboardShell><PartnerSection title={'Payouts'} description={'Check payout references and statuses; bank values must remain masked.'}><div className="ckp-list">{["Pending","Processing","Paid","Failed","On Hold","Reversed"].map(x=><div className="ckp-row" key={x}><b>{x}</b><span>Awaiting payout API</span></div>)}</div></PartnerSection></DashboardShell>}
