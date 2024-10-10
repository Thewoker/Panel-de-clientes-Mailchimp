// /app/api/mailchimp/createList.js

import { NextResponse } from 'next/server';
import mailchimp from '@mailchimp/mailchimp_marketing';

// Configurar Mailchimp
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

export async function POST( req ) {
  const { name } = await req.json();
  try {
    const response = await mailchimp.lists.createList({
      name: name, // Nombre que quieres darle a la lista
      contact: {
        company: "CONNECTION NEGOCIOS INMOBILIARIOS SRL.",
        address1: "Jose M. Moreno 409 4to B",
        city: "(1426) Ciudad Buenos Aires",
        state: "Ciudad Buenos Aires",
        zip: "1744",
        country: "Argentina",
      },
      permission_reminder: "Estás recibiendo este correo porque compraste un condominio con nosotros.",
      campaign_defaults: {
        from_name: "CONNECTION NEGOCIOS INMOBILIARIOS SRL.",
        from_email: "mentoria@juaninmobiliario360.com",
        subject: "Aun te tenemos en cuenta",
        language: "es",
      },
      email_type_option: true,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error creando la lista:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
