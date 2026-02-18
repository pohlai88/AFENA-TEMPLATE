export interface ClearanceItem {
  itemType: 'EQUIPMENT' | 'ACCESS_CARD' | 'KEYS' | 'DOCUMENTS' | 'SYSTEM_ACCESS' | 'CORPORATE_CARD' | 'OTHER';
  description: string;
  
  assignedDepartment: string;
  responsiblePerson: string;
  
  dueDate: Date;
  clearedDate?: Date;
  
  isCleared: boolean;
  isCritical: boolean;
  
  notes?: string;
}
