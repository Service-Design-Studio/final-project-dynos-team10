# require "google/cloud/pubsub"
#
# class PubsubService
#   attr_reader :pubsub
#
#   def initialize
#     @pubsub = Google::Cloud::PubSub.new(
#       project_id: "tsh-qc",
#       credentials: "config/service-account-credentials.json"
#     )
#   end
#
#   def get_topic(topic_name)
#     @pubsub.topic topic_name
#   end
#
#   def publish_to_topic(topic_name, message)
#     get_topic(topic_name).publish(message)
#   end
# end
