import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// StrictMode intentionally omitted: it double-invokes effects in dev,
// which opens/closes the webcam stream twice and breaks the camera setup.
ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
