import type { Metadata } from "next";
import "./globals.css";
import "./terralote.css";

export const metadata: Metadata = {
  title: "TerraLote · Control de lotificaciones",
  description: "Disponibilidad, reservaciones y expedientes con acceso por roles.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
