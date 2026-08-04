export const STATUSES = ['Saved', 'Applied', 'Screening', 'Assessment', 'Interview', 'Offer', 'Accepted', 'Rejected', 'Withdrawn', 'Closed']
export const statusTone = { Saved: 'slate', Applied: 'blue', Screening: 'cyan', Assessment: 'amber', Interview: 'purple', Offer: 'orange', Accepted: 'green', Rejected: 'red', Withdrawn: 'slate', Closed: 'dark' }
export function autoBadges(app, threshold = 7) {
  const today = new Date(); today.setHours(0,0,0,0); const badges = []; const follow = app.followUpDate ? new Date(`${app.followUpDate}T00:00:00`) : null
  const terminal = ['Accepted','Rejected','Withdrawn','Closed'].includes(app.currentStatus)
  if (follow && !app.followUpCompleted && !terminal) badges.push(follow < today ? 'Follow-up Overdue' : follow.getTime() === today.getTime() ? 'Follow-up Today' : null)
  const anchor = app.updatedAt?.toDate?.() || new Date(`${app.applicationDate}T00:00:00`); const days = Math.floor((Date.now() - anchor) / 86400000)
  if (app.currentStatus === 'Applied') badges.push(days >= threshold ? `No Response for ${threshold} Days` : 'Waiting for Response')
  return badges.filter(Boolean)
}
