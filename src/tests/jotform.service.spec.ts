import fetch from 'node-fetch';
import {
    getJotFormImage
} from '../services/jotform.service';

describe('JotForm', () => {
    test('JotForm Sample Image URL Active', async () => {
        const url =
            'https://www.jotform.com/uploads/glebbulatovskiy/211827483647060/5012321919365964060/Logan_Rock_Treen_closeup.jpg';

        const resp = await fetch(url);
        expect(resp.ok).toBe(true);
    });

    test('JotForm Retrieve Image w/ Service', async () => {
        const formId = '211827483647060';
        const subId = '5012321919365964060';
        const fileName = 'Logan_Rock_Treen_closeup.jpg';

        const img = await getJotFormImage(formId, subId, fileName);
        expect(img).toBeDefined();
    });

    // test('makePicBrickFromJotForm Response', async () => {
    //     const formId = '211827483647060';
    //     const subId = '5012321919365964060';
    //     const fileName = 'Logan_Rock_Treen_closeup.jpg';

    //     const img = await makePicBrickFromJotForm(formId, subId, fileName);
    //     expect(img).toBeDefined();
    // }, 50000);
});
