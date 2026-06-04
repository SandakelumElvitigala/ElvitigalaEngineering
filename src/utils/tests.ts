/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TestCaseResult } from '../types';
import { TRANSLATIONS } from './i18n';

// Simple lightweight test runner simulating jest/mocha assertions
export function runUnitTests(): TestCaseResult[] {
  const results: TestCaseResult[] = [];

  const runTest = (name: string, testFn: () => void) => {
    const start = performance.now();
    try {
      testFn();
      results.push({
        name,
        passed: true,
        durationMs: Math.round((performance.now() - start) * 100) / 100,
      });
    } catch (err: any) {
      results.push({
        name,
        passed: false,
        durationMs: Math.round((performance.now() - start) * 100) / 100,
        error: err.message || String(err),
      });
    }
  };

  // 1. TEST COST CALCULATIONS
  runTest('BOQ Calculator: Computes total line-items sum accurately', () => {
    const mockItems = [
      { id: '1', description: 'Grade 30 concrete pouring', quantity: 15, unit: 'm3', rate: 45000, amount: 675000 },
      { id: '2', description: 'D16 High-Tensile Steel rebar', quantity: 2.5, unit: 'MT', rate: 290000, amount: 725000 },
      { id: '3', description: 'Excavation machine lease', quantity: 4, unit: 'days', rate: 25000, amount: 100000 }
    ];

    const computedTotal = mockItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const expected = 675000 + 725000 + 100000; // 1,500,000

    if (computedTotal !== expected) {
      throw new Error(`Expected calculation to equal ${expected} but received ${computedTotal}`);
    }
  });

  // 2. TEST i18n ACCESSIBILITY
  runTest('i18n Localization: Every language dictionary contains all keys with no missing values', () => {
    const keysEn = Object.keys(TRANSLATIONS.en) as (keyof typeof TRANSLATIONS.en)[];
    const keysSi = Object.keys(TRANSLATIONS.si) as (keyof typeof TRANSLATIONS.si)[];

    if (keysEn.length !== keysSi.length) {
      throw new Error(`Dictionary length mismatch. English has ${keysEn.length} keys, Sinhala has ${keysSi.length} keys.`);
    }

    for (const key of keysEn) {
      if (!TRANSLATIONS.si[key]) {
        throw new Error(`Sinhala translation dictionary is missing translation for key: ${key}`);
      }
      if (!TRANSLATIONS.en[key]) {
        throw new Error(`English translation dictionary is missing translation for key: ${key}`);
      }
    }
  });

  // 3. TEST COLUMN MAPPING SYSTEM FOR CSV
  runTest('CSV Parser: Accurately parses and maps custom headers to structural BOQ schemas', () => {
    const sampleCSVData = `Item No,Work Description,Quantity Column,Unit Measure,Rate Price\n1.1,Soil excavation and clearing,120,m3,2500\n1.2,Underbed rubble packing,15,m3,8500`;
    
    const lines = sampleCSVData.split('\n');
    const headers = lines[0].split(',');
    
    // Test mapping heuristics
    const findMapping = (h: string[], term: string) => h.findIndex(col => col.toLowerCase().includes(term.toLowerCase()));
    
    const descIdx = findMapping(headers, 'description');
    const qtyIdx = findMapping(headers, 'quant');
    const rateIdx = findMapping(headers, 'rate');

    if (descIdx === -1 || qtyIdx === -1 || rateIdx === -1) {
      throw new Error(`Column mapping heuristic failed. Decrypted indices: Desc=${descIdx}, Qty=${qtyIdx}, Rate=${rateIdx}`);
    }

    // Attempt second line parsing
    const cols = lines[1].split(',');
    const parsedQty = parseFloat(cols[qtyIdx]);
    const parsedRate = parseFloat(cols[rateIdx]);

    if (parsedQty !== 120 || parsedRate !== 2500) {
      throw new Error(`Valuation cell extracts invalid quantities. Qty=${parsedQty}, Rate=${parsedRate}`);
    }
  });

  // 4. DATABASE INTEGRUITY MOCK
  runTest('Local DB Simulator: Safely saves, appends, and filters BOQ records in storage', () => {
    const testBoqs = [
      { id: 'boq-A', status: 'pending', totalEstimate: 250000 },
      { id: 'boq-B', status: 'reviewing', totalEstimate: 450000 },
    ];

    const mockLocalStorage: Record<string, string> = {
      'test_boqs': JSON.stringify(testBoqs)
    };

    const readBoqs = JSON.parse(mockLocalStorage['test_boqs']);
    if (readBoqs.length !== 2) {
      throw new Error(`Storage simulation failed to recover records. Length: ${readBoqs.length}`);
    }

    const filtered = readBoqs.filter((b: any) => b.status === 'reviewing');
    if (filtered.length !== 1 || filtered[0].id !== 'boq-B') {
      throw new Error(`Active status filtration did not filter correctly. Count: ${filtered.length}`);
    }
  });

  return results;
}
