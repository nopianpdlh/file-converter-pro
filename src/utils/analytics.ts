interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  timestamp: string;
}

interface ConversionMetrics {
  totalConversions: number;
  conversionsByType: Record<string, number>;
  averageFileSize: number;
  totalDataProcessed: number;
  popularFormats: Record<string, number>;
  conversionTimes: number[];
  errorRate: number;
  successRate: number;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private storageKey = "fileConverterAnalytics";

  constructor() {
    this.loadEvents();
  }

  private loadEvents(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      console.error("Failed to load analytics:", error);
      this.events = [];
    }
  }

  private saveEvents(): void {
    try {
      // Keep only last 1000 events to prevent storage bloat
      const recentEvents = this.events.slice(-1000);
      localStorage.setItem(this.storageKey, JSON.stringify(recentEvents));
      this.events = recentEvents;
    } catch (error) {
      console.error("Failed to save analytics:", error);
    }
  }

  track(
    action: string,
    category: string,
    label?: string,
    value?: number
  ): void {
    const event: AnalyticsEvent = {
      action,
      category,
      label,
      value,
      timestamp: new Date().toISOString(),
    };

    this.events.push(event);
    this.saveEvents();
  }

  trackConversion(
    fromFormat: string,
    toFormat: string,
    fileSize: number,
    duration: number,
    success: boolean
  ): void {
    this.track("conversion", "file", `${fromFormat}_to_${toFormat}`, duration);
    this.track(
      success ? "conversion_success" : "conversion_error",
      "file",
      `${fromFormat}_to_${toFormat}`,
      fileSize
    );
  }

  trackFileUpload(fileType: string, fileSize: number): void {
    this.track("file_upload", "user_action", fileType, fileSize);
  }

  trackDownload(format: string, fileSize: number): void {
    this.track("file_download", "user_action", format, fileSize);
  }

  trackError(errorType: string): void {
    this.track("error", "system", errorType);
  }

  getMetrics(): ConversionMetrics {
    const conversionEvents = this.events.filter(
      (e) => e.action === "conversion"
    );
    const successEvents = this.events.filter(
      (e) => e.action === "conversion_success"
    );
    const errorEvents = this.events.filter(
      (e) => e.action === "conversion_error"
    );

    const conversionsByType: Record<string, number> = {};
    const popularFormats: Record<string, number> = {};
    const conversionTimes: number[] = [];
    let totalDataProcessed = 0;

    conversionEvents.forEach((event) => {
      if (event.label) {
        conversionsByType[event.label] =
          (conversionsByType[event.label] || 0) + 1;

        const [, toFormat] = event.label.split("_to_");
        if (toFormat) {
          popularFormats[toFormat] = (popularFormats[toFormat] || 0) + 1;
        }
      }

      if (event.value) {
        conversionTimes.push(event.value);
      }
    });

    successEvents.forEach((event) => {
      if (event.value) {
        totalDataProcessed += event.value;
      }
    });

    const totalConversions = conversionEvents.length;
    const averageFileSize = totalDataProcessed / (successEvents.length || 1);
    const errorRate = errorEvents.length / (totalConversions || 1);
    const successRate = successEvents.length / (totalConversions || 1);

    return {
      totalConversions,
      conversionsByType,
      averageFileSize,
      totalDataProcessed,
      popularFormats,
      conversionTimes,
      errorRate,
      successRate,
    };
  }

  getUsageStats(days = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentEvents = this.events.filter(
      (event) => new Date(event.timestamp) >= cutoffDate
    );

    const dailyStats: Record<string, number> = {};

    recentEvents.forEach((event) => {
      const date = new Date(event.timestamp).toDateString();
      dailyStats[date] = (dailyStats[date] || 0) + 1;
    });

    return dailyStats;
  }

  exportData(): string {
    return JSON.stringify(
      {
        events: this.events,
        metrics: this.getMetrics(),
        exportDate: new Date().toISOString(),
      },
      null,
      2
    );
  }

  clearData(): void {
    this.events = [];
    localStorage.removeItem(this.storageKey);
  }
}

export const analytics = new AnalyticsService();
