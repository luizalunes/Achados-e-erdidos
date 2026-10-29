
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import ItemDetalhe from "./pages/ItemDetalhe";
import ItemForm from "./pages/ItemForm";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/item/:id" element={<ItemDetalhe />} />
        <Route path="/novo" element={<ItemForm />} />
        <Route path="/editar/:id" element={<ItemForm />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
