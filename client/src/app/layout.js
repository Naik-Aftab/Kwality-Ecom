"use client"
import "../styles/globals.css";
import store from "../store/store";
import { Provider } from "react-redux";

export default function RootLayout({ children }) {


  return (
    <html lang="en">
      <body> 
      <Provider store={store}>
        {children}
        </Provider>
      </body>  
    </html>
  );
}
