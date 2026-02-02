import { supabase } from './supabase';

export const logSecurityEvent = async (type: string, field: string, payload: string) => {
    try {
        await supabase.from('security_logs').insert({
            event_type: type,
            field_name: field,
            payload: payload,
            page_url: window.location.href,
            user_agent: navigator.userAgent
        });
    } catch (err) {
        console.error('Failed to log security event:', err);
    }
};

export const logUserActivity = async (action: string, module: string, details: string, userEmail?: string) => {
    try {
        const storedUser = localStorage.getItem('peve_admin_user');
        const user = storedUser ? JSON.parse(storedUser) : null;

        const payload: any = {
            action: action,
            module: module,
            details: details,
            email: userEmail || user?.email,
            user_agent: navigator.userAgent
        };

        // Only include user_id if it exists and looks like a UUID or we've updated the table to TEXT
        // To be safe against 400 errors, we only include it if it's not null
        if (user?.id) {
            payload.user_id = user.id;
        }

        await supabase.from('user_activity_logs').insert(payload);
    } catch (err) {
        console.error('Failed to log user activity:', err);
    }
};

export const isMalicious = (str: string) => {
    if (!str) return false;
    const maliciousPatterns = [
        '--', ';', '/*', '*/', 'xp_', 'select ', 'insert ', 'delete ', 'drop ', 'update ',
        '<script', 'javascript:', 'onclick', 'onerror', 'alert(', 'union select'
    ];
    const cleanStr = str.toLowerCase();
    return maliciousPatterns.some(p => cleanStr.includes(p));
};

export const sanitizeInput = (str: string) => {
    if (!str) return '';
    // Remove HTML tags to prevent XSS
    return str.replace(/<[^>]*>?/gm, '').trim();
};

export const isDummyData = (str: string) => {
    if (!str || str.length < 3) return true;

    // 1. Check for repetitive characters like "aaaaa" or "....."
    const cleanStr = str.toLowerCase().replace(/\s/g, '');
    const uniqueChars = new Set(cleanStr.split(''));
    if (uniqueChars.size <= 1 && cleanStr.length > 2) return true;

    // 2. Check for common keyboard mashing/spam patterns
    const spamPatterns = ['asdf', 'qwerty', '1234', 'zxcv', 'http', 'href=', 'www.'];
    if (spamPatterns.some(p => cleanStr.includes(p))) return true;

    // 3. Block messages that are just a string of numbers or symbols
    if (/^[\d\W_]+$/.test(cleanStr) && cleanStr.length > 5) return true;

    return false;
};
