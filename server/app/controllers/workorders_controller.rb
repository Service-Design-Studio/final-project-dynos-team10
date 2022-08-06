require "json"

class WorkordersController < ApplicationController
    # TODO: permit params
    def index
        # /workorders?workorder_number=
        workorder_number = params[:workorder_number]

        all_workorders = Workorder.find_all

        # render json: success_json(all_workorders)

        unless workorder_number.nil?
            workorder_record = Workorder.search_by_workorder_number(workorder_number)
            if workorder_record.empty?
                begin
                    puts workorder_record.errors
                    errors = workorder_record.errors
                rescue NoMethodError
                    errors = "Workorder does not exist"
                end
                # render json: fail_json(errors: errors, data: workorder_record), status: :unprocessable_entity
            else
                # render json: success_json(workorder_record)
            end
        else
            workorder_record = all_workorders
        end
        # /workorders?page=
        page_number = params[:page]
        unless page_number.nil?
            get_category = params[:completed]
            unless get_category.nil?
                get_completed = get_category.to_i == 1
                page_completion = Workorder.find_completed_incomplete_paginated(page_number, get_completed)
                # render json: success_json(Workorder.find_completed_incomplete_paginated(page_number, get_completed))
                # return
            else
                page_completion = Workorder.find_paginated(page_number)
            end
            # render json: success_json(Workorder.find_paginated(page_number))
        else
            page_completion = all_workorders
        end

        results = workorder_record.merge(page_completion)
        query_results = all_workorders.merge(results)

        if query_results.empty?
            render json: fail_json(errors: errors, data: query_results), status: :unprocessable_entity
        else
            render json: success_json(query_results)
        end

    end

    def create
        workorder_number = params[:workorder_number]
        machine_type_id = params[:machine_type_id]
        workorder_record = Workorder.create_record workorder_number, machine_type_id
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
        @workorder = Workorder.find(params[:id])
        marking_as_completed = params[:completed] == true # explicit check for this
        if marking_as_completed
            num_submitted_components = @workorder.components.length
            expected_num_components = @workorder.machine_type.component_types.length
            unless num_submitted_components == expected_num_components
                render json: fail_json(errors: "Not all components submitted"), status: :unprocessable_entity
                return
            end
        end

        # evaluate and save whether this workorder is a pass or fail
        workorder_has_passed = Workorder.evaluate_pass_fail params[:id]
        @workorder.passed = workorder_has_passed # Mode.saved will be called in the update method below

        if @workorder.update(params.require(:workorder).permit(:workorder_number,:machine_type_id,:completed))
            # here means that update was successful, check if completed status was present and true
            if !params[:completed].nil? && marking_as_completed
                message_hash = {:id => @workorder.id, :workorder_number => @workorder.workorder_number, :passed => @workorder.passed}
                PUBSUB.publish_to_topic("workorders", message_hash.to_json)
                ActionCable.server.broadcast("main", { title: "new-workorder", body: message_hash.to_json })
            end
            render json: success_json(@workorder)
        else
            render json: fail_json(errors: @workorder.errors, data: @workorder), status: :unprocessable_entity
        end
    end

    def destroy
        # @workorder = Workorder.find(params[:id])
        # @workorder.destroy
        # flash[:success] = "workorder successfully deleted!"
        # # redirect_to workorderzes_url
    end

    def get_count
        get_category = params[:completed]
        if get_category.nil?
            render json: success_json(Workorder.get_count)
            return
        end
        get_completed = get_category.to_i == 1
        render json: success_json(Workorder.get_completed_incomplete_count(get_completed))
    end

    def get_one_components
        components = Workorder.get_one_components params[:id]
        render json: success_json(components)
    end

    def search_by_workorder_number
        workorders = Workorder.search_by_workorder_number params[:containing]
        render json: success_json(workorders)
    end
end
