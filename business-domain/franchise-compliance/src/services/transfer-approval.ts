export async function approveTransfer(transferId: string, approved: boolean): Promise<{ status: string }> {
  return { status: approved ? 'APPROVED' : 'DENIED' };
}
