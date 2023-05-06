import axios from "./axios";
import {child, get} from "firebase/database";

export async function sendPush(refDb, {title, body, to}) {
    get(child(refDb, `pushTokens/${to}`)).then(async (snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
            const token = snapshot.val().token;
            const message = {
                "notification": {
                    "title": title,
                    "body": body
                },
                "to": token,
            }

            await axios.post('https://fcm.googleapis.com/fcm/send', message, {
                'headers': {
                    'Authorization': `key=${process.env.REACT_APP_SERVER_KEY}`,
                    'Content-Type': 'application/json'
                }
            })
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}