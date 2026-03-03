/**
 * Tabs Overview — Dashboard stats and grouping for tabs with error handling
 */

export class TabsOverviewError extends Error {
    constructor(
        message: string,
        public code: string,
        public operation: string,
        public originalError?: Error
    ) {
        super(message);
        this.name = 'TabsOverviewError';
        if (originalError && originalError.stack) {
            this.stack = originalError.stack;
        }
    }
}

export const TabsOverviewErrorCode = {
    TABS_API_ERROR: 'TABS_API_ERROR',
    INVALID_TAB_ID: 'INVALID_TAB_ID',
    NO_TABS_FOUND: 'NO_TABS_FOUND',
    TAB_REMOVE_ERROR: 'TAB_REMOVE_ERROR',
} as const;

export interface TabStats { total: number; pinned: number; audible: number; muted: number; grouped: number; domains: Record<string, number>; windows: number; }

/**
 * Tabs Overview — Dashboard stats and grouping for tabs with proper error handling
 */
export class TabsOverview {
    /** Get comprehensive tab statistics */
    static async getStats(): Promise<TabStats> {
        try {
            const tabs = await chrome.tabs.query({});
            const windows = new Set(tabs.map((t) => t.windowId));
            const domains: Record<string, number> = {};
            const errors: string[] = [];
            
            tabs.forEach((t) => {
                if (t.url) {
                    try {
                        const url = new URL(t.url);
                        if (url.hostname) {
                            domains[url.hostname] = (domains[url.hostname] || 0) + 1;
                        }
                    } catch {
                        // Skip invalid URLs but track that we had some
                        errors.push(t.url);
                    }
                }
            });
            
            return {
                total: tabs.length, 
                pinned: tabs.filter((t) => t.pinned).length,
                audible: tabs.filter((t) => t.audible).length, 
                muted: tabs.filter((t) => t.mutedInfo?.muted).length,
                grouped: tabs.filter((t) => t.groupId !== -1).length,
                domains, 
                windows: windows.size,
            };
        } catch (error) {
            throw new TabsOverviewError(
                `Failed to get tab statistics: ${(error as Error).message}. ` +
                'Make sure you have the "tabs" permission in your manifest.',
                TabsOverviewErrorCode.TABS_API_ERROR,
                'getStats',
                error as Error
            );
        }
    }

    /** Get top domains by tab count */
    static async getTopDomains(count: number = 10): Promise<Array<{ domain: string; tabs: number }>> {
        if (typeof count !== 'number' || count < 1 || !Number.isFinite(count)) {
            throw new TabsOverviewError(
                `Invalid count: must be a positive number. Received: ${count}`,
                TabsOverviewErrorCode.INVALID_TAB_ID,
                'getTopDomains'
            );
        }
        
        const stats = await this.getStats();
        return Object.entries(stats.domains).sort(([, a], [, b]) => b - a)
            .slice(0, count).map(([domain, tabs]) => ({ domain, tabs }));
    }

    /** Get tabs grouped by domain */
    static async groupByDomain(): Promise<Map<string, chrome.tabs.Tab[]>> {
        try {
            const tabs = await chrome.tabs.query({});
            const groups = new Map<string, chrome.tabs.Tab[]>();
            
            tabs.forEach((t) => {
                if (t.url) {
                    try {
                        const url = new URL(t.url);
                        const domain = url.hostname;
                        if (domain) {
                            const list = groups.get(domain) || []; 
                            list.push(t); 
                            groups.set(domain, list);
                        }
                    } catch {
                        // Skip invalid URLs silently
                    }
                }
            });
            return groups;
        } catch (error) {
            throw new TabsOverviewError(
                `Failed to group tabs by domain: ${(error as Error).message}. ` +
                'Make sure you have the "tabs" permission in your manifest.',
                TabsOverviewErrorCode.TABS_API_ERROR,
                'groupByDomain',
                error as Error
            );
        }
    }

    /** Find duplicate tabs */
    static async getDuplicates(): Promise<Map<string, chrome.tabs.Tab[]>> {
        try {
            const tabs = await chrome.tabs.query({});
            const byUrl = new Map<string, chrome.tabs.Tab[]>();
            
            tabs.forEach((t) => {
                if (t.url) { 
                    const list = byUrl.get(t.url) || []; 
                    list.push(t); 
                    byUrl.set(t.url, list); 
                }
            });
            
            const dupes = new Map<string, chrome.tabs.Tab[]>();
            byUrl.forEach((tabs, url) => { if (tabs.length > 1) dupes.set(url, tabs); });
            return dupes;
        } catch (error) {
            throw new TabsOverviewError(
                `Failed to find duplicate tabs: ${(error as Error).message}. ` +
                'Make sure you have the "tabs" permission in your manifest.',
                TabsOverviewErrorCode.TABS_API_ERROR,
                'getDuplicates',
                error as Error
            );
        }
    }

    /** Get inactive tabs (not accessed in N minutes) */
    static async getInactive(minutesThreshold: number = 30): Promise<chrome.tabs.Tab[]> {
        if (typeof minutesThreshold !== 'number' || minutesThreshold < 0 || !Number.isFinite(minutesThreshold)) {
            throw new TabsOverviewError(
                `Invalid threshold: must be a non-negative number. Received: ${minutesThreshold}`,
                TabsOverviewErrorCode.INVALID_TAB_ID,
                'getInactive'
            );
        }
        
        try {
            const tabs = await chrome.tabs.query({});
            const cutoff = Date.now() - minutesThreshold * 60000;
            return tabs.filter((t) => !t.active && ((t as any).lastAccessed || 0) < cutoff);
        } catch (error) {
            throw new TabsOverviewError(
                `Failed to get inactive tabs: ${(error as Error).message}. ` +
                'Make sure you have the "tabs" permission in your manifest.',
                TabsOverviewErrorCode.TABS_API_ERROR,
                'getInactive',
                error as Error
            );
        }
    }

    /** Close all inactive tabs */
    static async closeInactive(minutesThreshold: number = 30): Promise<{ closed: number; failed: number; errors: string[] }> {
        if (typeof minutesThreshold !== 'number' || minutesThreshold < 0 || !Number.isFinite(minutesThreshold)) {
            throw new TabsOverviewError(
                `Invalid threshold: must be a non-negative number. Received: ${minutesThreshold}`,
                TabsOverviewErrorCode.INVALID_TAB_ID,
                'closeInactive'
            );
        }
        
        try {
            const inactive = await this.getInactive(minutesThreshold);
            const ids = inactive.map((t) => t.id).filter(Boolean) as number[];
            
            if (ids.length === 0) {
                return { closed: 0, failed: 0, errors: [] };
            }
            
            const errors: string[] = [];
            try {
                await chrome.tabs.remove(ids);
            } catch (error) {
                // Partial failure - some tabs may have been closed already
                errors.push(`Failed to close some tabs: ${(error as Error).message}`);
            }
            
            return { 
                closed: ids.length - errors.length, 
                failed: errors.length,
                errors 
            };
        } catch (error) {
            if (error instanceof TabsOverviewError) throw error;
            throw new TabsOverviewError(
                `Failed to close inactive tabs: ${(error as Error).message}`,
                TabsOverviewErrorCode.TAB_REMOVE_ERROR,
                'closeInactive',
                error as Error
            );
        }
    }
}
