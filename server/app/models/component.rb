class Component < ApplicationRecord
    has_many :images
    belongs_to :workorder
    belongs_to :component_type
    has_and_belongs_to_many :failing_reasons_type
    validates :component_type_id, :workorder_id, presence: true
    validates :component_type_id, uniqueness: { scope: :workorder_id}
    # TODO: validate uniqueness of the above 2 AS a whole unit
    validates :status, inclusion: [true, false] # detection of boolean field presence, different validation because of under the hood ops
    # shud i make status default false
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

    def self.get_failing_reasons(component_id)
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

    def self.add_failing_reasons_type(component_id,failing_reasons_type_id)
        @component = Component.find_by(id: component_id)
        @failing_reasons_type = FailingReasonsType.find_by(id: failing_reasons_type_id)
        if @component.component_type.failing_reasons_types.include?(@failing_reasons_type)
            @component.failing_reasons_type.push(@failing_reasons_type) unless  @component.failing_reasons_types.include?(@failing_reasons_type)
            @failing_reasons_type.components.push(@component) unless  @failing_reasons_type.components.include?(@component)
        end

    end

    def self.remove_failing_reasons_type(component_id,failing_reasons_type_id)
        @component = Component.find_by(id: component_id)
        @failing_reasons_type = FailingReasonsType.find_by(id: failing_reasons_type_id)
        @component.failing_reasons_type.delete(@failing_reasons_type)
        @failing_reasons_type.components.delete(@component)
    end

    def self.update_failing_reasons_types(component_id, failing_reasons_type_ids)
        @component = Component.find_by(id: component_id)
        @component.failing_reasons_types.clear
        failing_reasons_type_ids.each do |failing_reasons_type_id|
            Component.add_failing_reasons_type(component_id,failing_reasons_type_id)
        end
    end
end