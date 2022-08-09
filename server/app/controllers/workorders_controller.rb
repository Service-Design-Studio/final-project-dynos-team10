require "json"

class WorkordersController < ApplicationController
    # TODO: permit params
    def index
        # /workorders?workorder_number=
        workorder_number = params[:workorder_number]

        query_results = Workorder.find_all.order(id: :desc)
        errors = []
        # render json: success_json(all_workorders)
        # ------- searching --------
        unless workorder_number.nil?
            query_results = Workorder.search_by_workorder_number query_results, workorder_number
            puts query_results
            if query_results.empty?
                begin
                    puts query_results.errors
                    errors = query_results.errors
                rescue NoMethodError
                    errors = "Workorder does not exist"
                end
                # render json: fail_json(errors: errors, data: workorder_record), status: :unprocessable_entity
            else
                # render json: success_json(workorder_record)
            end
        end

        # ---------- filter by completion ---------
        get_category = params[:completed]
        unless get_category.nil?
            get_completed = get_category.to_i == 1
            query_results = Workorder.find_completed_incomplete query_results, get_completed
        end

        # /workorders/page/:page
        # ----------- pagination --------------
        page_number = params[:page]
        unless page_number.nil?
            res_per_page = params[:res_per_page]
            query_results = Workorder.get_paginated query_results, page_number, res_per_page
        end

        if query_results.respond_to?(:errors)
            errors = query_results.errors
        else
            errors = []
        end

        if query_results.nil?
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
                topic = ENV["PUBSUB_TOPIC"]
                PUBSUB.publish_to_topic(topic, message_hash.to_json)
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
        search_term = params[:workorder_number]
        if get_category.nil? && search_term.nil?
            render json: success_json(Workorder.get_count)
            return
        end
        get_completed = get_category.to_i == 1
        completion_records = get_category.nil? ? Workorder.all : Workorder.find_completed_incomplete(Workorder.all, get_completed)
        searched_records = search_term.nil? ? Workorder.all : Workorder.search_by_workorder_number(Workorder.all, search_term)
        records = completion_records.merge(searched_records)
        render json: success_json(records.count)
    end

    def get_one_components
        components = Workorder.get_one_components params[:id]
        render json: success_json(components)
    end
end
