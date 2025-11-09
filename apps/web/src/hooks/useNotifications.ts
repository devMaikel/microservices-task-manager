import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function useNotifications(enabled: boolean, token?: string) {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!enabled || !token) {
      if (socketRef.current) {
        try {
          socketRef.current.disconnect();
        } catch {}
        socketRef.current = null;
      }
      return;
    }

    if (socketRef.current) {
      try {
        socketRef.current.disconnect();
      } catch {}
      socketRef.current = null;
    }

    const socket: Socket = io("http://localhost:3004", {
      transports: ["websocket"],
      auth: { token },
      autoConnect: true,
      reconnection: true,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      // toast.success("Conectado às notificações em tempo real");
    });

    socket.on("connect_error", (err: any) => {
      const msg = err?.message || "Falha ao conectar ao WebSocket";
      // toast.error(msg);
      console.error("[ws] connect_error", err);
    });

    socket.on("notification", (payload: any) => {
      const msg = payload?.message || "Notificação";
      toast.info(msg);

      const type: string | undefined = payload?.type;
      const taskId: string | undefined =
        payload?.taskId ?? payload?.data?.taskId;

      if (type === "comment:new" && taskId) {
        queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
        queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      } else if (type === "task:updated" && taskId) {
        queryClient.invalidateQueries({ queryKey: ["task", taskId] });
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      } else if (type === "task:created") {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      }
    });

    socket.on("unauthorized", (payload: any) => {
      const reason = payload?.reason || "unauthorized";
      console.log(`WebSocket não autorizado: ${reason}`);
      // toast.error(`WebSocket não autorizado: ${reason}`);
    });

    socket.on("disconnect", () => {});

    return () => {
      try {
        socket.disconnect();
      } catch {}
    };
  }, [enabled, token, queryClient]);
}
