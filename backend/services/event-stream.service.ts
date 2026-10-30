export interface StreamEvent {
  type: string;
  timestamp: string;
  mode: "LIVE" | "DEMO";
  payload: Record<string, unknown>;
}

type ClientHandler = (event: StreamEvent) => void;

class EventStreamService {
  private clients: Set<ClientHandler> = new Set();

  subscribe(handler: ClientHandler): () => void {
    this.clients.add(handler);
    return () => {
      this.clients.delete(handler);
    };
  }

  broadcast(type: string, payload: Record<string, unknown>, mode: "LIVE" | "DEMO" = "DEMO") {
    const event: StreamEvent = {
      type,
      timestamp: new Date().toISOString(),
      mode,
      payload,
    };

    for (const client of this.clients) {
      try {
        client(event);
      } catch (err) {
        console.error("[EventStream] Error sending to client:", err);
      }
    }
  }

  getClientCount(): number {
    return this.clients.size;
  }
}

export const eventStream = new EventStreamService();
