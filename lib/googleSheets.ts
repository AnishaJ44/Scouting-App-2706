// lib/googleSheets.ts

export const MATCH_SCOUTING_FIELD_ORDER = [
  'nameOfScout',
  'matchNumber',
  'alliance',
  'position',
  'teamNumber',
  'startLocation',
  'shooterScale',
  'accuracyScale',
  'defenseScale',
  'shootingLocationTeleop',
  'shootLocationAuto',
  'bump',
  'trench',
  'intakeLocation',
  'inactivePeriod',
  'actualClimb',
  'typeOfRobot',
  'endNotes',
  'autoMortality',
  'teleopMortality',
  'underTrench',
  'overBump',
  'climbOptions',
  'autoPath',
  'autoNotes',
  'intakeLocations',
  'penaltyPoints',
  'penaltyNotes',
];

export const PIT_SCOUTING_FIELD_ORDER = [
  'teamNumber',
  'sizeOfHopper',
  'typeOfShooter',
  'driveTrain',
  'possibleClimbs',
  'possibleShootingLocations',
  'travel',
  'intake',
  'pitNotes',
];

export function escapeCsvCell(value: any): string {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function buildMatchSheetAppendPayload(
  data: Record<string, any>,
  spreadsheetId: string,
  sheetName: string
) {
  const row = MATCH_SCOUTING_FIELD_ORDER.map((key) => {
    const value = data[key];
    return Array.isArray(value) ? value.join('|') : value;
  });
  return { spreadsheetId, sheetName, row };
}

export function buildPitSheetAppendPayload(
  data: Record<string, any>,
  spreadsheetId: string,
  sheetName: string
) {
  const row = PIT_SCOUTING_FIELD_ORDER.map((key) => {
    const value = data[key];
    return Array.isArray(value) ? value.join('|') : value;
  });
  return { spreadsheetId, sheetName, row };
}

async function postToSheet(url: string, payload: object): Promise<{ ok: boolean; error?: string }> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      // text/plain avoids a CORS preflight — Apps Script ignores Content-Type anyway
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return { ok: false, error: `HTTP ${response.status}` };
    }

    const result = await response.json();
    if (result.status !== 'ok') {
      return { ok: false, error: result.message ?? 'Unknown error' };
    }

    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err.message ?? 'Network error' };
  }
}

export function submitMatchScoutingToSheet(url: string, payload: object) {
  return postToSheet(url, payload);
}

export function submitPitScoutingToSheet(url: string, payload: object) {
  return postToSheet(url, payload);
}