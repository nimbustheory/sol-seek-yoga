import { useContext } from "react";
import { Calendar, Flame, Heart, Users, CreditCard, PartyPopper, Bell, Shield, Sparkles, MapPin } from "lucide-react";
import { AdminContext } from "./main.jsx";
import config from "./demo.config.js";
import App from "./App.jsx";

const iconMap = {
  calendar: Calendar, flame: Flame, heart: Heart, users: Users,
  creditCard: CreditCard, partyPopper: PartyPopper, bell: Bell,
  shield: Shield, sparkles: Sparkles, mapPin: MapPin,
};

export default function DemoWrapper() {
  const a = config.accent;
  const { isAdmin, setIsAdmin } = useContext(AdminContext);

  // --- ADMIN MODE: full-browser takeover, no phone frame ---
  if (isAdmin) {
    return (
      <div style={{ height: "100vh", overflow: "hidden", background: "#0f1520", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <style>{`
          ::-webkit-scrollbar { display: none; }
          * { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        <App />
      </div>
    );
  }

  // --- CONSUMER MODE: phone frame with sidebars ---
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#f5f2ed", fontFamily: "'DM Sans', system-ui, sans-serif", overflow: "hidden" }}>

      {/* Hide scrollbars globally */}
      <style>{`
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Three-column layout */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", justifyContent: "center" }}>

        {/* Left sidebar */}
        <aside className="demo-sidebar-left" style={{ width: 320, flexShrink: 0, overflowY: "auto", padding: "32px 28px 24px", display: "flex", flexDirection: "column" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: a, marginBottom: 24 }}>Prototype Demo</p>

          {/* Studio identity */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: a, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: "#fff", fontWeight: 700 }}>{config.logoMark}</div>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, color: "#1e2430", lineHeight: 1 }}>{config.shortName}</div>
              <div style={{ fontSize: 13, color: "#6a7060" }}>{config.subtitle}</div>
            </div>
          </div>

          {/* Feature list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1 }}>
            {config.features.map((f, i) => {
              const Icon = iconMap[f.icon] || Calendar;
              return (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <Icon size={18} color={a} style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1e2430" }}>{f.title}</div>
                    <div style={{ fontSize: 13, color: "#7a7868", lineHeight: 1.4 }}>{f.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{ marginTop: 32, paddingTop: 16, borderTop: "1px solid #e8e2d8" }}>
            <p style={{ fontSize: 12, color: "#a8a090", letterSpacing: "0.02em" }}>BUILT BY LUMI — LUMICLASS.APP</p>
          </div>
        </aside>

        {/* Center -- phone frame */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "0 24px", flexShrink: 0 }}>
          <div style={{
            width: 390,
            height: "100vh",
            borderRadius: 0,
            overflow: "hidden",
            background: "#f0ebe4",
            boxShadow: "0 8px 40px rgba(0,0,0,.12), 0 2px 12px rgba(0,0,0,.06)",
            position: "relative",
            transform: "translateZ(0)",
          }}>
            <App />
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="demo-sidebar-right" style={{ width: 300, flexShrink: 0, overflowY: "auto", padding: "32px 24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {config.salesCards.map((card, i) => {
            const Icon = iconMap[card.icon] || Shield;
            return (
              <div key={i} style={{ background: "#fff", border: "1px solid #e8e2d8", borderRadius: 14, padding: "24px 22px" }}>
                <Icon size={24} color={a} style={{ marginBottom: 14 }} />
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: "#1e2430", margin: "0 0 8px" }}>{card.title}</h3>
                <p style={{ fontSize: 14, color: "#6a7060", lineHeight: 1.5, margin: 0 }}>{card.desc}</p>
              </div>
            );
          })}
        </aside>
      </div>

      {/* Responsive: hide sidebars on small screens */}
      <style>{`
        @media (max-width: 1100px) {
          .demo-sidebar-left, .demo-sidebar-right { display: none !important; }
        }
      `}</style>
    </div>
  );
}
