class Component < ApplicationRecord
    has_many :images
    belongs_to :workorder
    belongs_to :component_type
    has_and_belongs_to_many :failing_reasons_type
    validates :component_type_id, :workorder_id, presence: true
    validates :component_type_id, uniqueness: { scope: :workorder_id}
    # TODO: validate uniqueness of the above 2 AS a whole unit
    validates :status, inclusion: [true, false] # detection of boolean field presence, different validation because of under the hood ops

    def self.create_record(workorder_id, component_type_id, status)
        new_component = Component.create(status: status, workorder_id: workorder_id,component_type_id: component_type_id)
        # return new_component
        # if new_component.nil?
        #
        # end
    end

    def self.find_one(component_id)
        Component.find_by(id: component_id)
    end

    def self.find_all
        Component.all
    end

    def self.find_all_by_workorder_id(workorder_id)
        Component.where(workorder_id: workorder_id)
    end

    def self.get_failing_reason(component_id)
        Component.find_by(id: component_id).failing_reasons_types
    end

    def self.get_one_images(component_id)
        Component.find_by(id: component_id).images
    end

    def self.create_components_for_workorder(workorder_id)
        work_order = Workorder.find_by(id:workorder_id)
        all_comp_types = MachineType.get_all_component_types_from_id(work_order.machine_type_id)
        all_comp_types.each do |comp_type|
            Component.create_record(work_order.id,comp_type.id,false)
        end
        Component.where(workorder_id:work_order.id)
    end

    def self.get_component_type(component_id)
        component = Component.find_by(id: component_id)
        ComponentType.get_one_component_type_from_id(component.component_type_id)
    end
end