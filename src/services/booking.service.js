import { supabase } from '../lib/supabase/client';

/**
 * Service to handle pet yoga booking operations
 */
export const bookingService = {
  /**
   * Save a new booking to the Supabase database
   * @param {Object} bookingData - The data for the booking
   * @returns {Promise<{success: boolean, data: any, error: any}>}
   */
  async createBooking(bookingData) {
    try {
      // Generate the UUID on the frontend so we don't need to use .select()
      // This prevents the Row Level Security (RLS) "new row violates..." error 
      // because we don't need to read the row back from the database.
      const bookingId = crypto.randomUUID();

      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            id: bookingId,
            owner_name: bookingData.ownerName,
            phone: bookingData.phone,
            email: bookingData.email,
            pet_name: bookingData.petName,
            pet_breed: bookingData.petBreed,
            pet_age: parseInt(bookingData.petAge, 10),
            yoga_service: bookingData.yogaService,
            booking_date: bookingData.bookingDate,
            booking_time: bookingData.bookingTime,
            additional_notes: bookingData.additionalNotes || null,
            payment_status: 'pending', // Default status
          }
        ]);

      if (error) throw error;

      return { success: true, data: { id: bookingId }, error: null };
    } catch (error) {
      console.error('Error creating booking:', error);
      return { success: false, data: null, error };
    }
  },

  // TODO: Implement Razorpay integration in the future

  /**
   * Initiate Razorpay payment by calling local Express backend
   */
  async initiatePayment(bookingId, amount) {
    try {
      const response = await fetch('http://localhost:3001/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, bookingId })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create order');
      return { success: true, data };
    } catch (error) {
      console.error('Error initiating payment:', error);
      return { success: false, error };
    }
  },

  /**
   * Verify Razorpay payment signature by calling local Express backend
   */
  async verifyPayment(paymentDetails, bookingId) {
    try {
      const response = await fetch('http://localhost:3001/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...paymentDetails, bookingId })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to verify payment');
      return { success: true, data };
    } catch (error) {
      console.error('Error verifying payment:', error);
      return { success: false, error };
    }
  },

  /**
   * Placeholder function to save full payment details if needed
   */
  async savePaymentDetails(bookingId, fullDetails) {
    console.log(`Saving full payment details for ${bookingId}`);
    // Logic to save detailed payment logs would go here
    return { success: true };
  }
};
