import * as React from 'react';
import './style.scss';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from "./App.tsx";
import {Provider} from 'react-redux';
import store from './store/Store.ts'

const root = createRoot(document.getElementById('root'));
root.render(
    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>
);
