import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as sgMail from '@sendgrid/mail';

admin.initializeApp();
const db = admin.firestore();

const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;
sgMail.setApiKey(API_KEY);

export const transactionUpdateListener = functions.firestore
    .document('Transaction/{transactionID}')
    .onUpdate(async (snapshot, context) => {
        const postSnap = await db.collection('Transaction').doc(context.params.transactionID).get();
        const transaction = postSnap.data() || {};

        const msg = {
            to: ['victor.hadziristic@gmail.com'],
            from: 'hello@inventurbo.io',
            templateId: TEMPLATE_ID,
            dynamic_template_data: {
                transactionID: context.params.transactionID,
                transactionStatus: transaction.status,
                transactionLink: `https://inventurbocapstone.firebaseapp.com/organization/transaction/view/${context.params.transactionID}`,
                transactionSource: transaction.oid_source,
                transactionDestination: transaction.oid_dest,
            },
        }
        return sgMail.send(msg);
    });
