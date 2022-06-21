class ComponentsController < ApplicationController

# to ensure that the current component is loaded from the session before any controller action occurs, 
# and that the (possibly modified) current component is replaced in the session after each action completes.

    before_action :get_Component_from_session
    after_action  :store_Component_in_session
    
    private
    
    def get_Component_from_session
        @component = Component.new('')
        if !session[:component].blank?
        @component = YAML.load(session[:component])
        end
    end

    def store_Component_in_session
        session[:component] = @component.to_yaml
    end

    public

    def index

    end

    def create
        new_component_type = params[:component_type]
        @component = Component.new(component_type)
        @component = @workorder.components.create(component_type: )
        
    end

    def show

    end

    def update


    end

    def destroy
        @component = Component.find(params[:id])
        @component.destroy
        flash[:success] = "The component was successfully destroyed."
        #redirect somewhere


    end

end
