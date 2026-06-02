import { addMonths } from 'date-fns';

export const catalog = {
  pcModels: ['Latitude 5420', 'ThinkPad T14', 'Elitebook 840 G8', 'Vostro 3400', 'OptiPlex 7090'],
  ramSizes: ['2 GB', '4 GB', '8 GB', '16 GB', '32 GB', '64 GB'],
  ramTypes: ['DDR1', 'DDR2', 'DDR3', 'DDR4', 'DDR5'],
  diskSizes: ['250 GB', '480 GB', '512 GB', '1 TB', '2 TB'],
  diskTypes: ['SSD', 'M.2 NVMe', 'HDD'],
  processors: ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 5', 'AMD Ryzen 7', 'Apple M1', 'Apple M2'],
  processorGenerations: ['8va Gen', '9na Gen', '10ma Gen', '11va Gen', '12va Gen', '13va Gen', '14va Gen'],
  upsBrands: ['APC', 'Tripp Lite', 'CyberPower', 'Forza'],
  upsModels: ['Smart-UPS 1500', 'Back-UPS 600', 'Pro 1000', 'EASY UPS', 'FX-1500'],
  monitorBrands: ['Dell', 'LG', 'Samsung', 'HP', 'Acer', 'ViewSonic'],
  monitorModels: ['24MK400', 'UltraWide 29"', 'P2419H', 'EliteDisplay E243', 'S2421HN'],
  pcBrands: ['Dell', 'HP', 'Lenovo', 'Asus', 'Apple']
};

export const assets = [
  {
    id: 'LAP-001',
    name: 'Laptop Dell Latitude 5420',
    category: 'Equipo de cómputo',
    status: 'Asignado',
    company: 'PALLOMARO S.A',
    responsable: 'William Aguilera',
    city: 'Cali',
    serialNumber: 'DXG-12345-ABC',
    purchaseDate: '2023-01-15',
    invoiceNumber: 'FV-2023-1234',
    brand: 'Dell',
    model: 'Latitude 5420',
    processor: 'Intel Core i7',
    processorGen: '11va Gen',
    rams: [{ size: '16 GB', type: 'DDR4' }],
    storages: [{ size: '1 TB', type: 'SSD' }],
    os: 'Windows 11 Pro',
    osKey: 'XXXXX-XXXXX-XXXXX-XXXXX-ABCDE',
    officeVersion: 'OFFICE 365',
    officeKey: 'YYYYY-YYYYY-YYYYY-YYYYY-FGHIJ',
    networkName: 'PC-TEC-01'
  },
  {
    id: 'MON-002',
    name: 'Monitor LG UltraWide 29"',
    category: 'Monitor',
    status: 'En Almacén',
    company: 'HYCO',
    responsable: 'Almacén',
    city: 'Cali',
    serialNumber: 'LGM-98765-XYZ',
    purchaseDate: '2022-11-30',
    invoiceNumber: 'FV-2022-5678',
    brand: 'LG',
    model: 'UltraWide 29"',
    description: 'Monitor con resolución 2560x1080.',
  },
  {
    id: 'UPS-001',
    name: 'UPS APC 1500VA',
    category: 'UPS',
    status: 'Asignado',
    company: 'FUNDIMETAL',
    responsable: 'Dylam Moralez',
    city: 'Cali',
    serialNumber: 'APC-91011-JKL',
    purchaseDate: '2024-03-01',
    invoiceNumber: 'FV-2024-9101',
    brand: 'APC',
    model: 'Smart-UPS 1500',
    description: 'Batería reemplazada en Enero 2024.',
  }
];

export const assetHistory = {
    'LAP-001': [
        { id: '1', date: '2024-03-15', author: 'William Aguilera', type: 'Mantenimiento', description: 'Limpieza interna y cambio de pasta térmica.' },
        { id: '2', date: '2024-05-15', author: 'Dylam Moralez', type: 'Incidente', description: 'El equipo no enciende. Se revisa fuente de poder y se soluciona.' },
    ],
    'MON-002': [
         { id: '3', date: '2024-02-01', author: 'William Aguilera', type: 'Instalación', description: 'Instalación de paquete de Adobe Creative Cloud.' },
    ],
    'UPS-001': [
        { id: '5', date: '2024-01-10', author: 'Dylam Moralez', type: 'Mantenimiento', description: 'Revisión de batería y limpieza.' },
    ]
};

export const deletedAssets = [];

export const users = [
    { id: '1', name: 'William Aguilera', company: 'PALLOMARO S.A', department: 'Tecnología', idNumber: '1144172797' },
    { id: '2', name: 'Dylam Moralez', company: 'FUNDIMETAL', department: 'Operaciones', idNumber: '555555555' },
    { id: '3', name: 'Carlos Fierro', company: 'HYCO', department: 'Ventas', idNumber: '666666666' },
    { id: '5', name: 'Whashintong Palma', company: 'PALLOMARO S.A', department: 'Tecnología', idNumber: '94432420' },
    { id: '9', name: 'Daniela Manyoma', company: 'HYCO', department: 'Contabilidad', idNumber: '123456789' }
];

export const companies = [
    { id: 1, companyId: 'EMP001', name: 'PALLOMARO S.A', city: 'Cali' },
    { id: 2, companyId: 'EMP002', name: 'HYCO', city: 'Cali' },
    { id: 3, companyId: 'EMP003', name: 'FUNDIMETAL', city: 'Cali' },
    { id: 4, companyId: 'EMP004', name: 'WFM', city: 'Cali' },
];
