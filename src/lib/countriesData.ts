export interface Country {
    name: string;
    code: string;
    dial: string;
    flag: string;
    cities: string[];
}

export const countries: Country[] = [
    { name: "Argentina", code: "AR", dial: "+54", flag: "🇦🇷", cities: ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata", "Mar del Plata", "San Miguel de Tucumán", "Salta", "Santa Fe", "Corrientes", "Bahía Blanca", "Resistencia", "Posadas", "San Salvador de Jujuy", "Santiago del Estero", "Neuquén", "Formosa", "San Luis", "Catamarca", "La Rioja", "Santa Rosa"] },
    { name: "Bolivia", code: "BO", dial: "+591", flag: "🇧🇴", cities: ["La Paz", "Santa Cruz de la Sierra", "Cochabamba", "Sucre", "Oruro", "Potosí", "Tarija", "Sacaba", "Quillacollo", "Montero", "Trinidad", "Riberalta", "Yacuiba", "Colcapirhua"] },
    { name: "Brasil", code: "BR", dial: "+55", flag: "🇧🇷", cities: ["São Paulo", "Río de Janeiro", "Brasilia", "Salvador", "Fortaleza", "Belo Horizonte", "Curitiba", "Recife", "Porto Alegre", "Manaus", "Belém", "Goiânia", "Guarulhos", "Campinas", "São Luís"] },
    { name: "Chile", code: "CL", dial: "+56", flag: "🇨🇱", cities: ["Santiago", "Valparaíso", "Concepción", "Viña del Mar", "Antofagasta", "Valdivia", "Temuco", "Rancagua", "Iquique", "Puerto Montt", "La Serena", "Coquimbo", "Talca", "Arica", "Chillán", "Los Ángeles", "Punta Arenas"] },
    { name: "Colombia", code: "CO", dial: "+57", flag: "🇨🇴", cities: ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Bucaramanga", "Pereira", "Cúcuta", "Ibagué", "Santa Marta", "Manizales", "Villavicencio", "Pasto", "Neiva", "Armenia", "Sincelejo", "Valledupar", "Montería", "Tunja", "Popayán", "Riohacha", "Quibdó", "Florencia", "Yopal", "Arauca", "Mocoa", "San José del Guaviare", "Mitú", "Puerto Carreño"] },
    { name: "Costa Rica", code: "CR", dial: "+506", flag: "🇨🇷", cities: ["San José", "Alajuela", "Cartago", "Heredia", "Liberia", "Puntarenas", "Limón", "San Isidro de El General", "Quesada"] },
    { name: "Cuba", code: "CU", dial: "+53", flag: "🇨🇺", cities: ["La Habana", "Santiago de Cuba", "Camagüey", "Holguín", "Guantánamo", "Santa Clara", "Bayamo", "Las Tunas", "Cienfuegos"] },
    { name: "Ecuador", code: "EC", dial: "+593", flag: "🇪🇨", cities: ["Quito", "Guayaquil", "Cuenca", "Manta", "Ambato", "Loja", "Machala", "Durán", "Portoviejo", "Santo Domingo", "Ibarra", "Esmeraldas", "Quevedo", "Riobamba", "Milagro", "Tulcán", "Latacunga"] },
    { name: "El Salvador", code: "SV", dial: "+503", flag: "🇸🇻", cities: ["San Salvador", "Santa Ana", "San Miguel", "Santa Tecla", "Antiguo Cuscatlán", "Delgado", "Mejicanos", "Soyapango"] },
    { name: "España", code: "ES", dial: "+34", flag: "🇪🇸", cities: ["Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza", "Málaga", "Murcia", "Palma de Mallorca", "Bilbao", "Alicante", "Córdoba", "Valladolid", "Vigo", "Gijón", "L'Hospitalet de Llobregat", "Vitoria-Gasteiz", "Granada", "Elche", "Oviedo", "Badalona", "Cartagena", "Jerez de la Frontera"] },
    { name: "Estados Unidos", code: "US", dial: "+1", flag: "🇺🇸", cities: ["Miami", "Nueva York", "Los Ángeles", "Houston", "Chicago", "Dallas", "Las Vegas", "Orlando", "San Francisco", "Washington D.C.", "Boston", "Austin", "Seattle", "Denver", "Phoenix"] },
    { name: "Guatemala", code: "GT", dial: "+502", flag: "🇬🇹", cities: ["Ciudad de Guatemala", "Mixco", "Villa Nueva", "Quetzaltenango", "Escuintla", "Antigua Guatemala", "San Juan Sacatepéquez", "Villa Canales", "Petapa", "Chimaltenango", "Retalhuleu", "Mazatenango", "Cobán"] },
    { name: "Guinea Ecuatorial", code: "GQ", dial: "+240", flag: "🇬🇶", cities: ["Malabo", "Bata", "Ebibeyin", "Luba", "Mongomo"] },
    { name: "Honduras", code: "HN", dial: "+504", flag: "🇭🇳", cities: ["Tegucigalpa", "San Pedro Sula", "La Ceiba", "Choluteca", "El Progreso", "Comayagua", "Puerto Cortés", "Danlí", "Siguatepeque"] },
    { name: "México", code: "MX", dial: "+52", flag: "🇲🇽", cities: ["Ciudad de México", "Guadalajara", "Monterrey", "Puebla", "Querétaro", "Cancún", "Tijuana", "León", "Mérida", "San Luis Potosí", "Aguascalientes", "Hermosillo", "Toluca", "Chihuahua", "Mazatlán", "Culiacán", "Veracruz", "Acapulco", "Oaxaca", "Tuxtla Gutiérrez", "Villahermosa"] },
    { name: "Nicaragua", code: "NI", dial: "+505", flag: "🇳🇮", cities: ["Managua", "León", "Masaya", "Granada", "Matagalpa", "Chinandega", "Tipitapa", "Estelí", "Jinotega"] },
    { name: "Panamá", code: "PA", dial: "+507", flag: "🇵🇦", cities: ["Ciudad de Panamá", "David", "Colón", "Santiago", "Chitré", "La Chorrera", "Penonomé", "Arraiján", "Aguadulce"] },
    { name: "Paraguay", code: "PY", dial: "+595", flag: "🇵🇾", cities: ["Asunción", "Ciudad del Este", "San Lorenzo", "Luque", "Lambaré", "Fernando de la Mora", "Encarnación", "Capiatá", "Pedro Juan Caballero"] },
    { name: "Perú", code: "PE", dial: "+51", flag: "🇵🇪", cities: ["Lima", "Arequipa", "Trujillo", "Chiclayo", "Cusco", "Piura", "Iquitos", "Huancayo", "Tacna", "Pucallpa", "Chimbote", "Ica", "Juliaca", "Sullana", "Huánuco"] },
    { name: "Puerto Rico", code: "PR", dial: "+1", flag: "🇵🇷", cities: ["San Juan", "Bayamón", "Carolina", "Ponce", "Caguas", "Guaynabo", "Mayagüez", "Trujillo Alto", "Arecibo"] },
    { name: "Portugal", code: "PT", dial: "+351", flag: "🇵🇹", cities: ["Lisboa", "Oporto", "Braga", "Coímbra", "Funchal", "Sintra", "Cascais"] },
    { name: "República Dominicana", code: "DO", dial: "+1", flag: "🇩🇴", cities: ["Santo Domingo", "Santiago de los Caballeros", "La Romana", "Punta Cana", "San Cristóbal", "Puerto Plata", "San Pedro de Macorís", "Bonao"] },
    { name: "Uruguay", code: "UY", dial: "+598", flag: "🇺🇾", cities: ["Montevideo", "Salto", "Maldonado", "Paysandú", "Las Piedras", "Rivera", "Melo", "Tacuarembó"] },
    { name: "Venezuela", code: "VE", dial: "+58", flag: "🇻🇪", cities: ["Caracas", "Maracaibo", "Valencia", "Barquisimeto", "Maracay", "Ciudad Guayana", "San Cristóbal", "Maturín", "Barcelona", "Puerto La Cruz", "Cumaná", "Mérida", "Ciudad Bolívar", "Punto Fijo", "Los Teques"] },
    { name: "Reino Unido", code: "GB", dial: "+44", flag: "🇬🇧", cities: ["Londres", "Manchester", "Liverpool", "Birmingham", "Edinburgh", "Glasgow"] },
    { name: "Francia", code: "FR", dial: "+33", flag: "🇫🇷", cities: ["París", "Marsella", "Lyon", "Toulouse", "Nice", "Nantes"] },
    { name: "Italia", code: "IT", dial: "+39", flag: "🇮🇹", cities: ["Roma", "Milán", "Nápoles", "Florencia", "Turín", "Venecia"] },
    { name: "Alemania", code: "DE", dial: "+49", flag: "🇩🇪", cities: ["Berlín", "Hamburgo", "Múnich", "Frankfurt", "Cologne", "Stuttgart"] },
    { name: "Canadá", code: "CA", dial: "+1", flag: "🇨🇦", cities: ["Toronto", "Montreal", "Vancouver", "Ottawa", "Calgary", "Edmonton"] },
    { name: "Australia", code: "AU", dial: "+61", flag: "🇦🇺", cities: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"] },
    { name: "+ Añadir País", code: "OTHER", dial: "", flag: "🌐", cities: [] }
];
