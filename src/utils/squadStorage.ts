import { SavedSquad, TacticalFormation, SquadSlot, PlayerPosition } from '../types';
import { FORMATIONS_LIST, DEFAULT_FORMATION_ID } from '../data/formationsData';

export const STORAGE_KEY = 'efootball_arena_squads_v1';
export const CURRENT_SQUAD_ID_KEY = 'efootball_arena_active_squad_id';

// Initialize a clean squad based on a formation
export function createDefaultSquad(
  id: string = `squad-${Date.now()}`,
  name: string = 'Mon Onze Titulaire',
  formationId: string = DEFAULT_FORMATION_ID
): SavedSquad {
  const formation = FORMATIONS_LIST.find((f) => f.id === formationId) || FORMATIONS_LIST[0];

  const slots: SquadSlot[] = formation.slots.map((template) => ({
    slotId: template.slotId,
    position: template.position,
    x: template.x,
    y: template.y,
    playerId: null,
  }));

  // Suggested default demo starting lineup for 4-2-1-3 so user gets an immediate rich view
  if (formationId === '4-2-1-3') {
    const defaultRosterMap: Record<string, string> = {
      'pos-gk': 'p-courtois',
      'pos-dg': 'p-theo',
      'pos-dc-1': 'p-saliba',
      'pos-dc-2': 'p-vandijk',
      'pos-dd': 'p-kounde',
      'pos-mdc-1': 'p-rodri',
      'pos-mdc-2': 'p-valverde',
      'pos-mo': 'p-debruyne',
      'pos-ag': 'p-vinicius',
      'pos-ac': 'p-mbappe',
      'pos-ad': 'p-salah',
    };

    slots.forEach((s) => {
      if (defaultRosterMap[s.slotId]) {
        s.playerId = defaultRosterMap[s.slotId];
      }
    });
  }

  return {
    id,
    name,
    formationId: formation.id,
    slots,
    bench: [
      'p-haaland',     // Remplaçant 1
      'p-bellingham',  // Remplaçant 2
      'p-rudiger',     // Remplaçant 3
      'p-alisson',     // Remplaçant 4
      null,
      null,
      null
    ],
    playstyle: 'Contre-attaque rapide',
    updatedAt: new Date().toISOString(),
    version: 1,
  };
}

// Load all squads from LocalStorage with corruption resilience
export function loadAllSquads(): SavedSquad[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initialSquad = createDefaultSquad();
      saveAllSquads([initialSquad]);
      return [initialSquad];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const initialSquad = createDefaultSquad();
      saveAllSquads([initialSquad]);
      return [initialSquad];
    }

    // Sanitize squads to ensure slots and bench exist
    return parsed.map((squad: any) => {
      const formation = FORMATIONS_LIST.find((f) => f.id === squad.formationId) || FORMATIONS_LIST[0];
      const validSlots = Array.isArray(squad.slots) && squad.slots.length === 11
        ? squad.slots
        : formation.slots.map((t) => ({
            slotId: t.slotId,
            position: t.position,
            x: t.x,
            y: t.y,
            playerId: null,
          }));

      const bench = Array.isArray(squad.bench)
        ? [...squad.bench, null, null, null, null, null, null, null].slice(0, 7)
        : [null, null, null, null, null, null, null];

      return {
        id: squad.id || `squad-${Date.now()}`,
        name: squad.name || 'Ma Composition',
        formationId: formation.id,
        slots: validSlots,
        bench,
        playstyle: squad.playstyle || 'Contre-attaque rapide',
        updatedAt: squad.updatedAt || new Date().toISOString(),
        version: squad.version || 1,
      };
    });
  } catch (err) {
    console.warn('Error reading squads from localStorage, resetting to default', err);
    const initialSquad = createDefaultSquad();
    saveAllSquads([initialSquad]);
    return [initialSquad];
  }
}

// Save all squads to LocalStorage
export function saveAllSquads(squads: SavedSquad[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(squads));
  } catch (err) {
    console.error('Failed to save squads to localStorage', err);
  }
}

// Intelligent formation change preserving existing player assignments
export function applyFormationToSquad(
  squad: SavedSquad,
  targetFormationId: string
): { updatedSquad: SavedSquad; reallocatedCount: number; benchedCount: number } {
  const targetFormation = FORMATIONS_LIST.find((f) => f.id === targetFormationId) || FORMATIONS_LIST[0];

  // Extract currently assigned players from starting eleven
  const currentAssignedPlayers = squad.slots
    .filter((s) => s.playerId !== null)
    .map((s) => ({
      position: s.position,
      playerId: s.playerId as string,
    }));

  // Create new slots
  const newSlots: SquadSlot[] = targetFormation.slots.map((t) => ({
    slotId: t.slotId,
    position: t.position,
    x: t.x,
    y: t.y,
    playerId: null,
  }));

  let reallocatedCount = 0;
  const remainingPlayers = [...currentAssignedPlayers];

  // 1. Direct exact position match (e.g. GB -> GB, DC -> DC, AC -> AC)
  for (const slot of newSlots) {
    const matchIndex = remainingPlayers.findIndex((p) => p.position === slot.position);
    if (matchIndex !== -1) {
      slot.playerId = remainingPlayers[matchIndex].playerId;
      remainingPlayers.splice(matchIndex, 1);
      reallocatedCount++;
    }
  }

  // 2. Compatible position mapping (e.g. AG/AD <-> MG/MD, MC <-> MDC, AC <-> MO)
  const compatibilityMap: Record<PlayerPosition, PlayerPosition[]> = {
    GB: [],
    DC: ['MDC', 'DG', 'DD'],
    DG: ['MG', 'DC'],
    DD: ['MD', 'DC'],
    MDC: ['MC', 'DC'],
    MC: ['MDC', 'MO', 'MG', 'MD'],
    MO: ['MC', 'AC', 'AG', 'AD'],
    MG: ['AG', 'MC', 'DG'],
    MD: ['AD', 'MC', 'DD'],
    AG: ['MG', 'AC'],
    AD: ['MD', 'AC'],
    AC: ['MO', 'AG', 'AD'],
  };

  for (const slot of newSlots) {
    if (slot.playerId === null) {
      const compatiblePositions = compatibilityMap[slot.position] || [];
      const matchIndex = remainingPlayers.findIndex((p) => compatiblePositions.includes(p.position));
      if (matchIndex !== -1) {
        slot.playerId = remainingPlayers[matchIndex].playerId;
        remainingPlayers.splice(matchIndex, 1);
        reallocatedCount++;
      }
    }
  }

  // 3. Any unfilled slot gets any remaining player rather than discarding them
  for (const slot of newSlots) {
    if (slot.playerId === null && remainingPlayers.length > 0) {
      slot.playerId = remainingPlayers[0].playerId;
      remainingPlayers.shift();
      reallocatedCount++;
    }
  }

  // 4. If any players remain without a pitch slot, place them on the bench!
  const newBench = [...squad.bench];
  let benchedCount = 0;
  for (const extraPlayer of remainingPlayers) {
    const emptyBenchIndex = newBench.findIndex((b) => b === null);
    if (emptyBenchIndex !== -1) {
      newBench[emptyBenchIndex] = extraPlayer.playerId;
      benchedCount++;
    }
  }

  const updatedSquad: SavedSquad = {
    ...squad,
    formationId: targetFormation.id,
    slots: newSlots,
    bench: newBench,
    updatedAt: new Date().toISOString(),
  };

  return { updatedSquad, reallocatedCount, benchedCount };
}

// Export Squad to downloadable JSON file
export function exportSquadToJsonFile(squad: SavedSquad): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(squad, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  const cleanName = squad.name.toLowerCase().replace(/[^a-z0-9]/gi, '_');
  downloadAnchor.setAttribute('download', `eFootball_Arena_${cleanName}_${squad.formationId}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Validate imported JSON data
export function validateAndParseSquadJson(jsonString: string): { success: boolean; squad?: SavedSquad; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'Format JSON invalide.' };
    }

    if (!parsed.formationId || !Array.isArray(parsed.slots) || parsed.slots.length !== 11) {
      return { success: false, error: 'Structure invalide : la composition doit comporter une formation et 11 postes.' };
    }

    const formationExists = FORMATIONS_LIST.some((f) => f.id === parsed.formationId);
    const formationId = formationExists ? parsed.formationId : DEFAULT_FORMATION_ID;

    const validatedSquad: SavedSquad = {
      id: `squad-import-${Date.now()}`,
      name: typeof parsed.name === 'string' ? `${parsed.name} (Importée)` : 'Composition Importée',
      formationId,
      slots: parsed.slots.map((s: any, idx: number) => ({
        slotId: s.slotId || `pos-${idx}`,
        position: s.position || 'MC',
        x: typeof s.x === 'number' ? s.x : 50,
        y: typeof s.y === 'number' ? s.y : 50,
        playerId: typeof s.playerId === 'string' ? s.playerId : null,
      })),
      bench: Array.isArray(parsed.bench)
        ? [...parsed.bench, null, null, null, null, null, null, null].slice(0, 7)
        : [null, null, null, null, null, null, null],
      playstyle: parsed.playstyle || 'Contre-attaque rapide',
      updatedAt: new Date().toISOString(),
      version: 1,
    };

    return { success: true, squad: validatedSquad };
  } catch (err) {
    return { success: false, error: 'Impossible de lire le fichier JSON. Vérifiez qu\'il n\'est pas corrompu.' };
  }
}
