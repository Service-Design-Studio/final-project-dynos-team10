# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

machine_types = [{type_name:"m1"},{type_name:"m2"},{type_name:"m3"},{type_name:"m4"}]

component_types = [{type_name:"box"},{type_name:"panel"}] # id 3 and 4. 1 and 2 taken by label and wire created on machine type creation

workorders =[{:workorder_number => "WO1", :machine_type_id => 1,},
             {:workorder_number => "WO2", :machine_type_id => 1,},
             {:workorder_number => "test", :machine_type_id => 2,},
             {:workorder_number => "sample", :machine_type_id => 2, :completed => true},
             {:workorder_number => "workorder3", :machine_type_id => 1, :completed => true},
             {:workorder_number => "workorder4", :machine_type_id => 2, :completed => true},]

components = [{:workorder_id => 1, :status => false, :component_type_id => 1},
              {:workorder_id => 1, :status => false, :component_type_id => 2},
              {:workorder_id => 2, :status => true, :component_type_id => 1},
              {:workorder_id => 2, :status => true, :component_type_id => 2},
              {:workorder_id => 3, :status => false, :component_type_id => 1},
              {:workorder_id => 3, :status => true, :component_type_id => 2},
              {:workorder_id => 4, :status => true, :component_type_id => 1},
              {:workorder_id => 4, :status => true, :component_type_id => 2},
              {:workorder_id => 5, :status => true, :component_type_id => 1},
              {:workorder_id => 5, :status => true, :component_type_id => 2},
              {:workorder_id => 6, :status => true, :component_type_id => 1},
              {:workorder_id => 6, :status => false, :component_type_id => 2},]

              images = [{:component_id => 1, :public_url => "https://storage.googleapis.com/dynostic-test-bucket/032e11e6-d779-4882-bc01-aee951b65ac3.png", :auth_url => "https://storage.cloud.google.com/dynostic-test-bucket/032e11e6-d779-4882-bc01-aee951b65ac3.png"},
                        {:component_id => 1, :public_url => "https://storage.googleapis.com/dynostic-test-bucket/08306026-b08d-4016-b4fa-0a31afeac9f1.png", :auth_url => "https://storage.cloud.google.com/dynostic-test-bucket/08306026-b08d-4016-b4fa-0a31afeac9f1.png"},
                        {:component_id => 2, :public_url => "https://storage.googleapis.com/dynostic-test-bucket/1885ca22-e21d-47e3-a5a8-7e9a57eb3717.png", :auth_url => "https://storage.cloud.google.com/dynostic-test-bucket/1885ca22-e21d-47e3-a5a8-7e9a57eb3717.png"},
                        {:component_id => 2, :public_url => "https://storage.googleapis.com/dynostic-test-bucket/18cfc78f-f3d2-4714-b25f-bd3874987858.png", :auth_url => "https://storage.cloud.google.com/dynostic-test-bucket/18cfc78f-f3d2-4714-b25f-bd3874987858.png"},
                        {:component_id => 3, :public_url => "https://storage.googleapis.com/dynostic-test-bucket/3bd1ac0b-c028-4161-987e-cc16ea5fe2db.png", :auth_url => "https://storage.cloud.google.com/dynostic-test-bucket/3bd1ac0b-c028-4161-987e-cc16ea5fe2db.png"},
                        {:component_id => 3, :public_url => "https://storage.googleapis.com/dynostic-test-bucket/3fac6a36-7b46-49b9-a677-8cbc8f7a2527.png", :auth_url => "https://storage.cloud.google.com/dynostic-test-bucket/3fac6a36-7b46-49b9-a677-8cbc8f7a2527.png"},
                        {:component_id => 4, :public_url => "https://storage.googleapis.com/dynostic-test-bucket/41116b82-b017-4c6a-999b-255ea426c62f.png", :auth_url => "https://storage.cloud.google.com/dynostic-test-bucket/41116b82-b017-4c6a-999b-255ea426c62f.png"},
                        {:component_id => 4, :public_url => "https://storage.googleapis.com/dynostic-test-bucket/470a4cd7-5e3c-495b-a08f-1e098c9b9ea8.png", :auth_url => "https://storage.cloud.google.com/dynostic-test-bucket/470a4cd7-5e3c-495b-a08f-1e098c9b9ea8.png"},
                        {:component_id => 5, :public_url => "https://storage.googleapis.com/dynostic-test-bucket/3bd1ac0b-c028-4161-987e-cc16ea5fe2db.png", :auth_url => "https://storage.cloud.google.com/dynostic-test-bucket/3bd1ac0b-c028-4161-987e-cc16ea5fe2db.png"},
                        {:component_id => 5, :public_url => "https://storage.googleapis.com/dynostic-test-bucket/3fac6a36-7b46-49b9-a677-8cbc8f7a2527.png", :auth_url => "https://storage.cloud.google.com/dynostic-test-bucket/3fac6a36-7b46-49b9-a677-8cbc8f7a2527.png"},
                        {:component_id => 6, :public_url => "https://storage.googleapis.com/dynostic-test-bucket/41116b82-b017-4c6a-999b-255ea426c62f.png", :auth_url => "https://storage.cloud.google.com/dynostic-test-bucket/41116b82-b017-4c6a-999b-255ea426c62f.png"},
                        {:component_id => 6, :public_url => "https://storage.googleapis.com/dynostic-test-bucket/470a4cd7-5e3c-495b-a08f-1e098c9b9ea8.png", :auth_url => "https://storage.cloud.google.com/dynostic-test-bucket/470a4cd7-5e3c-495b-a08f-1e098c9b9ea8.png"}]

# failing_reasons_types = [{:reason => "crumpled",:component_type_id => 1},{:reason => "scribbles",:component_type_id => 1},{:reason => "missing color",:component_type_id => 2}]
failing_reasons_types = [{:reason => "crumpled"},{:reason => "scribbles"},{:reason => "missing color"}, {:reason => "torn"}, {:reason => "handwritten"}, {:reason => "missing field"}, {:reason => "wrong position"}]

machine_types.each do |machine_type|
  # puts "i am creating this type"
  # puts machine_type
  MachineType.create!(machine_type)
  # puts "i am done "
end

component_types.each do |component_type|
  ComponentType.create!(component_type)
end

workorders.each do |workorder|
  Workorder.create!(workorder)
end

components.each do |component|
  Component.create!(component)
end

images.each do |image|
  Image.create!(image)
end

failing_reasons_types.each do |failing_reasons_type|
  FailingReasonsType.create!(failing_reasons_type)
end

MachineType.update_component_types(1,[1,2])
MachineType.update_component_types(2,[2,3,4])

ComponentType.update_machine_types(1,[1])
ComponentType.update_machine_types(2,[1,2])
ComponentType.update_machine_types(3,[2])
ComponentType.update_machine_types(4,[2])

ComponentType.update_failing_reasons_types(1,[1,4,5,6,7])
ComponentType.update_failing_reasons_types(2,[3])
ComponentType.update_failing_reasons_types(3,[2])
ComponentType.update_failing_reasons_types(4,[2,3])
