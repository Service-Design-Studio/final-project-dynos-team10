class Component < ApplicationRecord
    has_many :images
    attr_accessor :component_id, :status, :component_type, :failing_reasons, :image_url

    def initialize(component_type)
        @component_id
        @status
        @component_type = component_type
        @failing_reasons = ['']
        @image_url = ['']
    end

    def get_component_id()
        return @component_id
    end

    def set_component_id(new_component_id)
        @component_id = new_component_id
    end

    def get_status()
        return @status
    end

    def set_status(new_status)
        @status = new_status
    end

    def get_failing_reasons()
        return @failing_reasons
    end

    def set_failing_reasons(new_failing_reasons)
        @failing_reasons = new_failing_reasons
    end

    def get_component_type()
        return @component_type
    end

    def set_component_type(new_component_type)
        @component_type = new_component_type
    end

    def get_image_url()
        return @image_url
    end

    def set_image_url(new_image_url)
        @image_url = new_image_url
    end

end