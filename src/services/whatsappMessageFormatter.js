/**
 * Builds the standardized WhatsApp booking message.
 */
export function buildWhatsAppMessage(params) {
  const { vendorName, bookingId, serviceName, price, date, clientName, clientPhone, clientLocation, clientEmail, referralName, referralDetails, referralPhone, paymentMethod, amount, notes } = params;
  
  return `Bonjour ${vendorName || 'Partenaire'},

*NOUVELLE RÉSERVATION*
------------------------
ID: ${bookingId || 'N/A'}
Service: ${serviceName || 'N/A'} - ${price || 'N/A'}
Date: ${date || 'N/A'}

*CLIENT*
Nom: ${clientName || 'N/A'}
Téléphone: ${clientPhone || 'N/A'}
Position: ${clientLocation || 'N/A'}
Email: ${clientEmail || 'N/A'}

*RÉFÉRAL*
Nom: ${referralName || 'InviteGenie'}
Détails: ${referralDetails || 'InviteGenie Beta Marketplace'}
Téléphone: ${referralPhone || 'N/A'}

*PAIEMENT*
Mode: ${paymentMethod || 'Manuel'}
👉 Envoyer une capture d'écran du paiement de ${amount || '0'} FCFA pour confirmer votre réservation après soumission de votre demande.

*NOTES*
${notes || 'Aucune'}

Merci.`;
}

function formatWhatsAppNumber(rawNumber) {
  if (!rawNumber) return "";
  const digits = String(rawNumber).replace(/\D/g, "");
  if (digits.length === 9) return `237${digits}`;
  return digits;
}

/**
 * Routes the WhatsApp message.
 * Seeded/internal vendors route to InviteGenie global (674406073).
 * Real verified vendors route to their saved contact.
 */
export function openWhatsAppBooking(provider, bookingParams) {
  const isSeeded = Boolean(
    provider?.is_seeded ||
    provider?.owner_type === "internal" ||
    provider?.owner_type === "seeded" ||
    !provider?.ownerId ||
    String(provider?.id).startsWith('vendor-') ||
    String(provider?.id).startsWith('demo-') ||
    String(provider?.id).startsWith('list-')
  );
  
  const defaultContact = "237674406073"; // InviteGenie Global Beta Contact
  let targetNumber = defaultContact;

  if (!isSeeded) {
    targetNumber = formatWhatsAppNumber(provider?.whatsappNumber) || formatWhatsAppNumber(provider?.phone) || defaultContact;
  }

  const message = buildWhatsAppMessage({
    referralName: "InviteGenie Beta",
    referralDetails: "Beta marketplace inquiry",
    ...bookingParams,
  });
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${targetNumber}?text=${encoded}`, "_blank", "noopener,noreferrer");
}