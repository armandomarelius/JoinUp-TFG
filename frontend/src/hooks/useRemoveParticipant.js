import { useState } from 'react';
import { removeParticipant } from '../services/fetchService';

export const useRemoveParticipant = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleRemoveParticipant = async (eventId, participantId) => {
        setLoading(true);
        setError(null);
        
        try {
            const result = await removeParticipant(eventId, participantId);
            setLoading(false);
            return result;
        } catch (err) {
            setError(err.message);
            setLoading(false);
            return null;
        }
    };

    return { handleRemoveParticipant, loading, error };
}; 