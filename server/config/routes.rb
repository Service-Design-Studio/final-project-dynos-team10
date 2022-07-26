Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "application#index"

  get 'verify-jwt', to: 'application#verify_jwt'

  resources :workorders do
    get 'page/:page', action: :index, on: :collection
    get 'total', to: 'workorders#get_count', on: :collection
    get 'components', to: "workorders#get_one_components", on: :member
  end

  resources :components do
    get "images", to: "components#get_one_images", on: :member
  end

  resources :images, except: :update do
    post "batch", to: "images#batch_create", on: :collection
    delete "batch", to: "images#batch_delete", on: :collection
  end

  resources :component_types do
    get 'components', to: "component_types#get_one_components", on: :member
  end

  resources :machine_types do
    get 'workorders', to: "machine_types#get_one_work_order"
  end

end
