import { LunaForm } from './formsTypes';

const API_BASE = '/api/forms';

export const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP Error ${res.status}`);
  }
  return res.json();
};

export const createLunaForm = async (data: Partial<LunaForm>) => {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create form');
  return res.json();
};

export const updateLunaForm = async (id: number, data: Partial<LunaForm>) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update form');
  return res.json();
};

export const deleteLunaForm = async (id: number) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete form');
  return res.json();
};

export const submitLunaFormResponse = async (formId: number, answers: any[]) => {
  const res = await fetch(`${API_BASE}/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ formId, answers }),
  });
  if (!res.ok) throw new Error('Failed to submit form response');
  return res.json();
};
