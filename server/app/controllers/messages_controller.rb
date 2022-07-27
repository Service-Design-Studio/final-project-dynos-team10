class MessagesController < ApplicationController
  def create
    ActionCable.server.broadcast(params[:room], { body: params[:message_body] })
    render json: 'ok'
  end
end