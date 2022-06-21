class WorkorderController < ApplicationController


    def index
        @workorders = Workorder.all
    end

    def show
        @workorder = Workorder.find(params[:id])
        # render :show
        end

        def new
        @workorder = Workorder.new
        # render :new
        end

        def create
        # @workorder = Workorder.new(params.require(:workorder).permit(:workorder_id, :workorder_type))
        # if @workorder.save
        #     flash[:success] = "New workorder successfully created!"
        #     # redirect_to workorderzes_url
        # else
        #     flash.now[:error] = "New workorder creation failed"
        #     # render :new
        # end
        end
        
        def edit
        @workorder = Workorder.find(params[:id])
        # render :edit
        end

        def update
        @workorder = Workorder.find(params[:id])
        # if @workorder.update(params.require(:workorder).permit(:title, :description))
        #     flash[:success] = "workorder successfully updated!"
        #     redirect_to workorder_url(@workorder)
        # else
        #     flash.now[:error] = "workorder update failed"
        #     render :edit
        # end
        end

        def destroy
        @workorder = Workorder.find(params[:id])
        @workorder.destroy
        flash[:success] = "workorder successfully deleted!"
        # redirect_to workorderzes_url
        end
    
end
