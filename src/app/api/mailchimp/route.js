// /app/api/mailchimp/lists/route.js

import { NextResponse } from 'next/server';
import mailchimp from '@mailchimp/mailchimp_marketing';

// Configurar Mailchimp
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

// GET: Obtener todas las listas de Mailchimp
export async function GET() {
  try {
    // Obtener todas las listas de Mailchimp
    const { lists } = await mailchimp.lists.getAllLists();
    const filteredLists = lists.map((list) => ({ id: list.id, name: list.name }));
    
    // Devolver las listas en formato JSON
    return NextResponse.json(filteredLists);
  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
