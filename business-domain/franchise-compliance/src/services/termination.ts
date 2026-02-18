export function initiateTermination(unitId: string, reason: string, curePeriodDays: number): {
  noticeDate: Date;
  cureDeadline: Date;
} {
  const noticeDate = new Date();
  const cureDeadline = new Date();
  cureDeadline.setDate(cureDeadline.getDate() + curePeriodDays);
  return { noticeDate, cureDeadline };
}
