import { Routes, Route, BrowserRouter } from "react-router-dom";
import { LayoutModule } from "./modules/Layout";
import { User } from "./modules/User/User";
import { Book } from "./modules/Book/Book";

function App() {
  return (
    <BrowserRouter>
      <LayoutModule />
      <Routes>
        <Route path="usuarios" element={<User />} />
        <Route path="libros" element={<Book />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
