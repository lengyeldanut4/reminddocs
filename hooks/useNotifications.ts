"use client";

import { useEffect } from "react";

interface Document {
  id: string;
  title: string;
  expiry_date: string;
}

export function useNotifications(documents: Document[]) {
  useEffect(() => {
    if (!documents || documents.length === 0) return;

    const checkNotifications = () => {
      const now = new Date();

      documents.forEach((doc) => {
        const expiry = new Date(doc.expiry_date);

        const diffDays =
          (expiry.getTime() - now.getTime()) /
          (1000 * 60 * 60 * 24);

        // 🔴 EXPIRED
        if (diffDays < 0) {
          showNotification(
            "❌ Document expirat",
            `${doc.title} a expirat`
          );
        }

        // 🟡 EXPIRING SOON
        if (diffDays > 0 && diffDays < 7) {
          showNotification(
            "⚠️ Document expiră curând",
            `${doc.title} expiră în ${Math.ceil(
              diffDays
            )} zile`
          );
        }
      });
    };

    const interval = setInterval(checkNotifications, 60000); // 1 min

    return () => clearInterval(interval);
  }, [documents]);
}

function showNotification(title: string, body: string) {
  if (!("Notification" in window)) return;

  if (Notification.permission === "granted") {
    new Notification(title, { body });
  }
}