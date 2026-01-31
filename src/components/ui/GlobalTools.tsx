
import React from 'react';
import { useLocation } from 'react-router-dom';
import WhatsAppButton from './WhatsAppButton';
import ScrollToTop from './ScrollToTop';
import CookieBanner from './CookieBanner';

const GlobalTools: React.FC = () => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    if (isAdminRoute) return null;

    return (
        <>
            <WhatsAppButton />
            <ScrollToTop />
            <CookieBanner />
        </>
    );
};

export default GlobalTools;
