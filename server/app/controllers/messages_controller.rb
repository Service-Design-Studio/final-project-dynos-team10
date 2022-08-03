require "json"

class MessagesController < ApplicationController
  def create
    # message = PUBSUB.publish_to_topic("workorders", params[:message_body].to_json)
    ActionCable.server.broadcast("main", params[:message_body])
    render json: "ok"
  end
end