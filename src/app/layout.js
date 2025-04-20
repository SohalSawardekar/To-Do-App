import "@/styles/globals.css";
import { SupabaseProvider } from "@/components/supabase-provider";

export const metadata = {
  title: "To Do App",
  description: "Allows you to create and manage your tasks efficiently.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SupabaseProvider>{children}</SupabaseProvider>
      </body>
    </html>
  );
}
