import "../styles/globals.css";

export const metadata = {
  title: "Kwality Chiken",
  description: "Kwality Chiken",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>  
    </html>
  );
}
