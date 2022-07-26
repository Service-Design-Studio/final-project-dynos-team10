class ComponentTypesController < ApplicationController
 # TODO: permit params

  def index
    component_type_name = params[:type_name]
    unless component_type_name.nil?
      component_type_rec = ComponentType.find_one_by_component_type_name(component_type_name)
      if component_type_rec.nil?
        begin
          errors = component_type_rec.errors
        rescue NoMethodError
          errors = "Component Type " + component_type_name + " does not exist"
        end
        render json: fail_json(errors: errors, data: component_type_rec), status: :unprocessable_entity
      else
        render json: success_json(component_type_rec)
      end
      return
    end

    all_component_types = ComponentType.find_all
    render json: success_json(all_component_types)
  end

  def create
    component_type_name = params[:type_name]
    component_type_rec = ComponentType.create_record component_type_name
    if component_type_rec.id.nil?
      render json: fail_json(errors: component_type_rec.errors, data: component_type_rec), status: :unprocessable_entity
      return
    end
    render json: success_json(component_type_rec)
  end

  def show
    component_type_rec = ComponentType.find_one params[:id]
    render json: success_json(component_type_rec)
  end

  # def update
  #   @component = Component.find(params[:id])
  #   if @component.update!(params.require(:component).permit(:component_type,:workorder_id,:status, :failing_reasons))
  #     @component.failing_reasons = params["component"][:failing_reasons]
  #     @component.save
  #     render json: success_json(@component)
  #
  #   else
  #     render json: fail_json(errors: @component.errors, data: @component), status: :unprocessable_entity
  #   end
  #
  # end

  def destroy

  end

 def get_count
   render json: success_json(ComponentType.get_count)
 end

 def get_one_component
   component = ComponentType.get_one_component params[:id]
   render json: success_json(component)
 end

end
