# webext-tabs-overview

Tab overview dashboard for Chrome extensions. Gives you tab stats, domain grouping, duplicate detection, and inactive tab cleanup. Built for Manifest V3.

Requires the `tabs` permission in your extension manifest.


INSTALL

```bash
npm install webext-tabs-overview
```


USAGE

```js
import { TabsOverview } from 'webext-tabs-overview';

// Get tab statistics across all windows
const stats = await TabsOverview.getStats();
console.log(stats.total, stats.pinned, stats.windows);
console.log(stats.audible, stats.muted, stats.grouped);
console.log(stats.domains);

// Top 5 domains by tab count
const top = await TabsOverview.getTopDomains(5);
top.forEach(({ domain, tabs }) => console.log(domain, tabs));

// Group tabs by domain
const groups = await TabsOverview.groupByDomain();
groups.forEach((tabs, domain) => console.log(domain, tabs.length));

// Find duplicate tabs (same URL open more than once)
const dupes = await TabsOverview.getDuplicates();
dupes.forEach((tabs, url) => console.log(url, tabs.length));

// Get tabs inactive for 30+ minutes
const inactive = await TabsOverview.getInactive(30);
console.log(inactive.length);

// Close tabs inactive for over an hour
const result = await TabsOverview.closeInactive(60);
console.log(result.closed, result.failed);
```


API

All methods on TabsOverview are static and return promises.

getStats()
Returns a TabStats object with total, pinned, audible, muted, grouped, windows (all numbers), and domains (a record mapping hostname strings to tab counts).

getTopDomains(count)
Takes an optional count (default 10). Returns an array of { domain, tabs } objects sorted by tab count descending.

groupByDomain()
Returns a Map where each key is a hostname and each value is an array of chrome.tabs.Tab objects on that domain.

getDuplicates()
Returns a Map of URL strings to arrays of chrome.tabs.Tab objects, including only URLs open in more than one tab.

getInactive(minutesThreshold)
Takes an optional threshold in minutes (default 30). Returns an array of chrome.tabs.Tab objects that have not been accessed within that window.

closeInactive(minutesThreshold)
Takes an optional threshold in minutes (default 30). Closes all matching inactive tabs. Returns { closed, failed, errors } where errors is an array of failure messages.


ERROR HANDLING

All methods throw TabsOverviewError on failure. The error includes a code string from TabsOverviewErrorCode, an operation string naming the method that failed, and an optional originalError with the underlying Chrome API error.

Error codes are TABS_API_ERROR, INVALID_TAB_ID, NO_TABS_FOUND, and TAB_REMOVE_ERROR.

```js
import { TabsOverview, TabsOverviewError } from 'webext-tabs-overview';

try {
  const stats = await TabsOverview.getStats();
} catch (err) {
  if (err instanceof TabsOverviewError) {
    console.log(err.code, err.operation, err.originalError);
  }
}
```


LICENSE

MIT. See LICENSE file.


---

Built at [zovo.one](https://zovo.one) by [theluckystrike](https://github.com/theluckystrike)
