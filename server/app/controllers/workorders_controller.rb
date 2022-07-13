class WorkordersController < ApplicationController
    # TODO: permit params
    def index
        workorder_number = params[:workorder_number]
        unless workorder_number.nil?
            render json: success_json(Workorder.find_one_by_workorder_number(workorder_number))
            return
        end
        all_workorders = Workorder.find_all
        render json: success_json(all_workorders)
    end

    def create
        workorder_number = params[:workorder_number]
        machine_type = params[:machine_type]
        workorder_record = Workorder.create_record workorder_number, machine_type
        if workorder_record.id.nil?
            render json: fail_json(errors: workorder_record.errors, data: workorder_record), status: :unprocessable_entity
            return
        end
        render json: success_json(workorder_record)
    end

    def show
        workorder = Workorder.find_one params[:id]
        render json: success_json(workorder)
    end

    def update
        # @workorder = Workorder.find(params[:id])
        # if @workorder.update(params.require(:workorder).permit(:title, :description))
        #     flash[:success] = "workorder successfully updated!"
        #     redirect_to workorder_url(@workorder)
        # else
        #     flash.now[:error] = "workorder update failed"
        #     render :edit
        # end
    end

    def destroy
        # @workorder = Workorder.find(params[:id])
        # @workorder.destroy
        # flash[:success] = "workorder successfully deleted!"
        # # redirect_to workorderzes_url
    end
end
