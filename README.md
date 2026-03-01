# webext-tabs-overview — Tab Dashboard
> **Built by [Zovo](https://zovo.one)** | `npm i webext-tabs-overview`

Tab stats, top domains, group by domain, find duplicates, detect and close inactive tabs.

```typescript
import { TabsOverview } from 'webext-tabs-overview';
const stats = await TabsOverview.getStats();
const dupes = await TabsOverview.getDuplicates();
const closed = await TabsOverview.closeInactive(30);
```
MIT License
