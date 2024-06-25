import Navbar from "./components/navbar.component";
import { Route, Routes } from "react-router-dom";
import UserAuthForm from "./pages/userAuthForm.page";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/session";
import EditorPage from "./pages/editor.pages";

export const userContext = createContext({});

const App = () => {
  const [authState, setAuthState] = useState({});

  useEffect(() => {
    let userInSession = lookInSession("user");

    userInSession
      ? setAuthState(JSON.parse(userInSession))
      : setAuthState({ access_token: null });
  }, []);

  return (
    <userContext.Provider value={{ authState, setAuthState }}>
      <Routes>
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/" element={<Navbar />}>
          <Route path="sign-in" element={<UserAuthForm type="sign-in" />} />
          <Route path="sign-up" element={<UserAuthForm type="sign-up" />} />
        </Route>
      </Routes>
    </userContext.Provider>
  );
};

export default App;
