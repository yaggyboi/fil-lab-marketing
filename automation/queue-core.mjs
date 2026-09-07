export function decision(item, record, now = Date.now()) {
  if (!item.approved) return 'unapproved';
  if (record?.status === 'published') return 'published';
  if (record) return 'review';
  if (now < Date.parse(item.at)) return 'early';
  if (now > Date.parse(item.until)) return 'expired';
  return 'due';
}
