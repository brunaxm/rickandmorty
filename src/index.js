import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from "react-router-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import { router } from './routes';


// Aplicativos criados com React possui um único nó DOM raiz, que é o root.
// Para renderizar os elementos em React é preciso passar o DOM para o createRoot e depois utilizar os elementos dentro do render.
// O React.StrictMode é utilizado para informar possíveis problemas na aplicação.
// O RouterProvider é um componente que possui todas as rotas da aplicação que são declaradas em routes/index.js.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
