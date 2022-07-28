class ComponentTypesController < ApplicationController
 # TODO: permit params

  def index
    component_type_name = params[:type_name]
    unless component_type_name.nil?
      component_type_rec = ComponentType.find_one_by_type_name(component_type_name)
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
    component_type_rec = ComponentType.get_one_component_type_from_id params[:id]
    render json: success_json(component_type_rec)
  end

  def update
      @component_type = ComponentType.find(params[:id])
      if @component_type.update(params.require(:component_type).permit(:type_name))
        ComponentType.update_machine_types(@component_type.id,params[:machine_type_ids])
        render json: success_json(@component_type)
      else
        render json: fail_json(errors: @component_type.errors, data: @component_type), status: :unprocessable_entity
      end
    end

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
