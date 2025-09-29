// Configuración de Retell
export const RETELL_API_KEY = process.env.RETELL_API_KEY || '';
export const RETELL_API_URL = 'https://api.retellai.com';

// IDs de los agentes desde las variables de entorno
export const AGENT_IDS = {
  SOPHIA: process.env.RETELL_AGENT_ID_SOPHIA_INTERVIEWER || '',
  JAMES: process.env.RETELL_AGENT_ID_JAMES_INTERVIEWER || '',
  MARIA: process.env.RETELL_AGENT_ID_MARIA_INTERVIEWER || '',
  CARLOS: process.env.RETELL_AGENT_ID_CARLOS_INTERVIEWER || '',
  DEFAULT: process.env.RETELL_DEFAULT_AGENT_ID || ''
};

// Función para crear una llamada web
export async function createWebCall(agentId: string) {
  const response = await fetch(`${RETELL_API_URL}/v2/create-web-call`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RETELL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      agent_id: agentId,
      metadata: {
        platform: 'ARIA HR',
        timestamp: new Date().toISOString()
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Retell API error: ${response.statusText}`);
  }

  return await response.json();
}
