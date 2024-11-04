const axios = require('axios');

// Create Order Function
const createOrder = async (req, res) => {
  const { request_id, drop_details } = req.body;
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
