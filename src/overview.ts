/**
 * Tabs Overview — Dashboard stats and grouping for tabs
 */
export interface TabStats { total: number; pinned: number; audible: number; muted: number; grouped: number; domains: Record<string, number>; windows: number; }

export class TabsOverview {
    /** Get comprehensive tab statistics */
    static async getStats(): Promise<TabStats> {
        const tabs = await chrome.tabs.query({});
        const windows = new Set(tabs.map((t) => t.windowId));
        const domains: Record<string, number> = {};
        tabs.forEach((t) => {
            try { const d = new URL(t.url || '').hostname; domains[d] = (domains[d] || 0) + 1; } catch { }
        });
        return {
            total: tabs.length, pinned: tabs.filter((t) => t.pinned).length,
            audible: tabs.filter((t) => t.audible).length, muted: tabs.filter((t) => t.mutedInfo?.muted).length,
            grouped: tabs.filter((t) => t.groupId !== -1).length,
            domains, windows: windows.size,
        };
    }

    /** Get top domains by tab count */
    static async getTopDomains(count: number = 10): Promise<Array<{ domain: string; tabs: number }>> {
        const stats = await this.getStats();
        return Object.entries(stats.domains).sort(([, a], [, b]) => b - a)
            .slice(0, count).map(([domain, tabs]) => ({ domain, tabs }));
    }

    /** Get tabs grouped by domain */
    static async groupByDomain(): Promise<Map<string, chrome.tabs.Tab[]>> {
        const tabs = await chrome.tabs.query({});
        const groups = new Map<string, chrome.tabs.Tab[]>();
        tabs.forEach((t) => {
            try {
                const d = new URL(t.url || '').hostname;
                const list = groups.get(d) || []; list.push(t); groups.set(d, list);
            } catch { }
        });
        return groups;
    }

    /** Find duplicate tabs */
    static async getDuplicates(): Promise<Map<string, chrome.tabs.Tab[]>> {
        const tabs = await chrome.tabs.query({});
        const byUrl = new Map<string, chrome.tabs.Tab[]>();
        tabs.forEach((t) => {
            if (t.url) { const list = byUrl.get(t.url) || []; list.push(t); byUrl.set(t.url, list); }
        });
        const dupes = new Map<string, chrome.tabs.Tab[]>();
        byUrl.forEach((tabs, url) => { if (tabs.length > 1) dupes.set(url, tabs); });
        return dupes;
    }

    /** Get inactive tabs (not accessed in N minutes) */
    static async getInactive(minutesThreshold: number = 30): Promise<chrome.tabs.Tab[]> {
        const tabs = await chrome.tabs.query({});
        const cutoff = Date.now() - minutesThreshold * 60000;
        return tabs.filter((t) => !t.active && (t.lastAccessed || 0) < cutoff);
    }

    /** Close all inactive tabs */
    static async closeInactive(minutesThreshold: number = 30): Promise<number> {
        const inactive = await this.getInactive(minutesThreshold);
        const ids = inactive.map((t) => t.id).filter(Boolean) as number[];
        if (ids.length) await chrome.tabs.remove(ids);
        return ids.length;
    }
}
