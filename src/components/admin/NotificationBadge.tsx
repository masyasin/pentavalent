import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface NotificationBadgeProps {
    type: 'messages' | 'applications';
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ type }) => {
    const [count, setCount] = useState(0);

    const fetchCount = async () => {
        try {
            console.log(`NotificationBadge: Fetching count for ${type}`);
            if (type === 'messages') {
                const { count: msgCount, error } = await supabase
                    .from('contact_messages')
                    .select('*', { count: 'exact', head: true })
                    .eq('is_read', false);

                console.log(`NotificationBadge: Messages count: ${msgCount}, Error: ${error?.message}`);
                if (!error) setCount(msgCount || 0);
            } else if (type === 'applications') {
                const { count: appCount, error } = await supabase
                    .from('job_applications')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'pending');

                console.log(`NotificationBadge: Applications count: ${appCount}, Error: ${error?.message}`);
                if (!error) setCount(appCount || 0);
            }
        } catch (error) {
            console.error(`Error fetching ${type} count:`, error);
        }
    };

    useEffect(() => {
        fetchCount();

        const table = type === 'messages' ? 'contact_messages' : 'job_applications';
        const subscription = supabase
            .channel(`public:${table}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: table }, () => {
                fetchCount();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [type]);

    if (count === 0) return null;

    return (
        <span className="ml-auto bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm min-w-[20px] text-center">
            {count > 99 ? '99+' : count}
        </span>
    );
};

export default NotificationBadge;
