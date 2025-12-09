import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "StrataGenie - AI-Powered Strata Compliance for NSW";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  // Load fonts
  const [newsreaderFont, jakartaFont] = await Promise.all([
    fetch(
      new URL("https://fonts.gstatic.com/s/newsreader/v20/cY9qfjOCX1hbuyalUrK49dLac06G1ZGsZBtoBCzBDXXD9JVF438w.woff2")
    ).then((res) => res.arrayBuffer()),
    fetch(
      new URL("https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_d0n9QB_VIKg.woff2")
    ).then((res) => res.arrayBuffer()),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#FDFBF7",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Warm gradient overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(ellipse at 30% 20%, rgba(255, 107, 53, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(255, 107, 53, 0.05) 0%, transparent 40%)",
          }}
        />

        {/* Decorative geometric shapes */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            border: "1px solid rgba(255, 107, 53, 0.15)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -150,
            left: -150,
            width: 500,
            height: 500,
            borderRadius: "50%",
            border: "1px solid rgba(255, 107, 53, 0.1)",
            display: "flex",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "80px 100px",
            height: "100%",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 40,
            }}
          >
            <span
              style={{
                fontSize: 48,
                fontFamily: "Newsreader",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "#1a1a2e",
              }}
            >
              Strata
            </span>
            <span
              style={{
                fontSize: 48,
                fontFamily: "Newsreader",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "#FF6B35",
              }}
            >
              Genie
            </span>
          </div>

          {/* Tagline */}
          <h1
            style={{
              fontSize: 64,
              fontFamily: "Newsreader",
              fontWeight: 600,
              color: "#1a1a2e",
              lineHeight: 1.1,
              marginBottom: 24,
              maxWidth: 800,
              letterSpacing: "-0.02em",
            }}
          >
            AI-Powered Strata Compliance for NSW
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 28,
              fontFamily: "Plus Jakarta Sans",
              color: "#6b6b8a",
              lineHeight: 1.4,
              maxWidth: 700,
              marginBottom: 48,
            }}
          >
            Self-manage your strata scheme with confidence. Automated AGM notices, financial tracking, and compliance monitoring.
          </p>

          {/* Feature pills */}
          <div
            style={{
              display: "flex",
              gap: 16,
            }}
          >
            {["AGM Compliance", "Financial Reports", "Document Vault"].map(
              (feature) => (
                <div
                  key={feature}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 24px",
                    backgroundColor: "rgba(255, 107, 53, 0.1)",
                    borderRadius: 100,
                    border: "1px solid rgba(255, 107, 53, 0.2)",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "#FF6B35",
                      display: "flex",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 18,
                      fontFamily: "Plus Jakarta Sans",
                      fontWeight: 500,
                      color: "#FF6B35",
                    }}
                  >
                    {feature}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "linear-gradient(90deg, #FF6B35 0%, #E85A2A 100%)",
            display: "flex",
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Newsreader",
          data: newsreaderFont,
          style: "normal",
          weight: 600,
        },
        {
          name: "Plus Jakarta Sans",
          data: jakartaFont,
          style: "normal",
          weight: 500,
        },
      ],
    }
  );
}
