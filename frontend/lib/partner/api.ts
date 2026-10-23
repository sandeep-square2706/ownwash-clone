const API = (
  process.env.NEXT_PUBLIC_CLEANKART_API_URL ||
  "http://127.0.0.1:8000/api"
).replace(/\/$/, "");
export function partnerToken(){if(typeof window==="undefined")return "";return localStorage.getItem("cleankart_access_token")||"";}
export async function partnerApi<T=any>(path:string,options:RequestInit={}):Promise<T>{const headers=new Headers(options.headers);if(!(options.body instanceof FormData))headers.set("Content-Type","application/json");const token=partnerToken();if(token)headers.set("Authorization",`Bearer ${token}`);const res=await fetch(`${API}${path.startsWith("/")?path:`/${path}`}`,{...options,headers,credentials:"include"});if(!res.ok){let message="Request failed";try{const d=await res.json();message=d.detail||d.message||JSON.stringify(d);}catch{}throw new Error(message)}if(res.status===204)return undefined as T;return res.json();}
