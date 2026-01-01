import "./globals.css";
import { AuthContextProvider } from "@/lib/AuthContext";
import { SearchProvider } from "@/lib/SearchContext"; // Import baru

export const metadata = {
  title: "VitalSense AI",
  description: "Early Warning System for Mortality Prediction",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true} className="antialiased">
        <AuthContextProvider>
          <SearchProvider> {/* Pasang di sini */}
            {children}
          </SearchProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}