export interface Country {
    name: string;
    code: string;
    dial: string;
    flag: string;
    cities: string[];
}

export const countries: Country[] = [
    { name: "Argentina", code: "AR", dial: "+54", flag: "🇦🇷", cities: ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata", "Mar del Plata", "San Miguel de Tucumán", "Salta", "Santa Fe", "Corrientes", "Bahía Blanca"] },
    { name: "Bolivia", code: "BO", dial: "+591", flag: "🇧🇴", cities: ["La Paz", "Santa Cruz de la Sierra", "Cochabamba", "Sucre", "Oruro", "Potosí", "Tarija", "Sacaba", "Quillacollo"] },
    { name: "Brasil", code: "BR", dial: "+55", flag: "🇧🇷", cities: ["São Paulo", "Río de Janeiro", "Brasilia", "Salvador", "Fortaleza", "Belo Horizonte", "Curitiba", "Recife", "Porto Alegre"] },
    { name: "Chile", code: "CL", dial: "+56", flag: "🇨🇱", cities: ["Santiago", "Valparaíso", "Concepción", "Viña del Mar", "Antofagasta", "Valdivia", "Temuco", "Rancagua", "Iquique", "Puerto Montt"] },
    { name: "Colombia", code: "CO", dial: "+57", flag: "🇨🇴", cities: ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Bucaramanga", "Pereira", "Cúcuta", "Ibagué", "Santa Marta", "Manizales", "Villavicencio", "Pasto", "Neiva"] },
    { name: "Costa Rica", code: "CR", dial: "+506", flag: "🇨🇷", cities: ["San José", "Alajuela", "Cartago", "Heredia", "Liberia", "Puntarenas", "Limón"] },
    { name: "Cuba", code: "CU", dial: "+53", flag: "🇨🇺", cities: ["La Habana", "Santiago de Cuba", "Camagüey", "Holguín", "Guantánamo", "Santa Clara"] },
    { name: "Ecuador", code: "EC", dial: "+593", flag: "🇪🇨", cities: ["Quito", "Guayaquil", "Cuenca", "Manta", "Ambato", "Loja", "Machala", "Durán", "Portoviejo", "Santo Domingo"] },
    { name: "El Salvador", code: "SV", dial: "+503", flag: "🇸🇻", cities: ["San Salvador", "Santa Ana", "San Miguel", "Santa Tecla", "Antiguo Cuscatlán"] },
    { name: "España", code: "ES", dial: "+34", flag: "🇪🇸", cities: ["Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza", "Málaga", "Murcia", "Palma de Mallorca", "Bilbao", "Alicante", "Córdoba", "Valladolid", "Vigo", "Gijón"] },
    { name: "Estados Unidos", code: "US", dial: "+1", flag: "🇺🇸", cities: ["Miami", "Nueva York", "Los Ángeles", "Houston", "Chicago", "Dallas", "Las Vegas", "Orlando", "San Francisco", "Washington D.C.", "Boston", "Austin"] },
    { name: "Guatemala", code: "GT", dial: "+502", flag: "🇬🇹", cities: ["Ciudad de Guatemala", "Mixco", "Villa Nueva", "Quetzaltenango", "Escuintla", "Antigua Guatemala"] },
    { name: "Guinea Ecuatorial", code: "GQ", dial: "+240", flag: "🇬🇶", cities: ["Malabo", "Bata", "Ebibeyin"] },
    { name: "Honduras", code: "HN", dial: "+504", flag: "🇭🇳", cities: ["Tegucigalpa", "San Pedro Sula", "La Ceiba", "Choluteca", "El Progreso", "Comayagua"] },
    { name: "México", code: "MX", dial: "+52", flag: "🇲🇽", cities: ["Ciudad de México", "Guadalajara", "Monterrey", "Puebla", "Querétaro", "Cancún", "Tijuana", "León", "Mérida", "San Luis Potosí", "Aguascalientes", "Hermosillo", "Toluca", "Chihuahua"] },
    { name: "Nicaragua", code: "NI", dial: "+505", flag: "🇳🇮", cities: ["Managua", "León", "Masaya", "Granada", "Matagalpa", "Chinandega"] },
    { name: "Panamá", code: "PA", dial: "+507", flag: "🇵🇦", cities: ["Ciudad de Panamá", "David", "Colón", "Santiago", "Chitré", "La Chorrera", "Penonomé"] },
    { name: "Paraguay", code: "PY", dial: "+595", flag: "🇵🇾", cities: ["Asunción", "Ciudad del Este", "San Lorenzo", "Luque", "Lambaré", "Fernando de la Mora"] },
    { name: "Perú", code: "PE", dial: "+51", flag: "🇵🇪", cities: ["Lima", "Arequipa", "Trujillo", "Chiclayo", "Cusco", "Piura", "Iquitos", "Huancayo", "Tacna", "Pucallpa", "Chimbote"] },
    { name: "Puerto Rico", code: "PR", dial: "+1", flag: "🇵🇷", cities: ["San Juan", "Bayamón", "Carolina", "Ponce", "Caguas", "Guaynabo", "Mayagüez"] },
    { name: "Portugal", code: "PT", dial: "+351", flag: "🇵🇹", cities: ["Lisboa", "Oporto", "Braga", "Coímbra", "Funchal"] },
    { name: "República Dominicana", code: "DO", dial: "+1", flag: "🇩🇴", cities: ["Santo Domingo", "Santiago de los Caballeros", "La Romana", "Punta Cana", "San Cristóbal", "Puerto Plata"] },
    { name: "Uruguay", code: "UY", dial: "+598", flag: "🇺🇾", cities: ["Montevideo", "Salto", "Maldonado", "Paysandú", "Las Piedras", "Rivera"] },
    { name: "Venezuela", code: "VE", dial: "+58", flag: "🇻🇪", cities: ["Caracas", "Maracaibo", "Valencia", "Barquisimeto", "Maracay", "Ciudad Guayana", "San Cristóbal", "Maturín", "Barcelona", "Puerto La Cruz"] },
    { name: "Reino Unido", code: "GB", dial: "+44", flag: "🇬🇧", cities: ["Londres", "Manchester", "Liverpool", "Birmingham"] },
    { name: "Francia", code: "FR", dial: "+33", flag: "🇫🇷", cities: ["París", "Marsella", "Lyon", "Toulouse"] },
    { name: "Italia", code: "IT", dial: "+39", flag: "🇮🇹", cities: ["Roma", "Milán", "Nápoles", "Florencia"] },
    { name: "Alemania", code: "DE", dial: "+49", flag: "🇩🇪", cities: ["Berlín", "Hamburgo", "Múnich", "Frankfurt"] },
    { name: "Canadá", code: "CA", dial: "+1", flag: "🇨🇦", cities: ["Toronto", "Montreal", "Vancouver", "Ottawa"] },
    { name: "Australia", code: "AU", dial: "+61", flag: "🇦🇺", cities: ["Sydney", "Melbourne", "Brisbane", "Perth"] },
];
