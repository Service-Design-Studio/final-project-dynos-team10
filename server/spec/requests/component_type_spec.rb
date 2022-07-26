require 'rails_helper'

RSpec.describe "ComponentTypes", type: :request do
  # describe "GET /index" do
  #   pending "add some examples (or delete) #{__FILE__}"
  # end

  describe "PUT #update" do
    it 'returns updated status as true after updating the machine type values' do
      machine_type_1 = MachineType.create_record("m5")
      machine_type_2 = MachineType.create_record("m6")
      machine_type_3 = MachineType.create_record("m7")

      component_type = ComponentType.create_record("zzzz")
      # puts component_type.id


      ComponentType.add_machine_type(machine_type_1.id,component_type.id)
      ComponentType.add_machine_type(machine_type_2.id,component_type.id)
      # all_mt = ComponentType.get_all_machine_types_from_id(component_type.id)
      # all_mt.each do |mt|
      #   puts mt.type_name
      # end


      # work_order_new = Workorder.create_record("15",1)

      put component_type_path(component_type), params: { component_type: {:type_name => "gggg"},machine_type_ids: [machine_type_2.id,machine_type_3.id]}
      component_type.reload
      # all_mt = ComponentType.get_all_machine_types_from_id(component_type.id)
      # all_mt.each do |mt|
      #   puts mt.type_name
      # end


      expected_json =  {"success"=>true, "result"=>{"type_name"=>"gggg", "id"=>component_type.id, "created_at"=>component_type.created_at, "updated_at"=>component_type.updated_at}}

      expect(JSON.parse(response.body)).to include{expected_json}

    end
  end
end
