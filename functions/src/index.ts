import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

export const increaseHeroLevels = functions.https
    .onRequest(async (req, res) => {
        let resMsg = '';
        const heroes = await db.collection('heroes').get();
        heroes.forEach(async doc => {
            const lvlUp = Math.floor(Math.random() * 3);
            if (lvlUp === 0) {
                resMsg += `<p>${doc.data().name} did not level up.</p>`;
                return;
            }

            resMsg += `<p>${doc.data().name} leveled up by ${lvlUp}!</p>`;
            await doc.ref.set({ 
                heroLevel: (doc.data().heroLevel || 0) + lvlUp
            }, { merge: true })
        });
        res.send(resMsg.trim());
    });

export const setHeroLevelOnCreate = functions.firestore
    .document('heroes/{heroId}')
    .onCreate((snap) => {
        return snap.ref.set({
            heroLevel: Math.floor(Math.random() * 10)
        }, { merge: true });
    });