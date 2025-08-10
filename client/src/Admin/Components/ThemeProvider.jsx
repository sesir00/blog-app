// //defines and exports the provider component

// import { useEffect, useState } from "react";
// import { ThemeContext } from "../../Context/ThemeContext";

// export const ThemeProvider = ({ children }) => {
//   const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");

//   useEffect(() => {
//     document.documentElement.classList.toggle("dark", dark);
//     localStorage.setItem("theme", dark ? "dark" : "light");
//   }, [dark]);

//   return (
//     <ThemeContext.Provider value={{ dark, setDark }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };
