import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GlobalContextProvider } from './context';

import {Home, CreateBattle, JoinBattle, } from './page';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <GlobalContextProvider >
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create-battle" element={<CreateBattle />} />
      <Route path="/join-battle" element={<JoinBattle />} />
      {/* <Route path="/battleground" element={<Battleground/>} /> */}
    </Routes>
    </GlobalContextProvider>
  </BrowserRouter>,
);
