export async function initiateFlutterwavePayment(payment) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        redirectUrl: "https://mock-flutterwave-checkout.com/" + payment.reference
      });
    }, 800);
  });
}