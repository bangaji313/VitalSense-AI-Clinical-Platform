import "./globals.css";

export const metadata = {
  title: "VitalSense AI",
  description: "Early Warning System for Mortality Prediction",
};

export default function RootLayout({ children }) {
  return (
    // Tambahkan suppressHydrationWarning={true} di sini
    <html lang="en" suppressHydrationWarning={true}>
      <body
        suppressHydrationWarning={true} 
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}