import "./globals.css";

export const metadata = {
  title: "Porchlight",
  description: "A room that turns over every hour.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
