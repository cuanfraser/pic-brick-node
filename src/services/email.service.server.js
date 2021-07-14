import { createTestAccount, createTransport, getTestMessageUrl } from 'nodemailer';
import { ORDER_EMAIL_TO } from '../constants.js';
import { pixelateJotFormImage } from './jotform.service.server.js';

const sendMail = async (to, subject, body) => {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: 'bar@example.com, baz@example.com', // list of receivers
        subject: subject,
        html: body,
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', getTestMessageUrl(info));
};

const sendOrder = async (subId, size, { finalImage, instructionsArr, colourCountMap }) => {
    const subject = `Order ${subId} received.`;
    const body = `
    <p>Instructions Array: ${instructionsArr}</p>
    <p>Count: ${colourCountMap.entries()}</p>
    `;
    return sendMail(ORDER_EMAIL_TO, subject, body);
};

const testing = async () => {
    const formId = '211827483647060';
    const subId = '5012321919365964060';
    const fileName = 'Logan_Rock_Treen_closeup.jpg';
    const size = 'Large 96x96';

    const brickPlan = await pixelateJotFormImage(formId, subId, fileName, size);

    return sendOrder(subId, size, brickPlan);
};

testing();

export { sendMail };
