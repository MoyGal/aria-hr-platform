import { NextRequest, NextResponse } from 'next/server';

// Verificar que la variable de entorno existe
const RETELL_API_KEY = process.env.RETELL_API_KEY;

if (!RETELL_API_KEY) {
  console.error('RETELL_API_KEY no está configurada en las variables de entorno');
}

export async function POST(request: NextRequest) {
  try {
    console.log('API Route llamada - /api/retell/register-call');
    
    // Verificar que tenemos la API key
    if (!RETELL_API_KEY) {
      console.error('RETELL_API_KEY no configurada');
      return NextResponse.json(
        { error: 'Configuración del servidor incompleta' },
        { status: 500 }
      );
    }

    // Parsear el body de la petición
    const body = await request.json();
    console.log('Body recibido:', body);

    // Configuración para Retell AI
    const retellConfig = {
      agent_id: process.env.RETELL_DEFAULT_AGENT_ID || 'agent_test_id',
      audio_websocket_protocol: 'web',
      audio_encoding: 'opus',
      sample_rate: 48000,
      ...body // Permite override desde el cliente
    };

    console.log('Configuración para Retell:', retellConfig);

    // Llamada a la API de Retell
    const response = await fetch('https://api.retellai.com/v2/create-web-call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RETELL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(retellConfig),
    });

    console.log('Respuesta de Retell status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error de Retell AI:', errorText);
      return NextResponse.json(
        { error: 'Error al crear la llamada con Retell AI', details: errorText },
        { status: response.status }
      );
    }

    const retellData = await response.json();
    console.log('Datos exitosos de Retell:', retellData);

    return NextResponse.json({
      success: true,
      call_id: retellData.call_id,
      access_token: retellData.access_token,
      agent_id: retellData.agent_id
    });

  } catch (error) {
    console.error('Error en API Route:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}

// Exportar también GET para debugging
export async function GET() {
  return NextResponse.json({ 
    message: 'API Route funcionando correctamente',
    timestamp: new Date().toISOString(),
    hasApiKey: !!RETELL_API_KEY
  });
}
