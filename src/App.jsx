import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import SelectionFlow from './pages/SelectionFlow';
// import Auth from './pages/Auth';
// import Account from './pages/Account';

// Existing imports for compatibility if needed, though we are focusing on the requested structure
import Order from './pages/Order';
import Vendor from './pages/Vendor';
import Profile from './pages/Profile';
import Login from './pages/Login'; // keeping old login available on /login-old if needed, or replacing
import VendorLogin from './pages/VendorLogin';
import Register from './pages/Register';
import OrdersPage from './pages/OrdersPage';
import DatabaseView from './pages/DatabaseView';
import { useAuth } from './context/AuthContext';

function App() {
    const { user } = useAuth();

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={user ? <Navigate to="/home" /> : <SelectionFlow />} />
                <Route path="/home" element={<Home />} />
                {/* <Route path="/auth" element={<Auth />} /> */}
                {/* <Route path="/account" element={<Account />} /> */}

                {/* Existing Routes */}
                <Route path="/order" element={<Order />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/vendor" element={<Vendor />} />
                <Route path="/vendor-login" element={<VendorLogin />} />

                <Route path="/database" element={<DatabaseView />} />

                {/* Redirect legacy /login to new /auth or keep separate? 
            For now, let's keep them accessible but /auth is the new one. 
        */}
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Catch all to selection flow or home */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
