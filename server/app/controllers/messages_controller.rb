require "json"

class MessagesController < ApplicationController
  def create
    # ActionCable.server.broadcast(params[:room], { body: params[:message_body] })
    message = PUBSUB.publish_to_topic("workorders", params[:message_body].to_json)
    render json: message
  end
end