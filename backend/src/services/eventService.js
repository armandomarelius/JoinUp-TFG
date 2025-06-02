import Event from '../models/Event.js';

/**
 * Actualiza eventos que ya pasaron de fecha marcándolos como 'finished'
 * @returns {Promise<Object>} Resultado de la operación
 */
export const updateExpiredEvents = async () => {
    try {
        const now = new Date();
        const result = await Event.updateMany(
            { 
                date: { $lt: now },
                status: { $in: ["open", "close"] }
            },
            { status: "finished" }
        );
        
        if (result.modifiedCount > 0) {
            console.log(`${result.modifiedCount} eventos marcados como finished automáticamente`);
        }
        
        return result;
    } catch (error) {
        console.error(' Error actualizando eventos expirados:', error);
        throw error;
    }
};

