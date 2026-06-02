import React from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Usuarios from "./pages/Usuarios";
import Produtos from "./pages/Produtos";
import Favoritos from "./pages/Favoritos";

function App() {
    return(
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar/>
                
                <main className="flex-glow">
                    <Routes>
                        <Route path="/" element={<Navigate to="/usuarios" replace/>} />
                        <Route path="/usuarios" element={<Usuarios/>} />
                        <Route path="/produtos" element={<Produtos/>} />
                        <Route path="/favoritos" element={<Favoritos/>} />

                        <Route path="*" element={
                            <div className="flex flex-col italic w-auto items-center mt-36 font-extrabold text-4xl text-emerald-500">
                                404
                                <h6 className="text-xl font-normal">Página não encontrada</h6>
                            </div>
                        } />
                    </Routes>
                </main>

                <Footer/>
            </div>
        </BrowserRouter>    
    );
}

export default App;