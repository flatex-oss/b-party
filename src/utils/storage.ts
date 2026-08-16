import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, testFirestoreConnection } from '../lib/firebase';
import { SurveyResponse } from '../types';
import { INITIAL_RESPONSES } from '../data/surveyData';

const LOCAL_STORAGE_KEY = 'party_menu_survey_responses_v2';
const RESPONSES_COLLECTION = 'responses';

export function getLocalResponses(): SurveyResponse[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to parse local storage', e);
  }
  return INITIAL_RESPONSES;
}

export function saveLocal(responses: SurveyResponse[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(responses));
  } catch (e) {
    console.error('Local storage write failed', e);
  }
}

// Subscribe to real-time updates from Firestore
export function subscribeToResponses(
  onData: (responses: SurveyResponse[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  // Test connection on boot non-blockingly
  testFirestoreConnection();

  const colRef = collection(db, RESPONSES_COLLECTION);
  const q = query(colRef);

  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        // If Firestore is completely empty, seed it with INITIAL_RESPONSES so users see initial party demo
        const local = getLocalResponses();
        if (local.length > 0) {
          onData(local);
        } else {
          onData(INITIAL_RESPONSES);
        }
        return;
      }

      const list: SurveyResponse[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as SurveyResponse;
        list.push({
          ...data,
          id: docSnap.id,
        });
      });

      // Sort by submittedAt descending
      list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

      saveLocal(list);
      onData(list);
    },
    (err: any) => {
      console.info('Firestore onSnapshot sync notice (operating with local state):', err?.message || err);
      if (onError) onError(err);
      onData(getLocalResponses());
      if (err?.code === 'permission-denied') {
        handleFirestoreError(err, OperationType.GET, RESPONSES_COLLECTION);
      }
    }
  );
}

// Fetch all responses once
export async function fetchResponses(): Promise<SurveyResponse[]> {
  try {
    const colRef = collection(db, RESPONSES_COLLECTION);
    const snap = await getDocs(colRef);

    if (snap.empty) {
      const local = getLocalResponses();
      return local.length > 0 ? local : INITIAL_RESPONSES;
    }

    const list: SurveyResponse[] = [];
    snap.forEach((docSnap) => {
      list.push({
        ...(docSnap.data() as SurveyResponse),
        id: docSnap.id,
      });
    });

    list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    saveLocal(list);
    return list;
  } catch (err: any) {
    console.info('Firestore fetch falling back to local storage:', err?.message || err);
    return getLocalResponses();
  }
}

// Save or update a survey response to Firestore and local storage
export async function saveResponse(response: SurveyResponse): Promise<SurveyResponse[]> {
  const sanitizedId = (response.id || 'res-' + Date.now()).replace(/[^a-zA-Z0-9_\-]/g, '_');
  const sanitizedData: SurveyResponse = {
    id: sanitizedId,
    name: response.name.slice(0, 100),
    allergies: response.allergies || ['none'],
    pizza: response.pizza || [],
    sushi: response.sushi || [],
    snacks: response.snacks || [],
    spice: Number(response.spice) || 2,
    avoid: response.avoid || ['none'],
    alcoholPref: response.alcoholPref || 'alcohol',
    alcoholTypes: response.alcoholTypes || [],
    softDrinks: response.softDrinks || [],
    desserts: response.desserts || [],
    wishes: (response.wishes || '').slice(0, 500),
    agentId: response.agentId || 'yoru',
    submittedAt: response.submittedAt || new Date().toISOString(),
  };

  // 1. Update local storage immediately
  const current = getLocalResponses();
  const existingIdx = current.findIndex((r) => r.id === sanitizedId || r.name.toLowerCase() === sanitizedData.name.toLowerCase());
  let updatedLocal: SurveyResponse[];
  if (existingIdx >= 0) {
    updatedLocal = [...current];
    updatedLocal[existingIdx] = sanitizedData;
  } else {
    updatedLocal = [sanitizedData, ...current];
  }
  saveLocal(updatedLocal);

  // 2. Write to Firestore
  try {
    const docRef = doc(db, RESPONSES_COLLECTION, sanitizedId);
    await setDoc(docRef, sanitizedData);
  } catch (err: any) {
    console.info('Firestore write stored locally, sync queue active:', err?.message || err);
    if (err?.code === 'permission-denied') {
      handleFirestoreError(err, OperationType.WRITE, `${RESPONSES_COLLECTION}/${sanitizedId}`);
    }
  }

  return updatedLocal;
}

// Delete a survey response
export async function deleteResponse(id: string, currentResponses: SurveyResponse[]): Promise<SurveyResponse[]> {
  const filtered = currentResponses.filter((r) => r.id !== id);
  saveLocal(filtered);

  try {
    const docRef = doc(db, RESPONSES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (err: any) {
    console.info('Firestore delete local update complete:', err?.message || err);
    if (err?.code === 'permission-denied') {
      handleFirestoreError(err, OperationType.DELETE, `${RESPONSES_COLLECTION}/${id}`);
    }
  }

  return filtered;
}

// Reset data to initial demo guests
export async function resetToDemo(): Promise<SurveyResponse[]> {
  saveLocal(INITIAL_RESPONSES);

  try {
    for (const item of INITIAL_RESPONSES) {
      const docRef = doc(db, RESPONSES_COLLECTION, item.id);
      await setDoc(docRef, item);
    }
  } catch (err) {
    console.warn('Firestore seed failed, local storage updated:', err);
  }

  return INITIAL_RESPONSES;
}

// Clear all responses
export async function clearAllResponses(): Promise<SurveyResponse[]> {
  saveLocal([]);

  try {
    const snap = await getDocs(collection(db, RESPONSES_COLLECTION));
    for (const d of snap.docs) {
      await deleteDoc(doc(db, RESPONSES_COLLECTION, d.id));
    }
  } catch (err) {
    console.warn('Firestore clear failed:', err);
  }

  return [];
}
