import React from 'react';
import ReactDOM from 'react-dom/client';
import {CRUD} from "./crud/index";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
		<CRUD />
  </React.StrictMode>
);

