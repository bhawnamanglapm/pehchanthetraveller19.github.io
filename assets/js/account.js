/**
 * Saved items store.
 *
 * Local-first by design: the MVP needs no identity, so adding authentication
 * early would cost complexity and privacy surface for no user benefit. This
 * module exposes exactly the interface an API-backed store would, so Phase 2
 * replaces the adapter below rather than rewriting the features that use it.
 *
 * Phase 2:  const adapter = new ApiStore(session)   // same four methods
 */

const KEY = "pehchan-saved";

class LocalStore {
  read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  }
  write(items) {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* private mode */ }
  }
  async list() { return this.read(); }
  async has(type, slug) { return this.read().some(i => i.type === type && i.slug === slug); }
  async add(item) {
    const items = this.read();
    if (!items.some(i => i.type === item.type && i.slug === item.slug)) {
      items.push({ ...item, savedAt: Date.now() });
      this.write(items);
    }
    return items;
  }
  async remove(type, slug) {
    const items = this.read().filter(i => !(i.type === type && i.slug === slug));
    this.write(items);
    return items;
  }
}

export const store = new LocalStore();
