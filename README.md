# webext-tabs-overview

[![npm version](https://img.shields.io/npm/v/webext-tabs-overview)](https://npmjs.com/package/webext-tabs-overview)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Discord](https://img.shields.io/badge/Discord-Zovo-blueviolet.svg?logo=discord)](https://discord.gg/zovo)
[![Website](https://img.shields.io/badge/Website-zovo.one-blue)](https://zovo.one)
[![GitHub Stars](https://img.shields.io/github/stars/theluckystrike/webext-tabs-overview?style=social)](https://github.com/theluckystrike/webext-tabs-overview)

> Tab overview dashboard for Chrome extensions -- tab stats, domain grouping, duplicate detection, and inactive tab management for MV3.

## Install

```bash
npm install webext-tabs-overview
```

## Usage

```js
import { TabsOverview } from 'webext-tabs-overview';

// Get comprehensive tab statistics
const stats = await TabsOverview.getStats();
console.log(`Total: ${stats.total}, Pinned: ${stats.pinned}, Windows: ${stats.windows}`);
console.log(`Audible: ${stats.audible}, Muted: ${stats.muted}, Grouped: ${stats.grouped}`);
console.log('Domains:', stats.domains);

// Get top domains by tab count
const topDomains = await TabsOverview.getTopDomains(5);
topDomains.forEach(({ domain, tabs }) => console.log(`${domain}: ${tabs} tabs`));

// Group all tabs by domain
const groups = await TabsOverview.groupByDomain();
groups.forEach((tabs, domain) => console.log(`${domain}: ${tabs.length} tabs`));

// Find duplicate tabs (same URL open in multiple tabs)
const dupes = await TabsOverview.getDuplicates();
dupes.forEach((tabs, url) => console.log(`"${url}" open in ${tabs.length} tabs`));

// Get tabs inactive for more than 30 minutes
const inactive = await TabsOverview.getInactive(30);
console.log(`${inactive.length} tabs inactive for 30+ minutes`);

// Close all tabs inactive for over an hour
const result = await TabsOverview.closeInactive(60);
console.log(`Closed ${result.closed} tabs, ${result.failed} failed`);
```

## API

### `TabsOverview`

All methods are static and async.

| Method | Parameters | Return Type | Description |
|--------|-----------|-------------|-------------|
| `getStats` | none | `Promise<TabStats>` | Get comprehensive statistics for all open tabs |
| `getTopDomains` | `count?: number` (default: 10) | `Promise<Array<{ domain: string; tabs: number }>>` | Get the top domains ranked by tab count |
| `groupByDomain` | none | `Promise<Map<string, chrome.tabs.Tab[]>>` | Group all tabs by their domain |
| `getDuplicates` | none | `Promise<Map<string, chrome.tabs.Tab[]>>` | Find tabs with identical URLs |
| `getInactive` | `minutesThreshold?: number` (default: 30) | `Promise<chrome.tabs.Tab[]>` | Get tabs not accessed within the given threshold |
| `closeInactive` | `minutesThreshold?: number` (default: 30) | `Promise<{ closed: number; failed: number; errors: string[] }>` | Close all tabs inactive beyond the threshold |

### `TabStats`

Object returned by `getStats()`.

| Property | Type | Description |
|----------|------|-------------|
| `total` | `number` | Total number of open tabs |
| `pinned` | `number` | Number of pinned tabs |
| `audible` | `number` | Number of tabs currently playing audio |
| `muted` | `number` | Number of muted tabs |
| `grouped` | `number` | Number of tabs in tab groups |
| `domains` | `Record<string, number>` | Map of domain names to their tab count |
| `windows` | `number` | Number of open browser windows |

### `TabsOverviewError`

Custom error class thrown by `TabsOverview` methods.

| Property | Type | Description |
|----------|------|-------------|
| `message` | `string` | Human-readable error message |
| `code` | `string` | Error code from `TabsOverviewErrorCode` |
| `operation` | `string` | The method that threw the error |
| `originalError` | `Error \| undefined` | The underlying Chrome API error |

### `TabsOverviewErrorCode`

| Code | Description |
|------|-------------|
| `TABS_API_ERROR` | General Chrome Tabs API error |
| `INVALID_TAB_ID` | Invalid parameter value |
| `NO_TABS_FOUND` | No tabs matched the query |
| `TAB_REMOVE_ERROR` | Failed to remove/close tabs |

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Built by [Zovo](https://zovo.one)

### Related Zovo Repositories

- [chrome-tab-timeline](https://github.com/theluckystrike/chrome-tab-timeline) - Tab activity timeline
- [chrome-tab-discard](https://github.com/theluckystrike/chrome-tab-discard) - Tab memory management
- [chrome-extension-starter-mv3](https://github.com/theluckystrike/chrome-extension-starter-mv3) - Production-ready Chrome extension starter

### Zovo Chrome Extensions

- [Zovo Tab Manager](https://chrome.google.com/webstore/detail/zovo-tab-manager) - Manage tabs efficiently
- [Zovo Focus](https://chrome.google.com/webstore/detail/zovo-focus) - Block distractions
- [Zovo Permissions Scanner](https://chrome.google.com/webstore/detail/zovo-permissions-scanner) - Check extension privacy grades

Visit [zovo.one](https://zovo.one) for more information.
