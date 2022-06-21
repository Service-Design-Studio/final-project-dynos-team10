class ComponentsController < ApplicationController

# to ensure that the current component is loaded from the session before any controller action occurs, 
# and that the (possibly modified) current component is replaced in the session after each action completes.

def index
    @components = Component.all
    end

    def show
    @component = Component.find(params[:id])
    # render :show
    end

    def new
    @component = Component.new
    # render :new
    end

    def create
    # @component = component.new(params.require(:component).permit(:component_id, :component_type))
    # if @component.save
    #     flash[:success] = "New component successfully created!"
    #     # redirect_to componentzes_url
    # else
    #     flash.now[:error] = "New component creation failed"
    #     # render :new
    # end
    end
    
    def edit
    @component = Component.find(params[:id])
    # render :edit
    end

    def update
    @component = Component.find(params[:id])
    # if @component.update(params.require(:component).permit(:title, :description))
    #     flash[:success] = "component successfully updated!"
    #     redirect_to component_url(@component)
    # else
    #     flash.now[:error] = "component update failed"
    #     render :edit
    # end
    end

    def destroy
    @component = Component.find(params[:id])
    @component.destroy
    flash[:success] = "component successfully deleted!"
    # redirect_to componentzes_url
    end

end
