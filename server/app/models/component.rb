class Component < ApplicationRecord
    has_many :images
    belongs_to :workorder
    validates :component_type, :workorder_id, presence: true, uniqueness: true
    validates :status, inclusion: [true, false] # detection of boolean field presence, different validation because of under the hood ops

    enum component_type: {
      label: 0,
      wires: 1,
      component_3: 2
    }

    def self.get_component_types
        Component.component_types
    end

    def self.create_record(workorder_id, component_type, status)
        component_type_int = self.get_component_types[component_type]
        if component_type_int.nil?
            component_type_int = 0 # defaults to the label
        end
        Component.create(component_type: component_type_int, status: status, workorder_id: workorder_id)
    end

    def self.find_one(component_id)
        Component.find_by(id: component_id)
    end

    def self.find_all
        Component.all
    end
    
    # def self.find_all_by_workorder_id(workorder_id)
    #     Component.where(["workorder_id = ?", workorder_id])
    # end
end