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

        // Only include user_id if it exists and is a valid UUID
        // This prevents 400 Bad Request if the ID is a custom string like 'admin-123'
        // while the database column is still a UUID type.
        const isUUID = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        
        if (user?.id && isUUID(user.id)) {
            payload.user_id = user.id;
        }

        // Clean up undefined or null values to prevent schema mismatch
        Object.keys(payload).forEach(key => {
            if (payload[key] === undefined || payload[key] === null) {
                delete payload[key];
            }
        });

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
