class Workorder < ApplicationRecord
    has_many :components

    # def initialize(workorder_type)
    #     @workorder_id
    #     @status
    #     @workorder_type = workorder_type
    #     @failing_reasons
    #     @component_list
    # end

    # def get_workorder_id()
    #     return @workorder_id
    # end

    # def set_workorder_id(new_workorder_id)
    #     @workorder_id = new_workorder_id
    # end

    # def get_status()
    #     return @status
    # end

    # def set_status(new_status)
    #     @status = new_status
    # end

    # def get_failing_reasons()
    #     return @failing_reasons
    # end

    # def set_failing_reasons(new_failing_reasons)
    #     @failing_reasons = new_failing_reasons
    # end

    # def get_Workorder_type()
    #     return @workorder_type
    # end

    # def set_Workorder_type(new_Workorder_type)
    #     @workorder_type = new_Workorder_type
    # end

    # def get_component_list()
    #     return @component_list
    # end

    # def set_component_list(new_component_list)
    #     @component_list = new_component_list
    # end
end
