export async function initiateMoMoPayment(payment) {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      resolve({
        success: true,
        message: "Payment prompt sent to mobile device.",
      });
    }, 1500);
  });
}