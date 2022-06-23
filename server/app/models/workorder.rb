class Workorder < ApplicationRecord
    has_many :components
    # TODO: sort out validations
    validates :workorder_number, :machine_type, presence: true
    validates :workorder_number, uniqueness: true

    enum machine_type: {
      machine_1: 0,
      machine_2: 1,
      machine_3: 2
    }

    def self.get_machine_types
        Workorder.machine_types
    end

    # creates a new workorder
    def self.create_record(workorder_number, machine_type)
        machine_type_int = self.get_machine_types[machine_type]
        if machine_type_int.nil?
            machine_type_int = 0 # defaults to the first machine
        end
        Workorder.create(workorder_number: workorder_number, machine_type: machine_type_int)
    end

    def self.find_all
        Workorder.all
    end

    def self.find_one(workorder_id)
        Workorder.find_by(id: workorder_id)
    end

    def self.find_one_by_workorder_number(workorder_number)
        Workorder.find_by(workorder_number: workorder_number)
    end

    # TODO: test whether this works
    def self.get_failing_reasons(workorder_id)
        workorder = self.find_one(workorder_id)
        failing_reasons = []
        workorder.components.each do |comp|
            failing_reasons << comp.get_failing_reasons(id: comp.id)
        end
        return failing_reasons
        # @components = Component.find_all_by_workorder_id(workorder_id)
        # components.each do |comp|
        #     failing_reasons << comp.get_failing_reasons(id: comp.id)
        # return failing_reasons
        # end
    end

    # def self.get_status(workorder_id)
    #     @components = Component.find_all_by_workorder_id(workorder_id)
    #     components.each do |comp|
    #         if(comp.get_status(id: comp.id)==false)
    #             return false
    #         end
    #     end
    #     true
    # end
end
