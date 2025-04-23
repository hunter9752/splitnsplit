const nodemailer = require('nodemailer');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Send email when user joins a deal
 * @param {string} email - User's email
 * @param {object} dealData - Deal information
 */
const sendDealJoinEmail = async (email, dealData) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Deal Joined: ${dealData.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #6B46C1; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">SplitNSplit</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #eee;">
          <h2>Deal Joined Successfully!</h2>
          <p>Thank you for joining the subscription split for <strong>${dealData.brand} - ${dealData.name}</strong>.</p>
          <div style="background-color: #f9f9f9; padding: 15px; margin: 15px 0; border-radius: 5px;">
            <h3 style="margin-top: 0;">Deal Details:</h3>
            <p><strong>Brand:</strong> ${dealData.brand}</p>
            <p><strong>Plan:</strong> ${dealData.name}</p>
            <p><strong>Original Price:</strong> ₹${dealData.originalPrice}</p>
            <p><strong>Your Split Price:</strong> ₹${dealData.splitPrice}</p>
            <p><strong>Status:</strong> Pending Payment</p>
          </div>
          <p>Your deal is now in <strong>pending</strong> status. To complete the process, please make the payment on your dashboard.</p>
          <div style="text-align: center; margin: 25px 0;">
            <a href="http://localhost:5000/join-deal.html?id=${dealData._id}" style="background-color: #6B46C1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Complete Payment</a>
          </div>
          <p>If you have any questions, please contact our support team at support@splitnsplit.com.</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          <p>&copy; 2023 SplitNSplit. All rights reserved.</p>
          <p>Bengaluru, India</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Deal join email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending deal join email: ${error.message}`);
  }
};

/**
 * Send email when a deal is complete (all slots filled)
 * @param {string} email - User's email
 * @param {object} dealData - Deal information
 */
const sendDealCompleteEmail = async (email, dealData) => {
  const startDate = dealData.startDate ? new Date(dealData.startDate).toLocaleDateString() : 'To be determined';
  const endDate = dealData.endDate ? new Date(dealData.endDate).toLocaleDateString() : 'To be determined';

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Your Split Deal is Complete: ${dealData.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #6B46C1; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">SplitNSplit</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #eee;">
          <h2>Great News! Your Split Deal is Ready to Start</h2>
          <p>All slots for <strong>${dealData.brand} - ${dealData.name}</strong> have been filled and your subscription split is now ready to begin!</p>
          <div style="background-color: #f9f9f9; padding: 15px; margin: 15px 0; border-radius: 5px;">
            <h3 style="margin-top: 0;">Deal Details:</h3>
            <p><strong>Brand:</strong> ${dealData.brand}</p>
            <p><strong>Plan:</strong> ${dealData.name}</p>
            <p><strong>Start Date:</strong> ${startDate}</p>
            <p><strong>End Date:</strong> ${endDate}</p>
            <p><strong>Duration:</strong> ${dealData.duration} months</p>
          </div>
          <p>Your account credentials and login information will be shared separately once the subscription is activated.</p>
          <div style="text-align: center; margin: 25px 0;">
            <a href="http://localhost:5000/my-deals.html" style="background-color: #6B46C1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View My Deals</a>
          </div>
          <p>If you have any questions, please contact our support team at support@splitnsplit.com.</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          <p>&copy; 2023 SplitNSplit. All rights reserved.</p>
          <p>Bengaluru, India</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Deal complete email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending deal complete email: ${error.message}`);
  }
};

/**
 * Send payment confirmation email with invoice
 * @param {string} email - User's email
 * @param {object} payment - Payment information
 * @param {object} deal - Deal information
 * @param {string} userName - User's name
 */
const sendPaymentConfirmationEmail = async (email, payment, deal, userName) => {
  const paymentDate = new Date(payment.createdAt).toLocaleDateString();
  const serviceTax = (payment.amount * 0.18).toFixed(2);
  const totalAmount = (parseFloat(payment.amount) + parseFloat(serviceTax)).toFixed(2);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Payment Confirmation: Invoice #${payment.invoiceNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #6B46C1; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">SplitNSplit</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #eee;">
          <h2>Payment Confirmation</h2>
          <p>Dear ${userName},</p>
          <p>Thank you for your payment. Your subscription split for <strong>${deal.brand} - ${deal.name}</strong> has been confirmed.</p>
          
          <div style="border: 1px solid #ddd; padding: 20px; margin: 20px 0;">
            <h3 style="text-align: center; margin-top: 0;">INVOICE</h3>
            <p style="text-align: right;"><strong>Invoice Number:</strong> ${payment.invoiceNumber}</p>
            <p style="text-align: right;"><strong>Date:</strong> ${paymentDate}</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background-color: #f5f5f5;">
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Description</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Amount</th>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${deal.brand} - ${deal.name} (${deal.duration} months)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">₹${payment.amount}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">GST (18%)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">₹${serviceTax}</td>
              </tr>
              <tr style="font-weight: bold;">
                <td style="border: 1px solid #ddd; padding: 8px;">Total</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">₹${totalAmount}</td>
              </tr>
            </table>
            
            <div style="margin-top: 20px;">
              <p><strong>Payment Method:</strong> ${payment.paymentMethod.toUpperCase()}</p>
              <p><strong>Transaction ID:</strong> ${payment.transactionId}</p>
              <p><strong>Status:</strong> ${payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}</p>
            </div>
            
            <div style="margin-top: 20px;">
              <p><strong>Shipping Address:</strong></p>
              <p>${payment.address.street},<br>
              ${payment.address.city}, ${payment.address.state},<br>
              ${payment.address.pincode}</p>
            </div>
          </div>
          
          <p>You can view your deal status and details in your dashboard:</p>
          <div style="text-align: center; margin: 25px 0;">
            <a href="http://localhost:5000/my-deals.html" style="background-color: #6B46C1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">My Deals Dashboard</a>
          </div>
          
          <p>If you have any questions regarding your payment or subscription, please contact our support team at support@splitnsplit.com.</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          <p>&copy; 2023 SplitNSplit. All rights reserved.</p>
          <p>Bengaluru, India</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Payment confirmation email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending payment confirmation email: ${error.message}`);
  }
};

module.exports = {
  sendDealJoinEmail,
  sendDealCompleteEmail,
  sendPaymentConfirmationEmail
}; 