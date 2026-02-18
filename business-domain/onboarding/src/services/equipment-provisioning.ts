export interface EquipmentAssignment {
  equipmentType: 'LAPTOP' | 'MONITOR' | 'PHONE' | 'HEADSET' | 'KEYBOARD' | 'MOUSE' | 'ACCESS_CARD' | 'OTHER';
  description: string;
  
  serialNumber?: string;
  assetTag?: string;
  
  assignedDate: Date;
  returnDate?: Date;
  
  isReturned: boolean;
}
