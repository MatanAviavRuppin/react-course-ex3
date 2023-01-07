import React from 'react';
import ReactDOM from 'react-dom/client';
import MyKitchen from './components/core/MyKitchen';
import 'bulma/css/bulma.min.css';

const url = 'https://localhost:44315';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MyKitchen />
  </React.StrictMode>
);

