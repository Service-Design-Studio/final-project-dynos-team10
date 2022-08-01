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
        component_type_id = params[:component_type_id]
        # failing_reasons = params[:failing_reasons]
        # shud i make status default false
        component_record = Component.create_record workorder_id, component_type_id, status
        if component_record.id.nil?
            render json: fail_json(errors: component_record.errors)
            return
        end
        render json: success_json(component_record)
    end

    def show
        component = Component.find_one params[:id]
        render json: success_json(component)
    end

    def update
        @component = Component.find(params[:id])
        if @component.update!(params.require(:component).permit(:component_type_id,:workorder_id,:status))
            Component.update_failing_reasons_types(@component.id,params[:failing_reasons_type_ids])
            @component.save
            render json: success_json(@component)

        else
            render json: fail_json(errors: @component.errors, data: @component), status: :unprocessable_entity
        end

    end

    def destroy

    end

    def get_one_images
        images = Component.get_one_images params[:id]
        render json: success_json(images)
    end
end
