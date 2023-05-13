import axios from "./axios";
import {child, get, update} from "firebase/database";

const ONESIGNAL_URL = 'https://onesignal.com/api/v1/notifications';

export async function sendNotification(title, body, userId, schedule = null) {
    const message = {
        "app_id": process.env.REACT_APP_ONE_SIGNAL_APP_ID,
        "include_external_user_ids": [
            userId
        ],
        "channel_for_external_user_ids": "push",
        "isAndroid": true,
        "contents": {
            "en": body
        },
        "headings": {
            "en": title
        },
    }

    if (schedule) {
        message.send_after = schedule;
    }

    return await axios.post(ONESIGNAL_URL, message, {
        'headers': {
            'Authorization': `Basic ${process.env.REACT_APP_ONE_SIGNAL_APIKEY}`,
            'Content-Type': 'application/json'
        }
    })
}

export async function cancelScheduledNotificationsForEvent(refDb, eventId) {
    get(child(refDb, `scheduledNotifications/${eventId}`)).then(async (snapshot) => {
        if (snapshot.exists()) {
            for (const userId of Object.keys(snapshot.val())) {
                const notificationId = snapshot.val()[userId];
                await axios.delete(`${ONESIGNAL_URL}/${notificationId}?app_id=${process.env.REACT_APP_ONE_SIGNAL_APP_ID}`, {
                    'headers': {
                        'Authorization': `Basic ${process.env.REACT_APP_ONE_SIGNAL_APIKEY}`,
                        'Content-Type': 'application/json'
                    }
                })
            }
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

export async function rescheduleNotificationsForEvent(refDb, eventId, newDate, eventName) {
    const title = '¿Estás listo?';
    const body = `¡Falta un día para el comienzo de tu evento ${eventName}!`;

    get(child(refDb, `scheduledNotifications/${eventId}`)).then(async (snapshot) => {
        if (snapshot.exists()) {
            console.log("snapshot", snapshot.val());
            for (const userId of Object.keys(snapshot.val())) {
                const sendResponse = await sendNotification(title, body, userId, newDate)
                console.log("sendResponse!", sendResponse.data);
                update(refDb, {
                    [`scheduledNotifications/${eventId}/${userId}`]: sendResponse.data.id
                }).then(res => console.log("updated scheduled", res))
            }
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}