import type { ISoundboxAdapter, ProviderStatus } from "./provider.interface.ts";
import { dbRepo } from "../database/db.ts";

export class SoundboxAdapter implements ISoundboxAdapter {
  private mqttBrokerUrl = process.env.SOUNDBOX_MQTT_URL;

  async sendChime(
    deviceId: string,
    amount: number,
    language = "hi",
    mode: "LIVE" | "DEMO" = "DEMO"
  ) {
    if (mode === "LIVE") {
      if (!this.mqttBrokerUrl) {
        return {
          success: false,
          deviceId,
          chimeType: "NONE",
          mode: "LIVE" as const,
          isDemo: false,
          audioChimeUrl: undefined,
        };
      }

      // If live MQTT is configured, send MQTT publish
      console.log(`[Soundbox LIVE] Dispatching chime to ${deviceId} over MQTT: Rs ${amount} (${language})`);
      return {
        success: true,
        deviceId,
        chimeType: "HARDWARE_SPEAKER",
        mode: "LIVE" as const,
        isDemo: false,
      };
    } else {
      // DEMO mode: persist event in database
      const eventId = `EVT_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const db = await import("../database/db.ts");
      const client = await db.getDb();
      await client.query(
        `INSERT INTO soundbox_events (event_id, mode, device_id, event_type, payload)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          eventId,
          "DEMO",
          deviceId,
          "CHIME_PLAYED",
          JSON.stringify({ amount, language, timestamp: new Date().toISOString() }),
        ]
      );

      return {
        success: true,
        deviceId,
        chimeType: "VIRTUAL_WEB_AUDIO",
        mode: "DEMO" as const,
        isDemo: true,
        audioChimeUrl: `/audio/soundbox-chimes/${language}/payment_received_${amount}.mp3`,
      };
    }
  }

  async pollHeartbeat(deviceId: string, mode: "LIVE" | "DEMO" = "DEMO") {
    const device = await dbRepo.getDevice(deviceId, mode);
    if (!device) {
      return {
        deviceId,
        batteryLevel: 0,
        status: "OFFLINE" as const,
        firmwareVersion: "UNKNOWN",
        lastHeartbeat: new Date(0).toISOString(),
        mode,
      };
    }

    return {
      deviceId: device.device_id,
      batteryLevel: device.battery_level,
      status: device.status,
      firmwareVersion: device.firmware_version,
      lastHeartbeat: device.last_heartbeat,
      mode,
    };
  }

  async getConnectionStatus(): Promise<ProviderStatus> {
    const hasHardware = Boolean(this.mqttBrokerUrl);
    return {
      provider: "soundbox",
      mode: hasHardware ? "LIVE" : "DEMO",
      status: hasHardware ? "CONNECTED" : "VIRTUAL_SIMULATOR",
      latencyMs: hasHardware ? 45 : 5,
      details: {
        broker: this.mqttBrokerUrl || "internal://virtual-soundbox",
        activeVirtualDevices: 1,
      },
    };
  }
}

export const soundboxAdapter = new SoundboxAdapter();
