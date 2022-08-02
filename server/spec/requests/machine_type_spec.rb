require 'rails_helper'

RSpec.describe "MachineTypes", type: :request do
  # describe "GET /index" do
  #   pending "add some examples (or delete) #{__FILE__}"
  # end

  describe "DELETE /destroy" do
    it 'destroys the machine type and returns the destroy record details' do
      machine_type = MachineType.create_record("m8")
      component_type1 = ComponentType.create_record("aaaa")
      component_type2 = ComponentType.create_record("bbbb")
      MachineType.add_component_type(machine_type.id,component_type2.id)
      MachineType.add_component_type(machine_type.id,component_type1.id)
      expected_json =  {"success"=>true, "result"=>{"type_name"=>"m8", "id"=>machine_type.id, "created_at"=>machine_type.created_at, "updated_at"=>machine_type.updated_at}}
      expected_json = JSON.parse(expected_json.to_json)

      delete machine_type_path(machine_type)

      component_type2.reload
      component_type1.reload

      expect(component_type1.machine_types).to be_empty
      expect(component_type2.machine_types).to be_empty

      expect(JSON.parse(response.body)).to eq(expected_json)
    end
  end

  describe "PUT #update" do
    it 'returns updated status as true after updating the machine type values' do
      machine_type_in = MachineType.create_record("m8")
      component_type1 = ComponentType.create_record("aaaa")
      component_type2 = ComponentType.create_record("bbbb")
      component_type3 = ComponentType.create_record("cccc")

      MachineType.add_component_type(machine_type_in.id,component_type1.id)
      MachineType.add_component_type(machine_type_in.id,component_type2.id)
      # all_comps = MachineType.get_all_component_types_from_id(machine_type_in.id)
      # all_comps.each do |comp|
      #   puts comp.type_name
      # end


      # work_order_new = Workorder.create_record("15",1)

      put machine_type_path(machine_type_in), params: { machine_type: {:type_name => "m9"},component_type_ids: [component_type2.id,component_type3.id]}
      machine_type_in.reload
      # all_comps = MachineType.get_all_component_types_from_id(machine_type_in.id)
      # all_comps.each do |comp|
      #   puts comp.type_name
      # end


      expected_json =  {"success"=>true, "result"=>{"type_name"=>"m9", "id"=>machine_type_in.id, "created_at"=>machine_type_in.created_at, "updated_at"=>machine_type_in.updated_at}}
      expected_json = JSON.parse(expected_json.to_json)

      # puts JSON.parse(response.body)

      expect(JSON.parse(response.body)).to eq(expected_json)

    end
  end
end
