import { Inter } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "@/lib/AuthContext";
import { SearchProvider } from "@/lib/SearchContext"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "VitalSense AI | ICU Clinical Decision Support",
  description: "Advanced Mortality Risk Prediction System based on FHIR Standards.",
  icons: {
    icon: '/icon.png', // Memastikan browser mengambil icon yang benar
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
         <AuthContextProvider>
            <SearchProvider>
               {children}
            </SearchProvider>
         </AuthContextProvider>
      </body>
    </html>
  );
}