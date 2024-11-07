const axios = require('axios');
const sendEmail = require("../../utils/sendMail");

// Create Order Function
const createOrder = async (req, res) => {
  const { request_id, drop_details, email_id } = req.body;
  console.log("porter Response", req.body)

  // Static details for the pickup address and delivery instructions
  const pickupDetails = {
    address: {
      apartment_address: "Shop No, 55 56",
      street_address1: "Chatrapati Shivaji Market, Camp",
      street_address2: "", 
      landmark: "Near St. Xaviers Church",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001",
      country: "India",
      lat: 18.517805010694502,
      lng: 73.88485517312623,
      contact_details: {
        name: "Test Sender",
        phone_number: "+919876543210"
      }
    }
  };


  try {
    const response = await axios.post(
      'https://pfe-apigw-uat.porter.in/v1/orders/create',
      {
        request_id, 
        pickup_details: pickupDetails, 
        drop_details, 
      },
      {
        headers: {
          'x-api-key': process.env.PORTER_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    try {     
      
      const trackingUrl = response.data.tracking_url;
      await sendEmail({
        email: email_id,
        subject: "Your Order Tracking URL",
        message: `Thank you for your order! You can track your order here: ${trackingUrl}`,
      });
    } catch (error) {
      console.error("Error sending email to user for tracking:", error.message);
      return res
        .status(500)
        .json({ message: "Failed to send tracking notification email to the User" });
    }

    // Return the response from the Porter API
    res.status(200).json(response.data);
    console.log("porter Response", response)
  } catch (error) {
    console.error('Error creating Porter order:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create Porter order' });
  }
};

module.exports = {
  createOrder,
};
