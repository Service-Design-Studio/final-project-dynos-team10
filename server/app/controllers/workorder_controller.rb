class WorkorderController < ApplicationController

        def index
    
        end
    
        def create
            new_workorder_type = params[:workorder_id]
            @workorder = Workorder.new(workorder_type)
            @workorder.component_list = [Component.new("Label"),Component.new("Wire")]
            
        end
    
        def show
    
        end
    
        def update
    
    
        end
    
        def destroy
            @workorder = workorder.find(params[:id])
            @workorder.destroy
            flash[:success] = "The workorder was successfully destroyed."
            #redirect somewhere
    
    
        end
    end
    