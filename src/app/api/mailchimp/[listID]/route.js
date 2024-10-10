// /app/api/mailchimp/route.js

import { NextResponse } from 'next/server';
import mailchimp from '@mailchimp/mailchimp_marketing';


// Configurar Mailchimp
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

// GET: Obtener la lista de clientes de Mailchimp
export async function GET(request, { params }) {
  const { listID } = params;
  console.log("listID:", listID);
  try {
    const response = await mailchimp.lists.getListMembersInfo(listID);
    return NextResponse.json(response.members);
  } catch (error) {
    console.log("Error:", error.response.body);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Agregar cliente a una lista específica de Mailchimp
export async function POST(req) {
  const { email, name, birthday, listId } = await req.json();
  console.log(name, birthday, listId);

  if (!email || !listId) {
    return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 });
  }

  try {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: name,       // Nombre
        BREAKPOINT: birthday, // Fecha de cumpleaños 
      },
    });
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.log("Error:", error.response.body);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
