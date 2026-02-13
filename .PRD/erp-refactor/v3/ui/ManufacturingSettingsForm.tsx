// Form scaffold for Manufacturing Settings
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ManufacturingSettings } from '../types/manufacturing-settings.js';

interface ManufacturingSettingsFormProps {
  initialData?: Partial<ManufacturingSettings>;
  onSubmit: (data: Partial<ManufacturingSettings>) => void;
  mode: 'create' | 'edit';
}

export function ManufacturingSettingsForm({ initialData = {}, onSubmit, mode }: ManufacturingSettingsFormProps) {
  const [formData, setFormData] = useState<Partial<ManufacturingSettings>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Manufacturing Settings' : 'New Manufacturing Settings'}</h2>
      {/* Tab: BOM and Production */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">BOM and Production</h3>
      </div>
      {/* Section: Raw Materials Consumption */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Raw Materials Consumption</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.material_consumption}
              onChange={e => handleChange('material_consumption', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow Continuous Material Consumption</label>
          </div>
          {!!formData.material_consumption && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.get_rm_cost_from_consumption_entry}
              onChange={e => handleChange('get_rm_cost_from_consumption_entry', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Get Raw Materials Cost from Consumption Entry</label>
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Backflush Raw Materials Based On</label>
            <select
              value={String(formData.backflush_raw_materials_based_on ?? '')}
              onChange={e => handleChange('backflush_raw_materials_based_on', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="BOM">BOM</option>
              <option value="Material Transferred for Manufacture">Material Transferred for Manufacture</option>
            </select>
          </div>
          {formData.backflush_raw_materials_based_on === "BOM" && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.validate_components_quantities_per_bom}
              onChange={e => handleChange('validate_components_quantities_per_bom', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Validate Components and Quantities Per BOM</label>
          </div>
          )}
        </div>
      </div>
      {/* Section: BOM */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">BOM</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.update_bom_costs_automatically}
              onChange={e => handleChange('update_bom_costs_automatically', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Update BOM Cost Automatically</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allow_editing_of_items_and_quantities_in_work_order}
              onChange={e => handleChange('allow_editing_of_items_and_quantities_in_work_order', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow Editing of Items and Quantities in Work Order</label>
          </div>
        </div>
      </div>
      {/* Section: Overproduction for Sales and Work Order */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Overproduction for Sales and Work Order</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Overproduction Percentage For Sales Order</label>
            <input
              type="number"
              step="any"
              value={formData.overproduction_percentage_for_sales_order != null ? Number(formData.overproduction_percentage_for_sales_order) : ''}
              onChange={e => handleChange('overproduction_percentage_for_sales_order', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Overproduction Percentage For Work Order</label>
            <input
              type="number"
              step="any"
              value={formData.overproduction_percentage_for_work_order != null ? Number(formData.overproduction_percentage_for_work_order) : ''}
              onChange={e => handleChange('overproduction_percentage_for_work_order', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Extra Material Transfer */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Extra Material Transfer</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Transfer Extra Raw Materials to WIP (%)</label>
            <input
              type="number"
              step="any"
              value={formData.transfer_extra_materials_percentage != null ? Number(formData.transfer_extra_materials_percentage) : ''}
              onChange={e => handleChange('transfer_extra_materials_percentage', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Tab: Job Card and Capacity Planning */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Job Card and Capacity Planning</h3>
      </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.add_corrective_operation_cost_in_finished_good_valuation}
              onChange={e => handleChange('add_corrective_operation_cost_in_finished_good_valuation', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Add Corrective Operation Cost in Finished Good Valuation</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.enforce_time_logs}
              onChange={e => handleChange('enforce_time_logs', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Enforce Time Logs</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.job_card_excess_transfer}
              onChange={e => handleChange('job_card_excess_transfer', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow Excess Material Transfer</label>
          </div>
      {/* Section: Capacity Planning */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Capacity Planning</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.disable_capacity_planning}
              onChange={e => handleChange('disable_capacity_planning', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Disable Capacity Planning</label>
          </div>
          {!formData.disable_capacity_planning && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allow_overtime}
              onChange={e => handleChange('allow_overtime', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow Overtime</label>
          </div>
          )}
          {!formData.disable_capacity_planning && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allow_production_on_holidays}
              onChange={e => handleChange('allow_production_on_holidays', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow Production on Holidays</label>
          </div>
          )}
          {!formData.disable_capacity_planning && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Capacity Planning For (Days)</label>
            <input
              type="number"
              step="1"
              value={formData.capacity_planning_for_days != null ? Number(formData.capacity_planning_for_days) : ''}
              onChange={e => handleChange('capacity_planning_for_days', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!formData.disable_capacity_planning && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Time Between Operations (Mins)</label>
            <input
              type="number"
              step="1"
              value={formData.mins_between_operations != null ? Number(formData.mins_between_operations) : ''}
              onChange={e => handleChange('mins_between_operations', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: Other Settings */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Other Settings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.set_op_cost_and_scrap_from_sub_assemblies}
              onChange={e => handleChange('set_op_cost_and_scrap_from_sub_assemblies', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Set Operating Cost / Scrap Items From Sub-assemblies</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.make_serial_no_batch_from_work_order}
              onChange={e => handleChange('make_serial_no_batch_from_work_order', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Make Serial No / Batch from Work Order</label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}