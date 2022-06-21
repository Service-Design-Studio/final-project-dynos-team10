class WorkordersController < ApplicationController
    # TODO: permit params
    def index
        all_workorders = Workorder.find_all
        render json: { success: true, data: all_workorders }
    end

    def create
        workorder_number = params[:workorder_number]
        machine_type = params[:machine_type]
        workorder_record = Workorder.create_record workorder_number, machine_type
        render json: { success: true, data: workorder_record }
    end

    def show
        workorder = Workorder.find_one params[:id]
        render json: { success: true, data: workorder }
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
