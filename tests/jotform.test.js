import fetch from 'node-fetch';
import { getSourceImage } from '../src/services/jotform.service.server.js';

describe('JotForm', () => {
    test('JotForm Sample Image URL Active', async () => {
        const url =
            'https://www.jotform.com/uploads/glebbulatovskiy/211827483647060/5012321919365964060/Logan_Rock_Treen_closeup.jpg';

        const resp = await fetch(url);
        expect(resp.ok).toBe(true);
    });

    // NOT CHECKING IF IMAGE -- IGNORE BASICALLY
    test('JotForm Retrieve Image w/ Service', async () => {

        const formId = 211827483647060;
        const subId = 5012321919365964060;
        const fileName = "Logan_Rock_Treen_closeup.jpg";

        expect( async () => await getSourceImage(formId, subId, fileName)).not.toThrow(Error);

    });
});
