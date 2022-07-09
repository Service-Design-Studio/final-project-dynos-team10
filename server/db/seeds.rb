# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

workorders =[{:workorder_number => "WO1"},
             {:workorder_number => "WO2", :machine_type => 1}]

components = [{:workorder_id => 1, :status => false},
              {:workorder_id => 1, :status => false, :failing_reasons => ["Wrong position"]},
              {:workorder_id => 2, :status => true, :component_type => 1},
              {:workorder_id => 2, :status => true}]

images = [{:component_id => 1, :public_url => "https://storage.googleapis.com/dynostic-test-bucket/032e11e6-d779-4882-bc01-aee951b65ac3.png", :auth_url => "https://storage.cloud.google.com/dynostic-test-bucket/032e11e6-d779-4882-bc01-aee951b65ac3.png"},
          {:component_id => 1, :public_url => "https://storage.googleapis.com/dynostic-test-bucket/08306026-b08d-4016-b4fa-0a31afeac9f1.png", :auth_url => "https://storage.cloud.google.com/dynostic-test-bucket/08306026-b08d-4016-b4fa-0a31afeac9f1.png"},
          {:component_id => 2, :public_url => "https://storage.googleapis.com/dynostic-test-bucket/1885ca22-e21d-47e3-a5a8-7e9a57eb3717.png", :auth_url => "https://storage.cloud.google.com/dynostic-test-bucket/1885ca22-e21d-47e3-a5a8-7e9a57eb3717.png"},
          {:component_id => 2, :public_url => "https://storage.googleapis.com/dynostic-test-bucket/18cfc78f-f3d2-4714-b25f-bd3874987858.png", :auth_url => "https://storage.cloud.google.com/dynostic-test-bucket/18cfc78f-f3d2-4714-b25f-bd3874987858.png"},
          {:component_id => 3, :public_url => "https://storage.googleapis.com/dynostic-test-bucket/3bd1ac0b-c028-4161-987e-cc16ea5fe2db.png", :auth_url => "https://storage.cloud.google.com/dynostic-test-bucket/3bd1ac0b-c028-4161-987e-cc16ea5fe2db.png"},
          {:component_id => 3, :public_url => "https://storage.googleapis.com/dynostic-test-bucket/3fac6a36-7b46-49b9-a677-8cbc8f7a2527.png", :auth_url => "https://storage.cloud.google.com/dynostic-test-bucket/3fac6a36-7b46-49b9-a677-8cbc8f7a2527.png"},
          {:component_id => 4, :public_url => "https://storage.googleapis.com/dynostic-test-bucket/41116b82-b017-4c6a-999b-255ea426c62f.png", :auth_url => "https://storage.cloud.google.com/dynostic-test-bucket/41116b82-b017-4c6a-999b-255ea426c62f.png"},
          {:component_id => 4, :public_url => "https://storage.googleapis.com/dynostic-test-bucket/470a4cd7-5e3c-495b-a08f-1e098c9b9ea8.png", :auth_url => "https://storage.cloud.google.com/dynostic-test-bucket/470a4cd7-5e3c-495b-a08f-1e098c9b9ea8.png"}]

workorders.each do |workorder|
  Workorder.create!(workorder)
end

components.each do |component|
  Component.create!(component)
end

images.each do |image|
  Image.create!(image)
end
