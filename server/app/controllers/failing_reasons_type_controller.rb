class FailingReasonsTypeController < ApplicationController
  def index
    all_failing_reasons_types = FailingReasonsType.find_all
    render json: success_json(all_failing_reasons_types)
  end

  def create
    reason = params[:reason]
    component_type_id = params[:component_type_id]
    failing_reasons_type = FailingReasonsType.create_record reason, component_type_id
    if failing_reasons_type.id.nil?
      render json: fail_json(errors: failing_reasons_type.errors)
      return
    end
    render json: success_json(failing_reasons_type)
  end
end
