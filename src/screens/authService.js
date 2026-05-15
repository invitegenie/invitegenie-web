import { supabase } from "../lib/supabaseClient";

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !email.trim()) return { valid: false, error: "Email is required." };
  if (!emailRegex.test(email.toLowerCase().trim())) return { valid: false, error: "Invalid email format." };
  return { valid: true, email: email.toLowerCase().trim() };
};

export const signUpUser = async ({ email, password, name, whatsappOptIn, phone }) => {
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) throw new Error(emailValidation.error);

  if (supabase) {
    const { data, error } = await supabase.auth.signUp({
      email: emailValidation.email,
      password,
      options: {
        data: {
          full_name: name,
          phone: phone || "",
          whatsapp_opt_in: whatsappOptIn || false,
        },
      },
    });
    if (error) throw error;
    return data;
  } else {
    // Local Demo Fallback
    const demoUser = { id: `user-${Date.now()}`, email: emailValidation.email, name, whatsappOptIn, phone, email_verified: false };
    localStorage.setItem("ig_demo_user", JSON.stringify(demoUser));
    return { user: demoUser, session: null };
  }
};

export const verifyOTP = async (email, token) => {
  if (supabase) {
    const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'signup' });
    if (error) throw error;
    return data;
  } else {
    return { user: { email_verified: true } };
  }
};

export const resendVerification = async (email) => {
  if (supabase) {
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    if (error) throw error;
  }
  return true;
};