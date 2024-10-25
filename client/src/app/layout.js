"use client"
import "../styles/globals.css";
import store from "../store/store";
import { Provider } from "react-redux";
import Header from "@/components/header";
import { usePathname } from 'next/navigation';
import Footer from "@/components/footer";


export default function RootLayout({ children }) {
  const pathname = usePathname(); // Get the current path

  const isAdminOrAuthPage = pathname.startsWith('/admin') || pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/forgotpassword')|| pathname.startsWith('/resetpassword');

  return (
    <html lang="en">
      <body> 
      <Provider store={store}>
      {!isAdminOrAuthPage && <Header />}
        {children}
        <Footer/>
        </Provider>
      </body>  
    </html>
  );
}
