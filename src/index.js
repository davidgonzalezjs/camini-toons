import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import {createCaminiToons} from './createCaminiToons';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App createCaminiToons={createCaminiToons}/>
  </React.StrictMode>
);
