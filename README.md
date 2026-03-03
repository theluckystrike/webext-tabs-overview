# webext-tabs-overview — Tab Dashboard

[![npm version](https://img.shields.io/npm/v/webext-tabs-overview)](https://npmjs.com/package/webext-tabs-overview)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Chrome Web Extension](https://img.shields.io/badge/Chrome-Web%20Extension-orange.svg)](https://developer.chrome.com/docs/extensions/)
[![CI Status](https://github.com/theluckystrike/webext-tabs-overview/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/webext-tabs-overview/actions)
[![Discord](https://img.shields.io/badge/Discord-Zovo-blueviolet.svg?logo=discord)](https://discord.gg/zovo)
[![Website](https://img.shields.io/badge/Website-zovo.one-blue)](https://zovo.one)
[![GitHub Stars](https://img.shields.io/github/stars/theluckystrike/webext-tabs-overview?style=social)](https://github.com/theluckystrike/webext-tabs-overview)

> Tab stats, top domains, group by domain, find duplicates, detect and close inactive tabs.

**webext-tabs-overview** provides comprehensive tab analytics and management for Chrome extensions. Get tab statistics, find duplicates, group by domain, and automatically close inactive tabs — all with a simple API.

Part of the [Zovo](https://zovo.one) developer tools family.

## Features

- ✅ **Tab Statistics** - Total tabs, windows, memory usage
- ✅ **Domain Analysis** - Top domains, tab distribution
- ✅ **Duplicate Detection** - Find and close duplicate tabs
- ✅ **Inactive Tab Management** - Close tabs not used in X days
- ✅ **Grouping** - Group tabs by domain or other criteria
- ✅ **TypeScript Support** - Full type definitions included

## Installation

```bash
npm install webext-tabs-overview
```

## Quick Start

```typescript
import { TabsOverview } from 'webext-tabs-overview';

// Get tab statistics
const stats = await TabsOverview.getStats();
console.log('Total tabs:', stats.totalTabs);
console.log('Total windows:', stats.totalWindows);

// Find duplicate tabs
const dupes = await TabsOverview.getDuplicates();
console.log('Duplicate URLs:', dupes);

// Close inactive tabs
const closed = await TabsOverview.closeInactive(30);
console.log('Closed tabs:', closed);
```

## Usage Examples

### Get Tab Statistics

```typescript
const stats = await TabsOverview.getStats();
/*
{
  totalTabs: 45,
  totalWindows: 5,
  activeTabs: 30,
  inactiveTabs: 15,
  memoryUsage: '450MB',
  topDomains: [
    { domain: 'github.com', count: 12 },
    { domain: 'stackoverflow.com', count: 8 }
  ]
}
*/
```

### Group Tabs by Domain

```typescript
const groups = await TabsOverview.groupByDomain();
/*
{
  'github.com': [tab1, tab2, ...],
  'youtube.com': [tab3, tab4, ...]
}
*/
```

### Find Duplicate URLs

```typescript
const duplicates = await TabsOverview.getDuplicates();
duplicates.forEach(group => {
  console.log(`Duplicate: ${group.url}`);
  console.log('Tabs:', group.tabs.map(t => t.title));
});
```

### Close Inactive Tabs

```typescript
// Close tabs not used in 7 days
const closed = await TabsOverview.closeInactive(7);
console.log(`Closed ${closed.length} inactive tabs`);
```

### Get Tab Timeline

```typescript
const timeline = await TabsOverview.getTimeline();
// Returns tab activity over time for visualization
```

## API

### TabsOverview Methods

| Method | Description |
|--------|-------------|
| `TabsOverview.getStats()` | Get tab statistics |
| `TabsOverview.groupByDomain()` | Group tabs by domain |
| `TabsOverview.getDuplicates()` | Find duplicate tabs |
| `TabsOverview.closeInactive(days)` | Close inactive tabs |
| `TabsOverview.getTimeline()` | Get tab activity timeline |

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/tabs-feature`
3. **Make** your changes
4. **Test** your changes: `npm test`
5. **Commit** your changes: `git commit -m 'Add new feature'`
6. **Push** to the branch: `git push origin feature/tabs-feature`
7. **Submit** a Pull Request

## Built by Zovo

Part of the [Zovo](https://zovo.one) developer tools family — privacy-first Chrome extensions built by developers, for developers.

## See Also

### Related Zovo Repositories

- [chrome-tab-search](https://github.com/theluckystrike/chrome-tab-search) - Tab search
- [chrome-tab-sort](https://github.com/theluckystrike/chrome-tab-sort) - Tab sorting
- [chrome-tab-discard](https://github.com/theluckystrike/chrome-tab-discard) - Tab discarding
- [chrome-tab-groups-api](https://github.com/theluckystrike/chrome-tab-groups-api) - Tab groups

### Zovo Chrome Extensions

- [Zovo Tab Manager](https://chrome.google.com/webstore/detail/zovo-tab-manager) - Manage tabs efficiently
- [Zovo Focus](https://chrome.google.com/webstore/detail/zovo-focus) - Block distractions
- [Zovo Permissions Scanner](https://chrome.google.com/webstore/detail/zovo-permissions-scanner) - Check extension privacy grades

Visit [zovo.one](https://zovo.one) for more information.

## License

MIT — [Zovo](https://zovo.one)

---

*Built by developers, for developers. No compromises on privacy.*
