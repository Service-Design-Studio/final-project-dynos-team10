class Component < ApplicationRecord
    has_many :images
    belongs_to :Component

    attr_accessor :component_type, :status, :failing_reasons

    validates :component_type, :status, :failing_reasons, presence: true

    def self.find_one(component_id)
        Component.find_by(id: component_id)
    end

    def self.get_failing_reasons(component_id)
        self.find_one(id: component_id).failing_reasons
    end


    def self.get_status(component_id)
        self.find_one(id: component_id).failing_reasons
    end
    
    def self.find_all_by_workorder_id(workorder_id)
        Component.where(["workorder_id = ?", workorder_id])
    end

    
    # validates  presence: true


    # def initialize(component_type)
    #     @component_id
    #     # @status
    #     @component_type = component_type
    #     @failing_reasons = ['']
    #     @image_url = ['']
    # end

    # def get_component_id()
    #     return @component_id
    # end

    # def set_component_id(new_component_id)
    #     @component_id = new_component_id
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

    # def get_component_type()
    #     return @component_type
    # end

    # def set_component_type(new_component_type)
    #     @component_type = new_component_type
    # end

    # def get_image_url()
    #     return @image_url
    # end

    # def set_image_url(new_image_url)
    #     @image_url = new_image_url
    # end

    

end