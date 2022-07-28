class SampleChannel < ApplicationCable::Channel
  # Called when the consumer has successfully become a subscriber to this channel
  def subscribed
    stream_from "sample_#{current_user_id}"
  end
end
