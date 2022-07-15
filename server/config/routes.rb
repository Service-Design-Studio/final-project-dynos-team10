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

  resources :images do
    post "batch-create", on: :collection
  end
end
