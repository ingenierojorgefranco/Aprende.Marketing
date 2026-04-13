
/* Actualización: Reajuste del rango cronológico del historial (Diciembre 2025 - Diciembre 2027) y reducción de la frecuencia de ventas diarias (1-5 transacciones) para asegurar coherencia en la facturación total. 15/06/2024 18:50 */
export const BASE_TOTAL_INCOME = 35807.00;
export const BASE_AVAILABLE = 800.00;
export const BASE_PENDING = 1200.00;

export interface HotmartDailyRecord {
  date: Date;
  transactions: number;
  cancellations: number;
}

// Generación de registros para Diciembre 2025 hasta Diciembre 2027
// Frecuencia reducida de 1 a 5 ventas por día.
export const MOCK_HOTMART_HISTORY: HotmartDailyRecord[] = [
  // --- Diciembre 2025 ---
  { date: new Date(2025, 11, 1), transactions: 2, cancellations: 0 },
  { date: new Date(2025, 11, 2), transactions: 2, cancellations: 0 },
  { date: new Date(2025, 11, 3), transactions: 2, cancellations: 0 },
  { date: new Date(2025, 11, 4), transactions: 2, cancellations: 0 },
  { date: new Date(2025, 11, 5), transactions: 2, cancellations: 0 },
  { date: new Date(2025, 11, 6), transactions: 4, cancellations: 0 },
  { date: new Date(2025, 11, 10), transactions: 1, cancellations: 0 },
  { date: new Date(2025, 11, 15), transactions: 1, cancellations: 0 },
  { date: new Date(2025, 11, 16), transactions: 3, cancellations: 1 },
  { date: new Date(2025, 11, 17), transactions: 2, cancellations: 1 },
  { date: new Date(2025, 11, 18), transactions: 1, cancellations: 0 },
  { date: new Date(2025, 11, 19), transactions: 3, cancellations: 1 },
  { date: new Date(2025, 11, 20), transactions: 1, cancellations: 0 },
  { date: new Date(2025, 11, 21), transactions: 0, cancellations: 0 },
  { date: new Date(2025, 11, 22), transactions: 0, cancellations: 0 },
  { date: new Date(2025, 11, 23), transactions: 5, cancellations: 0 },
  { date: new Date(2025, 11, 24), transactions: 2, cancellations: 1 },
  { date: new Date(2025, 11, 25), transactions: 5, cancellations: 1 },
  { date: new Date(2025, 11, 26), transactions: 4, cancellations: 0 },
  { date: new Date(2025, 11, 27), transactions: 3, cancellations: 0 },
  { date: new Date(2025, 11, 28), transactions: 2, cancellations: 0 },
  { date: new Date(2025, 11, 29), transactions: 2, cancellations: 1 },
  { date: new Date(2025, 11, 30), transactions: 5, cancellations: 0 },
  { date: new Date(2025, 11, 31), transactions: 9, cancellations: 0 },

  // --- Enero 2026 ---
  { date: new Date(2026, 0, 1), transactions: 0, cancellations: 0 },
{ date: new Date(2026, 0, 2), transactions: 0, cancellations: 0 },
{ date: new Date(2026, 0, 3), transactions: 5, cancellations: 0 },
{ date: new Date(2026, 0, 4), transactions: 3, cancellations: 0 },
{ date: new Date(2026, 0, 5), transactions: 4, cancellations: 0 },
{ date: new Date(2026, 0, 6), transactions: 5, cancellations: 3 },
{ date: new Date(2026, 0, 7), transactions: 2, cancellations: 0 },
{ date: new Date(2026, 0, 8), transactions: 1, cancellations: 1 },
{ date: new Date(2026, 0, 9), transactions: 3, cancellations: 1 },
{ date: new Date(2026, 0, 10), transactions: 1, cancellations: 0 },
{ date: new Date(2026, 0, 11), transactions: 1, cancellations: 0 },
{ date: new Date(2026, 0, 12), transactions: 2, cancellations: 0 },
{ date: new Date(2026, 0, 13), transactions: 2, cancellations: 2 },
{ date: new Date(2026, 0, 14), transactions: 5, cancellations: 0 },
{ date: new Date(2026, 0, 15), transactions: 9, cancellations: 0 },
{ date: new Date(2026, 0, 16), transactions: 7, cancellations: 1 },
{ date: new Date(2026, 0, 17), transactions: 4, cancellations: 0 },
{ date: new Date(2026, 0, 18), transactions: 1, cancellations: 0 },
{ date: new Date(2026, 0, 19), transactions: 3, cancellations: 0 },
{ date: new Date(2026, 0, 20), transactions: 0, cancellations: 0 },
{ date: new Date(2026, 0, 21), transactions: 1, cancellations: 0 },
{ date: new Date(2026, 0, 22), transactions: 3, cancellations: 0 },
{ date: new Date(2026, 0, 23), transactions: 5, cancellations: 0 },
{ date: new Date(2026, 0, 24), transactions: 0, cancellations: 0 },
{ date: new Date(2026, 0, 25), transactions: 0, cancellations: 0 },
{ date: new Date(2026, 0, 26), transactions: 3, cancellations: 0 },
{ date: new Date(2026, 0, 27), transactions: 1, cancellations: 1 },
{ date: new Date(2026, 0, 28), transactions: 2, cancellations: 1 },
{ date: new Date(2026, 0, 29), transactions: 8, cancellations: 0 },
{ date: new Date(2026, 0, 30), transactions: 1, cancellations: 0 },
{ date: new Date(2026, 0, 31), transactions: 3, cancellations: 0 },



 

  // --- Febrero 2026 ---
  { date: new Date(2026, 1, 1), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 1, 2), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 1, 3), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 1, 4), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 1, 5), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 1, 6), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 1, 7), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 1, 8), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 1, 9), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 1, 10), transactions: 4, cancellations: 0 },
  { date: new Date(2026, 1, 11), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 1, 2), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 1, 13), transactions: 5, cancellations: 1 },
  { date: new Date(2026, 1, 14), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 1, 15), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 1, 16), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 1, 17), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 1, 18), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 1, 19), transactions: 2, cancellations: 0 },
  { date: new Date(2026, 1, 20), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 1, 21), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 1, 22), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 1, 23), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 1, 24), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 1, 25), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 1, 26), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 1, 27), transactions: 4, cancellations: 0 },
  { date: new Date(2026, 1, 28), transactions: 4, cancellations: 0 },



  // --- Marzo 2026 ---

    { date: new Date(2026, 2, 1), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 2, 2), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 2, 3), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 2, 4), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 2, 5), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 2, 6), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 2, 7), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 2, 8), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 2, 9), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 2, 10), transactions: 4, cancellations: 0 },
  { date: new Date(2026, 2, 11), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 2, 2), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 2, 13), transactions: 5, cancellations: 1 },
  { date: new Date(2026, 2, 14), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 2, 15), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 2, 16), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 2, 17), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 2, 18), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 2, 19), transactions: 2, cancellations: 0 },
  { date: new Date(2026, 2, 20), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 2, 21), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 2, 22), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 2, 23), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 2, 24), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 2, 25), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 2, 26), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 2, 27), transactions: 4, cancellations: 0 },
  { date: new Date(2026, 2, 28), transactions: 4, cancellations: 0 },
  { date: new Date(2026, 2, 29), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 2, 30), transactions: 4, cancellations: 0 },
  { date: new Date(2026, 2, 31), transactions: 4, cancellations: 0 },



  // --- Abril 2026 ---
  { date: new Date(2026, 3, 1), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 3, 2), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 3, 3), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 3, 4), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 3, 5), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 3, 6), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 3, 7), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 3, 8), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 3, 9), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 3, 10), transactions: 4, cancellations: 0 },
  { date: new Date(2026, 3, 11), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 3, 2), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 3, 13), transactions: 5, cancellations: 1 },
  { date: new Date(2026, 3, 14), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 3, 15), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 3, 16), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 3, 17), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 3, 18), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 3, 19), transactions: 2, cancellations: 0 },
  { date: new Date(2026, 3, 20), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 3, 21), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 3, 22), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 3, 23), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 3, 24), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 3, 25), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 3, 26), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 3, 27), transactions: 4, cancellations: 0 },
  { date: new Date(2026, 3, 28), transactions: 4, cancellations: 0 },
  { date: new Date(2026, 3, 29), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 3, 30), transactions: 4, cancellations: 0 },

  // --- Mayo 2026 ---
  { date: new Date(2026, 4, 1), transactions: 5, cancellations: 1 },
  { date: new Date(2026, 4, 15), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 4, 31), transactions: 4, cancellations: 0 },

  // --- Junio 2026 ---
  { date: new Date(2026, 5, 5), transactions: 2, cancellations: 0 },
  { date: new Date(2026, 5, 15), transactions: 5, cancellations: 0 },
  { date: new Date(2026, 5, 30), transactions: 3, cancellations: 0 },

  // --- Julio 2026 ---
  { date: new Date(2026, 6, 5), transactions: 4, cancellations: 1 },
  { date: new Date(2026, 6, 20), transactions: 2, cancellations: 0 },

  // --- Agosto 2026 ---
  { date: new Date(2026, 7, 10), transactions: 5, cancellations: 0 },
  { date: new Date(2026, 7, 25), transactions: 3, cancellations: 0 },

  // --- Septiembre 2026 ---
  { date: new Date(2026, 8, 5), transactions: 4, cancellations: 0 },
  { date: new Date(2026, 8, 20), transactions: 2, cancellations: 1 },

  // --- Octubre 2026 ---
  { date: new Date(2026, 9, 1), transactions: 5, cancellations: 0 },
  { date: new Date(2026, 9, 15), transactions: 3, cancellations: 0 },

  // --- Noviembre 2026 ---
  { date: new Date(2026, 10, 5), transactions: 4, cancellations: 0 },
  { date: new Date(2026, 10, 25), transactions: 5, cancellations: 1 },

  // --- Diciembre 2026 ---
  { date: new Date(2026, 11, 1), transactions: 3, cancellations: 0 },
  { date: new Date(2026, 11, 20), transactions: 5, cancellations: 0 },
  { date: new Date(2026, 11, 31), transactions: 2, cancellations: 0 },

  // --- Año 2027 ---
  { date: new Date(2027, 0, 15), transactions: 4, cancellations: 0 },
  { date: new Date(2027, 1, 15), transactions: 3, cancellations: 0 },
  { date: new Date(2027, 2, 15), transactions: 5, cancellations: 1 },
  { date: new Date(2027, 3, 15), transactions: 2, cancellations: 0 },
  { date: new Date(2027, 4, 15), transactions: 4, cancellations: 0 },
  { date: new Date(2027, 5, 15), transactions: 3, cancellations: 0 },
  { date: new Date(2027, 6, 15), transactions: 5, cancellations: 0 },
  { date: new Date(2027, 7, 15), transactions: 1, cancellations: 0 },
  { date: new Date(2027, 8, 15), transactions: 4, cancellations: 0 },
  { date: new Date(2027, 9, 15), transactions: 3, cancellations: 0 },
  { date: new Date(2027, 10, 15), transactions: 5, cancellations: 1 },
  { date: new Date(2027, 11, 31), transactions: 4, cancellations: 0 }
];
