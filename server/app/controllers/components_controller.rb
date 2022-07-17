class ComponentsController < ApplicationController
    # TODO: permit params

    def index
        all_components = Component.find_all
        render json: success_json(all_components)
    end

    def create
        workorder_id = params[:workorder_id]
        # IF no status param is passed, that means failed (false), ELSE true
        status = !params[:status].nil?
        component_type = params[:component_type]
        failing_reasons = params[:failing_reasons]

        component_record = Component.create_record workorder_id, component_type, status, failing_reasons
        if component_record.id.nil?
            render json: fail_json(errors: component_record.errors)
            return
        end
        render json: success_json(component_record)
    end

    def show
        Component.find_one params[:id]
    end

    def update
        @component = Component.find(params[:id])
        if @component.update(params.require(:component).permit(:component_type,:workorder_id,:failing_reasons,:status))
            render json: success_json(@component)
        else
            render json: fail_json(errors: @component.errors, data: @component), status: :unprocessable_entity
            render :edit
        end

    end

    def destroy

    end

    def get_one_images
        images = Component.get_one_images params[:id]
        render json: success_json(images)
    end
end
