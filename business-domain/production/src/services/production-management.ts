/**
 * Production Management Service
 * Handles work orders, capacity planning, production scheduling, and yield tracking
 */

// ============================================================================
// Interfaces
// ============================================================================

export interface WorkOrder {
  workOrderId: string;
  productId: string;
  quantityOrdered: number;
  quantityProduced: number;
  quantityScrap: number;
  status: 'DRAFT' | 'RELEASED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  priority: 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW';
  plannedStartDate: Date;
  plannedEndDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  workCenterId: string;
  billOfMaterials: BOMLine[];
  routings: RoutingOperation[];
  estimatedCost: number;
  actualCost?: number;
}

export interface BOMLine {
  lineNumber: number;
  componentId: string;
  quantityPer: number;
  totalRequired: number;
  quantityIssued: number;
  scrapPercentage: number;
  unitCost: number;
}

export interface RoutingOperation {
  operationNumber: number;
  workCenterId: string;
  operationDescription: string;
  setupTime: number; // minutes
  runTimePerUnit: number; // minutes
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';
  actualSetupTime?: number;
  actualRunTime?: number;
  laborCost: number;
  machineCost: number;
}

export interface WorkCenter {
  workCenterId: string;
  name: string;
  type: 'MACHINE' | 'ASSEMBLY' | 'INSPECTION' | 'PACKAGING' | 'FINISHING';
  capacity: number; // units per hour
  efficiency: number; // percentage
  utilization: number; // percentage
  laborRate: number; // per hour
  overheadRate: number; // per hour
  status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
}

export interface ProductionSchedule {
  scheduleId: string;
  workCenterId: string;
  scheduleDate: Date;
  workOrders: ScheduledWorkOrder[];
  totalPlannedHours: number;
  availableHours: number;
  utilizationPercentage: number;
}

export interface ScheduledWorkOrder {
  workOrderId: string;
  startTime: Date;
  endTime: Date;
  plannedHours: number;
  sequenceNumber: number;
}

export interface ProductionRun {
  runId: string;
  workOrderId: string;
  operationNumber: number;
  startTime: Date;
  endTime?: Date;
  quantityProduced: number;
  quantityScrap: number;
  scrapReasons: ScrapReason[];
  operatorId: string;
}

export interface ScrapReason {
  reason: string;
  quantity: number;
  cost: number;
}

// ============================================================================
// Database Operations
// ============================================================================

export async function createWorkOrder(workOrder: Omit<WorkOrder, 'workOrderId'>): Promise<WorkOrder> {
  // TODO: Implement with Drizzle ORM
  // const workOrderId = generateWorkOrderNumber();
  // return await db.insert(workOrders).values({ ...workOrder, workOrderId }).returning();
  throw new Error('Not implemented');
}

export async function releaseWorkOrder(workOrderId: string): Promise<void> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function recordProduction(
  workOrderId: string,
  quantityProduced: number,
  quantityScrap: number
): Promise<void> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function issueMaterial(
  workOrderId: string,
  bomLine: number,
  quantityIssued: number
): Promise<void> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function getWorkCenter(workCenterId: string): Promise<WorkCenter | null> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function createProductionSchedule(
  schedule: Omit<ProductionSchedule, 'scheduleId'>
): Promise<ProductionSchedule> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function recordProductionRun(run: Omit<ProductionRun, 'runId'>): Promise<ProductionRun> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

// ============================================================================
// Helper Functions
// ============================================================================

export function generateWorkOrderNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const sequence = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `WO-${dateStr}-${sequence}`;
}

export function calculateMaterialRequirements(workOrder: WorkOrder): {
  totalMaterialCost: number;
  shortages: Array<{ componentId: string; required: number; issued: number; shortage: number }>;
} {
  let totalMaterialCost = 0;
  const shortages: Array<{ componentId: string; required: number; issued: number; shortage: number }> = [];

  workOrder.billOfMaterials.forEach(line => {
    totalMaterialCost += line.totalRequired * line.unitCost;
    
    const shortage = line.totalRequired - line.quantityIssued;
    if (shortage > 0) {
      shortages.push({
        componentId: line.componentId,
        required: line.totalRequired,
        issued: line.quantityIssued,
        shortage,
      });
    }
  });

  return { totalMaterialCost, shortages };
}

export function calculateProductionTime(workOrder: WorkOrder): {
  totalSetupTime: number;
  totalRunTime: number;
  totalProductionTime: number;
} {
  let totalSetupTime = 0;
  let totalRunTime = 0;

  workOrder.routings.forEach(op => {
    totalSetupTime += op.setupTime;
    totalRunTime += op.runTimePerUnit * workOrder.quantityOrdered;
  });

  return {
    totalSetupTime,
    totalRunTime,
    totalProductionTime: totalSetupTime + totalRunTime,
  };
}

export function calculateYield(workOrder: WorkOrder): {
  yieldPercentage: number;
  scrapPercentage: number;
  firstPassYield: number;
} {
  const totalProduced = workOrder.quantityProduced + workOrder.quantityScrap;
  const yieldPercentage = totalProduced > 0 ? (workOrder.quantityProduced / totalProduced) * 100 : 0;
  const scrapPercentage = totalProduced > 0 ? (workOrder.quantityScrap / totalProduced) * 100 : 0;
  
  // First pass yield assumes no rework (simplified)
  const firstPassYield = workOrder.quantityOrdered > 0 
    ? (workOrder.quantityProduced / workOrder.quantityOrdered) * 100 
    : 0;

  return {
    yieldPercentage,
    scrapPercentage,
    firstPassYield,
  };
}

export function calculateProductionCost(workOrder: WorkOrder, workCenters: WorkCenter[]): {
  materialCost: number;
  laborCost: number;
  overheadCost: number;
  totalCost: number;
  costPerUnit: number;
} {
  // Material cost
  const materialCost = workOrder.billOfMaterials.reduce(
    (sum, line) => sum + (line.quantityIssued * line.unitCost),
    0
  );

  // Labor and overhead
  let laborCost = 0;
  let overheadCost = 0;

  workOrder.routings.forEach(op => {
    const workCenter = workCenters.find(wc => wc.workCenterId === op.workCenterId);
    if (workCenter) {
      const actualSetup = op.actualSetupTime || op.setupTime;
      const actualRun = op.actualRunTime || (op.runTimePerUnit * workOrder.quantityProduced);
      
      const totalHours = (actualSetup + actualRun) / 60;
      laborCost += totalHours * workCenter.laborRate;
      overheadCost += totalHours * workCenter.overheadRate;
    }
  });

  const totalCost = materialCost + laborCost + overheadCost;
  const costPerUnit = workOrder.quantityProduced > 0 ? totalCost / workOrder.quantityProduced : 0;

  return {
    materialCost,
    laborCost,
    overheadCost,
    totalCost,
    costPerUnit,
  };
}

export function calculateWorkCenterCapacity(
  workCenter: WorkCenter,
  workOrders: WorkOrder[]
): {
  totalCapacityHours: number;
  scheduledHours: number;
  availableHours: number;
  utilizationPercentage: number;
  overloadedHours: number;
} {
  // Assume 8-hour shifts, 5 days/week
  const totalCapacityHours = 8 * 5 * (workCenter.efficiency / 100);
  
  let scheduledHours = 0;
  workOrders.forEach(wo => {
    wo.routings
      .filter(op => op.workCenterId === workCenter.workCenterId)
      .forEach(op => {
        scheduledHours += (op.setupTime + (op.runTimePerUnit * wo.quantityOrdered)) / 60;
      });
  });

  const availableHours = Math.max(totalCapacityHours - scheduledHours, 0);
  const utilizationPercentage = (scheduledHours / totalCapacityHours) * 100;
  const overloadedHours = Math.max(scheduledHours - totalCapacityHours, 0);

  return {
    totalCapacityHours,
    scheduledHours,
    availableHours,
    utilizationPercentage,
    overloadedHours,
  };
}

export function scheduleWorkOrders(
  workOrders: WorkOrder[],
  workCenter: WorkCenter,
  startDate: Date
): ScheduledWorkOrder[] {
  // Simple forward scheduling algorithm
  const scheduled: ScheduledWorkOrder[] = [];
  let currentTime = new Date(startDate);

  // Sort by priority and due date
  const sorted = [...workOrders].sort((a, b) => {
    const priorityOrder = { URGENT: 1, HIGH: 2, NORMAL: 3, LOW: 4 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return a.plannedEndDate.getTime() - b.plannedEndDate.getTime();
  });

  sorted.forEach((wo, index) => {
    const operation = wo.routings.find(op => op.workCenterId === workCenter.workCenterId);
    if (!operation) return;

    const plannedHours = (operation.setupTime + (operation.runTimePerUnit * wo.quantityOrdered)) / 60;
    const endTime = new Date(currentTime.getTime() + plannedHours * 60 * 60 * 1000);

    scheduled.push({
      workOrderId: wo.workOrderId,
      startTime: new Date(currentTime),
      endTime,
      plannedHours,
      sequenceNumber: index + 1,
    });

    currentTime = endTime;
  });

  return scheduled;
}

export function analyzeScrapTrends(productionRuns: ProductionRun[]): Array<{
  reason: string;
  totalQuantity: number;
  totalCost: number;
  occurrences: number;
  percentage: number;
}> {
  const scrapData = new Map<string, { quantity: number; cost: number; occurrences: number }>();
  let totalScrap = 0;

  productionRuns.forEach(run => {
    run.scrapReasons.forEach(scrap => {
      totalScrap += scrap.quantity;
      
      if (!scrapData.has(scrap.reason)) {
        scrapData.set(scrap.reason, { quantity: 0, cost: 0, occurrences: 0 });
      }
      
      const data = scrapData.get(scrap.reason)!;
      data.quantity += scrap.quantity;
      data.cost += scrap.cost;
      data.occurrences++;
    });
  });

  return Array.from(scrapData.entries())
    .map(([reason, data]) => ({
      reason,
      totalQuantity: data.quantity,
      totalCost: data.cost,
      occurrences: data.occurrences,
      percentage: totalScrap > 0 ? (data.quantity / totalScrap) * 100 : 0,
    }))
    .sort((a, b) => b.totalQuantity - a.totalQuantity);
}

export function calculateOEE(workCenter: WorkCenter, productionRuns: ProductionRun[]): {
  availability: number;
  performance: number;
  quality: number;
  oee: number;
} {
  // OEE = Availability × Performance × Quality
  
  // Availability = (Operating Time / Planned Production Time)
  const plannedTime = 8 * 60; // 8 hours in minutes
  const downtime = 30; // placeholder for actual downtime tracking
  const availability = ((plannedTime - downtime) / plannedTime) * 100;
  
  // Performance = (Actual Output / Standard Output)
  const totalProduced = productionRuns.reduce((sum, run) => sum + run.quantityProduced, 0);
  const idealProduction = workCenter.capacity * 8; // capacity per hour × 8 hours
  const performance = idealProduction > 0 ? (totalProduced / idealProduction) * 100 : 0;
  
  // Quality = (Good Units / Total Units Produced)
  const totalScrap = productionRuns.reduce((sum, run) => sum + run.quantityScrap, 0);
  const quality = (totalProduced + totalScrap) > 0 
    ? (totalProduced / (totalProduced + totalScrap)) * 100 
    : 0;
  
  const oee = (availability / 100) * (performance / 100) * (quality / 100) * 100;

  return {
    availability,
    performance,
    quality,
    oee,
  };
}
