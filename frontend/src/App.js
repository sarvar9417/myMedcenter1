import { useRoutes } from "./routes";
import { BrowserRouter as Router } from 'react-router-dom'
import { Admin } from "./Director/directorPages/Admin";
function App() {
  const routes = useRoutes()
  return (
    <Router>
      <div>
        {routes}
      </div>
    </Router>
  );
}

export default App;
