// /app/api/mailchimp/createMergeFields.js

import { NextResponse } from 'next/server';
import mailchimp from '@mailchimp/mailchimp_marketing';

// Configurar Mailchimp
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

export async function POST(req) {
  try {
    const { listId } = await req.json(); // Debes proporcionar el ID de la lista recién creada

    // Crear campo para 'Nombre'
    await mailchimp.lists.addListMergeField(listId, {
      tag: "FNAME",
      name: "Nombre",
      type: "text",
      required: false,
      public: true,
    });

    // Crear campo para 'Apellidos'
    await mailchimp.lists.addListMergeField(listId, {
      tag: "LNAME",
      name: "Apellidos",
      type: "text",
      required: false,
      public: true,
    });

    // Crear campo para 'Cumpleaños'
    await mailchimp.lists.addListMergeField(listId, {
      tag: "CUMPLE",
      name: "Cumpleaños",
      type: "date",
      required: false,
      public: true,
      options: {
        date_format: "DD/MM/YYYY"
      }
    });

    await mailchimp.lists.addListMergeField(listId, {
        tag: "COMPRADO",
        name: "Dia que fue comprado",
        type: "date",
        required: false,
        public: true,
        options: {
          date_format: "DD/MM/YYYY"
        }
      });

    return NextResponse.json({ message: "Merge fields creados correctamente." });
  } catch (error) {
    console.error("Error creando los merge fields:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
