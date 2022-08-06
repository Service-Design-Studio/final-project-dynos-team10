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
    all_component_types_arr = []
    all_component_types.each do |component_type|
      component_type_json = component_type.as_json
      component_type_json[:failing_reasons_types] = component_type.failing_reasons_types
      all_component_types_arr << component_type_json
    end
    render json: success_json(all_component_types_arr)
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
    component_type_json = component_type_rec.as_json
    component_type_json[:failing_reasons_types] = component_type_rec.failing_reasons_types
    render json: success_json(component_type_json)
  end


  def update
      @component_type = ComponentType.find(params[:id])
      if @component_type.update(params.require(:component_type).permit(:type_name))
        ComponentType.update_machine_types(@component_type.id,params[:machine_type_ids]) unless params[:machine_type_ids].nil?
        ComponentType.update_failing_reasons_types(@component_type.id, params[:failing_reasons_type_ids]) unless params[:failing_reasons_type_ids].nil?
        render json: success_json(@component_type)
      else
        render json: fail_json(errors: @component_type.errors, data: @component_type), status: :unprocessable_entity
      end
    end

 def destroy
   @component_type = ComponentType.find(params[:id])
   unless @component_type.type_name == "Label" or @component_type.type_name == "Wire"
     machine_types = ComponentType.get_all_machine_types_from_id(@component_type.id)
     machine_types.each do |machine_type|
       ComponentType.remove_machine_type(machine_type.id,@component_type.id)
     end
     @component_type.save
     @component_type.destroy
     render json: success_json(@component_type)
   else
     errors = "Cannot delete component type "+@component_type.type_name
     render json: fail_json(errors: errors, data: @component_type), status: :unprocessable_entity
   end

 end

 def get_count
   render json: success_json(ComponentType.get_count)
 end

 def get_one_components
   component = ComponentType.get_one_components params[:id]
   render json: success_json(component)
 end

 def get_all_failing_reasons_types
   all_failing_reasons_types = ComponentType.get_all_failing_reasons_types params[:id]
   render json: success_json(all_failing_reasons_types)

 end

end
