import { Routes, Route } from 'react-router';
import Home from './pages/Home';
import FormView from './pages/FormView';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/form/:formId" element={<FormView />} />
    </Routes>
  );
}
