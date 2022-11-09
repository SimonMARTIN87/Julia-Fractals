import * as React from "react";
import { AppContextProvider } from "../context";
import "./../assets/scss/App.scss";
import { Colors } from "./Colors";
import { Drawer } from "./Drawer";
import { Menu } from "./Menu";

const App = () => (
  <AppContextProvider>
    <div className="app">
      <p>
        Warning, this can be heavy to compute. Avoid iterations over 50 on small platforms.
      </p>
      <Drawer />
      <Menu/>
      <Colors/>
    </div>
  </AppContextProvider>
);

export default App;
