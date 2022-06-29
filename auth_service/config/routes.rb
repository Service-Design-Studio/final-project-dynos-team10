Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resource :session, only: [:create, :destroy] do
    post :callback
  end

  resource :registration, only: [:create] do
    post :callback
  end

  resource :credentials, only: [:create, :destroy] do
    post :callback, on: :collection
  end
end
