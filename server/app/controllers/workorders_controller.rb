class WorkordersController < ApplicationController
    # TODO: permit params
    def index
        # /workorders?workorder_number=
        workorder_number = params[:workorder_number]
        unless workorder_number.nil?
            workorder_record = Workorder.find_one_by_workorder_number(workorder_number)
            if workorder_record.nil?
                begin
                    errors = workorder_record.errors
                rescue NoMethodError
                    errors = "Workorder does not exist"
                end
                render json: fail_json(errors: errors, data: workorder_record), status: :unprocessable_entity
            else
                render json: success_json(workorder_record)
            end
            return
        end
        # /workorders?page=
        page_number = params[:page]
        unless page_number.nil?
            render json: success_json(Workorder.find_paginated(page_number))
            return
        end
        # /workorders
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

    def get_count
        render json: success_json(Workorder.get_count)
    end

    def get_one_components
        components = Workorder.get_one_components params[:id]
        render json: success_json(components)
    end
end
