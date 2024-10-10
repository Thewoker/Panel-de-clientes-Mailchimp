// /app/api/mailchimp/deleteSubscriber.js

import { NextResponse } from 'next/server';
import mailchimp from '@mailchimp/mailchimp_marketing';
import crypto from 'crypto';

// Configurar Mailchimp
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

// Función para obtener el hash MD5 del correo electrónico
const getSubscriberHash = (email) => {
  return crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
};

// DELETE: Eliminar un suscriptor de una lista de Mailchimp
export async function POST(req) {
  try {
    const { email, listId } = await req.json(); // Recibe el correo y el ID de la lista como parámetros

    // Genera el hash del correo electrónico
    const subscriberHash = getSubscriberHash(email);

    // Elimina el suscriptor de la lista
    await mailchimp.lists.deleteListMember(listId, subscriberHash);

    return NextResponse.json({ message: `Suscriptor ${email} eliminado correctamente de la lista ${listId}.` });
  } catch (error) {
    console.error("Error eliminando al suscriptor:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
