'use server';

import type { HueLight, HueLightUpdate } from './types';

const BRIDGE_IP = process.env.HUE_BRIDGE_IP ?? '';
const API_KEY = process.env.HUE_API_KEY ?? '';

const BASE_URL = `http://${BRIDGE_IP}/api/${API_KEY}`;

if (!BRIDGE_IP || !API_KEY) {
  throw new Error('Missing HUE_BRIDGE_IP or HUE_API_KEY in .env');
}

export async function listLights(): Promise<HueLight[]> {
  try {
    const res = await fetch(`${BASE_URL}/lights`, { cache: 'no-store' });
    if (!res.ok) { throw new Error(`HTTP ${res.status}`); }
    
    const data = await res.json();
    return Object.entries(data).map(([id, light]: [string, any]) => ({
      id,
      name: light.name,
      state: light.state,
    }));
  } catch (error) {
    console.error('Hue listLights error:', error);
    return [];
  }
}

export async function getLightById(id: string): Promise<HueLight | null> {
  try {
    const res = await fetch(`${BASE_URL}/lights/${id}`, { cache: 'no-store' });
    if (!res.ok) { return null; }
    
    const light = await res.json();
    return { id, name: light.name, state: light.state };
  } catch (error) {
    console.error(`Hue getLightById(${id}) error:`, error);
    return null;
  }
}

export async function setLightState(id: string, update: HueLightUpdate): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/lights/${id}/state`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    });

    const data = await res.json();
    if (Array.isArray(data) && data[0]?.error) {
      return { success: false, error: data[0].error.description };
    }
    return { success: true };
  } catch (error) {
    console.error('Hue setLightState error:', error);
    return { success: false, error: 'Failed to communicate with Hue bridge' };
  }
}