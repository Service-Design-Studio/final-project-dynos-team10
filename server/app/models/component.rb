class Component < ApplicationRecord
    has_many :images
    belongs_to :workorder
    validates :component_type, :workorder_id, presence: true
    validates :component_type, uniqueness: { scope: :workorder_id}
    # TODO: validate uniqueness of the above 2 AS a whole unit
    validates :status, inclusion: [true, false] # detection of boolean field presence, different validation because of under the hood ops

    def self.create_record(workorder_id, component_type, status, failing_reasons=[""])
        new_component = Component.create(component_type: component_type, status: status, workorder_id: workorder_id, failing_reasons: failing_reasons)
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
        Component.find_by(id: component_id).failing_reasons
    end

    def self.get_one_images(component_id)
        Component.find_by(id: component_id).images
    end
end