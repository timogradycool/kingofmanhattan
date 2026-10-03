import { getCollection, type CollectionEntry } from 'astro:content';

export type Approval = CollectionEntry<'approvals'>;

/** All approvals, newest first. */
export async function getApprovals(filter?: (entry: Approval) => boolean): Promise<Approval[]> {
  const entries = await getCollection('approvals', filter);
  return entries.sort(
    (a, b) =>
      b.data.dateApproved.getTime() - a.data.dateApproved.getTime() ||
      a.data.name.localeCompare(b.data.name),
  );
}

export function approvalUrl(entry: Approval): string {
  return `/approved/${entry.id}/`;
}

// Dates are written as plain YYYY-MM-DD, so format in UTC to avoid off-by-one-day bugs.
const dateFormat = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

export function formatDate(date: Date): string {
  return dateFormat.format(date);
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Short, readable version of a URL for display, e.g. "instagram.com/joespizza". */
export function prettyLink(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}
