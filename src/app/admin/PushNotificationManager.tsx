"use client";

import React, { useEffect, useState } from "react";
import { Bell, BellOff, BellRing } from "lucide-react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

type Status = "unsupported" | "not-standalone" | "loading" | "subscribed" | "unsubscribed";

export default function PushNotificationManager() {
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true;

    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported");
      return;
    }
    if (!isStandalone) {
      setStatus("not-standalone");
      return;
    }

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then(async (registration) => {
        const sub = await registration.pushManager.getSubscription();
        setStatus(sub ? "subscribed" : "unsubscribed");
      })
      .catch(() => setStatus("unsubscribed"));
  }, []);

  async function subscribe() {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
    });

    await fetch("/api/admin/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sub),
    });
    setStatus("subscribed");
  }

  async function unsubscribe() {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.getSubscription();
    if (sub) {
      await fetch("/api/admin/push/subscribe", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: sub.endpoint }),
      });
      await sub.unsubscribe();
    }
    setStatus("unsubscribed");
  }

  if (status === "loading") return null;

  if (status === "unsupported") return null;

  if (status === "not-standalone") {
    return (
      <div className="rounded-xl bg-white/5 px-4 py-3 text-[11px] leading-relaxed text-neutral-400">
        <p className="flex items-center gap-2 text-neutral-300 font-medium mb-1">
          <BellOff size={14} /> Notificações de venda
        </p>
        Adicione este painel à Tela de Início (Compartilhar → Adicionar à Tela de Início) para poder ativar as notificações.
      </div>
    );
  }

  return (
    <button
      onClick={status === "subscribed" ? unsubscribe : subscribe}
      className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-medium tracking-wide transition-colors ${
        status === "subscribed"
          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
          : "bg-white/5 text-neutral-300 border border-white/10 hover:bg-white/10"
      }`}
    >
      {status === "subscribed" ? <BellRing size={16} /> : <Bell size={16} />}
      {status === "subscribed" ? "Notificações de venda ativas" : "Ativar notificações de venda"}
    </button>
  );
}
