/**
 * Helper para interpretar y procesar las claves de seguimiento de Hotmart
 * según las especificaciones de planes:
 * 
 * Imagen 1 (Plan Mensual):
 * - Plan_nombre = Pro_llimitado
 * - Plan_Periodicidad = Mensual
 * - Plan_Precio = 79
 * - Plan_Dias = 30
 * - Plan_Slug = pro_mensual
 * 
 * Imagen 2 (Plan Anual):
 * - Plan_nombre = Pro_llimitado
 * - Plan_Periodicidad = Anual
 * - Plan_Precio = 708
 * - Plan_Dias = 365
 * - Plan_Slug = pro_anual
 */

export const formatMySqlDate = (date) => {
    if (!date) return null;
    const d = (date instanceof Date) ? date : new Date(date);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().slice(0, 19).replace('T', ' ');
};

/**
 * Busca de forma recursiva o exhaustiva un valor en diferentes ubicaciones del payload y query
 */
export const findTrackingValue = (keys, sourceObj = {}, queryObj = {}) => {
    const list = Array.isArray(keys) ? keys : [keys];

    const sources = [
        queryObj,
        sourceObj,
        sourceObj?.data,
        sourceObj?.data?.purchase,
        sourceObj?.data?.purchase?.tracking,
        sourceObj?.data?.purchase?.tracking_keys,
        sourceObj?.data?.purchase?.custom_fields,
        sourceObj?.data?.purchase?.offer,
        sourceObj?.data?.purchase?.offer?.tracking,
        sourceObj?.data?.purchase?.offer?.tracking_keys,
        sourceObj?.tracking,
        sourceObj?.tracking_keys,
        sourceObj?.custom_fields,
        sourceObj?.data?.subscription,
        sourceObj?.data?.subscriber
    ];

    for (const src of sources) {
        if (!src || typeof src !== 'object') continue;
        for (const k of list) {
            if (src[k] !== undefined && src[k] !== null && String(src[k]).trim() !== '') {
                return String(src[k]).trim();
            }
            // Búsqueda case-insensitive
            const lowerK = k.toLowerCase();
            for (const [prop, val] of Object.entries(src)) {
                if (prop.toLowerCase() === lowerK && val !== undefined && val !== null && String(val).trim() !== '') {
                    return String(val).trim();
                }
            }
        }
    }
    return null;
};

/**
 * Parsea y resuelve todos los parámetros del plan (Mensual o Anual)
 * y calcula con precisión la fecha de inicio y la fecha de renovación.
 */
export const resolvePlanTracking = (payload = {}, query = {}, fallbackPurchaseDate = null) => {
    const rawName = findTrackingValue(['Plan_nombre', 'plan_nombre', 'Plan_Nombre', 'planNombre', 'product_name', 'name'], payload, query);
    const rawPeriodicity = findTrackingValue(['Plan_Periodicidad', 'plan_periodicidad', 'Plan_periodicidad', 'planPeriodicidad', 'periodicity', 'interval'], payload, query);
    const rawPrice = findTrackingValue(['Plan_Precio', 'plan_precio', 'Plan_precio', 'planPrecio', 'price', 'amount', 'valor'], payload, query);
    const rawDays = findTrackingValue(['Plan_Dias', 'plan_dias', 'Plan_dias', 'planDias', 'days', 'dias'], payload, query);
    const rawSlug = findTrackingValue(['Plan_Slug', 'plan_slug', 'Plan_slug', 'planSlug', 'slug', 'plan'], payload, query);

    // Detección inteligente de periodicidad (Anual vs Mensual)
    const isExplicitAnnual = 
        (rawSlug && (rawSlug.toLowerCase().includes('anual') || rawSlug.toLowerCase().includes('annual') || rawSlug.toLowerCase() === 'pro_anual')) ||
        (rawPeriodicity && (rawPeriodicity.toLowerCase().includes('anual') || rawPeriodicity.toLowerCase().includes('annual') || rawPeriodicity.toLowerCase().includes('year'))) ||
        (rawDays && parseInt(rawDays, 10) >= 300) ||
        (rawPrice && parseFloat(rawPrice) >= 400);

    const isExplicitMonthly = 
        (rawSlug && (rawSlug.toLowerCase().includes('mensual') || rawSlug.toLowerCase().includes('monthly') || rawSlug.toLowerCase() === 'pro_mensual')) ||
        (rawPeriodicity && (rawPeriodicity.toLowerCase().includes('mensual') || rawPeriodicity.toLowerCase().includes('monthly') || rawPeriodicity.toLowerCase().includes('mes'))) ||
        (rawDays && parseInt(rawDays, 10) <= 60 && parseInt(rawDays, 10) > 0) ||
        (rawPrice && parseFloat(rawPrice) <= 200 && parseFloat(rawPrice) > 0);

    const isAnnual = isExplicitAnnual && !isExplicitMonthly;

    // Valores canónicos exactos según imágenes
    const periodicity = isAnnual ? 'Anual' : 'Mensual';
    const planDays = rawDays ? parseInt(rawDays, 10) : (isAnnual ? 365 : 30);
    const planPrice = rawPrice ? parseFloat(rawPrice) : (isAnnual ? 708 : 79);
    const planSlug = isAnnual ? 'pro_anual' : 'pro_mensual';
    const planNombre = rawName || 'Pro_llimitado';

    // Fecha de inicio (Start Date)
    let startDate = new Date();
    if (fallbackPurchaseDate) {
        const parsed = new Date(fallbackPurchaseDate);
        if (!isNaN(parsed.getTime())) startDate = parsed;
    } else {
        const orderDateStr = payload?.data?.purchase?.order_date || payload?.data?.purchase?.approved_date || payload?.data?.purchase?.date;
        if (orderDateStr) {
            const parsed = new Date(orderDateStr);
            if (!isNaN(parsed.getTime())) startDate = parsed;
        }
    }

    // Fecha de renovación (Renewal Date)
    // 1. Si Hotmart envió fecha de próximo cobro en el webhook, la revisamos
    const nextChargeRaw = payload?.data?.purchase?.date_next_charge || payload?.data?.date_next_charge;
    let renewalDate = null;
    if (nextChargeRaw) {
        const parsedNext = new Date(nextChargeRaw);
        if (!isNaN(parsedNext.getTime()) && parsedNext > startDate) {
            renewalDate = parsedNext;
        }
    }

    // 2. Cálculo matemático exacto sumando planDays a la fecha de inicio
    if (!renewalDate) {
        renewalDate = new Date(startDate.getTime() + (planDays * 24 * 60 * 60 * 1000));
    }

    const trackingParameters = {
        Plan_nombre: planNombre,
        Plan_Periodicidad: periodicity,
        Plan_Precio: planPrice,
        Plan_Dias: planDays,
        Plan_Slug: planSlug
    };

    return {
        isAnnual,
        planNombre,
        periodicity,
        planPrice,
        planDays,
        planSlug,
        startDate,
        renewalDate,
        startDateFormatted: formatMySqlDate(startDate),
        renewalDateFormatted: formatMySqlDate(renewalDate),
        trackingParameters
    };
};
