import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get("title") || "YourApp"
  const description = searchParams.get("description") || ""

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
          backgroundColor: "#ffffff",
          fontFamily: "system-ui",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "#0E768C",
              letterSpacing: "-0.02em",
            }}
          >
            YourApp
          </div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: "#1a1a1a",
              lineHeight: 1.2,
              letterSpacing: "-0.03em",
              maxWidth: "80%",
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                fontSize: 22,
                color: "#6b6b6b",
                lineHeight: 1.4,
                maxWidth: "70%",
              }}
            >
              {description}
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
