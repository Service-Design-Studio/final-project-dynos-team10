class ComponentsController < ApplicationController
    # TODO: permit params

    def index
        all_components = Component.find_all
        render json: { success: true, data: all_components }
    end

    def create
        workorder_id = params[:workorder_id]
        # IF no status param is passed, that means failed (false), ELSE true
        status = !params[:status].nil?
        component_type = params[:component_type]

        component_record = Component.create_record workorder_id, component_type, status
        if component_record.id.nil?
            render json: { success: false, errors: component_record.errors }
            return
        end
        render json: { success: true, data: component_record }
    end

    def show
        Component.find_one params[:id]
    end

    def update

    end

    def destroy

    end

end
