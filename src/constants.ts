import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

// development, testing, production
export const NODE_ENV = process.env.NODE_ENV;

export const JOTFORM_USERNAME = process.env.JOTFORM_USERNAME;
export const JOTFORM_UPLOAD_URL = 'https://www.jotform.com/uploads';
export const JOTFORM_API_KEY = process.env.JOTFORM_API_KEY;

export const JOTFORM_SMALL_TEXT = 'Small 64x64';
export const JOTFORM_MEDIUM_TEXT = 'Medium 96x64';
export const JOTFORM_LARGE_TEXT = 'Large 96x96';

export const CARTOON_API_URL =
    'https://master-white-box-cartoonization-psi1104.endpoint.ainize.ai/predict';

export const MONGODB_URI = process.env.MONGODB_URI;

export const REMOVE_BG_URL = 'https://api.remove.bg/v1.0/removebg';
export const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY;

export const HEX_BACKGROUND_COLOUR = '#8D9BCA';
export const MIN_HEX_COUNT = 5;

export const HEX_COLOUR_PALETTE = [
    '#E58E93',
    '#DF291E',
    '#813232',
    // '#E4AD3F',
    '#D78739',
    '#D1C098',
    '#EECC3B',
    '#A8BB55',
    // '#7F9585',
    '#3AB340',
    // '#2C4C34',
    '#8D9BCA',
    '#0F37F8',
    '#244261',
    // '#36328A',
    '#A94386',
    '#F1CDB7',
    '#999CA0',
    '#76797B',
    '#967955',
    '#724629',
    '#F5F6F9',
    '#969696',
    '#757374',
    '#6A6869',
    '#282828',
    '#EFA6C8',
    '#DA6CA2',
    '#3171B0',
    '#E4AB53',
    '#262C3D',
    '#285331',
    '#8B5C9E',
    '#E6D29C',
    '#46729D',
    '#2F1C5B',
    '#894C33',
    '#5F7F72',
    '#7D7F80',
    '#EBD8D5',
    '#BBD68E',
    '#641A6E',
    '#C6D384',
    '#7F8A53',
    '#DDC9E8',
    '#4DA5BB',
    '#E7A852',
    '#DDA966',
    '#9D677D',
    '#50606B',
    '#9182B7',
    '#422534',
    '#B14065',
    '#E0694A',
    '#A8818D',
    '#B2645C',
    '#C96E87',
    '#CB456B',
    '#B35247',
    '#B8DBD3',
    '#E7A448',
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
    '#202225',
    '#1E211B',
    '#517A88',
    '#24515D',
    '#922953',
    '#071E46',
    '#91613A',
    '#DECD94',
    '#284F8B',
    '#8F8B7A',
    '#D24D95',
    '#C2A47B',
    '#C15F97',
    '#41145F',
    '#E6B291',
    '#745426',
    '#367AA1',
    '#6AB254',
    '#153862',
    '#3A5226',
    '#222F1B',
    '#303878',
    '#585079',
    '#686A80',
    '#202B35',
    '#527A6B',
];

export const HEX_COLOUR_NUM_MAP = new Map([
    ['#E58E93', 1],
    ['#DF291E', 2],
    ['#813232', 3],
    ['#E4AD3F', 4],
    ['#D78739', 5],
    ['#D1C098', 6],
    ['#EECC3B', 7],
    ['#A8BB55', 8],
    ['#7F9585', 9],
    ['#3AB340', 10],
    ['#2C4C34', 11],
    ['#8D9BCA', 12],
    ['#0F37F8', 13],
    ['#244261', 14],
    ['#36328A', 15],
    ['#A94386', 16],
    ['#F1CDB7', 17],
    ['#967955', 18],
    ['#724629', 19],
    ['#F5F6F9', 20],
    ['#999CA0', 21],
    ['#969696', 22],
    ['#757374', 23],
    ['#6A6869', 24],
    ['#282828', 25],
]);

export const HEX_COLOUR_NAME_MAP = new Map([
    ['#E58E93', 'light_pink'],
    ['#DF291E', 'bright_red'],
    ['#813232', 'dark_red'],
    ['#E4AD3F', 'light_yellow_orange'],
    ['#D78739', 'bright_orange'],
    ['#D1C098', 'brick_yellow'],
    ['#EECC3B', 'bright_yellow'],
    ['#A8BB55', 'lime'],
    ['#7F9585', 'sand_green'],
    ['#3AB340', 'dark_green'],
    ['#2C4C34', 'earth_green'],
    ['#8D9BCA', 'pastel_blue'],
    ['#0F37F8', 'bright_blue'],
    ['#244261', 'earth_blue'],
    ['#36328A', 'medium_lilac'],
    ['#A94386', 'magenta'],
    ['#F1CDB7', 'light_flesh'],
    ['#967955', 'sand_yellow'],
    ['#724629', 'reddish_brown'],
    ['#F5F6F9', 'white'],
    ['#999CA0', 'old_light_grey'],
    ['#969696', 'medium_stone_gray'],
    ['#757374', 'old_dark_grey'],
    ['#6A6869', 'dark_stone_gray'],
    ['#282828', 'black'],
]);
