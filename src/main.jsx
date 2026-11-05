import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SiteLayout } from './components/Layout';
import Home from './pages/Home';
import { Login, Register, Recovery } from './pages/AuthPages';
import Opportunities from './pages/Opportunities';
import Dashboard from './pages/Dashboard';
import './styles/legacy.css';
import './styles/dashboard.css';
import './styles/recovery.css';
import './styles/app.css';
function RequireAuth({children}) { const {user}=useAuth(); return user?children:<Navigate to="/login?next=/dashboard" replace/>; }
function GuestOnly({children}) { const {user}=useAuth(); return user?<Navigate to="/dashboard" replace/>:children; }
function App(){return <Routes><Route path="/" element={<SiteLayout><Home/></SiteLayout>}/><Route path="/oportunidades" element={<SiteLayout><Opportunities/></SiteLayout>}/><Route path="/login" element={<GuestOnly><SiteLayout><Login/></SiteLayout></GuestOnly>}/><Route path="/cadastro" element={<GuestOnly><SiteLayout><Register/></SiteLayout></GuestOnly>}/><Route path="/recuperar-senha" element={<GuestOnly><SiteLayout><Recovery/></SiteLayout></GuestOnly>}/><Route path="/dashboard" element={<RequireAuth><SiteLayout><Dashboard/></SiteLayout></RequireAuth>}/><Route path="*" element={<SiteLayout><main className="not-found"><h1>Página não encontrada</h1><a href="/">Voltar ao início</a></main></SiteLayout>}/></Routes>;}
createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter><ThemeProvider><AuthProvider><App/></AuthProvider></ThemeProvider></BrowserRouter></React.StrictMode>);
