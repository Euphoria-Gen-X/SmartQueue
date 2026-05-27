import "./globals.css";
import { ToastProvider } from "./components/Toast";

export const metadata = {
  title: "SmartQueue",
  description: "AI-driven appointment and queue management system"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
