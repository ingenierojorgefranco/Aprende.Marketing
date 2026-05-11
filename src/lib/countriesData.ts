export interface Country {
    name: string;
    code: string;
    dial: string;
    flag: string;
    cities: string[];
}

export const countries: Country[] = [
    { name: "Argentina", code: "AR", dial: "+54", flag: "🇦🇷", cities: ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata", "Mar del Plata"] },
    { name: "Bolivia", code: "BO", dial: "+591", flag: "🇧🇴", cities: ["La Paz", "Santa Cruz", "Cochabamba", "Sucre", "Oruro"] },
    { name: "Brasil", code: "BR", dial: "+55", flag: "🇧🇷", cities: ["São Paulo", "Río de Janeiro", "Brasilia", "Salvador", "Fortaleza"] },
    { name: "Chile", code: "CL", dial: "+56", flag: "🇨🇱", cities: ["Santiago", "Valparaíso", "Concepción", "Viña del Mar", "Antofagasta"] },
    { name: "Colombia", code: "CO", dial: "+57", flag: "🇨🇴", cities: ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Bucaramanga", "Pereira", "Cúcuta", "Ibagué"] },
    { name: "Costa Rica", code: "CR", dial: "+506", flag: "🇨🇷", cities: ["San José", "Alajuela", "Cartago", "Heredia", "Liberia"] },
    { name: "Cuba", code: "CU", dial: "+53", flag: "🇨🇺", cities: ["La Habana", "Santiago de Cuba", "Camagüey"] },
    { name: "Ecuador", code: "EC", dial: "+593", flag: "🇪🇨", cities: ["Quito", "Guayaquil", "Cuenca", "Manta", "Ambato", "Loja"] },
    { name: "El Salvador", code: "SV", dial: "+503", flag: "🇸🇻", cities: ["San Salvador", "Santa Ana", "San Miguel"] },
    { name: "España", code: "ES", dial: "+34", flag: "🇪🇸", cities: ["Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza", "Málaga", "Murcia", "Palma", "Bilbao"] },
    { name: "Estados Unidos", code: "US", dial: "+1", flag: "🇺🇸", cities: ["Miami", "Nueva York", "Los Ángeles", "Houston", "Chicago", "Dallas", "Las Vegas"] },
    { name: "Guatemala", code: "GT", dial: "+502", flag: "🇬🇹", cities: ["Ciudad de Guatemala", "Mixco", "Villa Nueva", "Quetzaltenango"] },
    { name: "Honduras", code: "HN", dial: "+504", flag: "🇭🇳", cities: ["Tegucigalpa", "San Pedro Sula", "La Ceiba", "Choluteca"] },
    { name: "México", code: "MX", dial: "+52", flag: "🇲🇽", cities: ["Ciudad de México", "Guadalajara", "Monterrey", "Puebla", "Querétaro", "Cancún", "Tijuana", "León", "Mérida"] },
    { name: "Nicaragua", code: "NI", dial: "+505", flag: "🇳🇮", cities: ["Managua", "León", "Masaya", "Granada"] },
    { name: "Panamá", code: "PA", dial: "+507", flag: "🇵🇦", cities: ["Ciudad de Panamá", "David", "Colón", "Santiago", "Chitré"] },
    { name: "Paraguay", code: "PY", dial: "+595", flag: "🇵🇾", cities: ["Asunción", "Ciudad del Este", "San Lorenzo", "Luque"] },
    { name: "Perú", code: "PE", dial: "+51", flag: "🇵🇪", cities: ["Lima", "Arequipa", "Trujillo", "Chiclayo", "Cusco", "Piura", "Iquitos", "Huancayo"] },
    { name: "Puerto Rico", code: "PR", dial: "+1", flag: "🇵🇷", cities: ["San Juan", "Bayamón", "Carolina", "Ponce", "Caguas"] },
    { name: "Portugal", code: "PT", dial: "+351", flag: "🇵🇹", cities: ["Lisboa", "Oporto", "Braga"] },
    { name: "República Dominicana", code: "DO", dial: "+1", flag: "🇩🇴", cities: ["Santo Domingo", "Santiago", "La Romana", "Punta Cana"] },
    { name: "Uruguay", code: "UY", dial: "+598", flag: "🇺🇾", cities: ["Montevideo", "Salto", "Maldonado", "Paysandú"] },
    { name: "Venezuela", code: "VE", dial: "+58", flag: "🇻🇪", cities: ["Caracas", "Maracaibo", "Valencia", "Barquisimeto", "Maracay", "Ciudad Guayana", "San Cristóbal"] },
    { name: "Otros", code: "", dial: "", flag: "🌐", cities: [] }
];
