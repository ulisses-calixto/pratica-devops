import React from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Navbar from "./components/Navbar";
import Usuarioscrud from "./pages/Usuarioscrud";
import Produtos from "./pages/Produtos";
import Favoritos from "./pages/Favoritos";

function App() {
    return(
        <BrowserRouter>
            <div className="min-h-screen bg-gray-100 flex flex-col">
                <Navbar/>
                
                <main className="flex-glow">
                    <Routes>
                        <Route path="/" element={<Navigate to="/usuarios" replace/>} />
                        <Route path="/usuarios" element={<Usuarioscrud/>} />
                        <Route path="/produtos" element={<Produtos/>} />
                        <Route path="/favoritos" element={<Favoritos/>} />

                        <Route path="*" element={
                            <div className="flex flex-col justify-center italic items-center h-full font-extrabold text-4xl text-gray-300">
                                *404
                                <h6 className="text-xl font-normal">Página não encontrada</h6>
                            </div>
                        } />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>    
    );
}

export default App;