class Component < ApplicationRecord
    has_many :images
    belongs_to :workorder
    validates :component_type, :workorder_id, presence: true
    # validates :component_type, uniqueness: { scope: :workorder_id}
    # TODO: validate uniqueness of the above 2 AS a whole unit
    validates :status, inclusion: [true, false] # detection of boolean field presence, different validation because of under the hood ops

    enum component_type: {
      label: 0,
      wire: 1,
      component_3: 2
    }

    def self.get_component_types
        Component.component_types
    end

    def self.create_record(workorder_id, component_type, status)
        component_type_int = self.get_component_types[component_type]
        if component_type_int.nil?
            component_type_int = 0 # defaults to the label //why are we doing this?
        end
        # byebug
        Component.create(component_type: component_type_int, status: status, workorder_id: workorder_id)
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
        Component.find_by(id: component_id).failing_reasons
    end
end