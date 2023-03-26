// development, testing, production
export let NODE_ENV = process.env.NODE_ENV;
export const NODE_ENV_DEV = 'development';
export const NODE_ENV_PROD = 'production';

if (!NODE_ENV) {
    const dotenv = await import('dotenv');
    //import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
    dotenv.config();
    NODE_ENV = process.env.NODE_ENV;
}

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export const JOTFORM_USERNAME = process.env.JOTFORM_USERNAME;
export const JOTFORM_UPLOAD_URL = 'https://www.jotform.com/uploads';
export const JOTFORM_API_KEY = process.env.JOTFORM_API_KEY;

// Size Jotform Text
export const JOTFORM_SMALL_TEXT = 'Small 64x64';
export const JOTFORM_MEDIUM_TEXT = 'Medium 96x64';
export const JOTFORM_LARGE_TEXT = 'Large 96x96';

// Background Color Jotform Text
export const JOTFORM_REPLACE_BG_YES = 'Yes';
export const JOTFORM_REPLACE_BG_NO = 'No';
export const JOTFORM_BG_PINK_TEXT = 'Pink';
export const JOTFORM_BG_YELLOW_TEXT = 'Yellow';
export const JOTFORM_BG_GREEN_TEXT = 'Green';
export const JOTFORM_BG_LIGHT_GREEN_TEXT = 'Light Green';
export const JOTFORM_BG_LIGHT_BLUE_TEXT = 'Light Blue';

export const HEX_COLOUR_BG_MAP = new Map([    
    [JOTFORM_BG_PINK_TEXT, 'EFA6C8'],
    [JOTFORM_BG_YELLOW_TEXT, 'EECC3B'],
    [JOTFORM_BG_GREEN_TEXT, '6AB254'],
    [JOTFORM_BG_LIGHT_GREEN_TEXT, 'A8BB55'],
    [JOTFORM_BG_LIGHT_BLUE_TEXT, '8D9BCA'],
]);

export const CARTOON_API_URL =
    'https://master-white-box-cartoonization-psi1104.endpoint.ainize.ai/predict';

export const MONGODB_URI = process.env.MONGODB_URI;

export const REMOVE_BG_URL = 'https://api.remove.bg/v1.0/removebg';
export const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY;

export const MIN_HEX_COUNT = 5;

export const HEX_COLOUR_PALETTE = [
    '#DF291E',
    '#EFA6C8',
    '#0F37F8',
    '#262C3D',
    '#F5F6F9',
    '#EECC3B',
    '#724629',
    '#D78739',
    '#3AB340',
    '#999CA0',
    '#46729D',
    '#894C33',
    '#A8BB55',
    '#282828',
    '#813232',
    '#7D7F80',
    '#EBD8D5',
    '#BBD68E',
    '#7F8A53',
    '#DDC9E8',
    '#4DA5BB',
    '#DDA966',
    '#9D677D',
    '#50606B',
    '#9182B7',
    '#422534',
    '#8D9BCA',
    '#E0694A',
    '#A8818D',
    '#B2645C',
    '#B35247',
    '#B8DBD3',
    '#A34926',
    '#D29661',
    '#CCB199',
    '#B37751',
    '#D1836B',
    '#9EADC2',
    '#4C2726',
    '#84B29D',
    '#B4A57D',
    '#A18659',
    '#ECD480',
    '#E4BCA8',
    '#D1C098',
    '#202225',
    '#1E211B',
    '#24515D',
    '#76797B',
    '#F1CDB7',
    '#91613A',
    '#DECD94',
    '#8F8B7A',
    '#E58E93',
    '#6A6869',
    '#244261',
    '#C2A47B',
    '#E6B291',
    '#745426',
    '#6AB254',
    '#967955',
    '#3A5226',
    '#222F1B',
    '#686A80',
    '#202B35',
    '#757374',
    '#527A6B',
];

export const HEX_COLOUR_NUM_MAP = new Map([    
    ['#DF291E',	1],
    ['#EFA6C8',	2],
    ['#0F37F8',	8],
    ['#262C3D',	9],
    ['#F5F6F9',	11],
    ['#EECC3B',	14],
    ['#724629',	16],
    ['#D78739',	17],
    ['#3AB340',	20],
    ['#999CA0',	22],
    ['#46729D',	23],
    ['#894C33',	26],
    ['#A8BB55',	27],
    ['#282828',	29],
    ['#813232',	30],
    ['#7D7F80',	31],
    ['#EBD8D5',	32],
    ['#BBD68E',	33],
    ['#7F8A53',	36],
    ['#DDC9E8',	37],
    ['#4DA5BB',	38],
    ['#DDA966',	40],
    ['#9D677D',	41],
    ['#50606B',	42],
    ['#9182B7',	43],
    ['#422534',	44],
    ['#8D9BCA',	46],
    ['#E0694A',	47],
    ['#A8818D',	48],
    ['#B2645C',	49],
    ['#B35247',	52],
    ['#B8DBD3',	53],
    ['#A34926',	55],
    ['#D29661',	56],
    ['#CCB199',	57],
    ['#B37751',	58],
    ['#D1836B',	59],
    ['#9EADC2',	60],
    ['#4C2726',	61],
    ['#84B29D',	62],
    ['#B4A57D',	63],
    ['#A18659',	65],
    ['#ECD480',	66],
    ['#E4BCA8',	67],
    ['#D1C098',	68],
    ['#202225',	69],
    ['#1E211B',	70],
    ['#24515D',	72],
    ['#76797B',	73],
    ['#F1CDB7',	75],
    ['#91613A',	77],
    ['#DECD94',	78],
    ['#8F8B7A',	80],
    ['#E58E93',	88],
    ['#6A6869',	89],
    ['#244261',	90],
    ['#C2A47B',	91],
    ['#E6B291',	94],
    ['#745426',	96],
    ['#6AB254',	98],
    ['#967955',	100],
    ['#3A5226',	101],
    ['#222F1B',	102],
    ['#686A80',	105],
    ['#202B35',	106],
    ['#757374',	107],
    ['#527A6B',	108],
]);
