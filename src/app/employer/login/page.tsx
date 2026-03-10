"use client";

import { useRouter } from "next/navigation";

const P = "#8B8FD4";
const NAVY = "#1E1E2E";

export default function EmployerLoginPage() {
  const router = useRouter();

  return (
    <div style={{ fontFamily: "'DM Sans','Outfit',system-ui,sans-serif", minHeight: "100vh", background: "#F7F8FC", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "white", borderRadius: 20, padding: 40, width: 420, boxShadow: "0 8px 32px rgba(30,30,46,.1)" }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>✿</div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: P, marginBottom: 6 }}>EMPLOYER PORTAL</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: NAVY, marginBottom: 4 }}>Welcome back</div>
        <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 24 }}>Log in to your employer account</p>

        <label style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", letterSpacing: "0.08em" }}>WORK EMAIL</label>
        <input defaultValue="hr@brownhealth.org" style={{ display: "block", width: "100%", borderRadius: 8, border: "1px solid #E0E1F4", padding: "10px 12px", fontSize: 14, marginTop: 5, marginBottom: 14, boxSizing: "border-box", outline: "none" }} />

        <label style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", letterSpacing: "0.08em" }}>PASSWORD</label>
        <input type="password" defaultValue="••••••••" style={{ display: "block", width: "100%", borderRadius: 8, border: "1px solid #E0E1F4", padding: "10px 12px", fontSize: 14, marginTop: 5, marginBottom: 22, boxSizing: "border-box", outline: "none" }} />

        <button onClick={() => router.push("/employer")} style={{ width: "100%", background: P, color: "white", border: "none", borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>Log In</button>
        <button onClick={() => router.back()} style={{ width: "100%", background: "none", color: "#9CA3AF", border: "none", fontSize: 13, cursor: "pointer", padding: 4 }}>← Back</button>
      </div>
    </div>
  );
}
