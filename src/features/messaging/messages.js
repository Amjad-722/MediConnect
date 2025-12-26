import { writable } from 'svelte/store';
import { supabase } from '../../lib/supabaseClient';

export const messages = writable([]);
export const messagesLoading = writable(false);

/**
 * Initialize messages from Supabase and set up real-time subscription
 */
export async function initMessages() {
    messagesLoading.set(true);
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch messages for appointments involving the current user
        // We fetch messages where the user is either the doctor or patient in the associated appointment
        const { data, error } = await supabase
            .from('messages')
            .select(`
                *,
                sender:sender_id(name, email)
            `)
            .order('created_at', { ascending: true });

        if (error) throw error;

        const formattedMessages = data?.map(msg => ({
            id: msg.id,
            appointmentId: msg.appointment_id,
            senderId: msg.sender_id,
            senderEmail: msg.sender?.email,
            senderName: msg.sender?.name,
            text: msg.content,
            timestamp: msg.created_at,
            read: msg.read
        })) || [];

        messages.set(formattedMessages);

        // Set up real-time subscription
        const channel = supabase
            .channel('messages_changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages'
                },
                (payload) => {
                    // Fetch the new message with sender info to update the store
                    fetchNewMessage(payload.new.id);
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'messages'
                },
                (payload) => {
                    // Update read status in store
                    messages.update(current =>
                        current.map(m => m.id === payload.new.id ? { ...m, read: payload.new.read } : m)
                    );
                }
            )
            .subscribe();

    } catch (error) {
        console.error('Error initializing messages:', error);
    } finally {
        messagesLoading.set(false);
    }
}

/**
 * Helper to fetch a single new message with sender info
 */
async function fetchNewMessage(id) {
    const { data, error } = await supabase
        .from('messages')
        .select(`
            *,
            sender:sender_id(name, email)
        `)
        .eq('id', id)
        .single();

    if (!error && data) {
        const newMessage = {
            id: data.id,
            appointmentId: data.appointment_id,
            senderId: data.sender_id,
            senderEmail: data.sender?.email,
            senderName: data.sender?.name,
            text: data.content,
            timestamp: data.created_at,
            read: data.read
        };
        messages.update(current => {
            // Check if already exists to avoid duplicates
            if (current.some(m => m.id === newMessage.id)) return current;
            return [...current, newMessage];
        });
    }
}

/**
 * Send a new message
 */
export async function sendMessage(appointmentId, senderEmail, text, senderName) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('messages')
            .insert({
                appointment_id: appointmentId,
                sender_id: user.id,
                content: text
            })
            .select(`
                *,
                sender:sender_id(name, email)
            `)
            .single();

        if (error) throw error;

        const newMessage = {
            id: data.id,
            appointmentId: data.appointment_id,
            senderId: data.sender_id,
            senderEmail: data.sender?.email,
            senderName: data.sender?.name,
            text: data.content,
            timestamp: data.created_at,
            read: data.read
        };

        // UI update will also happen via real-time but we can do it directly here for speed
        messages.update(current => {
            if (current.some(m => m.id === newMessage.id)) return current;
            return [...current, newMessage];
        });

        return newMessage;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}

/**
 * Get messages for a specific appointment
 */
export function getMessagesByAppointment(appointmentId) {
    let result = [];
    messages.subscribe(msgs => {
        result = msgs.filter(m => m.appointmentId === appointmentId);
    })();
    return result;
}

/**
 * Mark messages as read for an appointment
 */
export async function markAsRead(appointmentId, userEmail) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from('messages')
            .update({ read: true })
            .eq('appointment_id', appointmentId)
            .neq('sender_id', user.id);

        if (error) throw error;

        messages.update(current =>
            current.map(m =>
                m.appointmentId === appointmentId && m.senderEmail !== userEmail
                    ? { ...m, read: true }
                    : m
            )
        );
    } catch (error) {
        console.error('Error marking messages as read:', error);
    }
}

/**
 * Get unread message count for a user
 */
export function getUnreadCount(userEmail) {
    let count = 0;
    messages.subscribe(msgs => {
        count = msgs.filter(m => m.senderEmail !== userEmail && !m.read).length;
    })();
    return count;
}

// Initial load
if (typeof window !== 'undefined') {
    initMessages();
}
