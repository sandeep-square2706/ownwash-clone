import type {ReactNode} from "react";
export default function PartnerSection({title,description,children}:{title:string;description:string;children?:ReactNode}){return <section className="ckp-card" style={{marginTop:18}}><div className="ckp-kicker" style={{color:"#1766de"}}>Zaapino Partner</div><h1 style={{marginTop:8}}>{title}</h1><p className="ckp-muted">{description}</p>{children}</section>}
