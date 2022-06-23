Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "application#index"

  resources :workorders do
    get "machine-types", on: :collection
  end
  resources :components do
    get "component-types", on: :collection
  end
  resources :images do
    post "batch-create", on: :collection
  end
end
