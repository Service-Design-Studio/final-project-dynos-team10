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

  def show
    failing_reason_type = FailingReasonsType.find_one params[:id]
    render json: success_json(failing_reason_type)
  end

  # def update
  #   @failing_reason_type = FailingReasonsType.find(params[:id])
  #   if @failing_reason_type.update!(params.require(:failing_reasons_type).permit(:component_type_id,:reason))
  #     Component.update_failing_reasons_types(@component.id,params[:failing_reasons_type_ids])
  #     @component.save
  #     render json: success_json(@component)
  #
  #   else
  #     render json: fail_json(errors: @component.errors, data: @component), status: :unprocessable_entity
  #   end
  #
  # end
end
