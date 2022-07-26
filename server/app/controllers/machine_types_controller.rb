class MachineTypesController < ApplicationController

  def index

    machine_type_name = params[:type_name]
    unless machine_type_name.nil?
      machine_type_rec = MachineType.find_one_by_type_name(machine_type_name)
      if machine_type_rec.nil?
        begin
          errors = machine_type_rec.errors
        rescue NoMethodError
          errors = "Machine Type " + machine_type_name + " does not exist"
        end
        render json: fail_json(errors: errors, data: machine_type_rec), status: :unprocessable_entity
      else
        render json: success_json(machine_type_rec)
      end
      return
    end

    all_machine_types = MachineType.all
    render json: success_json(all_machine_types)
  end

  def create
    machine_type_name = params[:type_name]
    machine_type_rec = MachineType.create_record machine_type_name
    if machine_type_rec.id.nil?
      render json: fail_json(errors: machine_type_rec.errors, data: machine_type_rec), status: :unprocessable_entity
      return
    end
    machine_type_rec
    render json: success_json(machine_type_rec)
  end

  def show
    machine_type_rec = MachineType.find_one params[:id]
    render json: success_json(machine_type_rec)
  end

  def update
    @machine_type = MachineType.find(params[:id])
    if @machine_type.update(params.require(:machine_type).permit(:type_name))
      MachineType.update_component_types(@machine_type.id,params[:component_type_ids])
      render json: success_json(@machine_type)
    else
      render json: fail_json(errors: @machine_type.errors, data: @machine_type), status: :unprocessable_entity
    end
  end


  def get_count
    render json: success_json(MachineType.get_count)
  end

  def get_one_work_order
    work_order = MachineType.get_one_work_order params[:id]
    render json: success_json(work_order)
  end
end