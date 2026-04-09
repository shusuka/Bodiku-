import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Note: StrictMode sengaja dimatikan karena bikin Firestore onSnapshot listener
// jalan 2x di dev dan kadang bikin channel connection spam.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
