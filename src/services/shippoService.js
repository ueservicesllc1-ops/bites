/**
 * Shippo Service
 * Handle shipping rate calculations.
 */

const SHIPPO_API_KEY = import.meta.env.VITE_SHIPPO_API_KEY;

export const calculateShipping = async (address) => {
    // Note: Shippo API calls should ideally happen on a backend to protect the API KEY 
    // and avoid CORS issues. 
    console.log("Using Shippo Key:", SHIPPO_API_KEY ? "Detected" : "Missing");

    // Simulated network delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    if (!address || address.length < 5) {
        throw new Error("Dirección incompleta para cotizar envío.");
    }

    // Returning realistic provider rates without "Shippo" branding
    return [
        {
            id: 'usps_standard',
            name: 'Standard (USPS)',
            price: 7.50,
            estimated: '3-5 business days',
            provider: 'USPS'
        },
        {
            id: 'fedex_priority',
            name: 'Priority (FedEx)',
            price: 15.20,
            estimated: '1-2 business days',
            provider: 'FedEx'
        }
    ];
};
