import "@/styles/globals.css";

export const metadata = {
  title: "To Do App",
  description: "Allows you to create and manage your tasks efficiently.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
