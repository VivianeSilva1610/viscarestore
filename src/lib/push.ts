import webpush from "web-push";
import { adminDatabases, DB_ID, PUSH_SUBSCRIPTIONS_COL_ID } from "@/lib/appwrite-admin";

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails("mailto:pedidos@viscaree.com.br", vapidPublicKey, vapidPrivateKey);
}

export async function notifyAdminsOfNewSale(payload: { title: string; body: string; url?: string }) {
  if (!vapidPublicKey || !vapidPrivateKey) return;

  const subscriptions = await adminDatabases.listDocuments(DB_ID, PUSH_SUBSCRIPTIONS_COL_ID);
  const message = JSON.stringify({ ...payload, icon: "/icons/icon-192.png" });

  await Promise.all(
    subscriptions.documents.map(async (doc: any) => {
      const subscription = {
        endpoint: doc.endpoint,
        keys: { p256dh: doc.p256dh, auth: doc.auth },
      };
      try {
        await webpush.sendNotification(subscription, message);
      } catch (err: any) {
        if (err?.statusCode === 404 || err?.statusCode === 410) {
          await adminDatabases.deleteDocument(DB_ID, PUSH_SUBSCRIPTIONS_COL_ID, doc.$id).catch(() => {});
        } else {
          console.error("Falha ao enviar push notification:", err);
        }
      }
    })
  );
}
