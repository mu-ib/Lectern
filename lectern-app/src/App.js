import './App.css';
import {Route, Routes} from "react-router-dom";
import Layout from "./Layout";
import IndexPage from "./pages/IndexPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
      <Routes>
        <Route path={"/"} element={<Layout/>}>
          <Route index element={<IndexPage/>}/>
          <Route path={"/login"} element={<Login/>} />
          <Route path={"/register"} element={<Register/>} />
        </Route>

      </Routes>

  );
}

export default App;
