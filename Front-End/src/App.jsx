import React from "react";
import { BrowserRouter as Router} from "react-router-dom";
import history from "./services/history";
import Routes from "./routes/privateRoutes";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <div>
      <AuthProvider>
        <Router history={history}>
          <Routes />
        </Router>
      </AuthProvider>
    </div>
  );
};

export default App;