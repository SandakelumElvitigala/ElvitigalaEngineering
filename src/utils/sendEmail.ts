import { supabase } from "./db";

export async function sendEmail(to: string, subject: string, html: string) {
  const { data, error } = await supabase!.functions.invoke("send-boq-email", {
    body: { to, subject, html },
  });

  if (error) throw error;
  return data;
}